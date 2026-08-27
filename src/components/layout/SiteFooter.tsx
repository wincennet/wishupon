import Link from "next/link";
import { BRAND, DELIVERY, WHATSAPP_DISPLAY, whatsappLink } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-neutral/60 bg-neutral-soft">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-display text-lg text-primary">{BRAND.name}</p>
          <p className="mt-2 max-w-xs text-[0.82rem] leading-relaxed text-ink-soft">
            {BRAND.tagline}. Beaded and steel accessories, made by hand in
            Pakistan and posted anywhere in the country.
          </p>
        </div>

        <div>
          <h2 className="text-[0.7rem] uppercase tracking-[0.16em] text-ink-soft">
            Shop
          </h2>
          <ul className="mt-3 space-y-1.5 text-[0.85rem]">
            <li>
              <Link href="/shop/beaded-accessories" className="text-ink hover:text-primary">
                Beaded accessories
              </Link>
            </li>
            <li>
              <Link href="/shop/steel-bracelets" className="text-ink hover:text-primary">
                Steel bracelets
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-ink hover:text-primary">
                About &amp; custom orders
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-[0.7rem] uppercase tracking-[0.16em] text-ink-soft">
            Ask us anything
          </h2>
          <a
            href={whatsappLink("Assalam o alaikum! I have a question about WishUpon.")}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary/35 px-3.5 py-1.5 text-[0.82rem] text-primary transition-colors hover:bg-primary hover:text-background"
          >
            WhatsApp {WHATSAPP_DISPLAY}
          </a>
          <p className="mt-3 max-w-xs text-[0.78rem] leading-relaxed text-ink-soft">
            {DELIVERY.note}
          </p>
        </div>
      </div>

      <div className="border-t border-neutral/60 px-4 py-4 text-center text-[0.72rem] text-ink-soft sm:px-6">
        © {new Date().getFullYear()} {BRAND.name}. Every piece made by hand.
      </div>
    </footer>
  );
}
