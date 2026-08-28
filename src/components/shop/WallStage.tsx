"use client";

import { useRef, useState, useEffect, lazy, Suspense } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "framer-motion";
import type { Product } from "@/lib/types";
import { FAMILIES, familyOf } from "@/lib/palette";
import { PieceCard } from "./PieceCard";
import { PushPin } from "./PushPin";
import { formatPrice } from "@/lib/format";

const BeadField = lazy(() => import("@/components/hero/BeadField"));

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Hero and wall are one scene, not two sections that happen to sit together.
 *  A single bead field spans both: it is a bracelet at the top of the scroll
 *  and the four colour-family columns behind the shop at the bottom, and the
 *  scroll between them is the disassembly. */
export function WallStage({ products }: { products: Product[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const reduceMotion = useReducedMotion();

  const [quality, setQuality] = useState<"high" | "low">("high");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Coarse pointer or a narrow screen means a phone on mobile data: fewer
    // beads, lower pixel ratio, no antialias.
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse || window.innerWidth < 900) setQuality("low");
  }, []);

  useGSAP(
    () => {
      if (reduceMotion) {
        progressRef.current = 0;
        return;
      }

      ScrollTrigger.create({
        trigger: stageRef.current,
        start: "top top",
        // The sleeve has fully opened by the time one screen has scrolled,
        // which is when the wall's first row arrives.
        end: "+=90%",
        scrub: 0.6,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          // Drag belongs to the bracelet, not to the loose beads.
          if (canvasHostRef.current) {
            canvasHostRef.current.style.pointerEvents =
              self.progress < 0.12 ? "auto" : "none";
          }
        },
      });
    },
    { scope: stageRef, dependencies: [reduceMotion] }
  );

  const featured = products.find((p) => p.stock_qty > 0) ?? products[0];
  const wall = products.filter((p) => p.id !== featured?.id);

  // The wall is sorted into the same four families the beads fly into.
  const byFamily = FAMILIES.map((family) => ({
    family,
    pieces: wall.filter((p) => familyOf(p.name).id === family.id),
  })).filter((column) => column.pieces.length > 0);

  return (
    <div ref={stageRef} className="board-ground relative">
      {/* The bead field, behind everything, sticky for the length of the stage */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <div ref={canvasHostRef} className="h-full w-full">
            {mounted && !reduceMotion && (
              <Suspense fallback={null}>
                <BeadField progressRef={progressRef} quality={quality} />
              </Suspense>
            )}
          </div>
        </div>
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        id="top"
        className="relative z-10 flex min-h-screen items-center bg-neutral/0"
      >
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <h1 className="font-serif text-[2.6rem] leading-[1.02] tracking-[-0.01em] text-ink sm:text-6xl lg:text-[4.4rem]">
              No two pieces
              <span className="block text-primary">are ever the same.</span>
            </h1>

            <p className="mt-6 max-w-md text-[1rem] leading-relaxed text-ink-soft">
              Every bracelet is strung by hand in Pakistan, one bead at a time —
              so each one gets its own card on the wall. Choose a colour, or tell
              us yours and we&rsquo;ll make it to order.
            </p>

            <p className="mt-7 text-[0.8rem] text-ink-soft/85">
              Cash on delivery · Posted anywhere in Pakistan
            </p>
          </div>

          {/* The bracelet occupies this column — it is the sticky canvas
              behind, so this box just reserves its space. The featured card is
              pinned in front of it, overlapping, carrying the piece's name,
              its price label and the primary action. */}
          {featured && (
            <div className="relative aspect-square w-full">
              <p className="absolute left-1/2 top-3 -translate-x-1/2 text-[0.7rem] tracking-wide text-ink-soft/70">
                Drag to turn it
              </p>

              <div className="absolute -bottom-2 right-0 w-[74%] max-w-[300px] sm:w-[66%]">
                <span className="pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-[45%]">
                  <PushPin size={26} />
                </span>

                <div
                  className="relative rounded-[3px] bg-background px-4 pb-4 pt-6"
                  style={{
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.9), 0 0 0 1px rgba(42,27,61,0.10), 0 22px 44px -20px rgba(42,27,61,0.5)",
                  }}
                >
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-[9px] h-[7px] w-[7px] -translate-x-1/2 rounded-full bg-neutral/60 shadow-[inset_0_1px_2px_rgba(42,27,61,0.5)]"
                  />

                  <p className="text-[0.62rem] uppercase tracking-[0.2em] text-primary/60">
                    Featured piece
                  </p>
                  <h2 className="mt-1 font-serif text-[1.2rem] leading-tight text-ink">
                    {featured.name.replace(/ — .*/, "")}
                  </h2>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <span
                      className="rounded-[1px] px-1.5 py-0.5 font-serif text-[0.95rem] tabular-nums text-ink"
                      style={{
                        background: "#efe7da",
                        boxShadow: "inset 0 0 0 1px rgba(42,27,61,0.09)",
                      }}
                    >
                      {formatPrice(featured.price)}
                    </span>

                    <Link
                      href={`/piece/${featured.id}`}
                      className="rounded-full bg-primary px-5 py-2.5 text-[0.82rem] font-medium text-background transition-colors hover:bg-primary-dark"
                    >
                      See this piece
                    </Link>
                  </div>

                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-[2px]"
                    style={{ background: familyOf(featured.name).focus }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── The wall ─────────────────────────────────────────────────────── */}
      <section className="relative z-10">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-serif text-3xl tracking-tight text-ink sm:text-4xl">
              Ready to post
            </h2>
            <Link
              href="/shop/beaded-accessories"
              className="text-[0.85rem] text-primary underline underline-offset-4 hover:text-primary-dark"
            >
              See everything
            </Link>
          </div>

          {byFamily.length > 0 ? (
            /* Families are columns, not stacked rows: this is the arrangement
               the beads fly into overhead, and it keeps the wall dense instead
               of leaving a four-wide grid mostly empty when a colour only has
               one or two pieces in stock. */
            <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 sm:gap-x-7 lg:grid-cols-4">
              {byFamily.map(({ family, pieces }) => (
                <div key={family.id}>
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: family.focus }}
                    />
                    <h3 className="font-display text-[0.62rem] uppercase tracking-[0.18em] text-ink-soft sm:text-[0.68rem]">
                      {family.label}
                    </h3>
                  </div>
                  <span className="mt-2 block h-px w-full bg-ink/10" />

                  <div className="mt-8 space-y-12">
                    {pieces.map((piece, i) => (
                      <PieceCard key={piece.id} product={piece} index={i} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-10 text-[0.9rem] text-ink-soft">
              New pieces are being photographed. Check back shortly.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
