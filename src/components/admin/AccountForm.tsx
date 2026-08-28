"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

/** So the owner is not dependent on whoever set the shop up.
 *
 *  Password change happens in the browser against Supabase Auth directly,
 *  which means it needs no server route and no service key — and the new
 *  password is never sent anywhere except Supabase. */
export function AccountForm({ email }: { email: string }) {
  const [pwState, setPwState] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [pwMessage, setPwMessage] = useState<string | null>(null);

  const [emailState, setEmailState] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [emailMessage, setEmailMessage] = useState<string | null>(null);

  async function changePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const next = String(form.get("password"));
    const confirm = String(form.get("confirm"));

    if (next.length < 8) {
      setPwState("error");
      setPwMessage("Please use at least 8 characters.");
      return;
    }
    if (next !== confirm) {
      setPwState("error");
      setPwMessage("The two passwords do not match.");
      return;
    }

    setPwState("saving");
    const { error } = await createClient().auth.updateUser({ password: next });

    if (error) {
      setPwState("error");
      setPwMessage("That did not save. Please try again.");
      return;
    }
    setPwState("done");
    setPwMessage("Password changed. Use the new one next time you sign in.");
    (e.target as HTMLFormElement).reset();
  }

  async function changeEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next = String(new FormData(e.currentTarget).get("email")).trim();

    setEmailState("saving");
    const { error } = await createClient().auth.updateUser({ email: next });

    if (error) {
      setEmailState("error");
      setEmailMessage("That did not save. Check the address and try again.");
      return;
    }
    setEmailState("done");
    setEmailMessage(
      `Check ${next} and click the confirmation link. Until you do, keep signing in with your current address.`
    );
  }

  return (
    <div className="mt-6 space-y-6">
      <section className="rounded-[3px] bg-background p-6 shadow-[var(--shadow-card)]">
        <h2 className="font-serif text-lg text-ink">Change your password</h2>
        <p className="mt-1 text-[0.82rem] text-ink-soft">
          You sign in as <span className="text-ink">{email}</span>.
        </p>

        <form onSubmit={changePassword} className="mt-4 space-y-4">
          <Field label="New password" name="password" autoComplete="new-password" />
          <Field label="Type it again" name="confirm" autoComplete="new-password" />

          <button
            type="submit"
            disabled={pwState === "saving"}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 text-[0.88rem] font-medium text-background transition-colors hover:bg-primary-dark disabled:opacity-55"
          >
            {pwState === "saving" ? "Saving…" : "Save new password"}
          </button>

          {pwMessage && (
            <p
              className={`text-[0.84rem] ${pwState === "error" ? "text-red-700" : "text-primary"}`}
            >
              {pwMessage}
            </p>
          )}
        </form>
      </section>

      <section className="rounded-[3px] bg-background p-6 shadow-[var(--shadow-card)]">
        <h2 className="font-serif text-lg text-ink">Change your login email</h2>
        <p className="mt-1 text-[0.82rem] leading-relaxed text-ink-soft">
          Only worth doing once you have an email you actually check — a real
          address is what lets you reset your own password if you forget it.
        </p>

        <form onSubmit={changeEmail} className="mt-4 space-y-4">
          <Field
            label="New email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
          />

          <button
            type="submit"
            disabled={emailState === "saving"}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-primary/40 px-6 text-[0.88rem] text-primary transition-colors hover:bg-primary hover:text-background disabled:opacity-55"
          >
            {emailState === "saving" ? "Saving…" : "Change email"}
          </button>

          {emailMessage && (
            <p
              className={`text-[0.84rem] leading-relaxed ${emailState === "error" ? "text-red-700" : "text-primary"}`}
            >
              {emailMessage}
            </p>
          )}
        </form>
      </section>
    </div>
  );
}

function Field({
  label,
  name,
  type = "password",
  ...rest
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-[0.84rem] font-medium text-ink">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        {...rest}
        className="mt-1.5 w-full rounded-[2px] border border-neutral bg-neutral-soft/50 px-3.5 py-2.5 text-[0.9rem] text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}
