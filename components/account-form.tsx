"use client";
import Link from "next/link";
import { useState } from "react";
export function AccountForm({
  mode,
}: {
  mode: "login" | "register" | "apply";
}) {
  const [done, setDone] = useState(false);
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
            ? "Apply as a spares supplier or mechanic using the existing Autoheads provider flow."
            : "Access reviews, contributions and your Autoheads profile."}
        </p>
      </section>
      <form onSubmit={submit}>
        {done ? (
          <div className="form-notice">
            <b>Prototype form ready</b>
            <p>
              Submission will connect to the existing Autoheads account service
              during backend integration.
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
                  Business type
                  <select required>
                    <option value="">Select type</option>
                    <option>Spares supplier</option>
                    <option>Mechanic / workshop</option>
                  </select>
                </label>
                <label>
                  Address
                  <input required name="address" />
                </label>
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
