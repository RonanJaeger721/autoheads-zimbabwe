import { SiteShell } from "@/components/site-shell";
import { DirectoryPage } from "@/components/directory-page";
import { getDirectoryCategories, getDirectoryListings } from '@/lib/directory-admin-data';
export const dynamic = 'force-dynamic';
export default async function Page() {
  const [items, categories] = await Promise.all([
    getDirectoryListings('Spares'),
    getDirectoryCategories('Spares categories'),
  ]);
  return (
    <SiteShell>
      <DirectoryPage
        kind="Spares"
        items={items}
        categories={categories}
      />
    </SiteShell>
  );
}
