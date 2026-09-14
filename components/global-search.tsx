"use client";
import Link from "next/link";
import { Search, ArrowUpRight, MapPin } from "lucide-react";
import { useState } from "react";
import { vehicles, shops, categories, posts } from "@/lib/autoheads-data";
export function GlobalSearch() {
  const [q, setQ] = useState("");
  const [intent, setIntent] = useState<"mechanic" | "spares">("mechanic");
  const [location, setLocation] = useState("Harare");
  const n = q.trim().toLowerCase();
  const results = n
    ? [
        ...vehicles
          .filter((x) => `${x.make} ${x.name}`.toLowerCase().includes(n))
          .map((x) => ({
            type: "Vehicle guide",
            name: `${x.make} ${x.name}`,
            href: `/vehicle/${x.makeId}/${x.id}`,
          })),
        ...shops
          .filter((x) =>
            `${x.name} ${x.tags.join(" ")}`.toLowerCase().includes(n),
          )
          .map((x) => ({
            type: "Spares supplier",
            name: x.name,
            href: "/list-shops",
          })),
        ...categories
          .filter((x) => x.toLowerCase().includes(n))
          .map((x) => ({
            type: "Part category",
            name: x,
            href: `/list-shops?q=${encodeURIComponent(x)}`,
          })),
        ...posts
          .filter((x) => x.title.toLowerCase().includes(n))
          .map((x) => ({
            type: "Motoring",
            name: x.title,
            href: `/view-${x.id}`,
          })),
      ].slice(0, 7)
    : [];
  return (
    <div id="search" className="nearby-search">
      <div className="search-intent" aria-label="Choose what to find">
        <button className={intent === "mechanic" ? "active" : ""} onClick={() => setIntent("mechanic")}>Mechanic</button>
        <button className={intent === "spares" ? "active" : ""} onClick={() => setIntent("spares")}>Spares</button>
      </div>
      <div className="search-wrap">
      <Search size={24} />
      <label className="sr-only" htmlFor="global-search">
        Search Autoheads
      </label>
      <input
        id="global-search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={intent === "mechanic" ? "What service do you need?" : "What part do you need?"}
      />
      <Link aria-label="Find nearby" href={`${intent === "mechanic" ? "/list-mechanics" : "/list-shops"}?q=${encodeURIComponent(q)}&location=${encodeURIComponent(location)}`}>
        <ArrowUpRight />
      </Link>
      {n && (
        <div className="search-results">
          {results.length ? (
            results.map((r, i) => (
              <Link key={i} href={r.href}>
                <small>{r.type}</small>
                <b>{r.name}</b>
                <ArrowUpRight size={17} />
              </Link>
            ))
          ) : (
            <p>No matches in this migration snapshot.</p>
          )}
        </div>
      )}
      </div>
      <label className="area-picker"><MapPin /> <span>Search area</span>
        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          {['Harare','Bulawayo','Gweru','Mutare','Masvingo','Chitungwiza','Kwekwe','Kadoma','Marondera'].map((area) => <option key={area}>{area}</option>)}
        </select>
      </label>
      <div className="search-trust"><span><i /> Area-matched results</span><Link href="/verified">How verification works</Link></div>
    </div>
  );
}
