"use client";

import { useRef, useState, useEffect, lazy, Suspense } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "framer-motion";
import type { Product } from "@/lib/types";
import { CATEGORIES, categoryOf } from "@/lib/categories";
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
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroBoxRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const reduceMotion = useReducedMotion();

  /** Where the bracelet should sit while it is still a bracelet, as fractions
   *  of the viewport. The canvas is full-bleed so the loose beads can cover
   *  the whole page, which means the bracelet can no longer inherit its
   *  position from a container — it has to be told where the column is. */
  const anchorRef = useRef<{ fx: number; fy: number; fw: number } | null>(null);

  const [quality, setQuality] = useState<"high" | "low">("high");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Coarse pointer or a narrow screen means a phone on mobile data: fewer
    // beads, lower pixel ratio, no antialias.
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse || window.innerWidth < 900) setQuality("low");
  }, []);

  useEffect(() => {
    function measure() {
      const section = heroSectionRef.current;
      const box = heroBoxRef.current;
      if (!section || !box) return;

      const s = section.getBoundingClientRect();
      const b = box.getBoundingClientRect();

      // Measured against the hero section rather than the viewport: both are
      // in normal flow, so the offset between them survives any scroll
      // position. The canvas is sticky and the hero scrolls away under it, so
      // a plain viewport reading would only be correct at the very top.
      anchorRef.current = {
        fx: (b.left + b.width / 2) / window.innerWidth,
        fy: (b.top - s.top + b.height / 2) / window.innerHeight,
        fw: b.width / window.innerWidth,
      };
    }

    measure();
    const observer = new ResizeObserver(measure);
    if (heroSectionRef.current) observer.observe(heroSectionRef.current);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [mounted]);

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

  // The wall is grouped by the shop's own ranges, in the order the client
  // gave them, and the beads overhead settle into these same columns. Ranges
  // with nothing in stock are not shown here — the nav and footer still list
  // all six so a shopper can ask about them.
  const byCategory = CATEGORIES.map((category) => ({
    category,
    pieces: wall.filter((p) => p.category === category.id),
  })).filter((column) => column.pieces.length > 0);

  // With stock in only one range, four columns would leave a single skinny
  // strip of cards. That range takes the whole board instead.
  const soleRange = byCategory.length === 1;

  // The board is divided by how many ranges actually have stock, not by a
  // fixed four, so two populated ranges do not leave half the wall bare.
  // Written out in full because Tailwind cannot see a constructed class name.
  const columnClass =
    ["", "", "lg:grid-cols-2", "lg:grid-cols-3", "lg:grid-cols-4"][
      Math.min(byCategory.length, 4)
    ] || "lg:grid-cols-4";

  // How many pieces sit side by side inside one range column. A wide column
  // holding one card per row would print cards half a metre across, so the
  // fewer ranges there are, the more pieces share a row.
  const pieceClass = soleRange
    ? "lg:grid-cols-4"
    : byCategory.length === 2
      ? "lg:grid-cols-2"
      : "lg:grid-cols-1 lg:gap-y-12";

  return (
    <div ref={stageRef} className="board-ground relative">
      {/* The bead field, behind everything, sticky for the length of the stage
          and edge to edge: the loose beads are the page's backdrop, so boxing
          them into the content column left a bare margin down both sides. The
          bracelet keeps its place beside the headline through the measured
          anchor above rather than by sharing the container. */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          ref={canvasHostRef}
          className="sticky top-0 h-[100svh] w-full overflow-hidden"
        >
          {mounted && !reduceMotion && (
            <Suspense fallback={null}>
              <BeadField
                progressRef={progressRef}
                anchorRef={anchorRef}
                quality={quality}
                columns={Math.max(byCategory.length, 1)}
              />
            </Suspense>
          )}
        </div>
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroSectionRef}
        id="top"
        className="relative z-10 flex h-[100svh] min-h-[620px] max-h-[880px] items-center bg-neutral/0"
      >
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] 2xl:max-w-7xl">
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
            <div ref={heroBoxRef} className="relative aspect-square w-full">
              {/* Sits in the corner the card leaves free, so the hint is near
                  the object instead of marooned at the top of a tall column. */}
              <p className="absolute bottom-3 left-0 text-[0.72rem] tracking-wide text-ink-soft/70">
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
                      className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-[0.82rem] font-medium text-background transition-colors hover:bg-primary-dark"
                    >
                      See this piece
                    </Link>
                  </div>

                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-[2px]"
                    style={{ background: categoryOf(featured.category).accent }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── The wall ─────────────────────────────────────────────────────── */}
      <section className="relative z-10">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 2xl:max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-serif text-3xl tracking-tight text-ink sm:text-4xl">
              Ready to post
            </h2>
            <Link
              href="/shop/bangles"
              className="flex min-h-11 items-center text-[0.85rem] text-primary underline underline-offset-4 hover:text-primary-dark"
            >
              See everything
            </Link>
          </div>

          {byCategory.length > 0 ? (
            /* Ranges are columns from lg up — the arrangement the beads
               overhead fly into. Narrow screens stack them instead, because
               side-by-side columns of uneven length leave long dead gaps on a
               phone. Both the number of columns and the number of pieces per
               row follow how much stock there actually is, so the wall stays
               dense whether one range is filled or all six are. */
            <div
              className={
                soleRange
                  ? "mt-12"
                  : `mt-12 grid grid-cols-1 gap-y-14 lg:gap-x-7 lg:gap-y-0 ${columnClass}`
              }
            >
              {byCategory.map(({ category, pieces }, columnIndex) => (
                <div
                  key={category.id}
                  /* Columns start at slightly different heights: a real board
                     is pinned by hand, not aligned to a baseline. */
                  className={
                    soleRange
                      ? undefined
                      : ["lg:mt-0", "lg:mt-7", "lg:mt-3", "lg:mt-10"][columnIndex % 4]
                  }
                >
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: category.accent }}
                    />
                    <h3 className="font-display text-[0.64rem] uppercase tracking-[0.18em] text-ink-soft sm:text-[0.68rem]">
                      {category.label}
                    </h3>
                  </div>
                  <span className="mt-2 block h-px w-full bg-ink/10" />

                  <div
                    className={
                      `mt-8 grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 sm:gap-x-7 ${pieceClass}`
                    }
                  >
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
