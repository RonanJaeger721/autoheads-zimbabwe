import { SiteShell } from '@/components/site-shell';
import { SubscriptionForm } from '@/components/subscription-form';

export default function Page() {
  return (
    <SiteShell>
      <main className="subscribe-page">
        <section>
          <span>STAY INFORMED</span>
          <h1>Useful motoring information, by choice.</h1>
          <p>
            Subscribe to receive motoring tips, vehicle advice, new Autoheads
            articles and occasional updates. Subscription is separate from
            membership and can be cancelled later.
          </p>
        </section>
        <SubscriptionForm />
      </main>
    </SiteShell>
  );
}
