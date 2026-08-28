"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";

/** The 3D cluster is the page's one heavy asset, so it loads only in the
 *  browser and only after the text is already readable. The shopper on mobile
 *  data sees the offer immediately; the material arrives a moment later. */
const BeadCluster = dynamic(() => import("./BeadCluster"), {
  ssr: false,
  loading: () => <ClusterPlaceholder />,
});

function ClusterPlaceholder() {
  return (
    <div
      aria-hidden
      className="h-full w-full rounded-full bg-[radial-gradient(circle_at_50%_45%,rgba(201,169,224,0.45),rgba(232,220,238,0.15)_45%,transparent_70%)]"
    />
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-neutral/60 bg-neutral">
      {/* The board the cards are pinned to: a woven kraft ground, not a
          flat colour. Kept faint so the piece is what you look at. */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(42,27,61,0.045) 0 1px, transparent 1px 6px), repeating-linear-gradient(90deg, rgba(42,27,61,0.045) 0 1px, transparent 1px 6px)",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-6 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 110, damping: 18 }}
          className="relative z-10"
        >
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-primary/75">
            Handmade in Pakistan
          </p>

          <h1 className="mt-3 font-display text-[2.1rem] leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
            No two pieces
            <span className="block text-primary">are ever the same.</span>
          </h1>

          <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-ink-soft">
            Every bracelet is strung by hand, one at a time — so each one gets
            its own card on the wall. Choose a colour, or tell us yours and
            we&rsquo;ll make it to order.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/shop/beaded-accessories"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 text-[0.9rem] font-medium text-background transition-colors hover:bg-primary-dark"
            >
              See the wall
            </Link>
            <Link
              href="/about"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-primary/35 px-6 text-[0.9rem] text-primary transition-colors hover:bg-primary hover:text-background"
            >
              Order a custom piece
            </Link>
          </div>

          <p className="mt-6 text-[0.78rem] text-ink-soft/85">
            Cash on delivery · Posted anywhere in Pakistan
          </p>
        </motion.div>

        {/* The featured piece, live and draggable. A material you can touch,
            not a photograph with a glow behind it. */}
        <div className="relative">
          <div className="relative mx-auto aspect-square w-full max-w-[380px] cursor-grab active:cursor-grabbing lg:max-w-none">
            <BeadCluster />
          </div>
          <p className="mt-1 text-center text-[0.72rem] text-ink-soft/70">
            Drag to turn
          </p>
        </div>
      </div>
    </section>
  );
}
