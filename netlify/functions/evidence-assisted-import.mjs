import { createHash, randomUUID } from 'node:crypto';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  anonymizedClientFingerprint,
  sameOrigin,
  verifySession
} from './_session.mjs';

const MAX_FILE_SIZE = 100 * 1024 * 1024;
const APPROVED_HOSTS = new Set(['www.cityofpsl.com', 'cityofpsl.com']);
const APPROVED_PATH_PREFIX = '/files/assets/public/';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      pragma: 'no-cache'
    }
  });
}

function configuration() {
  const config = {
    accountId: process.env.R2_ACCOUNT_ID,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    bucket: process.env.R2_BUCKET_NAME,
    adminKey: process.env.CIVICLENS_ADMIN_KEY
  };
  return {
    ...config,
    ready: Boolean(config.accountId && config.accessKeyId && config.secretAccessKey && config.bucket && config.adminKey)
  };
}

function s3Client(config) {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey
    }
  });
}

function sanitizeSegment(value, fallback = 'unknown') {
  const cleaned = String(value || '')
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
  return cleaned || fallback;
}

function validateOfficialUrl(raw) {
  let url;
  try {
    url = new URL(String(raw || '').trim());
  } catch {
    throw Object.assign(new Error('Enter a valid official City PDF URL.'), { status: 400, code: 'INVALID_URL' });
  }

  const hostname = url.hostname.toLowerCase();
  const pathname = url.pathname.toLowerCase();
  if (url.protocol !== 'https:' || url.username || url.password || (url.port && url.port !== '443')) {
    throw Object.assign(new Error('Only standard HTTPS City source URLs are allowed.'), { status: 400, code: 'UNAPPROVED_URL' });
  }
  if (!APPROVED_HOSTS.has(hostname)) {
    throw Object.assign(new Error('Only official cityofpsl.com sources are approved.'), { status: 400, code: 'UNAPPROVED_HOST' });
  }
  if (!pathname.startsWith(APPROVED_PATH_PREFIX) || !pathname.endsWith('.pdf')) {
    throw Object.assign(new Error('The source must be a direct City PDF under the official public files path.'), { status: 400, code: 'UNAPPROVED_PATH' });
  }
  url.hash = '';
  return url;
}

function normalizeMetadata(input = {}) {
  const allowedTypes = new Map([
    ['budget', 'Budget or financial report'],
    ['audit', 'Audit or ACFR'],
    ['contract', 'Contract or procurement'],
    ['meeting', 'Council agenda or minutes'],
    ['invoice', 'Invoice or payment record'],
    ['other', 'Other official record']
  ]);
  const type = allowedTypes.has(input.type) ? input.type : 'other';
  return {
    type,
    typeLabel: allowedTypes.get(type),
    fiscalYear: String(input.fiscalYear || '').trim().slice(0, 40),
    publisher: String(input.publisher || 'City of Port St. Lucie').trim().slice(0, 180),
    title: String(input.title || '').trim().slice(0, 240),
    manifestDocumentId: sanitizeSegment(input.manifestDocumentId, '')
  };
}

function validateFile(file = {}) {
  const name = String(file.name || '').trim();
  const size = Number(file.size || 0);
  const type = String(file.type || '').toLowerCase();
  if (!name || !size) throw Object.assign(new Error('Select the official PDF file.'), { status: 400, code: 'FILE_REQUIRED' });
  if (!name.toLowerCase().endsWith('.pdf')) throw Object.assign(new Error('The selected file must be a PDF.'), { status: 415, code: 'NOT_PDF' });
  if (type && type !== 'application/pdf') throw Object.assign(new Error('The selected file must be a PDF.'), { status: 415, code: 'NOT_PDF' });
  if (size > MAX_FILE_SIZE) throw Object.assign(new Error('The PDF exceeds the 100 MB assisted-import limit.'), { status: 413, code: 'FILE_TOO_LARGE' });
  return { name, size, type: 'application/pdf' };
}

async function readJsonObject(client, bucket, key) {
  const response = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  return JSON.parse(await response.Body.transformToString());
}

async function writeRecord(client, bucket, record) {
  await client.send(new PutObjectCommand({
    Bucket: bucket,
    Key: `records/${record.id}.json`,
    Body: JSON.stringify(record, null, 2),
    ContentType: 'application/json; charset=utf-8',
    CacheControl: 'no-store'
  }));
}

async function writeAudit(client, config, request, session, action, details = {}) {
  const timestamp = new Date().toISOString();
  const [year, month, day] = timestamp.slice(0, 10).split('-');
  const event = {
    id: randomUUID(),
    timestamp,
    action,
    actor: { id: session?.sub || 'unknown', role: session?.role || 'unknown' },
    clientFingerprint: anonymizedClientFingerprint(request, config.adminKey),
    requestId: request.headers.get('x-nf-request-id') || null,
    details,
    version: 1
  };
  const keyStamp = timestamp.replace(/[:.]/g, '-');
  await client.send(new PutObjectCommand({
    Bucket: config.bucket,
    Key: `audit/${year}/${month}/${day}/${keyStamp}-${event.id}.json`,
    Body: JSON.stringify(event, null, 2),
    ContentType: 'application/json; charset=utf-8',
    CacheControl: 'no-store'
  }));
}

