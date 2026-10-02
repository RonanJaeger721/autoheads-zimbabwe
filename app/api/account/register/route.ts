import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { readStore, writeStore } from '@/lib/platform-store';
import type { MotoristAccount } from '@/lib/platform-types';
import {
  createUserSession,
  hashPassword,
  USER_COOKIE,
  userCookieOptions,
} from '@/lib/user-auth';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  if (!body) {
    return NextResponse.json(
      { error: 'Invalid registration details.' },
      { status: 400 },
    );
  }
  const firstName =
    typeof body.firstName === 'string' ? body.firstName.trim() : '';
  const email =
    typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  if (!firstName || !email || password.length < 8) {
    return NextResponse.json(
      {
        error:
          'Enter your name, a valid email address and a password of at least 8 characters.',
      },
      { status: 400 },
    );
  }
  const accounts = await readStore<MotoristAccount[]>('motorist-accounts', []);
  if (accounts.some((account) => account.email === email)) {
    return NextResponse.json(
      { error: 'An account already exists for this email address.' },
      { status: 409 },
    );
  }
  const account: MotoristAccount = {
    id: randomUUID(),
    firstName,
    gender: typeof body.gender === 'string' ? body.gender : '',
    email,
    phone: typeof body.phone === 'string' ? body.phone : '',
    city: typeof body.city === 'string' ? body.city : 'Harare',
    vehicleMake:
      typeof body.vehicleMake === 'string' ? body.vehicleMake : undefined,
    vehicleModel:
      typeof body.vehicleModel === 'string' ? body.vehicleModel : undefined,
    vehicleYear:
      typeof body.vehicleYear === 'string' ? body.vehicleYear : undefined,
    fuel: typeof body.fuel === 'string' ? body.fuel : undefined,
    marketingOptIn: body.marketingOptIn === true,
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  await writeStore('motorist-accounts', [account, ...accounts]);
  const response = NextResponse.json({ ok: true }, { status: 201 });
  response.cookies.set(
    USER_COOKIE,
    createUserSession(account.id),
    userCookieOptions,
  );
  return response;
}
