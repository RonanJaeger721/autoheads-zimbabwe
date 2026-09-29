import { SiteShell } from '@/components/site-shell';

export default function Page() {
  return (
    <SiteShell>
      <main className="privacy-page">
        <header>
          <span>AUTOHEADS / PRIVACY</span>
          <h1>Your information should stay yours.</h1>
          <p>
            This page records the privacy principles that the Autoheads account
            and provider systems must follow when the production backend is
            connected.
          </p>
        </header>
        <article>
          <h2>Information collected</h2>
          <p>
            Autoheads may collect account details, contact information,
            location, optional vehicle information, business application details
            and communication preferences. Only information needed to operate
            and improve the service should be collected.
          </p>
          <h2>How information may be used</h2>
          <p>
            Information may be used to manage accounts, review provider
            applications, match motorists with relevant providers, improve
            vehicle information and send communications only where the user has
            actively opted in.
          </p>
          <h2>Marketing choices</h2>
          <p>
            Creating an account does not automatically subscribe a member to
            marketing. Email subscription must be a separate, optional choice
            and every marketing message must provide a clear way to unsubscribe.
          </p>
          <h2>Public information</h2>
          <p>
            A motorist’s email address, mobile number and personal contact
            details must not be displayed publicly or exposed through search
            results, URLs or public application interfaces. Approved business
            contact details may be published as part of the provider listing.
          </p>
          <h2>Access and security</h2>
          <p>
            The production service must use appropriate access controls and
            security measures. Access to private account and application
            information should be limited to authorised users and Autoheads
            administrators who need it for their work.
          </p>
          <h2>Questions and changes</h2>
          <p>
            Formal privacy contact details, retention periods and applicable
            legal terms should be confirmed by Autoheads before account
            collection is enabled.
          </p>
        </article>
      </main>
    </SiteShell>
  );
}
