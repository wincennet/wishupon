"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/format";
import { DELIVERY } from "@/lib/constants";
import type { PaymentMethod } from "@/lib/types";

/** Bank details are shown only after she picks bank transfer, and they are
 *  the client's to supply — inventing an account number would be dangerous. */
const BANK_DETAILS_PENDING = true;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clear, ready } = useCart();

  const [method, setMethod] = useState<PaymentMethod>("cod");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (items.length === 0) return;

    setStatus("sending");
    const form = new FormData(event.currentTarget);
    const supabase = createClient();

    const { data, error } = await supabase
      .from("orders")
      .insert({
        customer_name: String(form.get("name")).trim(),
        phone: String(form.get("phone")).trim(),
        address: String(form.get("address")).trim(),
        items,
        total_price: total,
        payment_method: method,
        payment_reference: form.get("reference")
          ? String(form.get("reference")).trim()
          : null,
        status: "pending",
      })
      .select("id")
      .single();

    if (error || !data) {
      setStatus("error");
      return;
    }

    clear();
    router.push(`/order/${data.id}`);
  }

  if (ready && items.length === 0) {
    return (
      <>
        <SiteHeader />
        <main className="flex-1 bg-neutral">
          <div className="mx-auto w-full max-w-md px-4 py-16 text-center sm:px-6">
            <p className="font-display text-xl text-ink">Your cart is empty.</p>
            <Link
              href="/shop/beaded-accessories"
              className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-[0.88rem] font-medium text-background"
            >
              See the wall
            </Link>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-neutral">
        <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
          {/* Explicit step-state: a first-time cash-on-delivery buyer should
              never wonder what happens after she presses the button. */}
          <ol className="flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.14em] text-ink-soft">
            <li className="text-primary">1. Your details</li>
            <li aria-hidden>·</li>
            <li>2. We call to confirm</li>
            <li aria-hidden>·</li>
            <li>3. Posted to you</li>
          </ol>

          <h1 className="mt-3 font-display text-3xl tracking-tight text-ink">
            Checkout
          </h1>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5 rounded-[2px] bg-background p-5 shadow-[var(--shadow-card)] sm:p-7"
          >
            <Field
              label="Your name"
              name="name"
              autoComplete="name"
              placeholder="Ayesha Khan"
            />
            <Field
              label="Phone number"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="0300 1234567"
              hint="We call this number to confirm your order before posting."
            />

            <div>
              <label
                htmlFor="address"
                className="block text-[0.82rem] font-medium text-ink"
              >
                Delivery address
              </label>
              <textarea
                id="address"
                name="address"
                required
                rows={3}
                placeholder="House / street, area, city"
                className="mt-1.5 w-full rounded-[2px] border border-neutral bg-neutral-soft/50 px-3.5 py-2.5 text-[0.9rem] text-ink placeholder:text-ink-soft/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <fieldset>
              <legend className="text-[0.82rem] font-medium text-ink">
                How would you like to pay?
              </legend>

              <div className="mt-2.5 space-y-2">
                <PaymentOption
                  checked={method === "cod"}
                  onSelect={() => setMethod("cod")}
                  title="Cash on delivery"
                  body="Pay the courier when your parcel arrives. Nothing to pay now."
                />
                <PaymentOption
                  checked={method === "bank-transfer"}
                  onSelect={() => setMethod("bank-transfer")}
                  title="Bank transfer"
                  body="We send you the account details when we call to confirm."
                />
              </div>

              {method === "bank-transfer" && (
                <div className="mt-3 rounded-[2px] border border-neutral bg-neutral-soft/60 p-4">
                  {BANK_DETAILS_PENDING ? (
                    <p className="text-[0.83rem] leading-relaxed text-ink-soft">
                      We will share the account details on the phone when we call
                      to confirm this order. You can leave the reference blank
                      for now.
                    </p>
                  ) : null}
                  <Field
                    label="Transaction reference (optional)"
                    name="reference"
                    required={false}
                    placeholder="e.g. TRX123456"
                  />
                </div>
              )}
            </fieldset>

            <div className="border-t border-neutral pt-5">
              <div className="flex items-center justify-between">
                <span className="font-display text-lg text-ink">Total</span>
                <span className="font-display text-xl tabular-nums text-primary">
                  {formatPrice(total)}
                </span>
              </div>
              <p className="mt-1.5 text-[0.78rem] leading-relaxed text-ink-soft">
                {DELIVERY.note}
              </p>
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-full bg-primary px-6 py-3.5 text-[0.92rem] font-medium text-background transition-colors hover:bg-primary-dark disabled:opacity-55"
            >
              {status === "sending" ? "Placing your order…" : "Place order"}
            </button>

            {status === "error" && (
              <p className="text-center text-[0.85rem] text-red-700">
                Something went wrong placing the order. Please try again, or
                message us on WhatsApp.
              </p>
            )}
          </form>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function Field({
  label,
  name,
  hint,
  type = "text",
  required = true,
  ...rest
}: {
  label: string;
  name: string;
  hint?: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-[0.82rem] font-medium text-ink">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        {...rest}
        className="mt-1.5 w-full rounded-[2px] border border-neutral bg-neutral-soft/50 px-3.5 py-2.5 text-[0.9rem] text-ink placeholder:text-ink-soft/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
      {hint && <p className="mt-1 text-[0.75rem] text-ink-soft">{hint}</p>}
    </div>
  );
}

function PaymentOption({
  checked,
  onSelect,
  title,
  body,
}: {
  checked: boolean;
  onSelect: () => void;
  title: string;
  body: string;
}) {
  return (
    <label
      className={`flex cursor-pointer gap-3 rounded-[2px] border p-3.5 transition-colors ${
        checked
          ? "border-primary bg-accent-soft/50"
          : "border-neutral hover:border-primary/40"
      }`}
    >
      <input
        type="radio"
        name="payment"
        checked={checked}
        onChange={onSelect}
        className="mt-0.5 accent-[#5b3a7a]"
      />
      <span>
        <span className="block text-[0.88rem] font-medium text-ink">{title}</span>
        <span className="mt-0.5 block text-[0.8rem] leading-relaxed text-ink-soft">
          {body}
        </span>
      </span>
    </label>
  );
}
