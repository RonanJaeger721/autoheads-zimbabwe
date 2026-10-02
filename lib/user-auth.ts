import {
  createHmac,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
export const USER_COOKIE = 'autoheads_user';
const SESSION_AGE = 60 * 60 * 24 * 14;

const secret = () =>
  process.env.USER_SESSION_SECRET ?? process.env.ADMIN_SESSION_SECRET ?? '';
const encode = (value: string) =>
  Buffer.from(value, 'utf8').toString('base64url');
const sign = (value: string) =>
  createHmac('sha256', secret()).update(value).digest('base64url');

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const key = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${key.toString('hex')}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const key = (await scrypt(password, salt, 64)) as Buffer;
  const expected = Buffer.from(hash, 'hex');
  return key.length === expected.length && timingSafeEqual(key, expected);
}

export function createUserSession(id: string) {
  const payload = encode(
    JSON.stringify({ id, expires: Date.now() + SESSION_AGE * 1000 }),
  );
  return `${payload}.${sign(payload)}`;
}

export function readUserSession(token?: string): string | null {
  if (!token || !secret()) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload));
  const supplied = Buffer.from(signature);
  if (
    expected.length !== supplied.length ||
    !timingSafeEqual(expected, supplied)
  )
    return null;
  try {
    const session = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8'),
    ) as {
      id: string;
      expires: number;
    };
    return session.expires > Date.now() ? session.id : null;
  } catch {
    return null;
  }
}

export const userCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_AGE,
};
