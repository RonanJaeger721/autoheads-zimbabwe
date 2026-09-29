'use client';

import { useState } from 'react';

export function SubscriptionForm() {
  const [done, setDone] = useState(false);
  return (
    <form
      className="subscription-form"
      onSubmit={(event) => {
        event.preventDefault();
        setDone(true);
      }}
    >
      {done ? (
        <p>
          <b>Your preference is ready.</b> Email delivery must be connected
          before this address can be stored.
        </p>
      ) : (
        <>
          <label htmlFor="subscriber-email">Email address</label>
          <div>
            <input
              id="subscriber-email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
            />
            <button>Subscribe</button>
          </div>
          <small>
            Optional email updates only. This does not create an Autoheads
            account.
          </small>
        </>
      )}
    </form>
  );
}
