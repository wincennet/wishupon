import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WHATSAPP_DISPLAY, whatsappLink } from "@/lib/constants";

/** Deliberately does not read the order back from the database. Orders hold
 *  a name, phone, and home address, and the row-level security policy keeps
 *  them readable only by the signed-in shop owner. Showing the reference is
 *  enough to reassure the buyer without putting customer details on a URL
 *  anyone could open. */
export default async function OrderPlacedPage({
  params,
}: PageProps<"/order/[id]">) {
  const { id } = await params;
  const reference = id.slice(0, 8).toUpperCase();

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-neutral">
        <div className="mx-auto w-full max-w-lg px-4 py-14 sm:px-6 sm:py-20">
          <div className="rounded-[2px] bg-background p-7 text-center shadow-[var(--shadow-card-lifted)] sm:p-9">
            <p className="text-[0.7rem] uppercase tracking-[0.2em] text-primary/75">
              Order placed
            </p>

            <h1 className="mt-3 font-display text-2xl leading-tight tracking-tight text-ink sm:text-3xl">
              Thank you — we have your order.
            </h1>

            <p className="mt-4 text-[0.9rem] leading-relaxed text-ink-soft">
              We will call you on the number you gave us to confirm your order
              and the delivery charges, then post it to you.
            </p>

            <div className="mt-6 rounded-[2px] border border-neutral bg-neutral-soft/60 px-4 py-3">
              <p className="text-[0.72rem] uppercase tracking-[0.14em] text-ink-soft">
                Your reference
              </p>
              <p className="mt-1 font-display text-xl tabular-nums tracking-wide text-primary">
                {reference}
              </p>
            </div>

            <p className="mt-5 text-[0.82rem] leading-relaxed text-ink-soft">
              Keep this reference. Message it to us on WhatsApp
              ({WHATSAPP_DISPLAY}) if you need to change anything.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a
                href={whatsappLink(
                  `Assalam o alaikum! I just placed order ${reference}.`
                )}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 text-[0.88rem] font-medium text-background transition-colors hover:bg-primary-dark"
              >
                Message us
              </a>
              <Link
                href="/shop/bangles"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-primary/35 px-6 text-[0.88rem] text-primary transition-colors hover:bg-primary hover:text-background"
              >
                Keep looking
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
