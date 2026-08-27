"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";

const LINKS = [
  { href: "/shop/beaded-accessories", label: "Beaded" },
  { href: "/shop/steel-bracelets", label: "Steel" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const { count, ready } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-neutral/60 bg-background/92 backdrop-blur-sm">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="font-display text-lg leading-none tracking-tight text-primary sm:text-xl"
        >
          WishUpon
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-[2px] px-2.5 py-1.5 text-[0.8rem] text-ink transition-colors hover:text-primary sm:text-[0.85rem]"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/cart"
            className="ml-1 flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-[0.8rem] font-medium text-background transition-colors hover:bg-primary-dark"
          >
            Cart
            {ready && count > 0 && (
              <span className="rounded-full bg-background/25 px-1.5 text-[0.7rem] tabular-nums">
                {count}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
