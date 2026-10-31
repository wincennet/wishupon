"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { CATEGORIES } from "@/lib/categories";
import { PieceCard } from "./PieceCard";

/** The wall: every piece in stock, pinned as its own card and sorted into
 *  columns by range. The hero above it is a separate scene (ShotReel). */
export function WallStage({ products }: { products: Product[] }) {
    const wall = products;

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

  // Every range shows the same number of pieces, so the columns finish level.
  //
  // Without this the board is as tall as its deepest range: with fifteen
  // bangles beside four pairs of earrings, the earrings ran out after one
  // screen and the bangles carried on alone for five more, with the whole
  // right-hand side of the page empty the entire way down. The wall is a
  // shop window, not the full catalogue — anything past the cut is one click
  // away on its own range page, which is a better place to browse fifteen
  // bracelets than a single-file column anyway.
  // One row of slack rather than an exact match: holding every range to the
  // thinnest one would hide most of the main range to save a few hundred
  // pixels. A single uneven row reads as a hand-pinned board; six screens of
  // it reads as a broken page.
  const shortestRange = Math.min(...byCategory.map((c) => c.pieces.length));
  const perRange = soleRange
    ? Infinity
    : Math.min(8, Math.max(3, shortestRange + 1));

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
    <div className="board-ground relative">
      {/* ── The wall ─────────────────────────────────────────────────────── */}
      <section id="wall" className="relative z-10 scroll-mt-16">
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
                    {pieces.slice(0, perRange).map((piece, i) => (
                      <PieceCard key={piece.id} product={piece} index={i} />
                    ))}
                  </div>

                  {/* Where a range was cut to keep the board level, the rest
                      of it is one click away rather than silently missing. */}
                  {pieces.length > perRange && (
                    <Link
                      href={`/shop/${category.id}`}
                      className="mt-7 flex min-h-11 items-center text-[0.82rem] text-primary underline underline-offset-4 hover:text-primary-dark"
                    >
                      All {pieces.length} {category.label.toLowerCase()}
                      <span aria-hidden className="ml-1.5">
                        &rarr;
                      </span>
                    </Link>
                  )}
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
