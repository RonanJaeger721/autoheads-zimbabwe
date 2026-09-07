import { SiteShell } from "@/components/site-shell";
import { CarsExplorer } from "@/components/cars-explorer";
export default function Page() {
  return (
    <SiteShell>
      <main>
        <CarsExplorer />
      </main>
    </SiteShell>
  );
}
