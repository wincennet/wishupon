"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CATEGORIES } from "@/lib/categories";
import type { Category } from "@/lib/types";
import { PushPin } from "./PushPin";

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
          Six ranges, each strung in its own colours.
        </p>

        <ul className="-mx-4 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-8 pt-3 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-x-7 sm:gap-y-12 sm:overflow-visible sm:px-0 lg:grid-cols-6 [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((c, i) => {
            const cover = COVER[c.id];
            const rest = ((i * 37) % 30) / 10 - 1.5;

            return (
              <motion.li
                key={c.id}
                className="w-40 shrink-0 snap-center sm:w-auto"
                /* The drop moves the card; it never hides it, so a missed
                   scroll trigger can not leave the section blank. */
                initial={reduce ? false : { y: -18, rotate: rest * 4 }}
                whileInView={{ y: 0, rotate: rest }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  type: "spring",
                  stiffness: 90,
                  damping: 11,
                  mass: 0.8,
                  delay: reduce ? 0 : i * 0.07,
                }}
                style={{ transformOrigin: "50% 0%" }}
              >
                <motion.div
                  whileHover={reduce ? undefined : { y: -8, rotate: 0 }}
                  whileTap={reduce ? undefined : { scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  style={{ transformOrigin: "50% 0%" }}
                >
                  <Link
                    href={`/shop/${c.id}`}
                    className="group relative block rounded-[10px] bg-background pb-3 pt-6 shadow-[var(--shadow-card)] transition-shadow duration-300 hover:shadow-[var(--shadow-card-lifted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-neutral"
                  >
                    <span className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-[45%]">
                      <PushPin size={20} />
                    </span>

                    <span className="mx-2.5 block">
                      <span className="relative block aspect-square overflow-hidden rounded-[6px] bg-neutral-soft">
                        {cover ? (
                          <Image
                            src={cover}
                            alt=""
                            fill
                            sizes="(max-width: 640px) 160px, 170px"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                          />
                        ) : (
                          <BeadSpread id={c.id} beads={c.beads} />
                        )}
                      </span>
                    </span>

                    <span className="mt-2.5 flex items-center justify-between gap-2 px-3.5">
                      <span className="font-serif text-[1.05rem] leading-tight text-ink">
                        {c.label}
                      </span>
                      <span
                        aria-hidden
                        className="text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                      >
                        &rarr;
                      </span>
                    </span>

                    <span
                      aria-hidden
                      className="absolute inset-x-3 bottom-0 h-[2px] origin-left scale-x-0 rounded-full transition-transform duration-500 ease-out group-hover:scale-x-100"
                      style={{ background: c.accent }}
                    />
                  </Link>
                </motion.div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
