import { randomUUID } from 'node:crypto';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { anonymizedClientFingerprint, sameOrigin, verifySession } from './_session.mjs';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
}

function configuration() {
  const config = {
    accountId: process.env.R2_ACCOUNT_ID,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    bucket: process.env.R2_BUCKET_NAME,
    adminKey: process.env.CIVICLENS_ADMIN_KEY,
    openaiKey: process.env.OPENAI_API_KEY
  };
  return { ...config, ready: Boolean(config.accountId && config.accessKeyId && config.secretAccessKey && config.bucket && config.adminKey), aiReady: Boolean(config.openaiKey) };
}

function client(config) {
  return new S3Client({ region: 'auto', endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`, credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey } });
}

function recordKey(id) { return `records/${id}.json`; }
function researchKey(id) { return `research/${id}/latest.json`; }

async function readJson(s3, bucket, key) {
  const response = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  return JSON.parse(await response.Body.transformToString());
}

async function writeJson(s3, bucket, key, value) {
  await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: JSON.stringify(value, null, 2), ContentType: 'application/json; charset=utf-8', CacheControl: 'no-store' }));
}

async function audit(s3, config, request, session, action, details) {
  const timestamp = new Date().toISOString();
  const [year, month, day] = timestamp.slice(0, 10).split('-');
  await writeJson(s3, config.bucket, `audit/${year}/${month}/${day}/${timestamp.replace(/[:.]/g, '-')}-${randomUUID()}.json`, {
    id: randomUUID(), timestamp, action,
    actor: { id: session.sub, role: session.role },
    clientFingerprint: anonymizedClientFingerprint(request, config.adminKey),
    details, version: 1
  });
}

const schema = {
  type: 'object',
  additionalProperties: false,
  required: ['documentPurpose', 'summary', 'controlTotals', 'financialFindings', 'followUp', 'confidence'],
  properties: {
    documentPurpose: { type: 'string' },
    summary: { type: 'string' },
    controlTotals: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['label', 'amount', 'basis', 'page', 'confidence'], properties: {
      label: { type: 'string' }, amount: { type: 'string' }, basis: { type: 'string' }, page: { type: 'string' }, confidence: { type: 'string', enum: ['high', 'medium', 'low'] }
    }}},
    financialFindings: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['finding', 'page', 'evidence', 'confidence'], properties: {
      finding: { type: 'string' }, page: { type: 'string' }, evidence: { type: 'string' }, confidence: { type: 'string', enum: ['high', 'medium', 'low'] }
    }}},
    followUp: { type: 'array', items: { type: 'string' } },
    confidence: { type: 'string', enum: ['high', 'medium', 'low'] }
  }
};

export default async (request) => {
  const config = configuration();
  const session = verifySession(request, config.adminKey);
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
  if (!config.ready) return json({ error: 'Evidence storage is not configured.', code: 'STORAGE_NOT_CONFIGURED' }, 503);
  if (!config.aiReady) return json({ error: 'AI research is not configured. Add OPENAI_API_KEY in Netlify before running scans.', code: 'AI_NOT_CONFIGURED' }, 503);
  if (!sameOrigin(request)) return json({ error: 'Cross-site request rejected.' }, 403);
  if (!session) return json({ error: 'Secure sign-in required.', code: 'AUTH_REQUIRED' }, 401);

  try {
    const { id } = await request.json();
    if (!id) return json({ error: 'Evidence record ID is required.' }, 400);
    const s3 = client(config);
    const record = await readJson(s3, config.bucket, recordKey(String(id)));
    if (record.lifecycleStatus === 'archived') return json({ error: 'Archived records cannot be researched.' }, 409);
    if (record.mime !== 'application/pdf' && !String(record.name).toLowerCase().endsWith('.pdf')) return json({ error: 'AI research currently supports PDF records only.' }, 415);

    const fileUrl = await getSignedUrl(s3, new GetObjectCommand({ Bucket: config.bucket, Key: record.objectKey, ResponseContentType: 'application/pdf' }), { expiresIn: 900 });
    const prompt = `You are CivicLens Research, an evidence-first public-finance analyst. Analyze this original government PDF only. Never invent a total, department, page, or conclusion. Return facts and uncertainties, not accusations. Identify the document purpose; extract only the most important FY 2024-25 control totals and financial findings relevant to public-money tracing. Every amount must include the exact PDF page number and a short evidence label/table title. Keep separate funds, transfers, capital, debt, CRA activity, and budgeted vs actual figures. If a number is not clear, omit it and list what review is needed.`;
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${config.openaiKey}` },
      body: JSON.stringify({
        model: 'gpt-5.6',
        input: [{ role: 'user', content: [{ type: 'input_file', file_url: fileUrl, detail: 'low' }, { type: 'input_text', text: prompt }] }],
        text: { format: { type: 'json_schema', name: 'civiclens_research', strict: true, schema } }
      })
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload?.error?.message || 'The AI research request failed.');
    const output = payload.output_text || '';
    const analysis = JSON.parse(output);
    const result = { recordId: record.id, recordName: record.name, generatedAt: new Date().toISOString(), model: 'gpt-5.6', status: 'review_required', analysis };
    await writeJson(s3, config.bucket, researchKey(record.id), result);
    await audit(s3, config, request, session, 'evidence.ai_research_completed', { recordId: record.id, controlTotalCount: analysis.controlTotals.length, findingCount: analysis.financialFindings.length });
    return json({ result });
  } catch (error) {
    console.error('Evidence research error', error);
    return json({ error: error.message || 'Research scan failed.' }, 500);
  }
};