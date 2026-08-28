import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WHATSAPP_DISPLAY, whatsappLink } from "@/lib/constants";

export const metadata = {
  title: "About & custom orders — WishUpon",
  description:
    "WishUpon is handmade beaded and steel accessories, made to order in Pakistan. Tell us your colours and wrist size.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-neutral">
        <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="rounded-[2px] bg-background p-7 shadow-[var(--shadow-card)] sm:p-10">
            <p className="text-[0.7rem] uppercase tracking-[0.2em] text-primary/75">
              About
            </p>
            <h1 className="mt-2 font-display text-3xl leading-tight tracking-tight text-ink">
              Made one at a time.
            </h1>

            <div className="mt-6 space-y-4 text-[0.94rem] leading-relaxed text-ink-soft">
              <p>
                WishUpon is a small handmade accessories workshop in Pakistan.
                Every bracelet is strung by hand — bead by bead, cluster by
                cluster — which is why no two ever come out quite the same.
              </p>
              <p>
                Because each piece is made individually, most of what you see on
                the wall exists only once. When a card comes off the wall, that
                exact piece is gone. But almost anything can be made again in
                your colours.
              </p>
            </div>

            <h2 className="mt-10 font-display text-xl text-ink">
              Ordering something custom
            </h2>
            <p className="mt-2.5 text-[0.9rem] leading-relaxed text-ink-soft">
              Message us on WhatsApp with three things and we will send you a
              price and a timeline:
            </p>
            <ol className="mt-4 space-y-2.5 text-[0.9rem] text-ink-soft">
              {[
                "The colours you want — or a photo of the outfit it needs to match.",
                "Your wrist size, or the length in inches if you know it.",
                "When you need it by.",
              ].map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[0.72rem] font-medium tabular-nums text-primary">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>

            <a
              href={whatsappLink(
                "Assalam o alaikum! I'd like to order a custom piece."
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center mt-7 rounded-full bg-primary px-6 text-[0.9rem] font-medium text-background transition-colors hover:bg-primary-dark"
            >
              WhatsApp {WHATSAPP_DISPLAY}
            </a>

            <h2 className="mt-10 font-display text-xl text-ink">
              Delivery &amp; payment
            </h2>
            <div className="mt-2.5 space-y-3 text-[0.9rem] leading-relaxed text-ink-soft">
              <p>
                We post anywhere in Pakistan through TCS and similar couriers.
                Delivery charges are confirmed on the phone when we call about
                your order, so there are no surprises at the door.
              </p>
              <p>
                You can pay cash on delivery, or by bank transfer if you prefer —
                we share the account details when we call.
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
