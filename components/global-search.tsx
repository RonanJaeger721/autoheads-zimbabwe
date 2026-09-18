"use client";

import Link from "next/link";
import { ArrowRight, MapPin, PackageSearch, ShieldCheck, Wrench } from "lucide-react";
import { useMemo, useState } from "react";

const areas = ["Harare", "Bulawayo", "Gweru", "Mutare", "Masvingo", "Chitungwiza", "Kwekwe", "Kadoma", "Marondera"];
const prompts = {
  mechanic: ["Diagnostics", "Brakes", "Electrical", "Suspension"],
  spares: ["Filters", "Body parts", "Batteries", "Tyres"],
} as const;

export function GlobalSearch() {
  const [intent, setIntent] = useState<"mechanic" | "spares">("mechanic");
  const [area, setArea] = useState("Harare");
  const [need, setNeed] = useState("");
  const href = useMemo(
    () => `${intent === "mechanic" ? "/list-mechanics" : "/list-shops"}?q=${encodeURIComponent(need)}&location=${encodeURIComponent(area)}`,
    [area, intent, need],
  );

  return (
    <section id="search" className="route-finder" aria-labelledby="route-finder-title">
      <header>
        <div><span>NEARBY DIRECTORY</span><h2 id="route-finder-title">What are you looking for?</h2></div>
        <small>Results are matched by listed area, not estimated distance.</small>
      </header>
      <div className="route-choice" role="group" aria-label="Choose directory">
        <button type="button" className={intent === "mechanic" ? "active" : ""} onClick={() => { setIntent("mechanic"); setNeed(""); }}>
          <Wrench aria-hidden="true" /><span><b>A mechanic</b><small>Repairs, diagnostics and workshops</small></span>
        </button>
        <button type="button" className={intent === "spares" ? "active" : ""} onClick={() => { setIntent("spares"); setNeed(""); }}>
          <PackageSearch aria-hidden="true" /><span><b>Car spares</b><small>Parts, tyres, oils and suppliers</small></span>
        </button>
      </div>
      <div className="route-details">
        <label className="route-field route-area"><span><MapPin aria-hidden="true" /> Near</span><select value={area} onChange={(event) => setArea(event.target.value)}>{areas.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="route-field route-need"><span>{intent === "mechanic" ? "Service needed" : "Part needed"}</span><input value={need} onChange={(event) => setNeed(event.target.value)} placeholder={intent === "mechanic" ? "e.g. brake repair" : "e.g. Toyota filters"} /></label>
        <Link className="route-submit" href={href}>Show nearby <ArrowRight /></Link>
      </div>
      <div className="route-footer">
        <div className="route-suggestions"><span>Popular:</span>{prompts[intent].map((prompt) => <button type="button" key={prompt} onClick={() => setNeed(prompt)}>{prompt}</button>)}</div>
        <Link href="/verified"><ShieldCheck /> Understand verification</Link>
      </div>
    </section>
  );
}
