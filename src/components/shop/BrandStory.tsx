import Image from "next/image";
import Link from "next/link";
import { whatsappLink } from "@/lib/constants";

/** How an order goes, as four plain steps. The four steps are exactly
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

export function BrandStory() {
  return (
    <section id="about" className="border-t border-ink/10 bg-background">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-[1fr_1.05fr] lg:gap-24">
        {/* The workbench photograph, with a note pinned to its corner. */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-neutral-soft ">
            <Image
              src="/products/beaded-accessories/beaded-04-multicolor-worn.jpg"
              alt="Handmade multicolour beaded bangles worn on the wrist"
              fill
              sizes="(max-width: 1024px) 90vw, 480px"
              className="object-cover"
            />
          </div>

          <div className="absolute -bottom-6 right-3 w-56 rounded-xl border border-ink/10 bg-background px-5 py-4 sm:-right-6 sm:w-64">
            <p className="font-serif text-[1.2rem] italic leading-snug text-primary">
              Wear it on an ordinary Tuesday. That is what it is for.
            </p>
          </div>
        </div>

        <div>
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-ink-soft">
            About WishUpon
          </p>
          <h2 className="mt-3 font-serif text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] tracking-[-0.02em] text-ink">
            From your colour
            <span className="block italic text-primary">to your door</span>
          </h2>
          <p className="mt-5 max-w-md text-[0.98rem] leading-relaxed text-ink-soft">
            WishUpon is one maker, a table of beads and a lot of patience.
            Every piece is strung here in Pakistan and never repeated.
          </p>

          {/* Four steps as a quiet numbered list: hairlines and one colour. */}
          <ol className="mt-9 border-b border-ink/10">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="grid grid-cols-[3rem_1fr] gap-x-2 border-t border-ink/10 py-5"
              >
                <span
                  aria-hidden
                  className="pt-0.5 font-serif text-[1.15rem] italic text-primary"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-serif text-[1.3rem] leading-tight text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 max-w-sm text-[0.9rem] leading-relaxed text-ink-soft">
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
