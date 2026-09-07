"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { makes, vehicles } from "@/lib/autoheads-data";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CarsExplorer() {
  const [q, setQ] = useState("");
  const [makeId, setMakeId] = useState("all");
  const [active, setActive] = useState(0);
  type VehicleWithImage = Extract<
    (typeof vehicles)[number],
    { readonly image: string }
  >;
  const featured = vehicles.filter(
    (v): v is VehicleWithImage => "image" in v && Boolean(v.image),
  );
  const filtered = useMemo(
    () =>
      vehicles.filter(
        (v) =>
          (makeId === "all" || v.makeId === makeId) &&
          `${v.make} ${v.name}`.toLowerCase().includes(q.toLowerCase()),
      ),
    [makeId, q],
  );
  const selectedMake = makes.find(([id]) => id === makeId);
  const car = featured[active % featured.length];
  const move = (n: number) =>
    setActive((active + n + featured.length) % featured.length);
  return (
    <>
      <section className="cars-workspace">
        <div className="crumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <b>Cars</b>
        </div>
        <div className="cars-title">
          <span>
            AUTOHEADS VEHICLE LIBRARY / {vehicles.length} MODEL GUIDES
          </span>
          <h1>Find your car.</h1>
          <label>
            <Search />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search make or model…"
            />
          </label>
        </div>
        <div className="make-strip">
          {makes.map(([id, name]) => (
            <button
              key={id}
              onClick={() => setMakeId(id)}
              className={makeId === id ? "active" : ""}
            >
              {name}
            </button>
          ))}
        </div>
        {q || makeId !== "all" ? (
          <div className="search-vehicle-results">
            {filtered.length ? (
              filtered.map((v) => <VehicleCard key={v.id} v={v} />)
            ) : (
              <p className="empty-cars">
                No model guides match this selection.
              </p>
            )}
          </div>
        ) : (
          <div className="vehicle-browser">
            <div className="browser-backdrop">{car.name}</div>
            <AnimatePresence mode="wait">
              <motion.div
                key={car.id}
                className="browser-car"
                initial={{ opacity: 0, x: 90, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -70, scale: 0.97 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image src={car.image!} fill alt={`${car.make} ${car.name}`} />
              </motion.div>
            </AnimatePresence>
            <div className="browser-info">
              <small>{car.make}</small>
              <h2>{car.name}</h2>
              <p>{car.intro}</p>
              <Link href={`/vehicle/${car.makeId}/${car.id}`}>
                View guide <ArrowRight />
              </Link>
            </div>
            <div className="browser-controls">
              <button onClick={() => move(-1)} aria-label="Previous vehicle">
                <ArrowLeft />
              </button>
              <span>
                {String(active + 1).padStart(2, "0")} /{" "}
                {String(featured.length).padStart(2, "0")}
              </span>
              <button onClick={() => move(1)} aria-label="Next vehicle">
                <ArrowRight />
              </button>
            </div>
          </div>
        )}
      </section>
      <section id="guides" className="guide-library">
        <div>
          <span>BROWSE THE COMPLETE LIBRARY</span>
          <h2>{selectedMake ? selectedMake[1] : "Know what you drive."}</h2>
        </div>
        <div className="make-dropdown-panel">
          <div>
            <small>01 / SELECT A MAKE</small>
            <strong>Cars grouped by manufacturer</strong>
          </div>
          <Select
            value={makeId}
            onValueChange={(value) => setMakeId(value ?? "all")}
          >
            <SelectTrigger aria-label="Select vehicle make">
              <SelectValue>{selectedMake?.[1] ?? "All makes"}</SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              <SelectGroup>
                <SelectLabel>Vehicle makes</SelectLabel>
                <SelectItem value="all">All makes</SelectItem>
                {makes.map(([id, name]) => (
                  <SelectItem value={id} key={id}>
                    {name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <span>
            {filtered.length} {filtered.length === 1 ? "guide" : "guides"}
          </span>
        </div>
        <div className="vehicle-grid-full">
          {filtered.map((v) => (
            <VehicleCard key={v.id} v={v} />
          ))}
        </div>
      </section>
      <section className="all-makes">
        <span>ALL MAKES / {makes.length}</span>
        {makes.map(([id, name], i) => (
          <Link href={`/make/${id}`} key={id}>
            <small>{String(i + 1).padStart(2, "0")}</small>
            <b>{name}</b>
            <ArrowRight />
          </Link>
        ))}
      </section>
    </>
  );
}
function VehicleCard({ v }: { v: (typeof vehicles)[number] }) {
  return (
    <Link className="vehicle-card" href={`/vehicle/${v.makeId}/${v.id}`}>
      <div>
        {"image" in v && v.image ? (
          <Image src={v.image} fill alt={`${v.make} ${v.name}`} />
        ) : (
          <span className="vehicle-no-image">
            <small>{v.make}</small>
            <b>{v.name}</b>
          </span>
        )}
      </div>
      <small>{v.make}</small>
      <h3>{v.name}</h3>
      <span>
        Explore guide <ArrowRight />
      </span>
    </Link>
  );
}
