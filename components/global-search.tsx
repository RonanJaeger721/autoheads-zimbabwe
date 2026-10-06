'use client';

import Link from 'next/link';
import { ArrowRight, MapPin, Search, Wrench } from 'lucide-react';
import { useMemo, useState } from 'react';
import { cityAreas, helpCategories } from '@/lib/search-options';

export function GlobalSearch() {
  const [city, setCity] = useState('Harare');
  const [area, setArea] = useState('All areas');
  const [provider, setProvider] = useState('Mechanic');
  const [category, setCategory] = useState('');
  const areas = cityAreas[city] ?? ['All areas'];
  const href = useMemo(
    () =>
      `/find-help?provider=${encodeURIComponent(provider)}&city=${encodeURIComponent(city)}&area=${encodeURIComponent(area)}&category=${encodeURIComponent(category)}`,
    [area, category, city, provider],
  );

  return (
    <section
      id="search"
      className="route-finder unified-finder"
      aria-labelledby="route-finder-title"
    >
      <header>
        <div>
          <span>AUTOHEADS DIRECTORY</span>
          <h2 id="route-finder-title">Find the right help, nearby.</h2>
        </div>
        <small>
          Choose a provider, then narrow the search to your locality.
        </small>
      </header>
      <div
        className="finder-sequence"
        aria-label="Search by provider, location and category"
      >
        <label className="route-field">
          <span>
            <Wrench aria-hidden="true" /> Service provider
          </span>
          <select
            value={provider}
            onChange={(event) => setProvider(event.target.value)}
          >
            <option>Mechanic</option>
            <option>Workshop</option>
            <option>Spares supplier</option>
            <option>Towing</option>
          </select>
        </label>
        <label className="route-field">
          <span>
            <MapPin aria-hidden="true" /> City / Town
          </span>
          <select
            value={city}
            onChange={(event) => {
              setCity(event.target.value);
              setArea('All areas');
            }}
          >
            {Object.keys(cityAreas).map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="route-field">
          <span>Area / Suburb</span>
          <select
            value={area}
            onChange={(event) => setArea(event.target.value)}
          >
            {areas.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="route-field finder-category">
          <span>
            <Search aria-hidden="true" /> What do you need?
          </span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">Select category or service</option>
            {helpCategories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <Link className="route-submit" href={href}>
          Find help <ArrowRight />
        </Link>
      </div>
      <div className="route-footer">
        <span>Provider first. Location second. The right service next.</span>
        <div
          className="finder-routes"
          aria-label="Autoheads directory sections"
        >
          <Link href="/list-mechanics">Mechanics</Link>
          <Link href="/list-workshops">Workshops</Link>
          <Link href="/list-shops">Spares</Link>
          <Link href="/list-motoring-tips">Motoring tips</Link>
          <Link href="/list-makes">Car guides</Link>
          <Link href="/find-help?provider=Towing">Towing</Link>
        </div>
      </div>
    </section>
  );
}
