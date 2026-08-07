import { createHash, randomUUID } from 'node:crypto';
import { GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { anonymizedClientFingerprint, sameOrigin, verifySession } from './_session.mjs';

const MAX_IMPORT_SIZE = 100 * 1024 * 1024;
const MAX_REDIRECTS = 4;
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
    throw Object.assign(new Error('Only official cityofpsl.com sources are approved for direct import.'), { status: 400, code: 'UNAPPROVED_HOST' });
  }
  if (!pathname.startsWith(APPROVED_PATH_PREFIX) || !pathname.endsWith('.pdf')) {
    throw Object.assign(new Error('The source must be a direct City PDF under the official public files path.'), { status: 400, code: 'UNAPPROVED_PATH' });
  }
  url.hash = '';
  return url;
}

function sourceHeaders(browserCompatible = false) {
  if (!browserCompatible) {
    return {
      accept: 'application/pdf,*/*;q=0.2',
      'user-agent': 'CivicLens-Evidence-Preservation/1.0'
    };
  }

  return {
    accept: 'application/pdf,application/octet-stream;q=0.9,*/*;q=0.8',
    'accept-language': 'en-US,en;q=0.9',
    'cache-control': 'no-cache',
    pragma: 'no-cache',
    referer: 'https://www.cityofpsl.com/',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
  };
}

async function requestOfficialSource(url, browserCompatible = false) {
  return fetch(url, {
    method: 'GET',
    redirect: 'manual',
    headers: sourceHeaders(browserCompatible),
    signal: AbortSignal.timeout(55000)
  });
}

async function fetchOfficialPdf(initialUrl) {
  let current = validateOfficialUrl(initialUrl);

  for (let redirect = 0; redirect <= MAX_REDIRECTS; redirect += 1) {
    let response = await requestOfficialSource(current, false);

    // Some public-sector web application firewalls reject obvious server/bot user agents
    // even when the underlying public PDF is accessible in a normal browser. Retry a 403
    // once with browser-compatible headers while keeping the same strict host/path allowlist.
    if (response.status === 403) {
      response = await requestOfficialSource(current, true);
    }

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get('location');
      if (!location || redirect === MAX_REDIRECTS) {
        throw Object.assign(new Error('The official source redirected too many times.'), { status: 502, code: 'REDIRECT_LIMIT' });
      }
      current = validateOfficialUrl(new URL(location, current).toString());
      continue;
    }

    if (!response.ok) {
      const code = response.status === 403 ? 'SOURCE_BLOCKED_SERVER_FETCH' : 'SOURCE_FETCH_FAILED';
      const message = response.status === 403
        ? 'The City source blocked the secure server import request (HTTP 403).'
        : `The City source returned HTTP ${response.status}.`;
      throw Object.assign(new Error(message), { status: 502, code });
    }

    const declaredLength = Number(response.headers.get('content-length') || 0);
    if (declaredLength > MAX_IMPORT_SIZE) {
      throw Object.assign(new Error('The official source exceeds the 100 MB direct-import limit.'), { status: 413, code: 'SOURCE_TOO_LARGE' });
    }

    const bytes = Buffer.from(await response.arrayBuffer());
    if (!bytes.length) {
      throw Object.assign(new Error('The official source returned an empty file.'), { status: 502, code: 'EMPTY_SOURCE' });
    }
    if (bytes.length > MAX_IMPORT_SIZE) {
      throw Object.assign(new Error('The official source exceeds the 100 MB direct-import limit.'), { status: 413, code: 'SOURCE_TOO_LARGE' });
    }
    if (bytes.subarray(0, 5).toString('ascii') !== '%PDF-') {
      throw Object.assign(new Error('The retrieved source is not a valid PDF document.'), { status: 415, code: 'NOT_PDF' });
    }

    return {
      bytes,
      finalUrl: current.toString(),
      contentType: 'application/pdf',
      sourceContentType: response.headers.get('content-type') || '',
      etag: response.headers.get('etag') || '',
      lastModified: response.headers.get('last-modified') || ''
    };
  }

  throw Object.assign(new Error('Unable to retrieve the official source.'), { status: 502, code: 'SOURCE_FETCH_FAILED' });
}

