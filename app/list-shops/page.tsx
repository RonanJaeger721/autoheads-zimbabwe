import { SiteShell } from "@/components/site-shell";
import { DirectoryPage } from "@/components/directory-page";
import { categories } from "@/lib/autoheads-data";
import { sourceShops } from "@/lib/source-directory-data";
export default function Page() {
  return (
    <SiteShell>
      <DirectoryPage
        kind="Spares"
        items={sourceShops}
        categories={categories}
      />
    </SiteShell>
  );
}
