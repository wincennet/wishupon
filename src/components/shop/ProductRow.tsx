import Link from "next/link";
import type { Product } from "@/lib/types";
import { PieceCard } from "./PieceCard";

/** A short row of pinned cards on the board: "New arrivals", "Best sellers".
 *  Renders nothing when there is nothing to show, so an empty row never
 *  appears on the page. */
export function ProductRow({
  title,
  blurb,
  pieces,
}: {
  title: string;
  blurb: string;
  pieces: Product[];
}) {
  if (pieces.length === 0) return null;

  return (
    <section className="board-ground board-continued">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] tracking-[-0.02em] text-ink">
              {title}
            </h2>
            <p className="mt-2 text-[0.9rem] text-ink-soft">{blurb}</p>
          </div>
          <Link
            href="/shop/bangles"
            className="flex min-h-11 items-center text-[0.85rem] text-primary underline underline-offset-4 hover:text-primary-dark"
          >
            See everything
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 sm:gap-x-7 lg:grid-cols-4">
          {pieces.slice(0, 4).map((piece, i) => (
            <PieceCard key={piece.id} product={piece} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
