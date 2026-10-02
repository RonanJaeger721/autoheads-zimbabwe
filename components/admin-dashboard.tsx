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

type Application = {
  id: number;
  name: string;
  type: string;
  location: string;
  status: 'Pending' | 'Approved' | 'Needs review' | 'Archived';
  submitted: string;
};

const starterApplications: Application[] = [
  {
    id: 1,
    name: 'New business application',
    type: 'Workshop',
    location: 'Harare',
    status: 'Pending',
    submitted: 'Awaiting review',
  },
  {
    id: 2,
    name: 'Supplier listing update',
    type: 'Spares supplier',
    location: 'Bulawayo',
    status: 'Needs review',
    submitted: 'Information update',
  },
];

const sections = [
  ['Overview', CircleGauge],
  ['Applications', FileText],
  ['Businesses', Building2],
  ['Vehicles', CarFront],
  ['Editorial', FileText],
  ['Locations', MapPin],
  ['Categories', Settings2],
] as const;

export function AdminDashboard({ counts }: { counts: Counts }) {
  const router = useRouter();
  const [active, setActive] = useState('Overview');
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [applications, setApplications] = useState(starterApplications);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem('autoheads-admin-applications');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Application[];
        queueMicrotask(() => setApplications(parsed));
      } catch {
        window.localStorage.removeItem('autoheads-admin-applications');
      }
    }
  }, []);

  const save = (next: Application[]) => {
    setApplications(next);
    window.localStorage.setItem(
      'autoheads-admin-applications',
      JSON.stringify(next),
    );
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

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  }

  function addApplication(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get('name');
    const type = data.get('type');
    const location = data.get('location');
    save([
      {
        id: Date.now(),
        name: typeof name === 'string' ? name : '',
        type: typeof type === 'string' ? type : '',
        location: typeof location === 'string' ? location : '',
        status: 'Pending',
        submitted: 'Added by administrator',
      },
      ...applications,
    ]);
    setShowNew(false);
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
                setActive(label);
                setMenuOpen(false);
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
            onClick={() => setShowNew(true)}
          >
            <Plus /> Add record
          </button>
        </header>

        <div className="admin-content">
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
                {filtered.length ? (
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
                          save(
                            applications.map((record) =>
                              record.id === item.id
                                ? {
                                    ...record,
                                    status: event.target
                                      .value as Application['status'],
                                  }
                                : record,
                            ),
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
                  onClick={() => setActive(String(label))}
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
                  <p>Approval and Verified status are separate decisions.</p>
                </div>
              </div>
            </aside>
          </section>
        </div>
      </section>

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
