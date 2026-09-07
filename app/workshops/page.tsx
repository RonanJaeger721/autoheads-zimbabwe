import { SiteShell } from "@/components/site-shell";
import { DirectoryPage } from "@/components/directory-page";
import {
  sourceWorkshops,
  sourceWorkshopCategories,
} from "@/lib/source-directory-data";
export default function Page() {
  return (
    <SiteShell>
      <DirectoryPage
        kind="Workshops"
        items={sourceWorkshops}
        categories={sourceWorkshopCategories}
      />
    </SiteShell>
  );
}
