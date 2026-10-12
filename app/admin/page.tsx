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
        'Spares shops': sourceShops.map((item, index) => ({
          id: `shop-${index}`,
          title: item.name,
          subtitle: item.address || 'Zimbabwe',
          kind: 'Spares supplier',
          href: '/list-shops',
        })),
        Mechanics: sourceMechanics.map((item, index) => ({
          id: `mechanic-${index}`,
          title: item.name,
          subtitle: item.address || 'Zimbabwe',
          kind: 'Mechanic',
          href: '/list-mechanics',
        })),
        Workshops: sourceWorkshops.map((item, index) => ({
          id: `workshop-${index}`,
          title: item.name,
          subtitle: item.address || 'Zimbabwe',
          kind: 'Workshop',
          href: '/list-workshops',
        })),
        'Vehicle owners': [],
        Vehicles: vehicles.map((item) => ({
          id: `vehicle-${item.makeId}-${item.id}`,
          title: `${item.make} ${item.name}`,
          subtitle: item.intro,
          kind: 'Vehicle guide',
          href: `/vehicle/${item.makeId}/${item.id}`,
        })),
        News: posts.map((item) => ({
          id: `post-${item.id}`,
          title: item.title,
          subtitle: item.excerpt,
          kind: 'Article',
          href: `/view-${item.id}`,
        })),
        'News categories': [
          'Auto Newsmakers',
          'Automotive Technology',
          'Grey Entrants',
          'Motoring Companies',
          'Motorsport',
          'My Ride',
          'New Car',
          'On The Road',
          'Products and Brands',
        ].map((title, index) => ({
          id: `news-category-${index}`,
          title,
          subtitle: 'Legacy Autoheads news taxonomy',
          kind: 'News category',
          href: '/list-posts',
        })),
        'Motoring tips': motoringTips.map((item) => ({
          id: `tip-${item.id}`,
          title: item.title,
          subtitle: item.excerpt,
          kind: 'Motoring tip',
          href: '/list-motoring-tips',
        })),
        'Motoring tip categories': [
          'Auto Diagnostics',
          'Battery Care',
          'Braking System',
          'Engine Cooling',
          'Engine Maintenance',
          'Engine Overhaul',
          'Fuel System',
          'Lubrication',
          'Suspension',
          'Tyres and Wheels',
        ].map((title, index) => ({
          id: `tip-category-${index}`,
          title,
          subtitle: 'Legacy Autoheads motoring-tip taxonomy',
          kind: 'Motoring tip category',
          href: '/list-motoring-tips',
        })),
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
