"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Feedback } from "@/lib/types";

/** Customers leave a note and a star rating; nothing appears on the shop until
 *  the owner approves it in the admin. Only approved notes are ever listed,
 *  and with none approved the section shows just the form, never a made-up
 *  review. */
export function FeedbackSection({ approved }: { approved: Feedback[] }) {
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("sending");
    const { error } = await createClient()
      .from("feedback")
      .insert({
        name: String(form.get("name")).trim(),
        rating,
        message: String(form.get("message")).trim(),
        approved: false,
      });
    if (error) {
      setStatus("error");
      return;
    }
    (e.target as HTMLFormElement).reset();
    setStatus("sent");
  }

  return (
    <section id="feedback" className="bg-neutral-soft py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 2xl:max-w-7xl">
        <div>
          <h2 className="font-serif text-3xl tracking-tight text-primary sm:text-4xl">
            {approved.length > 0 ? "Kind words" : "Bought from us?"}
          </h2>
          <p className="mt-2 max-w-md text-[0.92rem] leading-relaxed text-ink-soft">
            {approved.length > 0
              ? "Notes from people who have a WishUpon piece."
              : "Tell us how it went. Your note may appear here once we have read it."}
          </p>

          {approved.length > 0 && (
            <ul className="mt-8 space-y-4">
              {approved.slice(0, 4).map((f) => (
                <li
                  key={f.id}
                  className="rounded-[3px] bg-background p-5 shadow-[var(--shadow-card)]"
                >
                  <p
                    className="text-[0.9rem] tracking-widest text-primary"
                    aria-label={`${f.rating} out of 5 stars`}
                  >
                    {"★".repeat(f.rating)}
                    <span className="text-neutral">{"★".repeat(5 - f.rating)}</span>
                  </p>
                  <p className="mt-2 text-[0.92rem] leading-relaxed text-ink">
                    {f.message}
                  </p>
                  <p className="mt-2 font-serif text-[1rem] text-ink-soft">
                    — {f.name}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form
          onSubmit={submit}
          className="space-y-4 rounded-[3px] bg-background p-6 shadow-[var(--shadow-card)] sm:p-7"
        >
          <h3 className="font-serif text-xl text-ink">Leave your feedback</h3>

          <div>
            <label htmlFor="fb-name" className="block text-[0.82rem] font-medium text-ink">
              Your name
            </label>
            <input
              id="fb-name"
              name="name"
              required
              maxLength={80}
              autoComplete="name"
              className="mt-1.5 w-full rounded-[2px] border border-neutral bg-neutral-soft/50 px-3.5 py-2.5 text-[0.9rem] text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <fieldset>
            <legend className="text-[0.82rem] font-medium text-ink">Rating</legend>
            <div className="mt-1 flex">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  aria-pressed={rating === n}
                  className={`flex h-11 w-11 items-center justify-center text-2xl transition-colors ${
                    n <= rating ? "text-primary" : "text-neutral"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="fb-message" className="block text-[0.82rem] font-medium text-ink">
              Your feedback
            </label>
            <textarea
              id="fb-message"
              name="message"
              required
              rows={4}
              maxLength={1000}
              className="mt-1.5 w-full rounded-[2px] border border-neutral bg-neutral-soft/50 px-3.5 py-2.5 text-[0.9rem] text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-7 text-[0.9rem] font-medium text-background transition-colors hover:bg-primary-dark disabled:opacity-55"
          >
            {status === "sending" ? "Sending…" : "Send feedback"}
          </button>

          {status === "sent" && (
            <p role="status" className="text-[0.85rem] text-ok">
              Thank you! We will read it and it may appear here.
            </p>
          )}
          {status === "error" && (
            <p role="alert" className="text-[0.85rem] text-err">
              That did not send. Please try again, or message us on WhatsApp.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
