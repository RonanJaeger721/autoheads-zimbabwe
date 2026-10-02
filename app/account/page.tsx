import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AccountHome } from '@/components/account-home';
import { SiteShell } from '@/components/site-shell';
import { readStore } from '@/lib/platform-store';
import type { MotoristAccount } from '@/lib/platform-types';
import { readUserSession, USER_COOKIE } from '@/lib/user-auth';

export const metadata = { title: 'My Autoheads Account' };

export default async function AccountPage() {
  const store = await cookies();
  const id = readUserSession(store.get(USER_COOKIE)?.value);
  if (!id) redirect('/login');
  const accounts = await readStore<MotoristAccount[]>('motorist-accounts', []);
  const account = accounts.find((item) => item.id === id);
  if (!account) redirect('/login');
  return (
    <SiteShell>
      <AccountHome firstName={account.firstName} city={account.city} />
    </SiteShell>
  );
}
