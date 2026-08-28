import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PieceCard } from "@/components/shop/PieceCard";
import { CATEGORIES, categoryOf, isCategory } from "@/lib/categories";
import type { Product } from "@/lib/types";
import { whatsappLink } from "@/lib/constants";

export const revalidate = 60;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.id }));
}

export default async function CategoryPage({
  params,
}: PageProps<"/shop/[category]">) {
  const { category } = await params;
  if (!isCategory(category)) notFound();

  const range = categoryOf(category);

  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("category", range.id)
    .order("created_at", { ascending: true });

  const pieces = (data ?? []) as Product[];

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <header className="board-ground border-b border-ink/10">
          <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="h-2 w-2 rounded-full"
                style={{ background: range.accent }}
              />
              <span className="font-display text-[0.66rem] uppercase tracking-[0.2em] text-ink-soft">
                The wall
              </span>
            </div>
            <h1 className="mt-2 font-serif text-3xl tracking-tight text-ink sm:text-4xl">
              {range.label}
            </h1>
            <p className="mt-3 max-w-xl text-[0.92rem] leading-relaxed text-ink-soft">
              {range.blurb}
            </p>
          </div>
        </header>

        <div className="board-ground">
          <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16 2xl:max-w-7xl">
            {pieces.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 sm:gap-x-7 lg:grid-cols-4">
                {pieces.map((piece, i) => (
                  <PieceCard key={piece.id} product={piece} index={i} />
                ))}
              </div>
            ) : (
              /* An empty range is a real state, not an error: one of these is
                 made to order by definition, and the rest are still being
                 photographed. Say which, and give her a way to ask rather
                 than a dead end. */
              <div className="mx-auto max-w-md rounded-[3px] bg-background px-6 py-10 text-center shadow-[var(--shadow-card)]">
                <h2 className="font-serif text-xl text-ink">
                  {range.madeToOrder
                    ? "Made just for you"
                    : "Being photographed now"}
                </h2>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-ink-soft">
                  {range.madeToOrder
                    ? "Tell us the colours, the size and when you need it, and we will send you a price."
                    : "These pieces are made but not yet shot. Message us and we will send photos of what is available today."}
                </p>
                <a
                  href={whatsappLink(
                    range.madeToOrder
                      ? "Assalam o alaikum! I'd like to order a custom piece."
                      : `Assalam o alaikum! Can you send me photos of your ${range.label.toLowerCase()}?`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 text-[0.88rem] font-medium text-background transition-colors hover:bg-primary-dark"
                >
                  Ask on WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
