import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminDashboard } from '@/components/admin-dashboard';
import {
  categories,
  makes,
  motoringTips,
  posts,
  vehicles,
} from '@/lib/autoheads-data';
import {
  sourceMechanics,
  sourceShops,
  sourceWorkshops,
} from '@/lib/source-directory-data';
import { ADMIN_COOKIE, verifyAdminSession } from '@/lib/admin-auth';

export const metadata = { title: 'Control Room — Autoheads' };

export default async function AdminPage() {
  const store = await cookies();
  if (!verifyAdminSession(store.get(ADMIN_COOKIE)?.value)) {
    redirect('/admin/login');
  }

  return (
    <AdminDashboard
      counts={{
        makes: makes.length,
        vehicles: vehicles.length,
        mechanics: sourceMechanics.length,
        shops: sourceShops.length,
        workshops: sourceWorkshops.length,
        posts: posts.length,
        tips: motoringTips.length,
        categories: categories.length,
      }}
      records={{
        Businesses: [
          ...sourceMechanics.map((item, index) => ({
            id: `mechanic-${index}`,
            title: item.name,
            subtitle: item.address || 'Zimbabwe',
            kind: 'Mechanic',
            href: '/list-mechanics',
          })),
          ...sourceShops.map((item, index) => ({
            id: `shop-${index}`,
            title: item.name,
            subtitle: item.address || 'Zimbabwe',
            kind: 'Spares supplier',
            href: '/list-shops',
          })),
          ...sourceWorkshops.map((item, index) => ({
            id: `workshop-${index}`,
            title: item.name,
            subtitle: item.address || 'Zimbabwe',
            kind: 'Workshop',
            href: '/list-workshops',
          })),
        ],
        Vehicles: vehicles.map((item) => ({
          id: `vehicle-${item.makeId}-${item.id}`,
          title: `${item.make} ${item.name}`,
          subtitle: item.intro,
          kind: 'Vehicle guide',
          href: `/vehicle/${item.makeId}/${item.id}`,
        })),
        Editorial: [
          ...posts.map((item) => ({
            id: `post-${item.id}`,
            title: item.title,
            subtitle: item.excerpt,
            kind: 'Article',
            href: `/view-${item.id}`,
          })),
          ...motoringTips.map((item) => ({
            id: `tip-${item.id}`,
            title: item.title,
            subtitle: item.excerpt,
            kind: 'Motoring tip',
            href: '/list-motoring-tips',
          })),
        ],
        Locations: [
          'Harare',
          'Bulawayo',
          'Gweru',
          'Mutare',
          'Masvingo',
          'Chitungwiza',
          'Kwekwe',
          'Kadoma',
          'Marondera',
        ].map((title, index) => ({
          id: `location-${index}`,
          title,
          subtitle: 'Active directory location',
          kind: 'City / town',
          href: `/find-help?location=${encodeURIComponent(title)}`,
        })),
        Categories: categories.map((title, index) => ({
          id: `category-${index}`,
          title,
          subtitle: 'Used by the location-aware directory search',
          kind: 'Service category',
          href: `/find-help?category=${encodeURIComponent(title)}`,
        })),
      }}
    />
  );
}