async function findActiveDuplicate(client, bucket, hash) {
  let continuationToken;
  do {
    const page = await client.send(new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: 'records/',
      ContinuationToken: continuationToken
    }));
    for (const item of page.Contents || []) {
      if (!item.Key?.endsWith('.json')) continue;
      try {
        const record = await readJsonObject(client, bucket, item.Key);
        if (record.lifecycleStatus !== 'archived' && record.hash === hash) return record;
      } catch (error) {
        console.error('Could not inspect evidence record for duplicate detection', item.Key, error);
      }
    }
    continuationToken = page.IsTruncated ? page.NextContinuationToken : undefined;
  } while (continuationToken);
  return null;
}

async function hashStoredObject(client, bucket, objectKey) {
  const firstBytes = await client.send(new GetObjectCommand({ Bucket: bucket, Key: objectKey, Range: 'bytes=0-4' }));
  const prefix = Buffer.from(await firstBytes.Body.transformToByteArray()).toString('ascii');
  if (prefix !== '%PDF-') {
    throw Object.assign(new Error('The stored file does not have a valid PDF signature.'), { status: 415, code: 'NOT_PDF' });
  }

  const response = await client.send(new GetObjectCommand({ Bucket: bucket, Key: objectKey }));
  const hash = createHash('sha256');
  for await (const chunk of response.Body) hash.update(chunk);
  return hash.digest('hex');
}

async function writeReceipt(client, bucket, receipt) {
  await client.send(new PutObjectCommand({
    Bucket: bucket,
    Key: `import-receipts/${receipt.completedAt.slice(0, 10)}/${receipt.receiptId}.json`,
    Body: JSON.stringify(receipt, null, 2),
    ContentType: 'application/json; charset=utf-8',
    CacheControl: 'no-store'
  }));
}

