"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { useFlyToCart } from "@/components/cart/FlyToCart";
import { CATEGORIES } from "@/lib/categories";

export function SiteHeader() {
  const { count, ready } = useCart();
  const { registerCart } = useFlyToCart();
  const cartRef = useRef<HTMLAnchorElement>(null);
  const shopRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);

  useEffect(() => {
    registerCart(cartRef.current);
    return () => registerCart(null);
  }, [registerCart]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the range menu on an outside click or Escape, so it never strands
  // itself open over the shop.
  useEffect(() => {
    if (!shopOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!shopRef.current?.contains(e.target as Node)) setShopOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShopOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [shopOpen]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-ink/8 bg-background/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 2xl:max-w-7xl">
        <Link
          href="/"
          className="flex min-h-11 items-center"
          aria-label="WishUpon — home"
        >
          <Image
            src="/logo/wordmark.png"
            alt="WishUpon"
            width={524}
            height={258}
            priority
            /* Nudged up because the butterfly's wing rises well above the
               script: centring the image's box leaves the word itself sitting
               low against Shop, About and the cart, which reads as the header
               being out of line even though the boxes agree. */
            className="h-7 w-auto -translate-y-[3px] sm:h-9 sm:-translate-y-[4px]"
          />
        </Link>

        <div className="flex items-center gap-0.5 sm:gap-2">
          {/* Six ranges will not fit across a phone, so they live behind one
              Shop control rather than being cut down to the two that fit. */}
          <div ref={shopRef} className="relative">
            <button
              type="button"
              onClick={() => setShopOpen((v) => !v)}
              aria-expanded={shopOpen}
              aria-haspopup="true"
              className="flex min-h-11 items-center gap-1 rounded-[2px] px-2.5 text-[0.82rem] text-ink transition-colors hover:text-primary"
            >
              Shop
              <svg
                width="9"
                height="6"
                viewBox="0 0 9 6"
                fill="none"
                aria-hidden
                className={`transition-transform duration-200 ${shopOpen ? "rotate-180" : ""}`}
              >
                <path
                  d="M1 1l3.5 3.5L8 1"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {shopOpen && (
              <div
                className="absolute right-0 top-full z-50 mt-1 w-60 overflow-hidden rounded-[3px] bg-background py-1"
                style={{
                  boxShadow:
                    "0 0 0 1px rgba(42,27,61,0.10), 0 18px 36px -16px rgba(42,27,61,0.45)",
                }}
              >
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.id}
                    href={`/shop/${c.id}`}
                    onClick={() => setShopOpen(false)}
                    className="flex min-h-11 items-center gap-2.5 px-4 text-[0.85rem] text-ink transition-colors hover:bg-accent-soft/60 hover:text-primary"
                  >
                    <span
                      aria-hidden
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: c.accent }}
                    />
                    {c.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/about"
            className="flex min-h-11 items-center rounded-[2px] px-2.5 text-[0.82rem] text-ink transition-colors hover:text-primary"
          >
            About
          </Link>

          <Link
            ref={cartRef}
            href="/cart"
            className="ml-1 flex min-h-11 items-center gap-1.5 rounded-full bg-primary px-4 text-[0.82rem] font-medium text-background transition-colors hover:bg-primary-dark"
            style={{ willChange: "transform" }}
          >
            Cart
            {ready && count > 0 && (
              <span className="rounded-full bg-background/25 px-1.5 text-[0.72rem] tabular-nums">
                {count}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
