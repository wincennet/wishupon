import Link from "next/link";
import { ArchCarousel } from "./ArchCarousel";
import { whatsappLink } from "@/lib/constants";

/** The home hero: a centred headline over an arched, draggable row of pieces.
 *  The hand-drawn note points the eye from the words down into the cards;
 *  its stroke draws itself in. */
export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-neutral pt-10 sm:pt-14">
      <div className="mx-auto max-w-4xl px-5 text-center">
        <span
          className="rise inline-flex items-center rounded-full bg-accent-soft px-4 py-2 text-[0.78rem] font-medium text-primary"
          style={{ ["--d" as string]: "0.05s" }}
        >
          Handmade accessories, made once
        </span>

        <h1
          className="mt-6 font-serif leading-[0.96] tracking-[-0.02em] text-ink"
          style={{ fontSize: "clamp(2.8rem, 8.4vw, 6.4rem)" }}
        >
          <span className="rise block" style={{ ["--d" as string]: "0.15s" }}>
            No two pieces
          </span>
          <span
            className="rise block italic text-primary"
            style={{ ["--d" as string]: "0.3s" }}
          >
            are ever the same
          </span>
        </h1>

        <p
          className="rise mx-auto mt-6 max-w-lg text-[0.98rem] leading-relaxed text-ink-soft sm:text-[1.05rem]"
          style={{ ["--d" as string]: "0.45s" }}
        >
          Strung by hand in Pakistan, one bead at a time. Pick a colour you
          love, or tell us yours and we&rsquo;ll make it just for you.
        </p>
      </div>

      {/* Hand-drawn note: points from the words down into the cards. */}
      <div className="pointer-events-none relative mx-auto hidden max-w-[1440px] md:block">
        <div
          className="rise absolute right-[9%] top-2 z-10 -rotate-[8deg] text-center font-serif text-[1.7rem] italic leading-[1.05] text-primary lg:text-[2.1rem]"
          style={{ ["--d" as string]: "1s" }}
        >
          one of
          <br />a kind
        </div>
        <svg
          aria-hidden
          className="draw absolute right-[7%] top-[4.6rem] z-10 h-40 w-24 text-primary lg:h-48"
          viewBox="0 0 96 190"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        >
          <path d="M62 6C92 40 88 92 52 130c-8 8-14 16-16 40" />
          <path d="M22 150l14 24 22-14" />
        </svg>
      </div>

      <div className="rise mt-6 sm:mt-10" style={{ ["--d" as string]: "0.6s" }}>
        <ArchCarousel />
      </div>

      <div className="relative mx-auto -mt-2 flex max-w-xl flex-col items-center px-5 pb-14 text-center sm:pb-20">
        <span
          className="rise rounded-full border-[1.5px] border-dashed border-primary/60 p-2"
          style={{ ["--d" as string]: "0.9s" }}
        >
          <Link
            href="#wall"
            className="btn btn-primary min-h-12 px-9 text-[0.95rem]"
          >
            See the wall
          </Link>
        </span>

        <a
          href={whatsappLink("Assalam o alaikum! I'd like a custom piece from WishUpon.")}
          target="_blank"
          rel="noreferrer"
          className="link-underline mt-5 flex min-h-11 items-center text-[0.88rem] font-medium text-ink"
        >
          Or order it in your colours
        </a>

        <p
          className="rise mt-3 font-serif text-[1.3rem] italic text-primary"
          style={{ ["--d" as string]: "1.1s" }}
        >
          pay on delivery
        </p>
      </div>
    </section>
  );
}
