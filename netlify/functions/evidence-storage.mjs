import { randomUUID, timingSafeEqual } from 'node:crypto';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const MAX_FILE_SIZE = 500 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/tiff'
]);

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store'
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

function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function requireAdmin(request, config) {
  const supplied = request.headers.get('x-civiclens-admin-key') || '';
  return safeEqual(supplied, config.adminKey || '');
}

function sanitizeSegment(value, fallback = 'unknown') {
  const cleaned = String(value || '')
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
  return cleaned || fallback;
}

function recordKey(id) {
  return `records/${id}.json`;
}

async function readJsonObject(client, bucket, key) {
  const response = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  const text = await response.Body.transformToString();
  return JSON.parse(text);
}

async function writeRecord(client, bucket, record) {
  await client.send(new PutObjectCommand({
    Bucket: bucket,
    Key: recordKey(record.id),
    Body: JSON.stringify(record, null, 2),
    ContentType: 'application/json; charset=utf-8',
    CacheControl: 'no-store'
  }));
}

async function listRecords(client, bucket) {
  const records = [];
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
        records.push(await readJsonObject(client, bucket, item.Key));
      } catch (error) {
        console.error('Could not read evidence record', item.Key, error);
      }
    }

    continuationToken = page.IsTruncated ? page.NextContinuationToken : undefined;
  } while (continuationToken);

  return records.sort((a, b) => String(b.uploadedAt).localeCompare(String(a.uploadedAt)));
}

function normalizePatch(input = {}) {
  const allowed = ['type', 'typeLabel', 'fiscalYear', 'publisher', 'sourceUrl', 'status', 'notes', 'title'];
  const patch = {};
  for (const key of allowed) {
    if (Object.hasOwn(input, key)) patch[key] = input[key];
  }
  if (patch.status && !['review', 'verified'].includes(patch.status)) delete patch.status;
  return patch;
}

export default async (request) => {
  const config = configuration();

  if (request.method === 'GET') {
    return json({
      configured: config.ready,
      provider: 'Cloudflare R2',
      maxFileSize: MAX_FILE_SIZE,
      permanent: true
    });
  }

  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  if (!config.ready) {
    return json({
      error: 'Permanent storage is not configured yet.',
      code: 'STORAGE_NOT_CONFIGURED'
    }, 503);
  }
  if (!requireAdmin(request, config)) return json({ error: 'Invalid admin key.' }, 401);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON request.' }, 400);
  }

  const client = s3Client(config);
  const action = body.action;

  try {
    if (action === 'list') {
      return json({ records: await listRecords(client, config.bucket) });
    }

    if (action === 'sign-upload') {
      const file = body.file || {};
      const size = Number(file.size || 0);
      const mime = String(file.type || 'application/octet-stream');

      if (!file.name || !size) return json({ error: 'File name and size are required.' }, 400);
      if (size > MAX_FILE_SIZE) return json({ error: 'File exceeds the 500 MB upload limit.' }, 413);
      if (!ALLOWED_TYPES.has(mime)) return json({ error: 'Unsupported file type.' }, 415);

      const id = randomUUID();
      const fiscal = sanitizeSegment(body.metadata?.fiscalYear, 'unassigned');
      const filename = sanitizeSegment(file.name, 'document');
      const objectKey = `originals/${fiscal}/${id}/${filename}`;

      const command = new PutObjectCommand({
        Bucket: config.bucket,
        Key: objectKey,
        ContentType: mime
      });

      const uploadUrl = await getSignedUrl(client, command, { expiresIn: 600 });
      return json({ id, objectKey, uploadUrl, expiresIn: 600 });
    }

    if (action === 'finalize-upload') {
      const { id, objectKey, file = {}, metadata = {}, hash = '' } = body;
      if (!id || !objectKey) return json({ error: 'Upload identifier is missing.' }, 400);

      const head = await client.send(new HeadObjectCommand({ Bucket: config.bucket, Key: objectKey }));
      const expectedSize = Number(file.size || 0);
      if (expectedSize && Number(head.ContentLength || 0) !== expectedSize) {
        return json({ error: 'Uploaded file size does not match the original file.' }, 409);
      }

      const record = {
        id,
        title: metadata.title || file.name,
        name: file.name,
        mime: file.type || head.ContentType || 'application/octet-stream',
        size: Number(head.ContentLength || expectedSize || 0),
        hash,
        hashAlgorithm: 'SHA-256',
        hashSource: 'client',
        objectKey,
        type: metadata.type || 'other',
        typeLabel: metadata.typeLabel || 'Other official record',
        fiscalYear: metadata.fiscalYear || '',
        publisher: metadata.publisher || '',
        sourceUrl: metadata.sourceUrl || '',
        status: 'review',
        notes: '',
        uploadedAt: new Date().toISOString(),
        storageProvider: 'Cloudflare R2',
        storageClass: 'STANDARD',
        immutableOriginal: true,
        recordVersion: 1
      };

      await writeRecord(client, config.bucket, record);
      return json({ record }, 201);
    }

    if (action === 'sign-read') {
      const id = String(body.id || '');
      if (!id) return json({ error: 'Record ID is required.' }, 400);
      const record = await readJsonObject(client, config.bucket, recordKey(id));
      const downloadUrl = await getSignedUrl(
        client,
        new GetObjectCommand({
          Bucket: config.bucket,
          Key: record.objectKey,
          ResponseContentType: record.mime
        }),
        { expiresIn: 900 }
      );
      return json({ record, downloadUrl, expiresIn: 900 });
    }

    if (action === 'update') {
      const id = String(body.id || '');
      if (!id) return json({ error: 'Record ID is required.' }, 400);
      const record = await readJsonObject(client, config.bucket, recordKey(id));
      const updated = {
        ...record,
        ...normalizePatch(body.patch),
        updatedAt: new Date().toISOString(),
        recordVersion: Number(record.recordVersion || 1) + 1
      };
      await writeRecord(client, config.bucket, updated);
      return json({ record: updated });
    }

    if (action === 'delete') {
      const id = String(body.id || '');
      if (!id) return json({ error: 'Record ID is required.' }, 400);
      const record = await readJsonObject(client, config.bucket, recordKey(id));
      await client.send(new DeleteObjectCommand({ Bucket: config.bucket, Key: record.objectKey }));
      await client.send(new DeleteObjectCommand({ Bucket: config.bucket, Key: recordKey(id) }));
      return json({ deleted: true, id });
    }

    return json({ error: 'Unknown action.' }, 400);
  } catch (error) {
    console.error('Evidence storage error', error);
    const status = error?.$metadata?.httpStatusCode === 404 || error?.name === 'NoSuchKey' ? 404 : 500;
    return json({ error: status === 404 ? 'Evidence record not found.' : 'Evidence storage operation failed.' }, status);
  }
};

export const config = {
  path: '/api/evidence-storage',
  rateLimit: {
    action: 'rate_limit',
    aggregateBy: ['domain', 'ip'],
    windowSize: 60,
    windowLimit: 120
  }
};
