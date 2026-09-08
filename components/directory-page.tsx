"use client";
import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  MessageCircle,
  Phone,
  SlidersHorizontal,
  X,
} from "lucide-react";
type Listing = {
  name: string;
  tags: readonly string[] | string[];
  address: string;
  phone?: string;
  details?: string;
};
const PAGE_SIZE = 15;
const locationOf = (address: string) =>
  [
    "Harare",
    "Bulawayo",
    "Gweru",
    "Marondera",
    "Mutare",
    "Masvingo",
    "Chitungwiza",
    "Kwekwe",
    "Kadoma",
    "Online",
  ].find((x) => address.toLowerCase().includes(x.toLowerCase())) ?? "Other";
const whatsappNumber = (phone = "") => {
  const first = phone.split(",")[0].replace(/\D/g, "");
  if (!first) return "";
  return first.startsWith("263")
    ? first
    : first.startsWith("0")
      ? `263${first.slice(1)}`
      : first;
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
  const deferredQ = useDeferredValue(q);
  const [cat, setCat] = useState("All");
  const [location, setLocation] = useState("All");
  const [filters, setFilters] = useState(false);
  const [page, setPage] = useState(1);
  const locations = useMemo(
    () => Array.from(new Set(items.map((x) => locationOf(x.address)))).sort(),
    [items],
  );
  const filtered = useMemo(
    () =>
      items.filter(
        (x) =>
          (cat === "All" ||
            `${x.details ?? ""} ${x.tags.join(" ")}`
              .toLowerCase()
              .includes(cat.toLowerCase())) &&
          (location === "All" || locationOf(x.address) === location) &&
          `${x.name} ${x.details ?? ""} ${x.tags.join(" ")} ${x.address}`
            .toLowerCase()
            .includes(deferredQ.toLowerCase()),
      ),
    [deferredQ, cat, location, items],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = filtered.slice(
    (current - 1) * PAGE_SIZE,
    current * PAGE_SIZE,
  );
  const isSpares = kind === "Spares";
  const chooseCategory = (value: string) => {
    setCat(value);
    setPage(1);
  };
  const chooseLocation = (value: string) => {
    setLocation(value);
    setPage(1);
  };
  return (
    <main>
      <div className="directory-hero">
        <span>FIND / TRUST / CONNECT</span>
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
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder={
              isSpares
                ? "Search parts, suppliers or categories…"
                : "Search service, provider or location…"
            }
          />
          <button onClick={() => setFilters(true)}>
            <SlidersHorizontal />
            Filters
          </button>
        </div>
        <div className="active-filters">
          {cat !== "All" && (
            <button onClick={() => chooseCategory("All")}>
              {cat}
              <X />
            </button>
          )}
          {location !== "All" && (
            <button onClick={() => chooseLocation("All")}>
              {location}
              <X />
            </button>
          )}
        </div>
      </div>
      <div className="quick-categories">
        {categories.slice(0, 8).map((x) => (
          <button
            className={cat === x ? "active" : ""}
            key={x}
            onClick={() => chooseCategory(x)}
          >
            {x}
          </button>
        ))}
        <button onClick={() => setFilters(true)}>
          All {categories.length} categories
        </button>
      </div>
      <div className="directory-layout">
        <aside className={filters ? "filter-open" : ""}>
          <div className="filter-title">
            <b>Filter results</b>
            <button
              aria-label="Close filters"
              onClick={() => setFilters(false)}
            >
              <X />
            </button>
          </div>
          <label>
            Location
            <select
              value={location}
              onChange={(e) => chooseLocation(e.target.value)}
            >
              <option>All</option>
              {locations.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <b>Category / service</b>
          <button
            className={cat === "All" ? "active" : ""}
            onClick={() => chooseCategory("All")}
          >
            All
          </button>
          {categories.map((x) => (
            <button
              className={cat === x ? "active" : ""}
              key={x}
              onClick={() => chooseCategory(x)}
            >
              {x}
            </button>
          ))}
          <Link className="verification-note" href="/verified">
            About Autoheads Verified
          </Link>
          <button
            className="reset"
            onClick={() => {
              chooseCategory("All");
              chooseLocation("All");
              setQ("");
            }}
          >
            Reset filters
          </button>
        </aside>
        <section className="results">
          <div className="results-meta">
            <span>{filtered.length} source listings</span>
            <span>
              Page {current} of {pages}
            </span>
          </div>
          {visible.map((x, i) => {
            const slug = x.name
              .toLowerCase()
              .replaceAll(" ", "-")
              .replaceAll("&", "and");
            const wa = whatsappNumber(x.phone);
            return (
              <article className="business-row" key={`${x.name}-${i}`}>
                <div className="business-index">
                  {String((current - 1) * PAGE_SIZE + i + 1).padStart(2, "0")}
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
                    <a data-lead-action="call" href={`tel:${x.phone}`}>
                      <Phone />
                      Call
                    </a>
                  )}
                  {wa && (
                    <a
                      data-lead-action="whatsapp"
                      href={`https://wa.me/${wa}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle />
                      WhatsApp
                    </a>
                  )}
                  <a
                    data-lead-action="directions"
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
              <p>Try a broader service or location.</p>
            </div>
          )}
          {pages > 1 && (
            <nav className="directory-pagination" aria-label="Directory pages">
              <button
                disabled={current === 1}
                onClick={() => setPage((x) => Math.max(1, x - 1))}
              >
                <ChevronLeft />
                Previous
              </button>
              <span>
                {current} / {pages}
              </span>
              <button
                disabled={current === pages}
                onClick={() => setPage((x) => Math.min(pages, x + 1))}
              >
                Next
                <ChevronRight />
              </button>
            </nav>
          )}
        </section>
      </div>
    </main>
  );
}
