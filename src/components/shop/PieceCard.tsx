"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { categoryOf, colourOf, pieceMark } from "@/lib/categories";
import { PushPin } from "./PushPin";
import { useShopUi } from "./ShopUi";
import { EXTENDED_SCHEMA } from "@/lib/features";

/** One piece, one card, pinned to the board.
 *
 *  The physicality has to survive scrutiny, so three things are real rather
 *  than suggested: the card hangs at its own slight angle because a hand put
 *  it there, it swings about the pin at the top rather than tilting about its
 *  own centre, and the cast shadow moves opposite the swing so the light
 *  stays put while the card moves under it. */
export function PieceCard({
  product,
  index,
  featured = false,
}: {
  product: Product;
  index: number;
  featured?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [hovering, setHovering] = useState(false);
  const { inWishlist, toggleWishlist, openQuickView } = useShopUi();
  const saved = inWishlist(product.id);

  const soldOut = product.stock_qty <= 0;
  const category = categoryOf(product.category);
  const colour = colourOf(product.name);
  const mark = pieceMark(product.id);
  const onSale =
    EXTENDED_SCHEMA && !!product.old_price && product.old_price > product.price;
  const tag = !EXTENDED_SCHEMA
    ? null
    : product.is_new
      ? "New"
      : product.is_bestseller
        ? "Bestseller"
        : null;

  // Deterministic per-card jitter: the same piece always hangs at the same
  // angle, so the wall does not reshuffle itself on every render.
  const seed = (product.id.charCodeAt(0) + product.id.charCodeAt(3) * 7) % 100;
  const restAngle = ((seed / 100) * 3 - 1.5) * (index % 2 === 0 ? 1 : -1);

  const swing = useSpring(0, { stiffness: 90, damping: 12, mass: 0.7 });
  const lift = useSpring(0, { stiffness: 140, damping: 18 });

  const rotate = useTransform(swing, (v) => restAngle + v);
  // Shadow travels against the swing: the lamp does not move, the card does.
  const shadow = useTransform([swing, lift], ([s, l]: number[]) => {
    const dx = (-(s as number) * 1.6).toFixed(2);
    const dy = (6 + (l as number) * 10).toFixed(2);
    const blur = (14 + (l as number) * 18).toFixed(2);
    return `drop-shadow(0 1px 1px rgba(42,27,61,0.10)) drop-shadow(${dx}px ${dy}px ${blur}px rgba(42,27,61,${0.18 + (l as number) * 0.14}))`;
  });

  const pointerX = useMotionValue(0);

  function handleMove(e: React.PointerEvent<HTMLElement>) {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    // Where the cursor sits across the card, -1 to 1, drives the swing.
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    pointerX.set(px);
    swing.set(px * 2.6);
  }

  return (
    <motion.article
      ref={ref}
      onPointerMove={handleMove}
      onPointerEnter={() => {
        if (reduceMotion) return;
        setHovering(true);
        lift.set(1);
      }}
      onPointerLeave={() => {
        setHovering(false);
        swing.set(0);
        lift.set(0);
      }}
      /* The reveal moves the card, it never hides it: gating visibility on an
         IntersectionObserver means a shop that renders blank when it misfires. */
      initial={reduceMotion ? false : { y: 12 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.9 }}
      style={{
        rotate: reduceMotion ? restAngle : rotate,
        filter: reduceMotion ? undefined : shadow,
        transformOrigin: "50% 0%",
      }}
      className="group relative"
    >
      {/* The pin sits above the card and is what the card hangs from. */}
      <span className="pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-[45%]">
        <PushPin size={featured ? 26 : 22} />
      </span>

      {/* Save for later. Sits over the card, outside the link, so tapping it
          never opens the piece. */}
      <button
        type="button"
        onClick={() => toggleWishlist(product.id)}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
        className="absolute right-1 top-7 z-30 flex h-11 w-11 items-center justify-center text-primary"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-background/90 shadow-[0_1px_3px_rgba(42,27,61,0.25)]">
          <svg width="15" height="15" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden>
            <path d="M12 20s-7-4.4-8.6-8.6A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8.6 4.4C19 15.6 12 20 12 20Z" />
          </svg>
        </span>
      </button>

      <button
        type="button"
        onClick={() => openQuickView(product)}
        aria-label={`Quick view of ${product.name}`}
        className="absolute right-1 top-[4.2rem] z-30 flex h-11 w-11 items-center justify-center text-primary"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-background/90 shadow-[0_1px_3px_rgba(42,27,61,0.25)]">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </span>
      </button>

      <Link
        href={`/piece/${product.id}`}
        className="block rounded-[3px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-neutral"
      >
        <div
          className="relative overflow-hidden rounded-[3px] bg-background"
          style={{
            // A real edge: warm bevel on the lit side, cool on the shadowed.
            boxShadow: featured
              ? `inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(42,27,61,0.10), 0 0 0 1px ${category.accent}55`
              : "inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(42,27,61,0.10), 0 0 0 1px rgba(42,27,61,0.09)",
          }}
        >
          {/* Punched hole the pin passes through */}
          <span
            aria-hidden
            className="absolute left-1/2 top-[9px] z-10 h-[7px] w-[7px] -translate-x-1/2 rounded-full bg-neutral/60 shadow-[inset_0_1px_2px_rgba(42,27,61,0.5)]"
          />

          {/* Stock margin: the photograph is mounted on the card, not bled to
              its edge, which is what makes the card read as card. */}
          <div className="px-2 pb-1 pt-6">
            <div className="relative aspect-square overflow-hidden rounded-[2px] bg-neutral-soft">
              <Image
                src={product.image_urls[0] ?? "/placeholder-piece.svg"}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                style={{
                  // A light tone pass so eight different backdrops read as one
                  // wall without touching the owner's actual photographs.
                  filter: soldOut
                    ? "saturate(0.35) contrast(0.95) brightness(1.04)"
                    : "saturate(1.04) contrast(1.03)",
                }}
              />

              {tag && !soldOut && (
                <span className="absolute left-1.5 top-1.5 rounded-full bg-background/90 px-2.5 py-0.5 text-[0.62rem] font-medium uppercase tracking-[0.14em] text-primary">
                  {tag}
                </span>
              )}

              {soldOut && (
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] border-2 border-primary/70 bg-background/70 px-3 py-1 font-display text-[0.7rem] uppercase tracking-[0.18em] text-primary backdrop-blur-[1px]">
                  Sold
                </span>
              )}
            </div>
          </div>

          <div className="px-3 pb-3 pt-1.5">
            <h3 className="font-serif text-[1.02rem] leading-[1.15] text-ink">
              {product.name.replace(/ — .*/, "")}
            </h3>
            <p className="mt-1 text-[0.72rem] text-ink-soft">{colour || "Handmade"}</p>

            <div className="mt-2.5 flex items-end justify-between gap-2">
              {/* The price reads as a stuck-on label, not a table cell. */}
              <span
                className="rounded-[1px] px-1.5 py-0.5 font-serif text-[0.9rem] tabular-nums text-ink"
                style={{
                  background: "#efe7da",
                  boxShadow:
                    "inset 0 0 0 1px rgba(42,27,61,0.09), 0 1px 0 rgba(255,255,255,0.7)",
                }}
              >
                {formatPrice(product.price)}
                {onSale && (
                  <span className="ml-1.5 text-[0.72rem] text-ink-soft line-through">
                    {formatPrice(product.old_price as number)}
                  </span>
                )}
              </span>

              {/* Stamped ink: a real per-piece mark from the row id, so it does
                  not renumber when stock moves. */}
              <span
                className="select-none font-display text-[0.58rem] uppercase tracking-[0.18em] text-primary/35"
                style={{ transform: "rotate(-3deg)" }}
              >
                № {mark}
              </span>
            </div>
          </div>

          {/* The reserved focus colour, spent on exactly one thing: the piece
              currently under the cursor. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left transition-transform duration-300"
            style={{
              background: category.accent,
              transform: hovering || featured ? "scaleX(1)" : "scaleX(0)",
            }}
          />
        </div>
      </Link>
    </motion.article>
  );
}
