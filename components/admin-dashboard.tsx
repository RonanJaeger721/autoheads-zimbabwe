'use client';

import {
  ArrowUpRight,
  Building2,
  CarFront,
  Check,
  ChevronRight,
  CircleGauge,
  FileText,
  Pencil,
  LogOut,
  MapPin,
  Megaphone,
  Menu,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Store,
  Star,
  Trash2,
  Wrench,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type {
  AdminContentModule,
  AdminContentRecord,
  AdvertRecord,
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
  active?: boolean;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  location?: string;
  description?: string;
  directions?: string;
  imageUrl?: string;
  category?: string;
  content?: string;
};

type RecordGroups = Record<
  | 'Spares shops'
  | 'Mechanics'
  | 'Workshops'
  | 'Vehicle owners'
  | 'Vehicles'
  | 'News'
  | 'News categories'
  | 'Motoring tips'
  | 'Motoring tip categories'
  | 'Locations'
  | 'Categories',
  AdminRecord[]
>;

const sections = [
  ['Overview', CircleGauge],
  ['Applications', FileText],
  ['Spares shops', Store],
  ['Mechanics', Wrench],
  ['Workshops', Building2],
  ['Vehicle owners', CarFront],
  ['Vehicles', CarFront],
  ['Locations', MapPin],
  ['News', FileText],
  ['News categories', Settings2],
  ['Motoring tips', FileText],
  ['Motoring tip categories', Settings2],
  ['Categories', Settings2],
  ['Adverts', Megaphone],
] as const;

const formText = (data: FormData, key: string) => {
  const value = data.get(key);
  return typeof value === 'string' ? value : '';
};

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
  const [editing, setEditing] = useState<BusinessApplication | null>(null);
  const [pendingDelete, setPendingDelete] = useState('');
  const [adverts, setAdverts] = useState<AdvertRecord[]>([]);
  const [showAdvert, setShowAdvert] = useState(false);
  const [contentOverrides, setContentOverrides] = useState<
    AdminContentRecord[]
  >([]);
  const [showContent, setShowContent] = useState(false);
  const [contentEditing, setContentEditing] =
    useState<AdminContentRecord | null>(null);
  const [recordStatus, setRecordStatus] = useState<
    'All' | 'Active' | 'Deactivated'
  >('All');

  useEffect(() => {
    void fetch('/api/applications', { cache: 'no-store' })
      .then((response) => response.json())
      .then((records: BusinessApplication[]) => setApplications(records))
      .finally(() => setLoadingRecords(false));
    void fetch('/api/admin/adverts', { cache: 'no-store' })
      .then((response) => response.json())
      .then((items: AdvertRecord[]) =>
        setAdverts(Array.isArray(items) ? items : []),
      );
    void fetch('/api/admin/content', { cache: 'no-store' })
      .then((response) => response.json())
      .then((items: AdminContentRecord[]) =>
        setContentOverrides(Array.isArray(items) ? items : []),
      );
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

  const updateApplication = async (
    id: string,
    changes: Partial<BusinessApplication>,
  ) => {
    const previous = applications;
    setApplications((items) =>
      items.map((item) => (item.id === id ? { ...item, ...changes } : item)),
    );
    const response = await fetch('/api/applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...changes }),
    });
    if (!response.ok) setApplications(previous);
    return response.ok;
  };

  const deleteApplication = async (id: string) => {
    if (pendingDelete !== id) {
      setPendingDelete(id);
      return;
    }
    const response = await fetch(
      `/api/applications?id=${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
      },
    );
    if (response.ok) {
      setApplications((items) => items.filter((item) => item.id !== id));
      setNotice('Record deleted.');
    }
    setPendingDelete('');
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

  const managedRecords = useMemo(() => {
    const contentModules = Object.keys(records) as AdminContentModule[];
    return Object.fromEntries(
      contentModules.map((contentModule) => {
        const overrides = contentOverrides.filter(
          (item) => item.module === contentModule,
        );
        const overrideIds = new Set(overrides.map((item) => item.id));
        const seeded = records[contentModule]
          .filter((item) => !overrideIds.has(item.id))
          .map((item) => ({ ...item, active: true }));
        return [
          contentModule,
          [...overrides.filter((item) => !item.deleted), ...seeded],
        ];
      }),
    ) as RecordGroups;
  }, [contentOverrides, records]);

  const activeRecords = useMemo(() => {
    if (
      active === 'Overview' ||
      active === 'Applications' ||
      active === 'Adverts'
    )
      return [];
    return managedRecords[active as keyof RecordGroups].filter((item) => {
      const matchesQuery = `${item.title} ${item.subtitle} ${item.kind}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesStatus =
        recordStatus === 'All' ||
        (recordStatus === 'Active' && item.active !== false) ||
        (recordStatus === 'Deactivated' && item.active === false);
      return matchesQuery && matchesStatus;
    });
  }, [active, managedRecords, query, recordStatus]);

  const selectSection = (label: string) => {
    setActive(label);
    setQuery('');
    setRecordStatus('All');
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

  async function saveApplication(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const data = new FormData(event.currentTarget);
    const ok = await updateApplication(editing.id, {
      name: formText(data, 'name'),
      type: formText(data, 'type'),
      location: formText(data, 'location'),
      area: formText(data, 'area'),
      address: formText(data, 'address'),
      phone: formText(data, 'phone'),
      subscriptionLevel: (formText(data, 'subscriptionLevel') ||
        'Basic') as BusinessApplication['subscriptionLevel'],
    });
    if (ok) {
      setNotice(`${editing.name} saved.`);
      setEditing(null);
    }
  }

  async function addAdvert(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const response = await fetch('/api/admin/adverts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(data.entries())),
    });
    if (response.ok) {
      const advert = (await response.json()) as AdvertRecord;
      setAdverts((items) => [advert, ...items]);
      setShowAdvert(false);
      setNotice('Advert placement created.');
    }
  }

  async function toggleAdvert(item: AdvertRecord) {
    const response = await fetch('/api/admin/adverts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, active: !item.active }),
    });
    if (response.ok)
      setAdverts((items) =>
        items.map((x) => (x.id === item.id ? { ...x, active: !x.active } : x)),
      );
  }

  async function deleteAdvert(id: string) {
    if (pendingDelete !== id) {
      setPendingDelete(id);
      return;
    }
    const response = await fetch(
      `/api/admin/adverts?id=${encodeURIComponent(id)}`,
      { method: 'DELETE' },
    );
    if (response.ok)
      setAdverts((items) => items.filter((item) => item.id !== id));
    setPendingDelete('');
  }

  async function saveContent(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const contentModule = active as AdminContentModule;
    const data = new FormData(event.currentTarget);
    const payload = {
      id: contentEditing?.id,
      module: contentModule,
      title: formText(data, 'title'),
      subtitle: formText(data, 'subtitle'),
      kind: formText(data, 'kind'),
      href: formText(data, 'href'),
      email: formText(data, 'email'),
      phone: formText(data, 'phone'),
      website: formText(data, 'website'),
      address: formText(data, 'address'),
      location: formText(data, 'location'),
      description: formText(data, 'description'),
      directions: formText(data, 'directions'),
      imageUrl: formText(data, 'imageUrl'),
      category: formText(data, 'category'),
      content: formText(data, 'content'),
      active: contentEditing?.active ?? true,
    };
    const response = await fetch('/api/admin/content', {
      method: contentEditing ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) return;
    const record = (await response.json()) as AdminContentRecord;
    setContentOverrides((items) => [
      record,
      ...items.filter((item) => item.id !== record.id),
    ]);
    setShowContent(false);
    setContentEditing(null);
    setNotice(contentEditing ? 'Record saved.' : 'Record added.');
  }

  async function updateContent(
    item: AdminRecord,
    changes: Partial<AdminContentRecord>,
  ) {
    const contentModule = active as AdminContentModule;
    const response = await fetch('/api/admin/content', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...item,
        module: contentModule,
        active: item.active ?? true,
        ...changes,
      }),
    });
    if (!response.ok) return;
    const record = (await response.json()) as AdminContentRecord;
    setContentOverrides((items) => [
      record,
      ...items.filter((entry) => entry.id !== record.id),
    ]);
    setNotice(`${record.title} updated.`);
  }

  async function deleteContent(item: AdminRecord) {
    if (pendingDelete !== item.id) {
      setPendingDelete(item.id);
      return;
    }
    const contentModule = active as AdminContentModule;
    const response = await fetch(
      `/api/admin/content?id=${encodeURIComponent(item.id)}&module=${encodeURIComponent(contentModule)}`,
      { method: 'DELETE' },
    );
    if (response.ok) {
      const now = new Date().toISOString();
      setContentOverrides((items) => [
        {
          ...item,
          module: contentModule,
          active: false,
          deleted: true,
          createdAt: now,
          updatedAt: now,
        },
        ...items.filter((entry) => entry.id !== item.id),
      ]);
      setNotice('Record deleted.');
    }
    setPendingDelete('');
  }

  const moduleCards = [
    { label: 'Mechanics', value: counts.mechanics, icon: Wrench },
    { label: 'Spare suppliers', value: counts.shops, icon: Store },
    { label: 'Workshops', value: counts.workshops, icon: Building2 },
    { label: 'Vehicle guides', value: counts.vehicles, icon: CarFront },
  ];
  const isProviderModule = ['Spares shops', 'Mechanics', 'Workshops'].includes(
    active,
  );
  const isEditorialModule = ['News', 'Motoring tips'].includes(active);
  const isTaxonomyModule = [
    'News categories',
    'Motoring tip categories',
    'Locations',
    'Categories',
  ].includes(active);

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
              if (active === 'Adverts') {
                setShowAdvert(true);
                return;
              }
              if (active === 'Applications' || active === 'Overview') {
                if (active !== 'Applications') selectSection('Applications');
                setShowNew(true);
                return;
              }
              setContentEditing(null);
              setShowContent(true);
            }}
          >
            <Plus /> {active === 'Adverts' ? 'Add advert' : 'Add record'}
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
                            : label === 'Articles'
                              ? 'News'
                              : label === 'Motoring tips'
                                ? 'Motoring tips'
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
                      <div className="admin-record-controls">
                        <button
                          type="button"
                          className={item.active ? 'is-on' : ''}
                          onClick={() =>
                            void updateApplication(item.id, {
                              active: !item.active,
                            })
                          }
                        >
                          {item.active ? 'Active' : 'Deactivated'}
                        </button>
                        <button
                          type="button"
                          className={item.featured ? 'is-on' : ''}
                          onClick={() =>
                            void updateApplication(item.id, {
                              featured: !item.featured,
                            })
                          }
                        >
                          <Star /> Featured
                        </button>
                        <button
                          type="button"
                          className={item.verified ? 'is-verified' : ''}
                          onClick={() =>
                            void updateApplication(item.id, {
                              verified: !item.verified,
                            })
                          }
                        >
                          <ShieldCheck /> Verified
                        </button>
                        <button type="button" onClick={() => setEditing(item)}>
                          <Pencil /> Edit
                        </button>
                        <button
                          type="button"
                          className="is-danger"
                          onClick={() => void deleteApplication(item.id)}
                        >
                          <Trash2 />{' '}
                          {pendingDelete === item.id
                            ? 'Confirm delete'
                            : 'Delete'}
                        </button>
                      </div>
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

          {active !== 'Overview' &&
            active !== 'Applications' &&
            active !== 'Adverts' && (
              <section className="admin-record-panel">
                <header>
                  <div>
                    <span>CONTENT MODULE / {active.toUpperCase()}</span>
                    <h2>{active}</h2>
                    <p>
                      Search the live catalogue and open any record on the
                      public website.
                    </p>
                  </div>
                  <strong>{activeRecords.length} records</strong>
                </header>
                <div
                  className="admin-record-filters"
                  aria-label="Record status"
                >
                  {(['All', 'Active', 'Deactivated'] as const).map((status) => (
                    <button
                      type="button"
                      className={recordStatus === status ? 'active' : ''}
                      onClick={() => setRecordStatus(status)}
                      key={status}
                    >
                      {status}
                    </button>
                  ))}
                </div>
                <div className="admin-record-list">
                  {activeRecords.length ? (
                    activeRecords.map((item, index) => (
                      <article
                        key={item.id}
                        style={
                          { '--record-order': index } as React.CSSProperties
                        }
                      >
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        <div>
                          <small>{item.kind}</small>
                          <h3>{item.title}</h3>
                          <p>{item.subtitle}</p>
                        </div>
                        <div className="admin-record-controls admin-content-controls">
                          <button
                            type="button"
                            className={item.active !== false ? 'is-on' : ''}
                            onClick={() =>
                              void updateContent(item, {
                                active: item.active === false,
                              })
                            }
                          >
                            {item.active === false ? 'Deactivated' : 'Active'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setContentEditing({
                                ...item,
                                module: active as AdminContentModule,
                                active: item.active ?? true,
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                              });
                              setShowContent(true);
                            }}
                          >
                            <Pencil /> Edit
                          </button>
                          <Link
                            href={item.href}
                            target="_blank"
                            aria-label={`Open ${item.title} on public website`}
                          >
                            Preview <ArrowUpRight />
                          </Link>
                          <button
                            type="button"
                            className="is-danger"
                            onClick={() => void deleteContent(item)}
                          >
                            <Trash2 />{' '}
                            {pendingDelete === item.id
                              ? 'Confirm delete'
                              : 'Delete'}
                          </button>
                        </div>
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

          {active === 'Adverts' && (
            <section className="admin-record-panel">
              <header>
                <div>
                  <span>COMMERCIAL INVENTORY</span>
                  <h2>Display adverts</h2>
                  <p>
                    Manage banner, side, footer and in-content placements. Image
                    assets are supplied as hosted image URLs.
                  </p>
                </div>
                <strong>{adverts.length} placements</strong>
              </header>
              <div className="admin-advert-list">
                {adverts.length ? (
                  adverts.map((item) => (
                    <article key={item.id}>
                      <div>
                        <small>{item.placement}</small>
                        <h3>{item.title}</h3>
                        <p>{item.imageUrl || 'No image URL supplied'}</p>
                      </div>
                      <button
                        type="button"
                        className={item.active ? 'is-on' : ''}
                        onClick={() => void toggleAdvert(item)}
                      >
                        {item.active ? 'Active' : 'Deactivated'}
                      </button>
                      <button
                        type="button"
                        className="is-danger"
                        onClick={() => void deleteAdvert(item.id)}
                      >
                        <Trash2 />{' '}
                        {pendingDelete === item.id
                          ? 'Confirm delete'
                          : 'Delete'}
                      </button>
                    </article>
                  ))
                ) : (
                  <div className="admin-empty">
                    No display adverts yet. Use Add advert to create the first
                    placement.
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

      {editing && (
        <dialog className="admin-modal" aria-modal="true" open>
          <form onSubmit={saveApplication}>
            <header>
              <div>
                <span>EDIT DIRECTORY RECORD</span>
                <h2>{editing.name}</h2>
              </div>
              <button
                type="button"
                aria-label="Close edit form"
                onClick={() => setEditing(null)}
              >
                <X />
              </button>
            </header>
            <label>
              Business name
              <input name="name" defaultValue={editing.name} required />
            </label>
            <label>
              Business type
              <input name="type" defaultValue={editing.type} required />
            </label>
            <label>
              City / town
              <input name="location" defaultValue={editing.location} required />
            </label>
            <label>
              Area / suburb
              <input name="area" defaultValue={editing.area ?? ''} />
            </label>
            <label>
              Business address
              <input name="address" defaultValue={editing.address ?? ''} />
            </label>
            <label>
              WhatsApp number
              <input name="phone" defaultValue={editing.phone ?? ''} />
            </label>
            <label>
              Subscription level
              <select
                name="subscriptionLevel"
                defaultValue={editing.subscriptionLevel ?? 'Basic'}
              >
                <option>Basic</option>
                <option>Standard</option>
                <option>Premium</option>
              </select>
            </label>
            <button className="admin-submit">
              Save changes <Check />
            </button>
          </form>
        </dialog>
      )}

      {showAdvert && (
        <dialog className="admin-modal" aria-modal="true" open>
          <form onSubmit={addAdvert}>
            <header>
              <div>
                <span>NEW DISPLAY ADVERT</span>
                <h2>Add a placement</h2>
              </div>
              <button
                type="button"
                aria-label="Close advert form"
                onClick={() => setShowAdvert(false)}
              >
                <X />
              </button>
            </header>
            <label>
              Advert name
              <input name="title" required />
            </label>
            <label>
              Placement
              <select name="placement" required>
                <option>Banner</option>
                <option>Skyscraper / Side</option>
                <option>Footer</option>
                <option>In-content</option>
              </select>
            </label>
            <label>
              Image URL
              <input type="url" name="imageUrl" placeholder="https://…" />
            </label>
            <label>
              Destination URL
              <input type="url" name="linkUrl" placeholder="https://…" />
            </label>
            <button className="admin-submit">
              Create advert <Check />
            </button>
          </form>
        </dialog>
      )}

      {showContent && active !== 'Overview' && active !== 'Applications' && (
        <dialog className="admin-modal" aria-modal="true" open>
          <form onSubmit={saveContent}>
            <header>
              <div>
                <span>{contentEditing ? 'EDIT RECORD' : 'NEW RECORD'}</span>
                <h2>
                  {contentEditing ? contentEditing.title : `Add to ${active}`}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close content form"
                onClick={() => {
                  setShowContent(false);
                  setContentEditing(null);
                }}
              >
                <X />
              </button>
            </header>
            <label>
              Name or title
              <input
                name="title"
                defaultValue={contentEditing?.title ?? ''}
                required
              />
            </label>
            <label>
              Record type
              <input
                name="kind"
                defaultValue={contentEditing?.kind ?? ''}
                placeholder="Workshop, vehicle make, article…"
                required
              />
            </label>
            {isProviderModule && (
              <div className="admin-field-grid">
                <label>
                  Email address
                  <input
                    type="email"
                    name="email"
                    defaultValue={contentEditing?.email ?? ''}
                  />
                </label>
                <label>
                  Phone number
                  <input
                    name="phone"
                    defaultValue={contentEditing?.phone ?? ''}
                  />
                </label>
                <label>
                  Website
                  <input
                    type="url"
                    name="website"
                    defaultValue={contentEditing?.website ?? ''}
                  />
                </label>
                <label>
                  City / location
                  <input
                    name="location"
                    defaultValue={contentEditing?.location ?? ''}
                  />
                </label>
              </div>
            )}
            {isProviderModule && (
              <label>
                Physical address
                <input
                  name="address"
                  defaultValue={contentEditing?.address ?? ''}
                />
              </label>
            )}
            <label>
              Description, address or supporting detail
              <textarea
                name="subtitle"
                defaultValue={contentEditing?.subtitle ?? ''}
              />
            </label>
            {(isProviderModule || active === 'Vehicles') && (
              <label>
                Full description
                <textarea
                  name="description"
                  defaultValue={contentEditing?.description ?? ''}
                />
              </label>
            )}
            {isProviderModule && (
              <label>
                Map directions or Google Maps link
                <textarea
                  name="directions"
                  defaultValue={contentEditing?.directions ?? ''}
                />
              </label>
            )}
            {(isProviderModule || active === 'Vehicles') && (
              <label>
                Logo or image URL
                <input
                  type="url"
                  name="imageUrl"
                  defaultValue={contentEditing?.imageUrl ?? ''}
                />
              </label>
            )}
            {isEditorialModule && (
              <>
                <label>
                  Category
                  <input
                    name="category"
                    defaultValue={contentEditing?.category ?? ''}
                  />
                </label>
                <label>
                  Article content
                  <textarea
                    className="admin-content-editor"
                    name="content"
                    defaultValue={contentEditing?.content ?? ''}
                  />
                </label>
              </>
            )}
            <label>
              Public page path
              <input
                name="href"
                defaultValue={contentEditing?.href ?? '/'}
                placeholder="/find-help"
                required
              />
            </label>
            {isTaxonomyModule && (
              <p className="admin-form-note">
                This taxonomy is available to the corresponding search or
                editorial module after saving.
              </p>
            )}
            <button className="admin-submit">
              {contentEditing ? 'Save changes' : 'Create record'} <Check />
            </button>
          </form>
        </dialog>
      )}
    </main>
  );
}
