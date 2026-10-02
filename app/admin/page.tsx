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
    />
  );
}
