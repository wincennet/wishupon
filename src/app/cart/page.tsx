"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart, lineKey } from "@/components/cart/CartProvider";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { formatPrice } from "@/lib/format";
import { DELIVERY } from "@/lib/constants";
import { useDelivery } from "@/components/cart/useDelivery";

export default function CartPage() {
  const { items, setQuantity, remove, total, ready } = useCart();
  const delivery = useDelivery(total);

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-neutral-soft">
        <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
          <h1 className="font-serif text-3xl tracking-tight text-ink">
            Your cart
          </h1>

          {!ready ? (
            <p className="mt-8 text-[0.9rem] text-ink-soft">Loading…</p>
          ) : items.length === 0 ? (
            <div className="mt-8 rounded-xl bg-background px-6 py-10 text-center border border-ink/10">
              <p className="font-serif text-lg text-ink">Nothing here yet.</p>
              <p className="mt-1.5 text-[0.87rem] text-ink-soft">
                Every piece is one of a kind, so it is worth a look.
              </p>
              <Link
                href="/shop/bangles"
                className="inline-flex min-h-11 items-center justify-center mt-6 rounded-lg bg-primary px-6 text-[0.88rem] font-medium text-background transition-colors hover:bg-primary-dark"
              >
                See the wall
              </Link>
            </div>
          ) : (
            <>
              <ul className="mt-8 space-y-3">
                {items.map((item) => (
                  <li
                    key={lineKey(item)}
                    className="flex gap-4 rounded-xl bg-background p-3 border border-ink/10"
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
                          className="font-serif text-[0.95rem] leading-tight text-ink hover:text-primary"
                        >
                          {item.name}
                          {(item.size || item.color) && (
                            <span className="mt-0.5 block font-body text-[0.76rem] text-ink-soft">
                              {[item.size, item.color].filter(Boolean).join(" · ")}
                            </span>
                          )}
                        </Link>
                        <p className="shrink-0 font-serif text-[0.95rem] tabular-nums text-primary">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center rounded-lg border border-ink/10">
                          <button
                            type="button"
                            aria-label={`Reduce quantity of ${item.name}`}
                            onClick={() =>
                              setQuantity(lineKey(item), item.quantity - 1)
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
                              setQuantity(lineKey(item), item.quantity + 1)
                            }
                            className="px-3 py-1 text-ink-soft transition-colors hover:text-primary"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => remove(lineKey(item))}
                          className="text-[0.78rem] text-ink-soft underline underline-offset-2 hover:text-primary"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-xl bg-background p-5 border border-ink/10">
                {delivery.amount !== null && (
                  <dl className="space-y-1.5 border-b border-ink/10 pb-3 text-[0.88rem] text-ink-soft">
                    <div className="flex justify-between">
                      <dt>Pieces</dt>
                      <dd className="tabular-nums">{formatPrice(total)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Delivery</dt>
                      <dd className="tabular-nums">
                        {delivery.amount === 0 ? "Free" : formatPrice(delivery.amount)}
                      </dd>
                    </div>
                  </dl>
                )}
                <div className={`flex items-center justify-between ${delivery.amount !== null ? "mt-3" : ""}`}>
                  <span className="font-serif text-lg text-ink">Total</span>
                  <span className="font-serif text-xl tabular-nums text-primary">
                    {formatPrice(delivery.total)}
                  </span>
                </div>
                <p className="mt-1.5 text-[0.78rem] leading-relaxed text-ink-soft">
                  {delivery.amount === null ? DELIVERY.note : delivery.text}
                </p>

                <Link
                  href="/checkout"
                  className="mt-5 flex min-h-12 w-full items-center justify-center rounded-lg bg-primary px-6 text-[0.92rem] font-medium text-background transition-colors hover:bg-primary-dark"
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
