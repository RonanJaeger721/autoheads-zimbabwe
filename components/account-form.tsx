"use client";
import Link from "next/link";
import { useState } from "react";
export function AccountForm({
  mode,
}: {
  mode: "login" | "register" | "apply";
}) {
  const [done, setDone] = useState(false);
  const [providerType, setProviderType] = useState("Spares supplier");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
  };
  return (
    <main className="account-page">
      <section>
        <span>AUTOHEADS ACCOUNT</span>
        <h1>
          {mode === "login"
            ? "Welcome back."
            : mode === "register"
              ? "Join the motoring community."
              : "List your automotive business."}
        </h1>
        <p>
          {mode === "apply"
            ? "Create a listing request for a spares business, mechanic or workshop. Verification is reviewed separately before any badge is shown."
            : "Access reviews, contributions and your Autoheads profile."}
        </p>
      </section>
      <form onSubmit={submit}>
        {done ? (
          <div className="form-notice">
            <b>Your application details are ready.</b>
            <p>
              This preview cannot send or retain applications yet. Production submission needs the Autoheads account service or database connected first; your details have not been claimed as submitted.
            </p>
          </div>
        ) : (
          <>
            {mode !== "login" && (
              <label>
                Username
                <input required name="username" autoComplete="username" />
              </label>
            )}
            <label>
              Email
              <input required type="email" name="email" autoComplete="email" />
            </label>
            {mode !== "apply" && (
              <label>
                Password
                <input
                  required
                  type="password"
                  name="password"
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                />
              </label>
            )}
            {mode === "apply" && (
              <>
                <label>
                  Cellphone
                  <input required type="tel" name="phone" />
                </label>
                <label>
                  I want to list
                  <select required value={providerType} onChange={(e) => setProviderType(e.target.value)}>
                    <option>Spares supplier</option>
                    <option>Independent mechanic</option>
                    <option>Workshop</option>
                  </select>
                </label>
                <label>
                  Business or trading name
                  <input required name="businessName" />
                </label>
                <label>
                  Area / city
                  <select required name="area" defaultValue="">
                    <option value="" disabled>Select area</option>
                    {['Harare','Bulawayo','Gweru','Mutare','Masvingo','Chitungwiza','Kwekwe','Kadoma','Marondera','Other'].map((area) => <option key={area}>{area}</option>)}
                  </select>
                </label>
                <label>Physical address<input required name="address" /></label>
                <label>Services or parts supplied<textarea required name="services" rows={4} placeholder={providerType === "Spares supplier" ? "e.g. Toyota suspension parts, filters, body panels" : "e.g. diagnostics, suspension, electrical repairs"} /></label>
                <div className="application-note"><b>What happens next</b><p>Autoheads reviews the business details and evidence. Applying does not automatically make a listing verified.</p></div>
              </>
            )}
            <button>
              {mode === "login"
                ? "Sign in"
                : mode === "register"
                  ? "Create account"
                  : "Submit application"}
            </button>
          </>
        )}
        <nav>
          {mode !== "login" && (
            <Link href="/login">Already registered? Sign in</Link>
          )}
          {mode === "login" && (
            <Link href="/register">Create a new account</Link>
          )}
          {mode !== "apply" && <Link href="/apply">List a business</Link>}
        </nav>
      </form>
    </main>
  );
}
