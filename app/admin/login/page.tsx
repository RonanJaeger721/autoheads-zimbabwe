import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { AdminLoginForm } from '@/components/admin-login-form';
import { ADMIN_COOKIE, verifyAdminSession } from '@/lib/admin-auth';

export const metadata = { title: 'Administration — Autoheads' };

export default async function AdminLoginPage() {
  const store = await cookies();
  if (verifyAdminSession(store.get(ADMIN_COOKIE)?.value)) redirect('/admin');

  return (
    <main className="admin-login-page">
      <section className="admin-login-intro">
        <Link href="/" aria-label="Return to Autoheads">
          <Image
            src="/images/autoheads-logo.png"
            alt="Autoheads"
            width={190}
            height={62}
            priority
          />
        </Link>
        <div>
          <span>AUTOHEADS / ADMINISTRATION</span>
          <h1>Run the community with clarity.</h1>
          <p>
            Review businesses, manage the directory and keep every public
            listing accurate from one focused workspace.
          </p>
        </div>
        <small>Zimbabwe’s digital motoring community.</small>
      </section>
      <section className="admin-login-panel">
        <div>
          <span>SECURE SIGN IN</span>
          <h2>Welcome back.</h2>
          <p>Use the administrator details supplied by Autoheads.</p>
        </div>
        <AdminLoginForm />
        <Link href="/">← Return to the public website</Link>
      </section>
    </main>
  );
}
