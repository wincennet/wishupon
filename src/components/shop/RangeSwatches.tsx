import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import type { Category } from "@/lib/types";

/** One real photograph per range where the shop has one. A range without a
 *  photograph yet shows its own bead colours as quiet vertical bands. */
const COVER: Partial<Record<Category, string>> = {
  bangles: "/products/beaded-accessories/beaded-07-lilac-pearl-flatlay.jpg",
  "hoop-earrings": "/products/hoop-earrings/hoop-02-pastel-pearl-chain.jpg",
  ringlets: "/products/ringlets/ringlet-02-pastel-kundan.jpg",
};

/** The ranges as a plain grid: a tall image, a name, an arrow. */
export function RangeSwatches() {
  return (
    <section className="border-t border-ink/10 bg-background">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-ink-soft">
              The ranges
            </p>
            <h2 className="mt-3 font-serif text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] tracking-[-0.02em] text-ink">
              Start with your colour
            </h2>
          </div>
          <p className="max-w-xs text-[0.9rem] leading-relaxed text-ink-soft">
            Six ranges, each strung in its own colours.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 md:mt-16 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
          {CATEGORIES.map((c) => {
            const cover = COVER[c.id];
            return (
              <li key={c.id}>
                <Link
                  href={`/shop/${c.id}`}
                  className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                >
                  <span className="relative block aspect-[4/5] overflow-hidden rounded-xl bg-neutral-soft">
                    {cover ? (
                      <Image
                        src={cover}
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 46vw, 400px"
                        className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04]"
                      />
                    ) : (
                      <span aria-hidden className="absolute inset-0 flex">
                        {c.beads.map((hex) => (
                          <span
                            key={hex}
                            className="flex-1"
                            style={{ background: hex, opacity: 0.82 }}
                          />
                        ))}
                      </span>
                    )}
                  </span>

                  <span className="mt-4 flex items-baseline justify-between gap-3 border-b border-ink/10 pb-4">
                    <span className="font-serif text-[1.35rem] leading-tight text-ink sm:text-[1.6rem]">
                      {c.label}
                    </span>
                    <span
                      aria-hidden
                      className="text-ink-soft transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:text-primary"
                    >
                      &rarr;
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
