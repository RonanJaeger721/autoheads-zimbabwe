import { categories as sourceSparesCategories } from '@/lib/autoheads-data';
import { readStore } from '@/lib/platform-store';
import type { AdminContentRecord } from '@/lib/platform-types';
import {
  sourceMechanics,
  sourceMechanicCategories,
  sourceShops,
  sourceWorkshops,
  sourceWorkshopCategories,
  type SourceListing,
} from '@/lib/source-directory-data';

const storeName = 'admin-content';

const modules = {
  Spares: {
    module: 'Spares shops',
    prefix: 'shop',
    listings: sourceShops,
  },
  Mechanics: {
    module: 'Mechanics',
    prefix: 'mechanic',
    listings: sourceMechanics,
  },
  Workshops: {
    module: 'Workshops',
    prefix: 'workshop',
    listings: sourceWorkshops,
  },
} as const;

export type DirectoryKind = keyof typeof modules;

const toListing = (
  record: AdminContentRecord,
  fallback?: SourceListing,
): SourceListing => ({
  name: record.title,
  details:
    record.description ||
    fallback?.details ||
    record.subtitle ||
    `${record.kind} listed on Autoheads.`,
  address:
    record.address ||
    record.location ||
    fallback?.address ||
    record.subtitle ||
    'Zimbabwe',
  tags: record.category
    ? record.category.split(',').map((item) => item.trim()).filter(Boolean)
    : fallback?.tags || [],
  phone: record.phone || fallback?.phone || '',
});

export async function getDirectoryListings(kind: DirectoryKind) {
  const config = modules[kind];
  const overrides = (await readStore<AdminContentRecord[]>(storeName, [])).filter(
    (item) => item.module === config.module,
  );
  const byId = new Map(overrides.map((item) => [item.id, item]));
  const seeded = config.listings.flatMap((item, index) => {
    const override = byId.get(`${config.prefix}-${index}`);
    if (override?.deleted || override?.active === false) return [];
    return [override ? toListing(override, item) : item];
  });
  const seededIds = new Set(config.listings.map((_, index) => `${config.prefix}-${index}`));
  const added = overrides
    .filter((item) => !seededIds.has(item.id) && !item.deleted && item.active !== false)
    .map((item) => toListing(item));
  return [...added, ...seeded];
}

const categorySeeds: Record<'Spares categories' | 'Mechanic / workshop categories', string[]> = {
  'Spares categories': sourceSparesCategories,
  'Mechanic / workshop categories': Array.from(
    new Set([...sourceMechanicCategories, ...sourceWorkshopCategories]),
  ).sort((a, b) => a.localeCompare(b)),
};

export async function getDirectoryCategories(
  module: 'Spares categories' | 'Mechanic / workshop categories',
) {
  const overrides = (await readStore<AdminContentRecord[]>(storeName, [])).filter(
    (item) => item.module === module,
  );
  const prefix = module === 'Spares categories' ? 'spares-category' : 'service-category';
  const byId = new Map(overrides.map((item) => [item.id, item]));
  const seeded = categorySeeds[module].flatMap((title, index) => {
    const override = byId.get(`${prefix}-${index}`);
    if (override?.deleted || override?.active === false) return [];
    return [override?.title || title];
  });
  const seedIds = new Set(categorySeeds[module].map((_, index) => `${prefix}-${index}`));
  const added = overrides
    .filter((item) => !seedIds.has(item.id) && !item.deleted && item.active !== false)
    .map((item) => item.title);
  return Array.from(new Set([...added, ...seeded])).sort((a, b) => a.localeCompare(b));
}

export async function getAllDirectoryListings() {
  const [mechanics, workshops, spares] = await Promise.all([
    getDirectoryListings('Mechanics'),
    getDirectoryListings('Workshops'),
    getDirectoryListings('Spares'),
  ]);
  return { mechanics, workshops, spares };
}
