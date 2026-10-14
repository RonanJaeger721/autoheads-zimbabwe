import { SiteShell } from '@/components/site-shell';
import { DirectoryPage } from '@/components/directory-page';
import { getDirectoryCategories, getDirectoryListings } from '@/lib/directory-admin-data';

export const dynamic = 'force-dynamic';
export default async function Page() {
  const [items, categories] = await Promise.all([
    getDirectoryListings('Workshops'),
    getDirectoryCategories('Mechanic / workshop categories'),
  ]);
  return (
    <SiteShell>
      <DirectoryPage
        kind="Workshops"
        items={items}
        categories={categories}
      />
    </SiteShell>
  );
}
