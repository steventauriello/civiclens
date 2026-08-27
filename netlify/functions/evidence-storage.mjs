import { randomUUID } from 'node:crypto';
import {
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
      'cache-control': 'no-store',
      'pragma': 'no-cache'
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

async function writeAudit(client, config, request, session, action, details = {}) {
  const timestamp = new Date().toISOString();
  const [year, month, day] = timestamp.slice(0, 10).split('-');
  const event = {
    id: randomUUID(),
    timestamp,
    action,
    actor: {
      id: session?.sub || 'unknown',
      role: session?.role || 'unknown'
    },
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
        const record = await readJsonObject(client, bucket, item.Key);
        if (record.lifecycleStatus !== 'archived') records.push(record);
      } catch (error) {
        console.error('Could not read evidence record', item.Key, error);
      }
    }

    continuationToken = page.IsTruncated ? page.NextContinuationToken : undefined;
  } while (continuationToken);

  return records.sort((a, b) => String(b.uploadedAt).localeCompare(String(a.uploadedAt)));
}

async function listAuditEvents(client, bucket, requestedLimit = 50) {
  const keys = [];
  let continuationToken;

  do {
    const page = await client.send(new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: 'audit/',
      ContinuationToken: continuationToken
    }));
    for (const item of page.Contents || []) {
      if (item.Key?.endsWith('.json')) keys.push(item.Key);
    }
    continuationToken = page.IsTruncated ? page.NextContinuationToken : undefined;
  } while (continuationToken);

  const limit = Math.max(1, Math.min(Number(requestedLimit) || 50, 100));
  const newest = keys.sort().reverse().slice(0, limit);
  const events = [];
  for (const key of newest) {
    try {
      events.push(await readJsonObject(client, bucket, key));
    } catch (error) {
      console.error('Could not read audit event', key, error);
    }
  }
  return events.sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp)));
}

function normalizePatch(input = {}) {
  const allowed = ['type', 'typeLabel', 'fiscalYear', 'publisher', 'sourceUrl', 'status', 'notes', 'title', 'aiApproved'];
  const patch = {};
  for (const key of allowed) {
    if (Object.hasOwn(input, key)) patch[key] = input[key];
  }
  if (patch.status && !['review', 'verified'].includes(patch.status)) delete patch.status;
  if (Object.hasOwn(patch, 'aiApproved')) patch.aiApproved = patch.aiApproved === true;
  return patch;
}

export default async (request) => {
  const config = configuration();
  const session = verifySession(request, config.adminKey);

  if (request.method === 'GET') {
    return json({
      configured: config.ready,
      provider: 'Cloudflare R2',
      maxFileSize: MAX_FILE_SIZE,
      permanent: true,
      authenticated: Boolean(session)
    });
  }

  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  if (!config.ready) {
    return json({
      error: 'Permanent storage is not configured yet.',
      code: 'STORAGE_NOT_CONFIGURED'
    }, 503);
  }
  if (!sameOrigin(request)) return json({ error: 'Cross-site request rejected.' }, 403);
  if (!session) return json({ error: 'Secure sign-in required.', code: 'AUTH_REQUIRED' }, 401);

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

    if (action === 'audit-list') {
      return json({ events: await listAuditEvents(client, config.bucket, body.limit) });
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
      await writeAudit(client, config, request, session, 'evidence.upload_authorized', {
        recordId: id,
        filename: file.name,
        size,
        mime,
        fiscalYear: body.metadata?.fiscalYear || ''
      });
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
        lifecycleStatus: 'active',
        recordVersion: 1,
        aiApproved: false
      };

      await writeRecord(client, config.bucket, record);
      await writeAudit(client, config, request, session, 'evidence.upload_completed', {
        recordId: record.id,
        filename: record.name,
        size: record.size,
        hash: record.hash,
        objectKey: record.objectKey
      });
      return json({ record }, 201);
    }

    if (action === 'sign-read') {
      const id = String(body.id || '');
      if (!id) return json({ error: 'Record ID is required.' }, 400);
      const record = await readJsonObject(client, config.bucket, recordKey(id));
      if (record.lifecycleStatus === 'archived') return json({ error: 'Evidence record is archived.' }, 410);
      const downloadUrl = await getSignedUrl(
        client,
        new GetObjectCommand({
          Bucket: config.bucket,
          Key: record.objectKey,
          ResponseContentType: record.mime
        }),
        { expiresIn: 900 }
      );
      await writeAudit(client, config, request, session, 'evidence.viewed', {
        recordId: record.id,
        filename: record.name
      });
      return json({ record, downloadUrl, expiresIn: 900 });
    }

    if (action === 'update') {
      const id = String(body.id || '');
      if (!id) return json({ error: 'Record ID is required.' }, 400);
      const record = await readJsonObject(client, config.bucket, recordKey(id));
      if (record.lifecycleStatus === 'archived') return json({ error: 'Archived records cannot be edited.' }, 409);
      const immutableFields = ['objectKey', 'hash', 'hashAlgorithm', 'hashSource', 'mime', 'size', 'name', 'uploadedAt', 'immutableOriginal'];
      const requestedFields = Object.keys(body.patch || {});
      const forbiddenField = requestedFields.find((key) => immutableFields.includes(key));
      if (forbiddenField) return json({ error: `Original evidence field "${forbiddenField}" is immutable. Create a linked derived record instead.` }, 409);
      const patch = normalizePatch(body.patch);
      const updated = {
        ...record,
        ...patch,
        updatedAt: new Date().toISOString(),
        recordVersion: Number(record.recordVersion || 1) + 1
      };
      await writeRecord(client, config.bucket, updated);
      await writeAudit(client, config, request, session, 'evidence.updated', {
        recordId: updated.id,
        fields: Object.keys(patch),
        status: updated.status
      });
      return json({ record: updated });
    }

    if (action === 'delete') {
      const id = String(body.id || '');
      if (!id) return json({ error: 'Record ID is required.' }, 400);
      const record = await readJsonObject(client, config.bucket, recordKey(id));
      const archived = {
        ...record,
        lifecycleStatus: 'archived',
        archivedAt: new Date().toISOString(),
        archivedBy: session.sub,
        recordVersion: Number(record.recordVersion || 1) + 1
      };
      await writeRecord(client, config.bucket, archived);
      await writeAudit(client, config, request, session, 'evidence.archived', {
        recordId: archived.id,
        filename: archived.name,
        originalPreserved: true
      });
      return json({ deleted: true, archived: true, originalPreserved: true, id });
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
