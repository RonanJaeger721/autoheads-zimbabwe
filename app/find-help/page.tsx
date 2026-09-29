import Link from 'next/link';
import { MapPin, Phone, ShieldCheck } from 'lucide-react';
import { SiteShell } from '@/components/site-shell';
import {
  sourceMechanics,
  sourceShops,
  sourceWorkshops,
} from '@/lib/source-directory-data';
import { cityAreas, helpCategories } from '@/lib/search-options';

const knownCities = Object.keys(cityAreas);
const listings = [
  ...sourceMechanics.map((item) => ({ ...item, type: 'Mechanic' })),
  ...sourceWorkshops.map((item) => ({ ...item, type: 'Workshop' })),
  ...sourceShops.map((item) => ({ ...item, type: 'Spares' })),
];

const cityFor = (address: string) =>
  knownCities.find((city) =>
    address.toLowerCase().includes(city.toLowerCase()),
  ) ?? 'Harare';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const city = typeof params.city === 'string' ? params.city : 'Harare';
  const area = typeof params.area === 'string' ? params.area : 'All areas';
  const category = typeof params.category === 'string' ? params.category : '';
  const matches = listings.filter((item) => {
    const haystack = `${item.tags.join(' ')} ${item.details}`.toLowerCase();
    const locationMatch =
      cityFor(item.address) === city &&
      (area === 'All areas' ||
        item.address.toLowerCase().includes(area.toLowerCase()));
    return (
      locationMatch && (!category || haystack.includes(category.toLowerCase()))
    );
  });

  return (
    <SiteShell>
      <main className="help-results-page">
        <header>
          <span>LOCATION + CATEGORY SEARCH</span>
          <h1>Help near {area === 'All areas' ? city : `${area}, ${city}`}.</h1>
          <p>
            {category
              ? `Showing providers whose source listing includes ${category}.`
              : 'Select a category to narrow the directory.'}
          </p>
          <form action="/find-help" className="results-refine">
            <label>
              City / Town
              <select name="city" defaultValue={city}>
                {knownCities.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              Area / Suburb
              <select name="area" defaultValue={area}>
                {(cityAreas[city] ?? ['All areas']).map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              Category
              <select name="category" defaultValue={category}>
                <option value="">All categories</option>
                {helpCategories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <button>Update results</button>
          </form>
        </header>
        <section className="help-result-list" aria-live="polite">
          <div className="results-meta">
            <b>{matches.length} relevant source listings</b>
            <span>Listed does not automatically mean verified.</span>
          </div>
          {matches.map((item, index) => {
            const slug = item.name
              .toLowerCase()
              .replaceAll(' ', '-')
              .replaceAll('&', 'and');
            return (
              <article key={`${item.type}-${item.name}-${index}`}>
                <small>
                  {item.type} / {item.tags.slice(0, 3).join(' · ')}
                </small>
                <h2>
                  <Link href={`/business/${slug}`}>{item.name}</Link>
                </h2>
                <p>
                  <MapPin />{' '}
                  {item.address ||
                    `${city} — address not supplied in source listing`}
                </p>
                <div>
                  <span>
                    <ShieldCheck /> Verification not yet confirmed
                  </span>
                  {item.phone && (
                    <a href={`tel:${item.phone}`}>
                      <Phone /> Call provider
                    </a>
                  )}
                </div>
              </article>
            );
          })}
          {!matches.length && (
            <div className="empty">
              <h2>No exact matches yet</h2>
              <p>
                Try the whole city or a broader category. Autoheads can only
                match the location and services contained in the current source
                listings.
              </p>
            </div>
          )}
        </section>
      </main>
    </SiteShell>
  );
}
