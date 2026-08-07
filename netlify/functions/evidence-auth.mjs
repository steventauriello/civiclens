import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'node:crypto';
import {
  anonymizedClientFingerprint,
  clearSessionCookie,
  createSessionToken,
  safeEqual,
  sameOrigin,
  sessionCookie,
  verifySession
} from './_session.mjs';

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'pragma': 'no-cache',
      ...extraHeaders
    }
  });
}

function configuration() {
  return {
    accountId: process.env.R2_ACCOUNT_ID,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    bucket: process.env.R2_BUCKET_NAME,
    adminKey: process.env.CIVICLENS_ADMIN_KEY
  };
}

function storageReady(config) {
  return Boolean(config.accountId && config.accessKeyId && config.secretAccessKey && config.bucket);
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

async function writeAuthAudit(config, request, action, outcome) {
  if (!storageReady(config)) return;
  try {
    const client = s3Client(config);
    const timestamp = new Date().toISOString();
    const date = timestamp.slice(0, 10).split('-');
    const keyStamp = timestamp.replace(/[:.]/g, '-');
    const event = {
      id: randomUUID(),
      timestamp,
      action,
      outcome,
      actor: outcome === 'success' ? { id: 'owner', role: 'owner' } : { id: 'anonymous', role: 'none' },
      clientFingerprint: anonymizedClientFingerprint(request, config.adminKey),
      requestId: request.headers.get('x-nf-request-id') || null,
      version: 1
    };
    await client.send(new PutObjectCommand({
      Bucket: config.bucket,
      Key: `audit/${date[0]}/${date[1]}/${date[2]}/${keyStamp}-${event.id}.json`,
      Body: JSON.stringify(event, null, 2),
      ContentType: 'application/json; charset=utf-8',
      CacheControl: 'no-store'
    }));
  } catch (error) {
    console.error('Could not write authentication audit event', error);
  }
}

export default async (request) => {
  const config = configuration();
  if (!config.adminKey) return json({ error: 'Evidence Vault authentication is not configured.' }, 503);

  if (request.method === 'GET') {
    const session = verifySession(request, config.adminKey);
    return json({
      authenticated: Boolean(session),
      role: session?.role || null,
      expiresAt: session ? new Date(session.exp * 1000).toISOString() : null
    });
  }

  if (!sameOrigin(request)) return json({ error: 'Cross-site request rejected.' }, 403);

  if (request.method === 'DELETE') {
    const session = verifySession(request, config.adminKey);
    if (session) await writeAuthAudit(config, request, 'session.logout', 'success');
    return json({ authenticated: false }, 200, { 'set-cookie': clearSessionCookie() });
  }

  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const suppliedKey = String(body.key || '');
  if (!safeEqual(suppliedKey, config.adminKey)) {
    await writeAuthAudit(config, request, 'session.login', 'failed');
    return json({ error: 'Invalid credentials.' }, 401);
  }

  const token = createSessionToken(config.adminKey);
  await writeAuthAudit(config, request, 'session.login', 'success');
  return json(
    { authenticated: true, role: 'owner' },
    200,
    { 'set-cookie': sessionCookie(token) }
  );
};

export const config = {
  path: '/api/evidence-auth',
  rateLimit: {
    action: 'rate_limit',
    aggregateBy: ['domain', 'ip'],
    windowSize: 60,
    windowLimit: 20
  }
};
