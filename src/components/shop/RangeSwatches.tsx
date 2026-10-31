"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CATEGORIES } from "@/lib/categories";
import type { Category } from "@/lib/types";

/** One real photograph per range where the shop has one. A range without a
 *  photograph yet shows a spread of its own beads instead of a flat colour. */
const COVER: Partial<Record<Category, string>> = {
  bangles: "/products/beaded-accessories/beaded-07-lilac-pearl-flatlay.jpg",
  "hoop-earrings": "/products/hoop-earrings/hoop-02-pastel-pearl-chain.jpg",
  ringlets: "/products/ringlets/ringlet-02-pastel-kundan.jpg",
};

/** The range's beads, scattered across the card in a loose hex packing, each
 *  one lit from the upper left. It is the same colours the 3D beads and the
 *  admin use, so the card tells you the range before you read its name. */
function BeadSpread({ id, beads }: { id: string; beads: string[] }) {
  const R = 7.6;
  const dots: { x: number; y: number; k: number }[] = [];
  let n = 0;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const x = col * 15 + (row % 2 ? 7.5 : 0) - 3;
      const y = row * 13.2 - 2;
      // A fixed pseudo-random order, so the pattern never reshuffles on render.
      const k = (n * 7 + row * 3 + (n >> 2)) % beads.length;
      dots.push({ x, y, k });
      n++;
    }
  }

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      <defs>
        {beads.map((c, k) => (
          <radialGradient key={k} id={`${id}-b${k}`} cx="34%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="28%" stopColor={c} />
            <stop offset="100%" stopColor="#2a1b3d" stopOpacity="0.55" />
          </radialGradient>
        ))}
      </defs>
      <rect width="100" height="100" fill={beads[3] ?? beads[0]} opacity="0.55" />
      {dots.map((d, i) => (
        <circle
          key={i}
          cx={d.x}
          cy={d.y}
          r={R}
          fill={`url(#${id}-b${d.k})`}
        />
      ))}
    </svg>
  );
}

/** The six ranges as pinned index cards on the kraft board. They drop onto
 *  their pins one after another as the section scrolls into view, then
 *  straighten and lift when touched. On a phone they scroll sideways. */
export function RangeSwatches() {
  const reduce = useReducedMotion();

  return (
    <section className="board-ground">
      <div className="mx-auto max-w-6xl px-4 pb-6 pt-14 sm:px-6 sm:pt-20 2xl:max-w-7xl">
        <h2 className="font-serif text-3xl tracking-tight text-ink sm:text-4xl">
          Start with your colour
        </h2>
        <p className="mt-2 text-[0.9rem] text-ink-soft">
          Six ranges, each strung in its own colours. Pick one and take a look.
        </p>

        <ul className="-mx-4 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-8 pt-3 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-16 sm:overflow-visible sm:px-0 lg:grid-cols-3 lg:gap-x-10 [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((c, i) => {
            const cover = COVER[c.id];
            return (
              <motion.li
                key={c.id}
                className="w-[74vw] max-w-80 shrink-0 snap-center sm:w-auto sm:max-w-none"
                /* The rise moves the tile; it never hides it, so a missed
                   scroll trigger can not leave the section blank. */
                initial={reduce ? false : { y: 28 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  type: "spring",
                  stiffness: 70,
                  damping: 16,
                  delay: reduce ? 0 : (i % 3) * 0.08,
                }}
              >
                <Link
                  href={`/shop/${c.id}`}
                  className="group block rounded-[28px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                >
                  {/* An arched window onto the range. */}
                  <span className="relative block aspect-[3/4] overflow-hidden rounded-t-[999px] rounded-b-[28px] bg-neutral-soft shadow-[0_28px_50px_-30px_rgba(42,27,61,0.55)] transition-all duration-500 group-hover:-translate-y-1.5 group-hover:shadow-[0_36px_60px_-30px_rgba(42,27,61,0.6)]">
                    {cover ? (
                      <Image
                        src={cover}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 74vw, (max-width: 1024px) 45vw, 380px"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                      />
                    ) : (
                      <BeadSpread id={c.id} beads={c.beads} />
                    )}
                  </span>

                  <span className="mt-5 block text-center">
                    <span className="block font-serif text-[1.8rem] leading-tight text-ink sm:text-[2rem]">
                      {c.label}
                    </span>
                    <span className="mx-auto mt-1.5 line-clamp-2 block max-w-[17rem] text-[0.88rem] leading-relaxed text-ink-soft">
                      {c.blurb}
                    </span>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-[0.88rem] font-medium text-primary">
                      {c.madeToOrder ? "Order yours" : "Explore"}
                      <span
                        aria-hidden
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      >
                        &rarr;
                      </span>
                    </span>
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
