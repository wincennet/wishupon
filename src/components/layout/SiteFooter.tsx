import Link from "next/link";
import Image from "next/image";
import { CATEGORIES } from "@/lib/categories";
import { BRAND, DELIVERY, WHATSAPP_DISPLAY, whatsappLink } from "@/lib/constants";

/** The footer in the reference store's brand-colour band: about + links,
 *  categories, then shipping and payment. */
export function SiteFooter() {
  return (
    <footer className="mt-auto bg-primary text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <Image
            src="/logo/wordmark.png"
            alt={BRAND.name}
            width={524}
            height={258}
            className="h-12 w-auto brightness-0 invert"
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/80">
            {BRAND.tagline}. Handmade beaded and steel accessories, made in
            Pakistan and posted to your door.
          </p>
          <a
            href={whatsappLink("Assalam o alaikum! I have a question about WishUpon.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-4 text-sm transition hover:bg-white/20"
          >
            WhatsApp {WHATSAPP_DISPLAY}
          </a>
        </div>

        <div>
          <p className="mb-4 text-xs uppercase tracking-widest text-white/60">
            Explore
          </p>
          <ul className="space-y-1 text-sm text-white/85">
            {[
              ["/", "Home"],
              ["/shop/bangles", "Shop"],
              ["/about", "About & custom orders"],
              ["/cart", "Cart"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex min-h-11 items-center transition hover:text-white"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs uppercase tracking-widest text-white/60">
            Ranges
          </p>
          <ul className="space-y-1 text-sm text-white/85">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/shop/${c.id}`}
                  className="flex min-h-11 items-center transition hover:text-white"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs uppercase tracking-widest text-white/60">
            Delivery &amp; payment
          </p>
          <ul className="space-y-2 text-sm text-white/85">
            <li>{DELIVERY.note}</li>
            <li>Payment: cash on delivery, or bank transfer</li>
            <li>Every order is confirmed by phone before it ships</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/15 py-5 text-center text-xs text-white/60">
        © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
      </div>
    </footer>
  );
}
