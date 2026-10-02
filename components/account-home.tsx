'use client';

import { ArrowRight, LogOut, MapPin, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function AccountHome({
  firstName,
  city,
}: {
  firstName: string;
  city: string;
}) {
  const router = useRouter();
  async function logout() {
    await fetch('/api/account/logout', { method: 'POST' });
    router.replace('/login');
    router.refresh();
  }
  return (
    <main className="motorist-home">
      <header>
        <span>MOTORIST ACCOUNT</span>
        <h1>Welcome, {firstName}.</h1>
        <p>
          <MapPin /> Your saved city is {city}.
        </p>
      </header>
      <section>
        <article>
          <ShieldCheck />
          <h2>Your account is active.</h2>
          <p>
            Your details are stored securely and are not shown in the public
            directory.
          </p>
        </article>
        <nav>
          <Link href="/find-help">
            Find automotive help <ArrowRight />
          </Link>
          <Link href="/list-makes">
            Browse vehicle guides <ArrowRight />
          </Link>
          <Link href="/list-motoring-tips">
            Read motoring tips <ArrowRight />
          </Link>
        </nav>
        <button type="button" onClick={logout}>
          Sign out <LogOut />
        </button>
      </section>
    </main>
  );
}
