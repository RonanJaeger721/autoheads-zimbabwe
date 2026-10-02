'use client';

import {
  ArrowUpRight,
  Building2,
  CarFront,
  Check,
  ChevronRight,
  CircleGauge,
  FileText,
  LogOut,
  MapPin,
  Menu,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Store,
  Wrench,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type {
  ApplicationStatus,
  BusinessApplication,
} from '@/lib/platform-types';

type Counts = {
  makes: number;
  vehicles: number;
  mechanics: number;
  shops: number;
  workshops: number;
  posts: number;
  tips: number;
  categories: number;
};

type AdminRecord = {
  id: string;
  title: string;
  subtitle: string;
  kind: string;
  href: string;
};

type RecordGroups = Record<
  'Businesses' | 'Vehicles' | 'Editorial' | 'Locations' | 'Categories',
  AdminRecord[]
>;

const sections = [
  ['Overview', CircleGauge],
  ['Applications', FileText],
  ['Businesses', Building2],
  ['Vehicles', CarFront],
  ['Editorial', FileText],
  ['Locations', MapPin],
  ['Categories', Settings2],
] as const;

export function AdminDashboard({
  counts,
  records,
}: {
  counts: Counts;
  records: RecordGroups;
}) {
  const router = useRouter();
  const [active, setActive] = useState('Overview');
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [applications, setApplications] = useState<BusinessApplication[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    void fetch('/api/applications', { cache: 'no-store' })
      .then((response) => response.json())
      .then((records: BusinessApplication[]) => setApplications(records))
      .finally(() => setLoadingRecords(false));
  }, []);

  const updateStatus = async (id: string, status: ApplicationStatus) => {
    const previous = applications;
    setApplications((records) =>
      records.map((record) =>
        record.id === id ? { ...record, status } : record,
      ),
    );
    const response = await fetch('/api/applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (!response.ok) setApplications(previous);
  };

  const filtered = useMemo(
    () =>
      applications.filter((item) =>
        `${item.name} ${item.type} ${item.location} ${item.status}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [applications, query],
  );

  const activeRecords = useMemo(() => {
    if (active === 'Overview' || active === 'Applications') return [];
    return records[active as keyof RecordGroups].filter((item) =>
      `${item.title} ${item.subtitle} ${item.kind}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  }, [active, query, records]);

  const selectSection = (label: string) => {
    setActive(label);
    setQuery('');
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  }

  async function addApplication(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get('name');
    const type = data.get('type');
    const location = data.get('location');
    const response = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, type, location }),
    });
    if (response.ok) {
      const record = (await response.json()) as BusinessApplication;
      setApplications((records) => [record, ...records]);
      setShowNew(false);
    }
  }

  const moduleCards = [
    { label: 'Mechanics', value: counts.mechanics, icon: Wrench },
    { label: 'Spare suppliers', value: counts.shops, icon: Store },
    { label: 'Workshops', value: counts.workshops, icon: Building2 },
    { label: 'Vehicle guides', value: counts.vehicles, icon: CarFront },
  ];

  return (
    <main className="admin-shell">
      <aside className={menuOpen ? 'is-open' : ''}>
        <div className="admin-wordmark">
          <span>AH</span>
          <div>
            <b>Autoheads</b>
            <small>Administration</small>
          </div>
          <button
            type="button"
            aria-label="Close administration menu"
            onClick={() => setMenuOpen(false)}
          >
            <X />
          </button>
        </div>
        <nav aria-label="Administration">
          <small>WORKSPACE</small>
          {sections.map(([label, Icon]) => (
            <button
              type="button"
              className={active === label ? 'active' : ''}
              onClick={() => {
                selectSection(label);
              }}
              key={label}
            >
              <Icon />
              {label}
              <ChevronRight />
            </button>
          ))}
        </nav>
        <div className="admin-side-actions">
          <Link href="/" target="_blank">
            View public website <ArrowUpRight />
          </Link>
          <button type="button" onClick={logout}>
            Sign out <LogOut />
          </button>
        </div>
      </aside>

      <section className="admin-workspace">
        <header>
          <button
            className="admin-menu-trigger"
            type="button"
            aria-label="Open administration menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu />
          </button>
          <div>
            <span>AUTOHEADS CONTROL ROOM</span>
            <h1>{active}</h1>
          </div>
          <label className="admin-search">
            <Search />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search records"
              aria-label="Search administration records"
            />
          </label>
          <button
            type="button"
            className="admin-new"
            onClick={() => {
              if (active !== 'Applications') selectSection('Applications');
              setShowNew(true);
            }}
          >
            <Plus /> Add record
          </button>
        </header>

        <div className="admin-content admin-view-enter" key={active}>
          {active === 'Overview' && (
            <>
              <section className="admin-welcome">
                <div>
                  <span>PLATFORM STATUS / LIVE DIRECTORY</span>
                  <h2>Keep the directory useful, current and trusted.</h2>
                </div>
                <p>
                  Review incoming businesses, maintain accurate locations and
                  publish only information that has been checked.
                </p>
              </section>

              <section className="admin-metrics" aria-label="Directory totals">
                {moduleCards.map(({ label, value, icon: Icon }) => (
                  <article key={label}>
                    <Icon />
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </article>
                ))}
              </section>

              <section className="admin-grid">
                <div className="admin-queue">
                  <header>
                    <div>
                      <span>REVIEW QUEUE</span>
                      <h2>Business applications</h2>
                    </div>
                    <b>{filtered.length} records</b>
                  </header>
                  <div className="admin-table">
                    {loadingRecords ? (
                      <div className="admin-empty">Loading live records…</div>
                    ) : filtered.length ? (
                      filtered.map((item) => (
                        <article key={item.id}>
                          <div>
                            <b>{item.name}</b>
                            <span>
                              {item.type} · {item.location}
                            </span>
                          </div>
                          <small
                            className={`status-${item.status.toLowerCase().replace(' ', '-')}`}
                          >
                            {item.status}
                          </small>
                          <select
                            aria-label={`Change status for ${item.name}`}
                            value={item.status}
                            onChange={(event) =>
                              updateStatus(
                                item.id,
                                event.target.value as ApplicationStatus,
                              )
                            }
                          >
                            <option>Pending</option>
                            <option>Needs review</option>
                            <option>Approved</option>
                            <option>Archived</option>
                          </select>
                        </article>
                      ))
                    ) : (
                      <div className="admin-empty">
                        No records match your search.
                      </div>
                    )}
                  </div>
                </div>

                <aside className="admin-modules">
                  <header>
                    <span>CONTENT CONTROL</span>
                    <h2>Platform modules</h2>
                  </header>
                  {[
                    ['Makes', counts.makes],
                    ['Categories', counts.categories],
                    ['Articles', counts.posts],
                    ['Motoring tips', counts.tips],
                    ['Locations', 9],
                  ].map(([label, value]) => (
                    <button
                      type="button"
                      key={label}
                      onClick={() =>
                        selectSection(
                          label === 'Makes'
                            ? 'Vehicles'
                            : label === 'Articles' || label === 'Motoring tips'
                              ? 'Editorial'
                              : String(label),
                        )
                      }
                    >
                      <span>{label}</span>
                      <b>{value}</b>
                      <ChevronRight />
                    </button>
                  ))}
                  <div className="admin-verification-note">
                    <ShieldCheck />
                    <div>
                      <b>Verification remains deliberate.</b>
                      <p>
                        Approval and Verified status are separate decisions.
                      </p>
                    </div>
                  </div>
                </aside>
              </section>
            </>
          )}

          {active === 'Applications' && (
            <section className="admin-record-panel">
              <header>
                <div>
                  <span>LIVE INTAKE</span>
                  <h2>Business applications</h2>
                  <p>Review, approve, return or archive directory requests.</p>
                </div>
                <strong>{filtered.length} records</strong>
              </header>
              <div className="admin-table admin-table-expanded">
                {loadingRecords ? (
                  <div className="admin-empty">Loading live records…</div>
                ) : filtered.length ? (
                  filtered.map((item) => (
                    <article key={item.id}>
                      <div>
                        <b>{item.name}</b>
                        <span>
                          {item.type} · {item.location}
                        </span>
                      </div>
                      <small
                        className={`status-${item.status.toLowerCase().replace(' ', '-')}`}
                      >
                        {item.status}
                      </small>
                      <select
                        aria-label={`Change status for ${item.name}`}
                        value={item.status}
                        onChange={(event) => {
                          void updateStatus(
                            item.id,
                            event.target.value as ApplicationStatus,
                          );
                          setNotice(`${item.name} updated.`);
                        }}
                      >
                        <option>Pending</option>
                        <option>Needs review</option>
                        <option>Approved</option>
                        <option>Archived</option>
                      </select>
                    </article>
                  ))
                ) : (
                  <div className="admin-empty">
                    No applications match your search.
                  </div>
                )}
              </div>
            </section>
          )}

          {active !== 'Overview' && active !== 'Applications' && (
            <section className="admin-record-panel">
              <header>
                <div>
                  <span>CONTENT MODULE / {active.toUpperCase()}</span>
                  <h2>{active}</h2>
                  <p>
                    Search the live catalogue and open any record on the public
                    website.
                  </p>
                </div>
                <strong>{activeRecords.length} records</strong>
              </header>
              <div className="admin-record-list">
                {activeRecords.length ? (
                  activeRecords.map((item, index) => (
                    <article
                      key={item.id}
                      style={{ '--record-order': index } as React.CSSProperties}
                    >
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <div>
                        <small>{item.kind}</small>
                        <h3>{item.title}</h3>
                        <p>{item.subtitle}</p>
                      </div>
                      <Link
                        href={item.href}
                        target="_blank"
                        aria-label={`Open ${item.title} on public website`}
                      >
                        Preview <ArrowUpRight />
                      </Link>
                    </article>
                  ))
                ) : (
                  <div className="admin-empty">
                    No records match your search.
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </section>

      {notice && (
        <button
          className="admin-toast"
          type="button"
          onClick={() => setNotice('')}
        >
          <Check /> {notice}
        </button>
      )}

      {showNew && (
        <dialog className="admin-modal" aria-modal="true" open>
          <form onSubmit={addApplication}>
            <header>
              <div>
                <span>NEW DIRECTORY RECORD</span>
                <h2>Add an application</h2>
              </div>
              <button
                type="button"
                aria-label="Close form"
                onClick={() => setShowNew(false)}
              >
                <X />
              </button>
            </header>
            <label>
              Business name
              <input name="name" required />
            </label>
            <label>
              Business type
              <select name="type" required>
                <option>Mechanic</option>
                <option>Workshop</option>
                <option>Spares supplier</option>
                <option>Other automotive business</option>
              </select>
            </label>
            <label>
              City / town
              <select name="location" required>
                <option>Harare</option>
                <option>Bulawayo</option>
                <option>Gweru</option>
                <option>Mutare</option>
                <option>Masvingo</option>
              </select>
            </label>
            <button className="admin-submit">
              Save record <Check />
            </button>
          </form>
        </dialog>
      )}
    </main>
  );
}
