import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import type { Category } from "@/lib/types";
import { PushPin } from "./PushPin";

/** One real photograph per range where the shop has one. A range with no
 *  photograph yet shows its own bead colours instead of a broken image. */
const COVER: Partial<Record<Category, string>> = {
  bangles: "/products/beaded-accessories/beaded-07-lilac-pearl-flatlay.jpg",
  "hoop-earrings": "/products/hoop-earrings/hoop-02-pastel-pearl-chain.jpg",
  ringlets: "/products/ringlets/ringlet-02-pastel-kundan.jpg",
};

/** The six ranges as pinned index cards, hung at slightly different angles by
 *  hand, on the same kraft board as the wall. */
export function RangeSwatches() {
  return (
    <section className="board-ground">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 2xl:max-w-7xl">
        <h2 className="font-serif text-3xl tracking-tight text-ink sm:text-4xl">
          Start with your colour
        </h2>
        <p className="mt-2 text-[0.9rem] text-ink-soft">
          Six ranges, each strung in its own colours.
        </p>

        <ul className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 sm:gap-x-7 lg:grid-cols-6">
          {CATEGORIES.map((c, i) => {
            const cover = COVER[c.id];
            const tilt = ((i * 37) % 30) / 10 - 1.5;
            return (
              <li key={c.id}>
                <Link
                  href={`/shop/${c.id}`}
                  style={{ rotate: `${tilt}deg`, transformOrigin: "50% 0" }}
                  className="group relative block rounded-[3px] bg-background pb-3 pt-6 shadow-[var(--shadow-card)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-lifted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-neutral"
                >
                  <span className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-[45%]">
                    <PushPin size={20} />
                  </span>
                  <span className="mx-2 block">
                    <span
                      className="relative block aspect-square overflow-hidden rounded-[2px]"
                      style={{
                        background: `linear-gradient(150deg, ${c.beads[0]}, ${c.beads[2]})`,
                      }}
                    >
                      {cover && (
                        <Image
                          src={cover}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 45vw, 170px"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                      )}
                    </span>
                  </span>
                  <span className="mt-2 block px-3 font-serif text-[1.02rem] leading-tight text-ink">
                    {c.label}
                  </span>
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                    style={{ background: c.accent }}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
