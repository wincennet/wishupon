"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { formatPrice } from "@/lib/format";
import { DELIVERY } from "@/lib/constants";

export default function CartPage() {
  const { items, setQuantity, remove, total, ready } = useCart();

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-neutral">
        <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
          <h1 className="font-display text-3xl tracking-tight text-ink">
            Your cart
          </h1>

          {!ready ? (
            <p className="mt-8 text-[0.9rem] text-ink-soft">Loading…</p>
          ) : items.length === 0 ? (
            <div className="mt-8 rounded-[2px] bg-background px-6 py-10 text-center shadow-[var(--shadow-card)]">
              <p className="font-display text-lg text-ink">Nothing here yet.</p>
              <p className="mt-1.5 text-[0.87rem] text-ink-soft">
                Every piece is one of a kind, so it is worth a look.
              </p>
              <Link
                href="/shop/bangles"
                className="inline-flex min-h-11 items-center justify-center mt-6 rounded-full bg-primary px-6 text-[0.88rem] font-medium text-background transition-colors hover:bg-primary-dark"
              >
                See the wall
              </Link>
            </div>
          ) : (
            <>
              <ul className="mt-8 space-y-3">
                {items.map((item) => (
                  <li
                    key={item.product_id}
                    className="flex gap-4 rounded-[2px] bg-background p-3 shadow-[var(--shadow-card)]"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-neutral-soft">
                      <Image
                        src={item.image_url ?? "/placeholder-piece.svg"}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                      <div className="flex items-start justify-between gap-3">
                        <Link
                          href={`/piece/${item.product_id}`}
                          className="font-display text-[0.95rem] leading-tight text-ink hover:text-primary"
                        >
                          {item.name}
                        </Link>
                        <p className="shrink-0 font-display text-[0.95rem] tabular-nums text-primary">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center rounded-full border border-neutral">
                          <button
                            type="button"
                            aria-label={`Reduce quantity of ${item.name}`}
                            onClick={() =>
                              setQuantity(item.product_id, item.quantity - 1)
                            }
                            className="px-3 py-1 text-ink-soft transition-colors hover:text-primary"
                          >
                            −
                          </button>
                          <span className="min-w-6 text-center text-[0.85rem] tabular-nums text-ink">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label={`Increase quantity of ${item.name}`}
                            onClick={() =>
                              setQuantity(item.product_id, item.quantity + 1)
                            }
                            className="px-3 py-1 text-ink-soft transition-colors hover:text-primary"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => remove(item.product_id)}
                          className="text-[0.78rem] text-ink-soft underline underline-offset-2 hover:text-primary"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-[2px] bg-background p-5 shadow-[var(--shadow-card)]">
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg text-ink">Total</span>
                  <span className="font-display text-xl tabular-nums text-primary">
                    {formatPrice(total)}
                  </span>
                </div>
                <p className="mt-1.5 text-[0.78rem] leading-relaxed text-ink-soft">
                  {DELIVERY.note}
                </p>

                <Link
                  href="/checkout"
                  className="mt-5 flex min-h-12 w-full items-center justify-center rounded-full bg-primary px-6 text-[0.92rem] font-medium text-background transition-colors hover:bg-primary-dark"
                >
                  Checkout
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
