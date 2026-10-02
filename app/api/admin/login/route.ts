import { NextResponse } from 'next/server';
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  createAdminSession,
  credentialsMatch,
} from '@/lib/admin-auth';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    username?: string;
    password?: string;
  } | null;
  const username = body?.username?.trim() ?? '';
  const password = body?.password ?? '';

  if (!credentialsMatch(username, password)) {
    await new Promise((resolve) => setTimeout(resolve, 650));
    return NextResponse.json(
      { error: 'The administrator details are incorrect.' },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(
    ADMIN_COOKIE,
    createAdminSession(username),
    adminCookieOptions,
  );
  return response;
}
