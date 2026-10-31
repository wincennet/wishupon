import Image from "next/image";
import Link from "next/link";
import { whatsappLink } from "@/lib/constants";

/** One headline, one photograph, one decision. Everything else is quiet. */
export function HomeHero() {
  return (
    <section className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pb-20 pt-12 sm:px-8 md:pb-28 md:pt-20 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-6">
        <p
          className="rise text-[0.7rem] font-medium uppercase tracking-[0.22em] text-ink-soft"
          style={{ ["--d" as string]: "0s" }}
        >
          Handmade accessories · Pakistan
        </p>

        <h1
          className="rise mt-6 font-serif text-[clamp(3rem,6.4vw,5.6rem)] leading-[1.02] tracking-[-0.025em] text-ink"
          style={{ ["--d" as string]: "0.1s" }}
        >
          No two pieces
          <span className="block italic text-primary">are ever the same.</span>
        </h1>

        <p
          className="rise mt-7 max-w-md text-[1.02rem] leading-[1.7] text-ink-soft"
          style={{ ["--d" as string]: "0.2s" }}
        >
          Strung by hand, one bead at a time. Choose a colour you love, or tell
          us yours and we&rsquo;ll make it just for you.
        </p>

        <div
          className="rise mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
          style={{ ["--d" as string]: "0.3s" }}
        >
          <Link href="#wall" className="btn btn-primary min-h-12 px-8 text-[0.92rem]">
            See what&rsquo;s ready
          </Link>
          <a
            href={whatsappLink("Assalam o alaikum! I'd like a custom piece from WishUpon.")}
            target="_blank"
            rel="noreferrer"
            className="link-underline flex min-h-11 items-center text-[0.92rem] font-medium text-ink"
          >
            Order in your colours
          </a>
        </div>

        <dl
          className="rise mt-14 grid max-w-md grid-cols-3 border-t border-ink/10 pt-6"
          style={{ ["--d" as string]: "0.4s" }}
        >
          {[
            ["Made to order", "Your colours, your size"],
            ["One of a kind", "Each piece made once"],
            ["Pay on delivery", "Anywhere in Pakistan"],
          ].map(([title, note], i) => (
            <div key={title} className={i > 0 ? "border-l border-ink/10 pl-4" : ""}>
              <dt className="text-[0.78rem] font-medium text-ink">{title}</dt>
              <dd className="mt-1 text-[0.72rem] leading-snug text-ink-soft">{note}</dd>
            </div>
          ))}
        </dl>
      </div>

      <figure className="rise lg:col-span-6" style={{ ["--d" as string]: "0.2s" }}>
        <div className="relative mx-auto aspect-[4/5] w-full max-w-xl overflow-hidden rounded-xl bg-neutral-soft lg:max-w-none">
          <Image
            src="/hero/model-lilac-pearl.png"
            alt="A model resting her cheek on her hand, wearing a lilac crystal-bead bracelet with gold tassels"
            fill
            priority
            sizes="(max-width: 1024px) 92vw, 46vw"
            className="object-cover"
            style={{ objectPosition: "50% 35%" }}
          />
        </div>
        <figcaption className="mx-auto mt-4 flex max-w-xl items-baseline justify-between gap-4 text-[0.78rem] text-ink-soft lg:max-w-none">
          <span className="font-serif text-[1rem] italic text-ink">
            Lilac pearl bracelet
          </span>
          <span>Model image is AI-generated</span>
        </figcaption>
      </figure>
    </section>
  );
}
