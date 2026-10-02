import { get, put } from '@vercel/blob';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const localRoot = path.join(process.cwd(), '.data');

const usesBlob = () => Boolean(process.env.VERCEL && process.env.BLOB_STORE_ID);

export async function readStore<T>(name: string, fallback: T): Promise<T> {
  if (usesBlob()) {
    const result = await get(`platform/${name}.json`, {
      access: 'private',
      useCache: false,
    });
    if (!result || result.statusCode !== 200) return fallback;
    return (await new Response(result.stream).json()) as T;
  }

  try {
    return JSON.parse(
      await readFile(path.join(localRoot, `${name}.json`), 'utf8'),
    ) as T;
  } catch {
    return fallback;
  }
}

export async function writeStore<T>(name: string, value: T): Promise<void> {
  const body = JSON.stringify(value, null, 2);
  if (usesBlob()) {
    await put(`platform/${name}.json`, body, {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
      cacheControlMaxAge: 0,
    });
    return;
  }

  await mkdir(localRoot, { recursive: true });
  await writeFile(path.join(localRoot, `${name}.json`), body, 'utf8');
}
