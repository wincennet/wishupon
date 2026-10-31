import type { Metadata } from "next";
import { PolicyPage } from "@/components/layout/PolicyPage";
import { WHATSAPP_DISPLAY, whatsappLink } from "@/lib/constants";

export const metadata: Metadata = { title: "Contact — WishUpon" };

export default function ContactPage() {
  return (
    <PolicyPage
      title="Contact"
      intro="The quickest way to reach us is WhatsApp."
    >
      <section>
        <a
          href={whatsappLink("Assalam o alaikum! I have a question about WishUpon.")}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-12 items-center rounded-full bg-primary px-7 font-medium text-background transition-colors hover:bg-primary-dark"
        >
          WhatsApp {WHATSAPP_DISPLAY}
        </a>
      </section>
      <section>
        <h2>Custom pieces</h2>
        <p>
          Tell us the colours, the size and when you need it, and we will send
          you a price.
        </p>
      </section>
    </PolicyPage>
  );
}
