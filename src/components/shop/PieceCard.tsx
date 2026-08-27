"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";

/** The unit of the whole site: one piece, one card, pinned to the board.
 *  The card is a physical object — real edge, real pin, real cast shadow.
 *  Draw it timidly and the design collapses into an ordinary product grid. */
export function PieceCard({
  product,
  index,
  featured = false,
}: {
  product: Product;
  index: number;
  featured?: boolean;
}) {
  const soldOut = product.stock_qty <= 0;
  const cardNumber = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      /* Damped, physical settle — the card comes to rest on its pin.
         Nothing here moves like software. */
      transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.9 }}
      className="group relative"
    >
      <Link
        href={`/piece/${product.id}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-neutral rounded-[2px]"
      >
        {/* The pin. Sits above the card and casts onto it. */}
        <span
          aria-hidden
          className="absolute left-1/2 top-0 z-20 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_1px_2px_rgba(42,27,61,0.5),inset_0_-1px_1px_rgba(255,255,255,0.35)]"
        />

        <div
          className={`
            relative overflow-hidden rounded-[2px] bg-background
            shadow-[var(--shadow-card)] transition-shadow duration-300
            group-hover:shadow-[var(--shadow-card-lifted)]
            ${featured ? "ring-1 ring-primary/25" : ""}
          `}
        >
          {/* Punched hole the pin passes through. */}
          <span
            aria-hidden
            className="absolute left-1/2 top-2.5 z-10 h-2 w-2 -translate-x-1/2 rounded-full bg-neutral/70 shadow-[inset_0_1px_2px_rgba(42,27,61,0.35)]"
          />

          <div className="relative aspect-square overflow-hidden bg-neutral-soft pt-5">
            <Image
              src={product.image_urls[0] ?? "/placeholder-piece.svg"}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover transition-transform duration-500 group-hover:scale-[1.03] ${
                soldOut ? "opacity-55 saturate-50" : ""
              }`}
            />

            {soldOut && (
              /* Sold pieces stay on the wall. Hiding them would hide the
                 evidence that these are one-of-a-kind and do sell. */
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] border-2 border-primary/70 px-3 py-1 font-display text-[0.7rem] uppercase tracking-[0.18em] text-primary">
                Sold
              </span>
            )}
          </div>

          {/* Stacked, not side-by-side: at a 2-up mobile grid there is not
              enough width for a name and a price on one line without the
              name truncating to nonsense. */}
          <div className="border-t border-neutral/60 px-3 py-2.5">
            <h3 className="line-clamp-2 font-display text-[0.86rem] leading-snug text-ink">
              {product.name.replace(/ — .*/, "")}
            </h3>
            <p className="mt-0.5 truncate text-[0.7rem] text-ink-soft">
              {product.name.includes(" — ")
                ? product.name.split(" — ")[1]
                : "Handmade"}
            </p>
            <div className="mt-2 flex items-baseline justify-between gap-2">
              <p className="font-display text-[0.88rem] tabular-nums text-primary">
                {formatPrice(product.price)}
              </p>
              <p className="text-[0.6rem] uppercase tracking-[0.14em] text-ink-soft/70 tabular-nums">
                No. {cardNumber}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
