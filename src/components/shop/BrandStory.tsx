import Image from "next/image";
import Link from "next/link";
import { DELIVERY } from "@/lib/constants";
import { PushPin } from "./PushPin";

const FEATURES = [
  {
    title: "Made to Order",
    body: "Tell us your colours and your size. We make it for you.",
    icon: (
      <path d="M12 21s-7-4.4-9.3-9A5.3 5.3 0 0 1 12 6a5.3 5.3 0 0 1 9.3 6c-2.3 4.6-9.3 9-9.3 9Z" />
    ),
  },
  {
    title: "One of a Kind",
    body: "Each piece is made once. No repeats, no mass production.",
    icon: <path d="m6 3 -3 6 9 12 9-12-3-6H6Zm-3 6h18M9 3l3 18M15 3l-3 18" />,
  },
  {
    title: "Everyday Prices",
    body: "Handmade you can wear on a Tuesday, not only at weddings.",
    icon: (
      <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8ZM7.5 7.5h.01" />
    ),
  },
  {
    title: "Pay on Delivery",
    body: DELIVERY.note,
    icon: (
      <path d="M1 6h13v10H1zM14 10h4l3 3v3h-7M5.5 19a1.5 1.5 0 1 0 0-.01M17.5 19a1.5 1.5 0 1 0 0-.01" />
    ),
  },
];

const POINTS = [
  "Strung by hand, one piece at a time",
  "A piece that is made once, never mass produced",
  "Your colours and your wrist size, if you ask",
  "Cash on delivery across Pakistan",
  "A real person answers on WhatsApp",
];

/** The reference store's About block and What you get, written with claims
 *  this shop can stand behind: no sales counts and no review claims. */
export function BrandStory() {
  return (
    <>
      <section id="about" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="scene depth-2 relative overflow-hidden rounded-[3px] bg-primary p-9 text-white sm:p-12">
            <div className="anim-float absolute -bottom-10 -right-10 h-52 w-52 rounded-full bg-accent opacity-20" />
            <span className="text-xs uppercase tracking-[0.25em] text-accent">
              About Us
            </span>
            <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">
              Made by hand, made for you
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-white/85">
              WishUpon is one maker, a table of beads and a lot of patience.
              Every bracelet, hoop and ringlet is strung here in Pakistan and
              never repeated.
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
              Wear it on an ordinary Tuesday. That is what it is for.
            </p>
            <Link
              href="/shop/bangles"
              className="btn mt-8 bg-background px-6 py-3 text-sm text-primary"
            >
              See what's ready
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="relative flex flex-col gap-3 rounded-[3px] bg-background p-6 pt-8 shadow-[var(--shadow-card)]"
              >
                <span className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[45%]">
                  <PushPin size={20} />
                </span>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-[3px] bg-primary text-white">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    {f.icon}
                  </svg>
                </span>
                <p className="font-serif text-xl text-primary">
                  {f.title}
                </p>
                <p className="text-sm text-ink">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-soft py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14">
          <div className="scene">
            <div className="tilt depth-3 relative aspect-[4/3] overflow-hidden rounded-[3px] bg-neutral">
              <Image
                src="/products/beaded-accessories/beaded-04-multicolor-worn.jpg"
                alt="Handmade multicolour beaded bangles worn on the wrist"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-primary sm:text-4xl">
              What you get
            </h2>
            <ul className="mt-6 space-y-4">
              {POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ok p-1 text-white">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="m5 12 5 5 9-10" />
                    </svg>
                  </span>
                  <span className="text-[0.95rem] text-ink">{point}</span>
                </li>
              ))}
            </ul>
            <Link href="/shop/bangles" className="btn btn-primary mt-9 px-7 py-3.5 text-sm">
              See the wall
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
