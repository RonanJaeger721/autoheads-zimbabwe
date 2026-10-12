import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, verifyAdminSession } from '@/lib/admin-auth';
import { readStore, writeStore } from '@/lib/platform-store';
import type {
  AdminContentModule,
  AdminContentRecord,
} from '@/lib/platform-types';

const storeName = 'admin-content';
const authorised = (request: NextRequest) =>
  verifyAdminSession(request.cookies.get(ADMIN_COOKIE)?.value);

const optionalText = (value: unknown) =>
  typeof value === 'string' ? value.trim() : undefined;

const contentFields = (body: Partial<AdminContentRecord>) => ({
  email: optionalText(body.email),
  phone: optionalText(body.phone),
  website: optionalText(body.website),
  address: optionalText(body.address),
  location: optionalText(body.location),
  description: optionalText(body.description),
  directions: optionalText(body.directions),
  imageUrl: optionalText(body.imageUrl),
  category: optionalText(body.category),
  content: optionalText(body.content),
});

export async function GET(request: NextRequest) {
  if (!authorised(request))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(
    await readStore<AdminContentRecord[]>(storeName, []),
  );
}

export async function POST(request: NextRequest) {
  if (!authorised(request))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = (await request
    .json()
    .catch(() => null)) as Partial<AdminContentRecord> | null;
  if (!body?.module || !body.title || !body.kind)
    return NextResponse.json(
      { error: 'Module, title and record type are required.' },
      { status: 400 },
    );
  const now = new Date().toISOString();
  const record: AdminContentRecord = {
    id: randomUUID(),
    module: body.module as AdminContentModule,
    title: body.title.trim(),
    subtitle: body.subtitle?.trim() ?? '',
    kind: body.kind.trim(),
    href: body.href?.trim() || '/',
    active: body.active ?? true,
    ...contentFields(body),
    createdAt: now,
    updatedAt: now,
  };
  const items = await readStore<AdminContentRecord[]>(storeName, []);
  await writeStore(storeName, [record, ...items]);
  return NextResponse.json(record, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  if (!authorised(request))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = (await request
    .json()
    .catch(() => null)) as Partial<AdminContentRecord> | null;
  if (!body?.id || !body.module)
    return NextResponse.json(
      { error: 'Record ID and module are required.' },
      { status: 400 },
    );
  const items = await readStore<AdminContentRecord[]>(storeName, []);
  const existing = items.find((item) => item.id === body.id);
  const now = new Date().toISOString();
  const record: AdminContentRecord = {
    id: body.id,
    module: body.module as AdminContentModule,
    title: body.title?.trim() ?? existing?.title ?? '',
    subtitle: body.subtitle?.trim() ?? existing?.subtitle ?? '',
    kind: body.kind?.trim() ?? existing?.kind ?? 'Record',
    href: body.href?.trim() ?? existing?.href ?? '/',
    active: body.active ?? existing?.active ?? true,
    ...contentFields({ ...existing, ...body }),
    deleted: body.deleted ?? existing?.deleted,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  const next = existing
    ? items.map((item) => (item.id === record.id ? record : item))
    : [record, ...items];
  await writeStore(storeName, next);
  return NextResponse.json(record);
}

export async function DELETE(request: NextRequest) {
  if (!authorised(request))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = request.nextUrl.searchParams.get('id');
  const contentModule = request.nextUrl.searchParams.get(
    'module',
  ) as AdminContentModule | null;
  if (!id || !contentModule)
    return NextResponse.json(
      { error: 'Record ID and module are required.' },
      { status: 400 },
    );
  const items = await readStore<AdminContentRecord[]>(storeName, []);
  const existing = items.find((item) => item.id === id);
  const now = new Date().toISOString();
  const tombstone: AdminContentRecord = {
    id,
    module: contentModule,
    title: existing?.title ?? '',
    subtitle: existing?.subtitle ?? '',
    kind: existing?.kind ?? 'Record',
    href: existing?.href ?? '/',
    active: false,
    ...contentFields(existing ?? {}),
    deleted: true,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  const next = existing
    ? items.map((item) => (item.id === id ? tombstone : item))
    : [tombstone, ...items];
  await writeStore(storeName, next);
  return NextResponse.json({ ok: true });
}
