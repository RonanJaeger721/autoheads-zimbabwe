import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, verifyAdminSession } from '@/lib/admin-auth';
import { readStore, writeStore } from '@/lib/platform-store';
import type {
  ApplicationStatus,
  BusinessApplication,
} from '@/lib/platform-types';

const storeName = 'business-applications';
const allowedStatuses: ApplicationStatus[] = [
  'Pending',
  'Approved',
  'Needs review',
  'Archived',
];

const authorised = (request: NextRequest) =>
  verifyAdminSession(request.cookies.get(ADMIN_COOKIE)?.value);

export async function GET(request: NextRequest) {
  if (!authorised(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json(
    await readStore<BusinessApplication[]>(storeName, []),
  );
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  if (!body) {
    return NextResponse.json(
      { error: 'Invalid application.' },
      { status: 400 },
    );
  }
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const type = typeof body.type === 'string' ? body.type.trim() : '';
  const location =
    typeof body.location === 'string' ? body.location.trim() : '';
  if (!name || !type || !location) {
    return NextResponse.json(
      { error: 'Business name, type and city are required.' },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();
  const record: BusinessApplication = {
    id: randomUUID(),
    name,
    type,
    location,
    area: typeof body.area === 'string' ? body.area : undefined,
    address: typeof body.address === 'string' ? body.address : undefined,
    contactName:
      typeof body.contactName === 'string' ? body.contactName : undefined,
    email: typeof body.email === 'string' ? body.email : undefined,
    phone: typeof body.phone === 'string' ? body.phone : undefined,
    categories: Array.isArray(body.categories)
      ? body.categories.filter(
          (item): item is string => typeof item === 'string',
        )
      : [],
    otherServices:
      typeof body.otherServices === 'string' ? body.otherServices : undefined,
    status: 'Pending',
    active: false,
    featured: false,
    verified: false,
    subscriptionLevel: 'Basic',
    submitted: authorised(request)
      ? 'Added by administrator'
      : 'Submitted through the public application form',
    createdAt: now,
    updatedAt: now,
  };
  const records = await readStore<BusinessApplication[]>(storeName, []);
  await writeStore(storeName, [record, ...records]);
  return NextResponse.json(record, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  if (!authorised(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as {
    id?: string;
    status?: ApplicationStatus;
    name?: string;
    type?: string;
    location?: string;
    area?: string;
    address?: string;
    email?: string;
    phone?: string;
    active?: boolean;
    featured?: boolean;
    verified?: boolean;
    subscriptionLevel?: 'Basic' | 'Standard' | 'Premium';
  } | null;
  if (!body?.id || (body.status && !allowedStatuses.includes(body.status))) {
    return NextResponse.json({ error: 'Invalid update.' }, { status: 400 });
  }
  const records = await readStore<BusinessApplication[]>(storeName, []);
  const next = records.map((record) => {
    if (record.id !== body.id) return record;
    const changes = Object.fromEntries(
      Object.entries(body).filter(
        ([key, value]) => key !== 'id' && value !== undefined,
      ),
    );
    return { ...record, ...changes, updatedAt: new Date().toISOString() };
  });
  await writeStore(storeName, next);
  return NextResponse.json(next.find((record) => record.id === body.id));
}

export async function DELETE(request: NextRequest) {
  if (!authorised(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json(
      { error: 'Application ID is required.' },
      { status: 400 },
    );
  }
  const records = await readStore<BusinessApplication[]>(storeName, []);
  const next = records.filter((record) => record.id !== id);
  if (next.length === records.length) {
    return NextResponse.json(
      { error: 'Application not found.' },
      { status: 404 },
    );
  }
  await writeStore(storeName, next);
  return NextResponse.json({ ok: true });
}
