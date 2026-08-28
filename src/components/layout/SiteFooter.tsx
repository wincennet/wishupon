import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { BRAND, DELIVERY, WHATSAPP_DISPLAY, whatsappLink } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-neutral/60 bg-neutral-soft">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6 2xl:max-w-7xl">
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
          <ul className="mt-1 text-[0.85rem]">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/shop/${c.id}`}
                  className="flex min-h-11 items-center text-ink hover:text-primary"
                >
                  {c.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/about" className="flex min-h-11 items-center text-ink hover:text-primary">
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
            className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/35 px-4 text-[0.82rem] text-primary transition-colors hover:bg-primary hover:text-background"
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
