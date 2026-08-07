import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export const SESSION_COOKIE = '__Host-civiclens_session';
export const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

function b64url(input) {
  return Buffer.from(input).toString('base64url');
}

function deriveSessionKey(adminKey) {
  return createHash('sha256')
    .update('civiclens-evidence-session-v1\0')
    .update(String(adminKey || ''))
    .digest();
}

export function safeEqual(leftValue, rightValue) {
  if (typeof leftValue !== 'string' || typeof rightValue !== 'string') return false;
  const left = Buffer.from(leftValue);
  const right = Buffer.from(rightValue);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function createSessionToken(adminKey) {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: 'owner',
    role: 'owner',
    iat: now,
    exp: now + SESSION_MAX_AGE_SECONDS,
    nonce: randomBytes(16).toString('hex'),
    version: 1
  };
  const encoded = b64url(JSON.stringify(payload));
  const signature = createHmac('sha256', deriveSessionKey(adminKey)).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
}

function parseCookies(request) {
  const raw = request.headers.get('cookie') || '';
  const cookies = new Map();
  for (const part of raw.split(';')) {
    const index = part.indexOf('=');
    if (index < 1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    cookies.set(key, value);
  }
  return cookies;
}

export function verifySession(request, adminKey) {
  if (!adminKey) return null;
  const token = parseCookies(request).get(SESSION_COOKIE);
  if (!token) return null;
  const [encoded, suppliedSignature, extra] = token.split('.');
  if (!encoded || !suppliedSignature || extra) return null;

  const expectedSignature = createHmac('sha256', deriveSessionKey(adminKey)).update(encoded).digest('base64url');
  if (!safeEqual(suppliedSignature, expectedSignature)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    const now = Math.floor(Date.now() / 1000);
    if (payload.version !== 1 || payload.sub !== 'owner' || payload.role !== 'owner') return null;
    if (!Number.isFinite(payload.exp) || payload.exp <= now) return null;
    if (!Number.isFinite(payload.iat) || payload.iat > now + 60) return null;
    return payload;
  } catch {
    return null;
  }
}

export function sessionCookie(token) {
  return `${SESSION_COOKIE}=${token}; Path=/; Max-Age=${SESSION_MAX_AGE_SECONDS}; HttpOnly; Secure; SameSite=Strict`;
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`;
}

export function sameOrigin(request) {
  const origin = request.headers.get('origin');
  const requestOrigin = new URL(request.url).origin;
  if (origin) return origin === requestOrigin;

  const fetchSite = request.headers.get('sec-fetch-site');
  return !fetchSite || fetchSite === 'same-origin' || fetchSite === 'same-site' || fetchSite === 'none';
}

export function anonymizedClientFingerprint(request, secret) {
  const forwarded = request.headers.get('x-nf-client-connection-ip')
    || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || 'unknown';
  return createHash('sha256')
    .update('civiclens-audit-client-v1\0')
    .update(String(secret || ''))
    .update('|')
    .update(forwarded)
    .digest('hex')
    .slice(0, 24);
}
