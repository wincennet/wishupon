"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const supabase = createClient();

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: String(form.get("email")).trim(),
      password: String(form.get("password")),
    });

    if (authError) {
      setError("That email or password is not right. Please try again.");
      setBusy(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral px-4 py-12">
      <div className="w-full max-w-sm rounded-[2px] bg-background p-7 shadow-[var(--shadow-card-lifted)]">
        <p className="font-display text-lg text-primary">WishUpon</p>
        <h1 className="mt-1 font-display text-2xl tracking-tight text-ink">
          Shop admin
        </h1>
        <p className="mt-1.5 text-[0.84rem] text-ink-soft">
          Sign in to manage your pieces and orders.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-[0.82rem] font-medium text-ink">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className="mt-1.5 w-full rounded-[2px] border border-neutral bg-neutral-soft/50 px-3.5 py-2.5 text-[0.9rem] text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[0.82rem] font-medium text-ink">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1.5 w-full rounded-[2px] border border-neutral bg-neutral-soft/50 px-3.5 py-2.5 text-[0.9rem] text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="inline-flex min-h-11 items-center justify-center w-full rounded-full bg-primary px-6 text-[0.9rem] font-medium text-background transition-colors hover:bg-primary-dark disabled:opacity-55"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>

          {error && (
            <p className="text-center text-[0.84rem] text-red-700">{error}</p>
          )}
        </form>
      </div>
    </main>
  );
}
