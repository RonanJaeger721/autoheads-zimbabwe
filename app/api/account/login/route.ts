import { NextResponse } from 'next/server';
import { readStore } from '@/lib/platform-store';
import type { MotoristAccount } from '@/lib/platform-types';
import {
  createUserSession,
  USER_COOKIE,
  userCookieOptions,
  verifyPassword,
} from '@/lib/user-auth';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  const email =
    typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  const accounts = await readStore<MotoristAccount[]>('motorist-accounts', []);
  const account = accounts.find((item) => item.email === email);
  if (!account || !(await verifyPassword(password, account.passwordHash))) {
    await new Promise((resolve) => setTimeout(resolve, 650));
    return NextResponse.json(
      { error: 'The email address or password is incorrect.' },
      { status: 401 },
    );
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(
    USER_COOKIE,
    createUserSession(account.id),
    userCookieOptions,
  );
  return response;
}
