import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, verifyAdminSession } from '@/lib/admin-auth';
import { readStore, writeStore } from '@/lib/platform-store';
import type { AdvertRecord } from '@/lib/platform-types';

const storeName = 'adverts';
const authorised = (request: NextRequest) =>
  verifyAdminSession(request.cookies.get(ADMIN_COOKIE)?.value);

export async function GET(request: NextRequest) {
  if (!authorised(request))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(await readStore<AdvertRecord[]>(storeName, []));
}

export async function POST(request: NextRequest) {
  if (!authorised(request))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = (await request
    .json()
    .catch(() => null)) as Partial<AdvertRecord> | null;
  if (!body?.title || !body.placement)
    return NextResponse.json(
      { error: 'Title and placement are required.' },
      { status: 400 },
    );
  const now = new Date().toISOString();
  const advert: AdvertRecord = {
    id: randomUUID(),
    title: body.title,
    placement: body.placement,
    imageUrl: body.imageUrl ?? '',
    linkUrl: body.linkUrl ?? '',
    active: body.active ?? false,
    createdAt: now,
    updatedAt: now,
  };
  const items = await readStore<AdvertRecord[]>(storeName, []);
  await writeStore(storeName, [advert, ...items]);
  return NextResponse.json(advert, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  if (!authorised(request))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = (await request
    .json()
    .catch(() => null)) as Partial<AdvertRecord> | null;
  if (!body?.id)
    return NextResponse.json(
      { error: 'Advert ID is required.' },
      { status: 400 },
    );
  const items = await readStore<AdvertRecord[]>(storeName, []);
  const next = items.map((item) =>
    item.id === body.id
      ? { ...item, ...body, updatedAt: new Date().toISOString() }
      : item,
  );
  await writeStore(storeName, next);
  return NextResponse.json(next.find((item) => item.id === body.id));
}

export async function DELETE(request: NextRequest) {
  if (!authorised(request))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = request.nextUrl.searchParams.get('id');
  if (!id)
    return NextResponse.json(
      { error: 'Advert ID is required.' },
      { status: 400 },
    );
  const items = await readStore<AdvertRecord[]>(storeName, []);
  await writeStore(
    storeName,
    items.filter((item) => item.id !== id),
  );
  return NextResponse.json({ ok: true });
}
