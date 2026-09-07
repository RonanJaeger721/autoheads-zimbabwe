import { SiteShell } from "@/components/site-shell";
import { DirectoryPage } from "@/components/directory-page";
import {
  sourceMechanics,
  sourceMechanicCategories,
} from "@/lib/source-directory-data";
export default function Page() {
  return (
    <SiteShell>
      <DirectoryPage
        kind="Mechanics"
        items={sourceMechanics}
        categories={sourceMechanicCategories}
      />
    </SiteShell>
  );
}
