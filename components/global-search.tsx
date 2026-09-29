'use client';

import Link from 'next/link';
import { ArrowRight, MapPin, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { cityAreas, helpCategories } from '@/lib/search-options';

export function GlobalSearch() {
  const [city, setCity] = useState('Harare');
  const [area, setArea] = useState('All areas');
  const [category, setCategory] = useState('');
  const areas = cityAreas[city] ?? ['All areas'];
  const href = useMemo(
    () =>
      `/find-help?city=${encodeURIComponent(city)}&area=${encodeURIComponent(area)}&category=${encodeURIComponent(category)}`,
    [area, category, city],
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
        <small>Search by location, then choose what you need.</small>
      </header>
      <div
        className="finder-sequence"
        aria-label="Search by location and category"
      >
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
        <Link
          className={`route-submit ${category ? '' : 'is-disabled'}`}
          href={category ? href : '#search'}
          aria-disabled={!category}
        >
          Find help <ArrowRight />
        </Link>
      </div>
      <div className="route-footer">
        <span>
          Location first. Category second. The most relevant providers next.
        </span>
        <Link href="/list-makes">Looking for a car? Browse vehicle guides</Link>
      </div>
    </section>
  );
}
