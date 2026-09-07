import Link from "next/link";
import { ArrowLeft, MapPin, Phone } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import {
  sourceMechanics,
  sourceShops,
  sourceWorkshops,
} from "@/lib/source-directory-data";
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const all = [
    ...sourceShops.map((x) => ({ ...x, kind: "supplier" })),
    ...sourceMechanics.map((x) => ({ ...x, kind: "mechanic" })),
    ...sourceWorkshops.map((x) => ({ ...x, kind: "workshop" })),
  ];
  const business =
    all.find(
      (s) =>
        s.name.toLowerCase().replaceAll(" ", "-").replaceAll("&", "and") ===
        slug,
    ) ?? all[0];
  const back =
    business.kind === "supplier"
      ? "/list-shops"
      : business.kind === "mechanic"
        ? "/list-mechanics"
        : "/workshops";
  return (
    <SiteShell>
      <main className="business-page">
        <div className="business-hero">
          <div className="crumbs">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href={back}>{business.kind}</Link>
            <span>/</span>
            <b>{business.name}</b>
          </div>
          <span>
            {business.kind.toUpperCase()} / AUTOHEADS SOURCE DIRECTORY
          </span>
          <h1>{business.name}</h1>
          <div className="business-tags">
            {business.tags.map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
        </div>
        <section className="business-profile">
          <aside>
            <small>ADDRESS</small>
            <p>
              <MapPin />
              {business.address || "Address not supplied"}
            </p>
            {business.phone && (
              <>
                <small>CONTACT</small>
                <p>
                  <Phone />
                  {business.phone}
                </p>
              </>
            )}
          </aside>
          <div>
            <h2>Directory information.</h2>
            <p>{business.details}</p>
            <p>
              This listing preserves the business name, services and address
              published by Autoheads. Contact details are only shown when they
              were available in the source record.
            </p>
            <Link className="back-directory" href={back}>
              <ArrowLeft />
              Back to all {business.kind}s
            </Link>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
