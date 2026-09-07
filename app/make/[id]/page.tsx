import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { makes, vehicles } from "@/lib/autoheads-data";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const make = makes.find((x) => x[0] === id);
  const name = make?.[1] ?? "Vehicle make";
  const models = vehicles.filter((v) => v.makeId === id);
  return (
    <SiteShell>
      <main className="make-page">
        <div className="make-intro">
          <div>
            <span>VEHICLE MAKE / {id.padStart(2, "0")}</span>
            <h1>{name}</h1>
            <p>
              Explore available Autoheads model guides, ownership context and
              maintenance information for {name} vehicles.
            </p>
          </div>
          {name === "Toyota" && (
            <Image
              src="/images/toyota.png"
              alt="Toyota emblem"
              width={420}
              height={260}
            />
          )}
        </div>
        <nav className="anchor-nav">
          <a href="#overview">Overview</a>
          <a href="#models">Models</a>
          <a href="#ownership">Ownership</a>
          <a href="#maintenance">Maintenance</a>
        </nav>
        <article id="overview" className="long-copy">
          <small>OVERVIEW</small>
          <h2>A practical guide to {name}.</h2>
          <p>
            The live Autoheads platform contains substantial editorial make
            information. This redesign preserves a narrow, readable editorial
            structure ready for the original database content to be connected
            without rewriting it.
          </p>
          <blockquote>
            Choose with context. Maintain with knowledge. Find support locally.
          </blockquote>
          <h3 id="ownership">Ownership in Zimbabwe</h3>
          <p>
            Vehicle suitability depends on condition, intended use, parts
            availability and informed maintenance. Autoheads brings those
            decisions together in one connected experience.
          </p>
          <h3 id="maintenance">Maintenance notes</h3>
          <p>
            Always check the manufacturer specification for service schedules,
            fluids and part compatibility. Existing Autoheads maintenance
            content should be migrated verbatim and reviewed editorially.
          </p>
        </article>
        <section id="models" className="models-section">
          <span>MODELS IN THE CURRENT LIBRARY</span>
          <div>
            {models.length ? (
              models.map((v) => (
                <Link key={v.id} href={`/vehicle/${v.makeId}/${v.id}`}>
                  <small>{v.make}</small>
                  <b>{v.name}</b>
                  <ArrowRight />
                </Link>
              ))
            ) : (
              <p>Model records will appear here from the existing database.</p>
            )}
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
