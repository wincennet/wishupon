import Image from "next/image";
import Link from "next/link";
import { FILM_PANELS } from "@/lib/hero-shots";
import { PushPin } from "@/components/shop/PushPin";

/** The home hero, in the reference store's layout: a centred editorial
 *  headline over a curved filmstrip of pieces that drifts on its own and
 *  pauses when she hovers. Panels come from FILM_PANELS (src/lib/hero-shots.ts). */
export function HomeHero() {
  // The track is the same set twice, so translating it by half loops with no seam.
  const strip = [...FILM_PANELS, ...FILM_PANELS];

  return (
    <section className="relative border-y border-neutral pt-8 sm:pt-12">
      <div className="mx-auto max-w-4xl px-5 text-center">
        <span className="inline-flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.3em] text-ink-soft">
          <span className="h-px w-8 bg-ink-soft/60" />
          Handmade Accessories
          <span className="h-px w-8 bg-ink-soft/60" />
        </span>

        <h1
          className="mt-6 font-serif leading-[0.98] tracking-tight text-primary"
          style={{ fontSize: "clamp(2.6rem, 8vw, 5.4rem)" }}
        >
          No two pieces
          <br />
          are <span className="text-primary-dark">ever</span>
          <br />
          the same
        </h1>

        <p className="mt-6 font-serif text-xl italic text-primary-dark sm:text-2xl md:text-3xl">
          One bead at a time, strung by hand in Pakistan.
        </p>
      </div>

      <div className="filmstrip scene mt-10 py-6 sm:mt-14" aria-label="Pieces from the shop">
        <div className="filmstrip-bow">
          <div className="filmstrip-track">
            {strip.map((panel, i) => {
              // Each card hangs at its own angle, as if pinned by hand.
              const tilt = (((i % FILM_PANELS.length) * 53) % 40) / 10 - 2;
              return (
                <figure
                  key={`${panel.src}-${i}`}
                  className="film-card"
                  style={{ rotate: `${tilt}deg` }}
                >
                  <span className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-[45%]">
                    <PushPin size={22} />
                  </span>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] bg-neutral-soft">
                    <Image
                      src={panel.src}
                      alt={i < FILM_PANELS.length ? panel.alt : ""}
                      aria-hidden={i >= FILM_PANELS.length}
                      fill
                      sizes="(max-width: 640px) 190px, 270px"
                      className="object-cover"
                      style={{ objectPosition: panel.focus }}
                      priority={i < 3}
                    />
                  </div>
                  <figcaption className="px-1 pb-1 pt-2.5 text-center">
                    <span className="block font-serif text-[1.05rem] leading-tight text-ink">
                      {panel.label}
                    </span>
                    {panel.note && (
                      <span className="mt-0.5 block text-[0.62rem] tracking-wide text-ink-soft">
                        {panel.note}
                      </span>
                    )}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-xl px-5 pb-12 text-center sm:mt-14 sm:pb-16">
        <p className="text-sm leading-relaxed text-ink sm:text-[0.95rem]">
          Each WishUpon piece is strung by hand and made once. Pick a colour
          you love, or tell us yours and we&rsquo;ll make it just for you.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <Link href="/shop/bangles" className="btn btn-primary px-8 py-3.5 text-sm">
            Shop the bangles
          </Link>
          <a href="#wall" className="link-underline text-sm font-medium text-ink">
            See the wall
          </a>
          <Link href="/about" className="link-underline text-sm font-medium text-ink">
            About us
          </Link>
        </div>

        <p className="mt-10 text-[0.7rem] uppercase tracking-[0.18em] text-ink-soft">
          Made to order &nbsp;·&nbsp; One of a kind &nbsp;·&nbsp; Cash on delivery
        </p>
      </div>
    </section>
  );
}
