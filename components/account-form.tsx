'use client';

import Link from 'next/link';
import { Building2, CarFront, MapPin, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { makes } from '@/lib/autoheads-data';
import { cityAreas, helpCategories, providerTypes } from '@/lib/search-options';

export function AccountForm({
  mode,
}: {
  mode: 'login' | 'register' | 'apply';
}) {
  const [done, setDone] = useState(false);
  const [city, setCity] = useState('Harare');
  const [selected, setSelected] = useState<string[]>([]);
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setDone(true);
  };
  const toggleCategory = (category: string) =>
    setSelected((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : current.length < 10
          ? [...current, category]
          : current,
    );

  const title =
    mode === 'login'
      ? 'Sign in to Autoheads.'
      : mode === 'register'
        ? 'Join as a motorist.'
        : 'List your automotive business.';
  return (
    <main className="account-page">
      <section>
        <span>
          {mode === 'login'
            ? 'AUTOHEAD SYSTEM / LOGIN'
            : mode === 'register'
              ? 'JOIN AUTOHEADS / MOTORIST'
              : 'JOIN AUTOHEADS / BUSINESS'}
        </span>
        <h1>{title}</h1>
        <p>
          {mode === 'apply'
            ? 'Submit a provider application for Autoheads review. An approved listing is not automatically Autoheads Verified.'
            : mode === 'register'
              ? 'Create your free account, save your location and optionally tell us what you drive.'
              : 'Access your motorist account or business application.'}
        </p>
        <div className="account-benefits">
          <span>
            <MapPin /> Location-aware discovery
          </span>
          <span>
            <CarFront /> Relevant vehicle information
          </span>
          <span>
            <ShieldCheck /> Privacy-conscious account design
          </span>
        </div>
      </section>
      <form onSubmit={submit}>
        {done ? (
          <div className="form-notice">
            <b>Your details are ready.</b>
            <p>
              The secure Autoheads account and application service still needs
              to be connected before this form can retain or submit information.
            </p>
          </div>
        ) : (
          <>
            {mode !== 'login' && (
              <label>
                {mode === 'apply' ? 'Contact person' : 'First name'}
                <input required name="firstName" autoComplete="name" />
              </label>
            )}
            {mode === 'register' && (
              <label>
                Gender
                <select required name="gender" defaultValue="">
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option>Female</option>
                  <option>Male</option>
                  <option>Prefer not to say</option>
                </select>
              </label>
            )}
            <label>
              Email address {mode === 'register' && <small>Optional</small>}
              <input
                required={mode !== 'register'}
                type="email"
                name="email"
                autoComplete="email"
              />
            </label>
            {mode !== 'login' && (
              <label>
                Mobile number {mode === 'register' && <small>Optional</small>}
                <input
                  required={mode === 'apply'}
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                />
              </label>
            )}
            {mode !== 'apply' && (
              <label>
                Password
                <input
                  required
                  type="password"
                  name="password"
                  autoComplete={
                    mode === 'login' ? 'current-password' : 'new-password'
                  }
                />
              </label>
            )}
            {mode === 'register' && (
              <>
                <label>
                  City / Town
                  <select
                    required
                    name="city"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                  >
                    {Object.keys(cityAreas).map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <fieldset className="optional-vehicle">
                  <legend>Optional vehicle details</legend>
                  <label>
                    Make
                    <select name="vehicleMake" defaultValue="">
                      <option value="">Select make or skip</option>
                      {makes.map(([id, name]) => (
                        <option value={id} key={id}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Model
                    <input name="vehicleModel" />
                  </label>
                  <label>
                    Year
                    <input name="vehicleYear" inputMode="numeric" />
                  </label>
                  <label>
                    Engine / Fuel type
                    <select name="fuel" defaultValue="">
                      <option value="">Select or skip</option>
                      <option>Petrol</option>
                      <option>Diesel</option>
                      <option>Hybrid</option>
                      <option>Electric</option>
                      <option>Other</option>
                    </select>
                  </label>
                </fieldset>
                <label className="consent-check">
                  <input type="checkbox" name="marketingOptIn" />{' '}
                  <span>
                    Yes, send me useful motoring tips, articles, vehicle advice
                    and occasional Autoheads updates by email.
                  </span>
                </label>
              </>
            )}
            {mode === 'apply' && (
              <>
                <label>
                  Business name
                  <input
                    required
                    name="businessName"
                    autoComplete="organization"
                  />
                </label>
                <label>
                  City / Town
                  <select
                    required
                    name="city"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                  >
                    {Object.keys(cityAreas).map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Area / Suburb
                  <select required name="area" defaultValue="All areas">
                    {cityAreas[city].map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Business area type
                  <select required name="businessType" defaultValue="">
                    <option value="" disabled>
                      Select business type
                    </option>
                    {providerTypes.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <fieldset className="service-selector">
                  <legend>
                    Categories / services offered{' '}
                    <small>{selected.length}/10 selected</small>
                  </legend>
                  <p>
                    Select up to 10. These categories connect your application
                    to motorist search.
                  </p>
                  <div>
                    {helpCategories.map((item) => (
                      <label key={item}>
                        <input
                          type="checkbox"
                          name="categories"
                          value={item}
                          checked={selected.includes(item)}
                          disabled={
                            !selected.includes(item) && selected.length >= 10
                          }
                          onChange={() => toggleCategory(item)}
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <label>
                  Other services <small>Optional</small>
                  <textarea
                    name="otherServices"
                    rows={3}
                    placeholder="Describe a service not available in the list"
                  />
                </label>
                <label>
                  Physical / business address
                  <input required name="address" />
                </label>
                <div className="application-note">
                  <b>Review before publication</b>
                  <p>
                    Autoheads reviews the application before publishing a
                    listing. Verification is a separate process.
                  </p>
                </div>
              </>
            )}
            <button>
              {mode === 'login'
                ? 'Sign in'
                : mode === 'register'
                  ? 'Create motorist account'
                  : 'Submit business application'}
            </button>
          </>
        )}
        <nav>
          {mode !== 'login' && (
            <Link href="/login">Already registered? Sign in</Link>
          )}
          {mode === 'login' && (
            <>
              <Link href="/register">Join as a motorist</Link>
              <Link href="/login#help">I forgot my password</Link>
            </>
          )}
          {mode !== 'apply' && <Link href="/apply">List your business</Link>}
          <Link href="/privacy">Privacy</Link>
        </nav>
      </form>
    </main>
  );
}
