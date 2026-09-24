'use client';
import Link from 'next/link';
import { Building2, Check, MapPin, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
export function AccountForm({
  mode,
}: {
  mode: 'login' | 'register' | 'apply';
}) {
  const [done, setDone] = useState(false);
  const [providerType, setProviderType] = useState('Spares supplier');
  const [accountType, setAccountType] = useState<'motorist' | 'business'>(
    'business',
  );
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
  };
  return (
    <main className="account-page">
      <section>
        <span>
          {mode === 'login'
            ? 'AUTOHEAD SYSTEM / LOGIN'
            : mode === 'register'
              ? 'AUTOHEAD SYSTEM / SIGN UP'
              : 'AUTOHEAD SYSTEM / APPLY'}
        </span>
        <h1>
          {mode === 'login'
            ? 'Sign in to your community.'
            : mode === 'register'
              ? 'Create Account'
              : 'Spares / Mechanics / Workshops: Apply'}
        </h1>
        <p>
          {mode === 'apply'
            ? 'Create a listing request for a spares business, mechanic or workshop. Verification is reviewed separately before any badge is shown.'
            : mode === 'login'
              ? 'Sign in to manage your listing, location, contact details and verification application.'
              : 'Motorists can save their preferences. Businesses can build a searchable provider profile.'}
        </p>
        <div className="account-benefits">
          <span>
            <MapPin /> Set your operating area
          </span>
          <span>
            <Building2 /> Manage business details
          </span>
          <span>
            <ShieldCheck /> Apply for verification
          </span>
        </div>
      </section>
      <form onSubmit={submit}>
        {done ? (
          <div className="form-notice">
            <b>
              {mode === 'apply'
                ? 'Your application details are ready.'
                : mode === 'login'
                  ? 'Business sign-in is ready to connect.'
                  : 'Your account details are ready.'}
            </b>
            <p>
              The secure Autoheads account service still needs to be connected
              before this form can send or retain information. Your details have
              not been claimed as submitted.
            </p>
          </div>
        ) : (
          <>
            {mode === 'register' && (
              <div
                className="account-type"
                role="group"
                aria-label="Choose account type"
              >
                <button
                  type="button"
                  className={accountType === 'business' ? 'active' : ''}
                  onClick={() => setAccountType('business')}
                >
                  <Building2 />
                  <span>
                    <b>Business</b>
                    <small>List services or spares</small>
                  </span>
                  {accountType === 'business' && <Check />}
                </button>
                <button
                  type="button"
                  className={accountType === 'motorist' ? 'active' : ''}
                  onClick={() => setAccountType('motorist')}
                >
                  <span>
                    <b>Motorist</b>
                    <small>Browse and save providers</small>
                  </span>
                  {accountType === 'motorist' && <Check />}
                </button>
              </div>
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
                </select>
              </label>
            )}
            {mode !== 'login' && (
              <label>
                {accountType === 'business' ? 'Contact person' : 'Your name'}
                <input required name="username" autoComplete="name" />
              </label>
            )}
            <label>
              Email
              <input required type="email" name="email" autoComplete="email" />
            </label>
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
            {mode === 'register' && accountType === 'business' && (
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
                  Primary location
                  <select required name="area" defaultValue="">
                    <option value="" disabled>
                      Select city or town
                    </option>
                    {[
                      'Harare',
                      'Bulawayo',
                      'Gweru',
                      'Mutare',
                      'Masvingo',
                      'Chitungwiza',
                      'Kwekwe',
                      'Kadoma',
                      'Marondera',
                      'Other',
                    ].map((area) => (
                      <option key={area}>{area}</option>
                    ))}
                  </select>
                </label>
                <div className="application-note">
                  <b>Your location powers discovery</b>
                  <p>
                    Customers use this area to find providers nearby. An exact
                    distance will only appear when verified map coordinates are
                    available.
                  </p>
                </div>
              </>
            )}
            {mode === 'register' && accountType === 'motorist' && (
              <>
                <label>
                  City
                  <select required name="city" defaultValue="">
                    <option value="" disabled>
                      Select city
                    </option>
                    {[
                      'Harare',
                      'Bulawayo',
                      'Mutare',
                      'Kwekwe',
                      'Chitungwiza',
                      'Masvingo',
                      'Kadoma',
                      'Gweru',
                      'Other',
                    ].map((area) => (
                      <option key={area}>{area}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Location
                  <input
                    required
                    name="location"
                    placeholder="Suburb or area"
                  />
                </label>
              </>
            )}
            {mode === 'apply' && (
              <>
                <label>
                  Cellphone
                  <input required type="tel" name="phone" />
                </label>
                <label>
                  I want to list
                  <select
                    required
                    value={providerType}
                    onChange={(e) => setProviderType(e.target.value)}
                  >
                    <option>Spares supplier</option>
                    <option>Independent mechanic</option>
                    <option>Workshop</option>
                  </select>
                </label>
                <label>
                  Business or trading name
                  <input required name="businessName" />
                </label>
                <label>
                  Area / city
                  <select required name="area" defaultValue="">
                    <option value="" disabled>
                      Select area
                    </option>
                    {[
                      'Harare',
                      'Bulawayo',
                      'Gweru',
                      'Mutare',
                      'Masvingo',
                      'Chitungwiza',
                      'Kwekwe',
                      'Kadoma',
                      'Marondera',
                      'Other',
                    ].map((area) => (
                      <option key={area}>{area}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Physical address
                  <input required name="address" />
                </label>
                <label>
                  Services or parts supplied
                  <textarea
                    required
                    name="services"
                    rows={4}
                    placeholder={
                      providerType === 'Spares supplier'
                        ? 'e.g. Toyota suspension parts, filters, body panels'
                        : 'e.g. diagnostics, suspension, electrical repairs'
                    }
                  />
                </label>
                <div className="application-note">
                  <b>What happens next</b>
                  <p>
                    Autoheads reviews the business details and evidence.
                    Applying does not automatically make a listing verified.
                  </p>
                </div>
              </>
            )}
            <button>
              {mode === 'login'
                ? 'Sign in'
                : mode === 'register'
                  ? accountType === 'business'
                    ? 'Create business account'
                    : 'Create motorist account'
                  : 'Submit application'}
            </button>
          </>
        )}
        <nav>
          {mode !== 'login' && (
            <Link href="/login">Already registered? Sign in</Link>
          )}
          {mode === 'login' && (
            <>
              <Link href="/register">Register a new membership</Link>
              <Link href="/login#help">I forgot my password</Link>
            </>
          )}
          {mode !== 'apply' && <Link href="/apply">List a business</Link>}
        </nav>
      </form>
    </main>
  );
}
