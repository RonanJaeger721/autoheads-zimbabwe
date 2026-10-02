import { createHmac, timingSafeEqual } from 'node:crypto';

export const ADMIN_COOKIE = 'autoheads_admin';
const SESSION_AGE = 60 * 60 * 8;

const secret = () => process.env.ADMIN_SESSION_SECRET ?? '';

const encode = (value: string) =>
  Buffer.from(value, 'utf8').toString('base64url');

const sign = (value: string) =>
  createHmac('sha256', secret()).update(value).digest('base64url');

export function createAdminSession(username: string) {
  const payload = encode(
    JSON.stringify({ username, expires: Date.now() + SESSION_AGE * 1000 }),
  );
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSession(token?: string) {
  if (!token || !secret()) return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;
  const expected = sign(payload);
  const suppliedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    suppliedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(suppliedBuffer, expectedBuffer)
  ) {
    return false;
  }
  try {
    const session = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8'),
    ) as { username: string; expires: number };
    return session.expires > Date.now() && Boolean(session.username);
  } catch {
    return false;
  }
}

export function credentialsMatch(username: string, password: string) {
  const expectedUsername = process.env.ADMIN_USERNAME ?? '';
  const expectedPassword = process.env.ADMIN_PASSWORD ?? '';
  if (!expectedUsername || !expectedPassword) return false;
  const givenUser = Buffer.from(username);
  const savedUser = Buffer.from(expectedUsername);
  const givenPass = Buffer.from(password);
  const savedPass = Buffer.from(expectedPassword);
  return (
    givenUser.length === savedUser.length &&
    givenPass.length === savedPass.length &&
    timingSafeEqual(givenUser, savedUser) &&
    timingSafeEqual(givenPass, savedPass)
  );
}

export const adminCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_AGE,
};
