import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, MapPin, MessageCircle, Phone } from 'lucide-react';
import { SiteShell } from '@/components/site-shell';
import { getAllDirectoryListings } from '@/lib/directory-admin-data';
import { readStore } from '@/lib/platform-store';
import type { BusinessApplication } from '@/lib/platform-types';
export const dynamic = 'force-dynamic';
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { mechanics, workshops, spares } = await getAllDirectoryListings();
  const applications = await readStore<BusinessApplication[]>(
    'business-applications',
    [],
  );
  const all = [
    ...applications
      .filter((item) => item.status === 'Approved' && item.active)
      .map((item) => ({
        name: item.name,
        details: item.otherServices || `${item.type} listed through Autoheads.`,
        address: item.address || `${item.area || ''} ${item.location}`.trim(),
        tags: item.categories ?? [],
        phone: item.phone ?? '',
        kind: item.type.toLowerCase(),
        verified: item.verified,
        featured: item.featured,
      })),
    ...spares.map((x) => ({
      ...x,
      kind: 'supplier',
      verified: false,
      featured: false,
    })),
    ...mechanics.map((x) => ({
      ...x,
      kind: 'mechanic',
      verified: false,
      featured: false,
    })),
    ...workshops.map((x) => ({
      ...x,
      kind: 'workshop',
      verified: false,
      featured: false,
    })),
  ];
  const business = all.find(
    (s) =>
      s.name.toLowerCase().replaceAll(' ', '-').replaceAll('&', 'and') ===
      slug,
  );
  if (!business) notFound();
  const back =
    business.kind === 'supplier'
      ? '/list-shops'
      : business.kind === 'mechanic'
        ? '/list-mechanics'
        : '/list-workshops';
  const firstPhone = business.phone.split(',')[0];
  const digits = firstPhone.replace(/\D/g, '');
  const whatsapp = digits.startsWith('263')
    ? digits
    : digits.startsWith('0')
      ? `263${digits.slice(1)}`
      : digits;
  return (
    <SiteShell>
      <main className="business-page">
        <div className="business-hero">
          <div className="crumbs">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href={back}>{business.kind}</Link>
            <span>/</span>
            <b>{business.name}</b>
          </div>
          <span>
            {business.kind.toUpperCase()} / AUTOHEADS SOURCE DIRECTORY
          </span>
          <h1>{business.name}</h1>
          {business.verified ? (
            <b className="business-verification">Autoheads Verified</b>
          ) : null}
          <div className="business-tags">
            {business.tags.map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
        </div>
        <section className="business-profile">
          <aside>
            <small>ADDRESS</small>
            <p>
              <MapPin />
              {business.address || 'Address not supplied'}
            </p>
            {business.phone && (
              <>
                <small>CONTACT</small>
                <p>
                  <Phone />
                  {business.phone}
                </p>
              </>
            )}
          </aside>
          <div>
            <h2>Directory information.</h2>
            <p>{business.details}</p>
            <p>
              This listing preserves the business name, services and address
              published by Autoheads. Contact details are only shown when they
              were available in the source record.
            </p>
            <div className="profile-actions">
              {firstPhone ? (
                <a data-lead-action="call" href={`tel:${firstPhone}`}>
                  <Phone />
                  Call
                </a>
              ) : null}
              {whatsapp ? (
                <a
                  data-lead-action="whatsapp"
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle />
                  WhatsApp
                </a>
              ) : null}
              <a
                data-lead-action="directions"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`}
                target="_blank"
                rel="noreferrer"
              >
                <MapPin />
                Directions
              </a>
            </div>
            <Link className="back-directory" href={back}>
              <ArrowLeft />
              Back to all {business.kind}s
            </Link>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
