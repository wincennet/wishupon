import Link from "next/link";
import Image from "next/image";
import { CATEGORIES } from "@/lib/categories";
import { BRAND, DELIVERY, WHATSAPP_DISPLAY, whatsappLink } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-ink/10 bg-background">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <Image
            src="/logo/wordmark.png"
            alt={BRAND.name}
            width={524}
            height={258}
            className="h-12 w-auto"
          />
          <p className="mt-5 max-w-xs text-[0.88rem] leading-relaxed text-ink-soft">
            {BRAND.tagline}. Handmade beaded and steel accessories, made in
            Pakistan and posted to your door.
          </p>
          <a
            href={whatsappLink("Assalam o alaikum! I have a question about WishUpon.")}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline mt-5 inline-flex min-h-11 items-center text-[0.88rem] font-medium text-ink"
          >
            WhatsApp {WHATSAPP_DISPLAY}
          </a>
        </div>

        <div className="md:col-span-3">
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-ink-soft">
            Ranges
          </p>
          <ul className="mt-4 text-[0.9rem] text-ink">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/shop/${c.id}`}
                  className="flex min-h-11 items-center transition-colors hover:text-primary"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-ink-soft">
            Delivery &amp; payment
          </p>
          <p className="mt-4 max-w-xs text-[0.88rem] leading-relaxed text-ink-soft">
            {DELIVERY.note} Pay on delivery, or by bank transfer.
          </p>
        </div>
      </div>

      <div className="border-t border-ink/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 px-5 py-2 text-[0.78rem] text-ink-soft sm:px-8">
          <p className="py-3">
            © {new Date().getFullYear()} {BRAND.name}
          </p>
          <nav aria-label="Policies" className="flex flex-wrap">
            {[
              ["/about", "About"],
              ["/shipping-returns", "Delivery & returns"],
              ["/privacy", "Privacy"],
              ["/terms", "Terms"],
              ["/contact", "Contact"],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="flex min-h-11 items-center pr-5 transition-colors hover:text-primary"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
