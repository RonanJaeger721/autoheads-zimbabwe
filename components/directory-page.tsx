"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { MapPin, Phone, SlidersHorizontal } from "lucide-react";
type Listing = {
  name: string;
  tags: readonly string[] | string[];
  address: string;
  phone?: string;
  details?: string;
};
export function DirectoryPage({
  kind,
  items,
  categories,
}: {
  kind: "Spares" | "Mechanics" | "Workshops";
  items: readonly Listing[];
  categories: readonly string[] | string[];
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [filters, setFilters] = useState(false);
  const filtered = useMemo(
    () =>
      items.filter(
        (x) =>
          (cat === "All" ||
            `${x.details ?? ""} ${x.tags.join(" ")}`
              .toLowerCase()
              .includes(cat.toLowerCase())) &&
          `${x.name} ${x.details ?? ""} ${x.tags.join(" ")} ${x.address}`
            .toLowerCase()
            .includes(q.toLowerCase()),
      ),
    [q, cat, items],
  );
  const isSpares = kind === "Spares";
  return (
    <main>
      <div className="directory-hero">
        <span>AUTOHEADS DIRECTORY / ZIMBABWE</span>
        <h1>
          {isSpares
            ? "What does your car need?"
            : kind === "Mechanics"
              ? "Find a mechanic."
              : "Find a workshop."}
        </h1>
        <p>
          {isSpares
            ? "Search parts, suppliers or categories."
            : "Search services, providers or locations."}
        </p>
        <div className="directory-search">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={
              isSpares
                ? "Search parts, suppliers or categories…"
                : "Search service, provider or location…"
            }
          />
          <button onClick={() => setFilters(!filters)}>
            <SlidersHorizontal />
            Filters
          </button>
        </div>
      </div>
      <div className="quick-categories">
        {categories.slice(0, 8).map((x) => (
          <button key={x} onClick={() => setCat(x)}>
            {x}
          </button>
        ))}
        <button onClick={() => setFilters(true)}>
          All {categories.length} categories
        </button>
      </div>
      <div className="directory-layout">
        <aside className={filters ? "filter-open" : ""}>
          <b>All categories / services</b>
          <button
            className={cat === "All" ? "active" : ""}
            onClick={() => setCat("All")}
          >
            All
          </button>
          {categories.map((x) => (
            <button
              className={cat === x ? "active" : ""}
              key={x}
              onClick={() => setCat(x)}
            >
              {x}
            </button>
          ))}
          <button
            className="reset"
            onClick={() => {
              setCat("All");
              setQ("");
            }}
          >
            Reset filters
          </button>
        </aside>
        <section className="results">
          <div className="results-meta">
            <span>{filtered.length} source listings</span>
            <span>List view</span>
          </div>
          {filtered.map((x, i) => {
            const slug = x.name
              .toLowerCase()
              .replaceAll(" ", "-")
              .replaceAll("&", "and");
            return (
              <article className="business-row" key={`${x.name}-${i}`}>
                <div className="business-index">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="business-main">
                  <small>{x.tags.join(" · ")}</small>
                  <h2>
                    <Link href={`/business/${slug}`}>{x.name}</Link>
                  </h2>
                  {x.details && <p>{x.details}</p>}
                  <p>
                    <MapPin />
                    {x.address}
                  </p>
                </div>
                <div className="business-actions">
                  {x.phone && (
                    <a href={`tel:${x.phone}`}>
                      <Phone />
                      Call
                    </a>
                  )}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(x.address)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MapPin />
                    Directions
                  </a>
                </div>
              </article>
            );
          })}
          {!filtered.length && (
            <div className="empty">
              <h2>No exact matches</h2>
              <p>Try a broader part, service or location.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
