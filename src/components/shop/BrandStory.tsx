import Image from "next/image";
import Link from "next/link";
import { whatsappLink } from "@/lib/constants";

/** How an order goes, told as beads on a string. The four steps are exactly
 *  what happens at checkout, so nothing here is a claim the shop cannot keep. */
const STEPS = [
  {
    title: "Choose your colour",
    body: "Pick a piece from the wall, or tell us your colours and your size.",
  },
  {
    title: "We call you",
    body: "A quick phone call to confirm your order and where it is going.",
  },
  {
    title: "Strung and posted",
    body: "Made by hand, then sent by courier anywhere in Pakistan.",
  },
  {
    title: "Pay at your door",
    body: "Cash on delivery, or a bank transfer if you would rather.",
  },
];

// Deep enough that the white numbers stay readable; one per range's palette.
const BEAD_COLOURS = ["#7d54a3", "#b8892f", "#c8415b", "#4a7c8c"];

export function BrandStory() {
  return (
    <section id="about" className="bg-background">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1fr_1.05fr] lg:gap-20 2xl:max-w-7xl">
        {/* The workbench photograph, with a note pinned to its corner. */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-neutral-soft shadow-[0_30px_60px_-30px_rgba(42,27,61,0.45)]">
            <Image
              src="/products/beaded-accessories/beaded-04-multicolor-worn.jpg"
              alt="Handmade multicolour beaded bangles worn on the wrist"
              fill
              sizes="(max-width: 1024px) 90vw, 480px"
              className="object-cover"
            />
          </div>

          <div className="absolute -bottom-6 right-2 w-52 rotate-[3deg] rounded-2xl bg-background px-5 py-4 shadow-[var(--shadow-card-lifted)] sm:-right-6 sm:w-60">
            <p className="font-serif text-[1.2rem] italic leading-snug text-primary">
              Wear it on an ordinary Tuesday. That is what it is for.
            </p>
          </div>
        </div>

        <div>
          <p className="text-[0.78rem] font-medium uppercase tracking-[0.2em] text-primary/70">
            About WishUpon
          </p>
          <h2 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight text-ink sm:text-5xl">
            From your colour
            <span className="block italic text-primary">to your door</span>
          </h2>
          <p className="mt-5 max-w-md text-[0.98rem] leading-relaxed text-ink-soft">
            WishUpon is one maker, a table of beads and a lot of patience.
            Every piece is strung here in Pakistan and never repeated.
          </p>

          {/* Beads on a thread: one bead per step. */}
          <ol className="relative mt-9 space-y-7">
            <span
              aria-hidden
              className="absolute bottom-3 left-[13px] top-3 w-px border-l-[1.5px] border-dashed border-ink/25"
            />
            {STEPS.map((step, i) => (
              <li key={step.title} className="relative flex gap-5">
                <span
                  aria-hidden
                  className="relative z-10 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[0.72rem] font-medium text-white shadow-[inset_-2px_-3px_5px_rgba(0,0,0,0.22),inset_2px_2px_4px_rgba(255,255,255,0.4)]"
                  style={{ background: BEAD_COLOURS[i % BEAD_COLOURS.length] }}
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-serif text-[1.25rem] leading-tight text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-1 max-w-sm text-[0.9rem] leading-relaxed text-ink-soft">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3">
            <Link href="#wall" className="btn btn-primary min-h-12 px-8 text-[0.92rem]">
              See what is ready
            </Link>
            <a
              href={whatsappLink("Assalam o alaikum! I'd like a custom piece from WishUpon.")}
              target="_blank"
              rel="noreferrer"
              className="link-underline flex min-h-11 items-center text-[0.9rem] font-medium text-ink"
            >
              Ask for a custom piece
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