async function readJsonObject(client, bucket, key) {
  const response = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  return JSON.parse(await response.Body.transformToString());
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

  const submittedUrl = String(body.url || '').trim();
  const metadata = normalizeMetadata(body.metadata || {});
  const client = s3Client(config);

  try {
    const officialUrl = validateOfficialUrl(submittedUrl);
    const fetched = await fetchOfficialPdf(officialUrl.toString());
    const hash = createHash('sha256').update(fetched.bytes).digest('hex');
    const duplicate = await findActiveDuplicate(client, config.bucket, hash);

    if (duplicate) {
      await writeAudit(client, config, request, session, 'evidence.official_import_duplicate', {
        sourceUrl: officialUrl.toString(),
        hash,
        existingRecordId: duplicate.id,
        existingFilename: duplicate.name
      });
      return json({
        error: 'This exact document is already preserved in the Evidence Vault.',
        code: 'DUPLICATE_EVIDENCE',
        existingRecord: { id: duplicate.id, name: duplicate.name, hash: duplicate.hash }
      }, 409);
    }

    const id = randomUUID();
    const finalUrl = new URL(fetched.finalUrl);
    const rawFilename = decodeURIComponent(finalUrl.pathname.split('/').pop() || 'official-document.pdf');
    const filename = sanitizeSegment(rawFilename, 'official-document.pdf');
    const fiscal = sanitizeSegment(metadata.fiscalYear, 'unassigned');
    const objectKey = `originals/${fiscal}/${id}/${filename}`;
    const retrievedAt = new Date().toISOString();

    await client.send(new PutObjectCommand({
      Bucket: config.bucket,
      Key: objectKey,
      Body: fetched.bytes,
      ContentType: 'application/pdf',
      CacheControl: 'no-store'
    }));

    const record = {
      id,
      title: metadata.title || rawFilename,
      name: rawFilename,
      mime: 'application/pdf',
      size: fetched.bytes.length,
      hash,
      hashAlgorithm: 'SHA-256',
      hashSource: 'server',
      objectKey,
      type: metadata.type,
      typeLabel: metadata.typeLabel,
      fiscalYear: metadata.fiscalYear,
      publisher: metadata.publisher,
      sourceUrl: officialUrl.toString(),
      retrievedUrl: fetched.finalUrl,
      sourceHost: finalUrl.hostname.toLowerCase(),
      sourceVerified: true,
      retrievedAt,
      sourceEtag: fetched.etag,
      sourceLastModified: fetched.lastModified,
      sourceContentType: fetched.sourceContentType,
      manifestDocumentId: metadata.manifestDocumentId || '',
      ingestMethod: 'official-url-import',
      status: 'review',
      notes: '',
      uploadedAt: retrievedAt,
      storageProvider: 'Cloudflare R2',
      storageClass: 'STANDARD',
      immutableOriginal: true,
      lifecycleStatus: 'active',
      recordVersion: 1
    };

    await writeRecord(client, config.bucket, record);

    const receipt = {
      version: 1,
      importedAt: retrievedAt,
      recordId: record.id,
      manifestDocumentId: record.manifestDocumentId,
      sourceUrl: record.sourceUrl,
      retrievedUrl: record.retrievedUrl,
      filename: record.name,
      size: record.size,
      sha256: record.hash,
      fiscalYear: record.fiscalYear,
      publisher: record.publisher,
      documentType: record.type,
      title: record.title
    };
    await client.send(new PutObjectCommand({
      Bucket: config.bucket,
      Key: `import-receipts/${retrievedAt.slice(0, 10)}/${record.id}.json`,
      Body: JSON.stringify(receipt, null, 2),
      ContentType: 'application/json; charset=utf-8',
      CacheControl: 'no-store'
    }));

    await writeAudit(client, config, request, session, 'evidence.official_imported', {
      recordId: record.id,
      filename: record.name,
      manifestDocumentId: record.manifestDocumentId,
      sourceUrl: record.sourceUrl,
      retrievedUrl: record.retrievedUrl,
      size: record.size,
      hash: record.hash,
      hashSource: 'server'
    });

    return json({ record, receipt }, 201);
  } catch (error) {
    console.error('Official evidence import failed', error);
    try {
      await writeAudit(client, config, request, session, 'evidence.official_import_failed', {
        sourceUrl: submittedUrl.slice(0, 1000),
        code: error.code || 'IMPORT_FAILED'
      });
    } catch (auditError) {
      console.error('Could not write failed import audit event', auditError);
    }
    return json({
      error: error.message || 'Official source import failed.',
      code: error.code || 'IMPORT_FAILED'
    }, Number(error.status) || 500);
  }
};

export const config = {
  path: '/api/evidence-import',
  rateLimit: {
    action: 'rate_limit',
    aggregateBy: ['domain', 'ip'],
    windowSize: 60,
    windowLimit: 12
  }
};
