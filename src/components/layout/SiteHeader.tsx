"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { useFlyToCart } from "@/components/cart/FlyToCart";

const LINKS = [
  { href: "/shop/beaded-accessories", label: "Beaded" },
  { href: "/shop/steel-bracelets", label: "Steel" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const { count, ready } = useCart();
  const { registerCart } = useFlyToCart();
  const cartRef = useRef<HTMLAnchorElement>(null);
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-ink/8 bg-background/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center" aria-label="WishUpon — home">
          <Image
            src="/logo/wordmark.png"
            alt="WishUpon"
            width={524}
            height={258}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-[2px] px-2.5 py-1.5 text-[0.82rem] text-ink transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}

          <Link
            ref={cartRef}
            href="/cart"
            className="ml-1 flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-[0.82rem] font-medium text-background transition-colors hover:bg-primary-dark"
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