export default async (request) => {
  const config = configuration();
  const session = verifySession(request, config.adminKey);

  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
  if (!config.ready) return json({ error: 'Evidence storage is not configured.' }, 503);
  if (!sameOrigin(request)) return json({ error: 'Cross-site request rejected.' }, 403);
  if (!session) return json({ error: 'Secure sign-in required.', code: 'AUTH_REQUIRED' }, 401);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON request.' }, 400);
  }

  const client = s3Client(config);

  try {
    const action = String(body.action || '');
    const sourceUrl = validateOfficialUrl(body.sourceUrl).toString();
    const metadata = normalizeMetadata(body.metadata || {});
    const file = validateFile(body.file || {});
    const retrievalMode = body.retrievalMode === 'browser-cors-direct' ? 'browser-cors-direct' : 'owner-selected-file';

    if (action === 'authorize') {
      const id = randomUUID();
      const fiscal = sanitizeSegment(metadata.fiscalYear, 'unassigned');
      const filename = sanitizeSegment(file.name, 'official-document.pdf');
      const objectKey = `assisted-imports/${fiscal}/${id}/${filename}`;
      const uploadUrl = await getSignedUrl(
        client,
        new PutObjectCommand({ Bucket: config.bucket, Key: objectKey, ContentType: 'application/pdf' }),
        { expiresIn: 600 }
      );
      await writeAudit(client, config, request, session, 'evidence.official_assisted_authorized', {
        importId: id,
        sourceUrl,
        filename: file.name,
        size: file.size,
        manifestDocumentId: metadata.manifestDocumentId,
        retrievalMode
      });
      return json({ id, objectKey, uploadUrl, expiresIn: 600 });
    }

    if (action !== 'finalize') return json({ error: 'Unknown action.' }, 400);

    const id = String(body.id || '');
    const objectKey = String(body.objectKey || '');
    if (!id || !objectKey || !objectKey.startsWith('assisted-imports/')) {
      return json({ error: 'Assisted import identifier is missing.' }, 400);
    }

    const head = await client.send(new HeadObjectCommand({ Bucket: config.bucket, Key: objectKey }));
    const storedSize = Number(head.ContentLength || 0);
    if (!storedSize || storedSize !== file.size) {
      return json({ error: 'Stored file size does not match the selected file.' }, 409);
    }

    const hash = await hashStoredObject(client, config.bucket, objectKey);
    const duplicate = await findActiveDuplicate(client, config.bucket, hash);
    const completedAt = new Date().toISOString();
    const source = new URL(sourceUrl);

    if (duplicate) {
      await client.send(new DeleteObjectCommand({ Bucket: config.bucket, Key: objectKey }));
      const updated = {
        ...duplicate,
        title: metadata.title || duplicate.title,
        fiscalYear: metadata.fiscalYear || duplicate.fiscalYear,
        publisher: metadata.publisher || duplicate.publisher,
        sourceUrl,
        sourceHost: source.hostname.toLowerCase(),
        sourceUrlApproved: true,
        sourceContentMatch: retrievalMode === 'browser-cors-direct' ? 'browser-direct' : 'review-required',
        sourceVerificationMethod: retrievalMode,
        sourceVerificationNote: retrievalMode === 'browser-cors-direct'
          ? 'The owner browser retrieved the allowlisted City URL directly; the stored bytes were independently SHA-256 hashed by the CivicLens server.'
          : 'The City blocks CivicLens server retrieval. The owner selected the PDF obtained from the official URL; exact source/file matching remains a reviewer step.',
        manifestDocumentId: metadata.manifestDocumentId || duplicate.manifestDocumentId || '',
        hashAlgorithm: 'SHA-256',
        hashSource: 'server-r2-assisted-match',
        updatedAt: completedAt,
        recordVersion: Number(duplicate.recordVersion || 1) + 1
      };
      await writeRecord(client, config.bucket, updated);

      const receipt = {
        version: 1,
        receiptId: randomUUID(),
        completedAt,
        outcome: 'duplicate-metadata-attached',
        recordId: updated.id,
        sourceUrl,
        filename: updated.name,
        size: updated.size,
        sha256: hash,
        manifestDocumentId: updated.manifestDocumentId,
        retrievalMode,
        sourceContentMatch: updated.sourceContentMatch
      };
      await writeReceipt(client, config.bucket, receipt);
      await writeAudit(client, config, request, session, 'evidence.official_assisted_duplicate_attached', {
        recordId: updated.id,
        sourceUrl,
        filename: updated.name,
        hash,
        manifestDocumentId: updated.manifestDocumentId,
        retrievalMode
      });
      return json({ duplicate: true, metadataAttached: true, record: updated, receipt });
    }

    const finalObjectKey = `originals/${sanitizeSegment(metadata.fiscalYear, 'unassigned')}/${id}/${sanitizeSegment(file.name, 'official-document.pdf')}`;
    const stored = await client.send(new GetObjectCommand({ Bucket: config.bucket, Key: objectKey }));
    await client.send(new PutObjectCommand({
      Bucket: config.bucket,
      Key: finalObjectKey,
      Body: stored.Body,
      ContentType: 'application/pdf',
      CacheControl: 'no-store'
    }));
    await client.send(new DeleteObjectCommand({ Bucket: config.bucket, Key: objectKey }));

    const record = {
      id,
      title: metadata.title || file.name,
      name: file.name,
      mime: 'application/pdf',
      size: storedSize,
      hash,
      hashAlgorithm: 'SHA-256',
      hashSource: 'server-r2-assisted',
      objectKey: finalObjectKey,
      type: metadata.type,
      typeLabel: metadata.typeLabel,
      fiscalYear: metadata.fiscalYear,
      publisher: metadata.publisher,
      sourceUrl,
      sourceHost: source.hostname.toLowerCase(),
      sourceUrlApproved: true,
      sourceContentMatch: retrievalMode === 'browser-cors-direct' ? 'browser-direct' : 'review-required',
      sourceVerificationMethod: retrievalMode,
      sourceVerificationNote: retrievalMode === 'browser-cors-direct'
        ? 'The owner browser retrieved the allowlisted City URL directly; the stored bytes were independently SHA-256 hashed by the CivicLens server.'
        : 'The City blocks CivicLens server retrieval. The owner selected the PDF obtained from the official URL; exact source/file matching remains a reviewer step.',
      manifestDocumentId: metadata.manifestDocumentId || '',
      ingestMethod: 'browser-assisted-official-source',
      status: 'review',
      notes: '',
      uploadedAt: completedAt,
      storageProvider: 'Cloudflare R2',
      storageClass: 'STANDARD',
      immutableOriginal: true,
      lifecycleStatus: 'active',
      recordVersion: 1
    };
    await writeRecord(client, config.bucket, record);

    const receipt = {
      version: 1,
      receiptId: randomUUID(),
      completedAt,
      outcome: 'preserved',
      recordId: record.id,
      sourceUrl,
      filename: record.name,
      size: record.size,
      sha256: record.hash,
      manifestDocumentId: record.manifestDocumentId,
      retrievalMode,
      sourceContentMatch: record.sourceContentMatch
    };
    await writeReceipt(client, config.bucket, receipt);
    await writeAudit(client, config, request, session, 'evidence.official_assisted_imported', {
      recordId: record.id,
      sourceUrl,
      filename: record.name,
      size: record.size,
      hash: record.hash,
      hashSource: record.hashSource,
      manifestDocumentId: record.manifestDocumentId,
      retrievalMode,
      sourceContentMatch: record.sourceContentMatch
    });

    return json({ record, receipt }, 201);
  } catch (error) {
    console.error('Assisted official import failed', error);
    return json({
      error: error.message || 'Assisted official source import failed.',
      code: error.code || 'ASSISTED_IMPORT_FAILED'
    }, Number(error.status) || 500);
  }
};

export const config = {
  path: '/api/evidence-assisted-import',
  rateLimit: {
    action: 'rate_limit',
    aggregateBy: ['domain', 'ip'],
    windowSize: 60,
    windowLimit: 20
  }
};
