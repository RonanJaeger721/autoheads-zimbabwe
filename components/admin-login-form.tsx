'use client';

import { ArrowRight, Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function AdminLoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    const form = new FormData(event.currentTarget);
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: form.get('username'),
        password: form.get('password'),
      }),
    });
    setLoading(false);
    if (!response.ok) {
      const result = (await response.json()) as { error?: string };
      setError(result.error ?? 'Unable to sign in. Please try again.');
      return;
    }
    router.replace('/admin');
    router.refresh();
  }

  return (
    <form className="admin-login-form" onSubmit={submit}>
      <div className="admin-form-mark">
        <LockKeyhole aria-hidden="true" />
        <span>Restricted access</span>
      </div>
      <label>
        Administrator username
        <input
          name="username"
          autoComplete="username"
          required
          spellCheck={false}
        />
      </label>
      <label>
        Password
        <span className="password-field">
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword((current) => !current)}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </span>
      </label>
      {error && (
        <p className="admin-form-error" role="alert">
          {error}
        </p>
      )}
      <button className="admin-submit" disabled={loading}>
        {loading ? 'Checking access…' : 'Enter administration'}
        {!loading && <ArrowRight aria-hidden="true" />}
      </button>
      <small>This area is for authorised Autoheads administrators only.</small>
    </form>
  );
}
