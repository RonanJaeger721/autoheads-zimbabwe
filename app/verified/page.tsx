import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
export default function Page() {
  return (
    <SiteShell>
      <main className="verified-page">
        <section>
          <div className="verified-mark">
            <ShieldCheck />
          </div>
          <span>TRUST / AUTOHEADS 2.0</span>
          <h1>
            Autoheads
            <br />
            Verified.
          </h1>
          <p>
            A foundation for identifying automotive businesses whose information
            and verification status have been reviewed by Autoheads.
          </p>
        </section>
        <article>
          <h2>Clear status. No invented claims.</h2>
          <p>
            The verification policy is still to be defined by Autoheads. Until
            that policy is approved and real providers complete it, no business
            is presented as verified.
          </p>
          <div className="verification-steps">
            <div>
              <small>01</small>
              <b>Policy</b>
              <p>Autoheads defines what is checked and what the badge means.</p>
            </div>
            <div>
              <small>02</small>
              <b>Review</b>
              <p>Authorised staff assess submitted business information.</p>
            </div>
            <div>
              <small>03</small>
              <b>Status</b>
              <p>
                Approved profiles receive a distinct, traceable verification
                state.
              </p>
            </div>
          </div>
          <Link href="/apply">
            List your automotive business <ArrowRight />
          </Link>
        </article>
      </main>
    </SiteShell>
  );
}
