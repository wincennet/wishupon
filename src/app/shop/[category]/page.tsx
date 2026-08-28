import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PieceCard } from "@/components/shop/PieceCard";
import { CATEGORY_LABELS, type Category, type Product } from "@/lib/types";
import { whatsappLink } from "@/lib/constants";

export const revalidate = 60;

const BLURBS: Record<Category, string> = {
  "beaded-accessories":
    "Crystal and glass beads, strung and clustered by hand on gold-tone wire. Bracelets are ready now; earrings and necklaces are being photographed.",
  "steel-bracelets":
    "Steel and metal pieces, built to be worn every day and not tarnish. These are being photographed now.",
};

export function generateStaticParams() {
  return [{ category: "beaded-accessories" }, { category: "steel-bracelets" }];
}

export default async function CategoryPage({
  params,
}: PageProps<"/shop/[category]">) {
  const { category } = await params;

  if (!(category in CATEGORY_LABELS)) notFound();
  const key = category as Category;

  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("category", key)
    .order("created_at", { ascending: true });

  const pieces = (data ?? []) as Product[];

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <header className="board-ground border-b border-ink/10">
          <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
            <h1 className="mt-2 font-display text-3xl tracking-tight text-ink sm:text-4xl">
              {CATEGORY_LABELS[key]}
            </h1>
            <p className="mt-3 max-w-xl text-[0.9rem] leading-relaxed text-ink-soft">
              {BLURBS[key]}
            </p>
          </div>
        </header>

        <div className="board-ground"><div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          {pieces.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4">
              {pieces.map((piece, i) => (
                <PieceCard key={piece.id} product={piece} index={i} />
              ))}
            </div>
          ) : (
            /* An empty category is a real state here, not an error: two of the
               four sub-ranges genuinely have no photographs yet. Say so, and
               give her a way to ask rather than a dead end. */
            <div className="mx-auto max-w-md rounded-[2px] border border-neutral bg-background px-6 py-10 text-center shadow-[var(--shadow-card)]">
              <h2 className="font-display text-xl text-ink">
                Being photographed now
              </h2>
              <p className="mt-2 text-[0.88rem] leading-relaxed text-ink-soft">
                These pieces are made but not yet shot. Message us and we&rsquo;ll
                send you photos of what is available today.
              </p>
              <a
                href={whatsappLink(
                  `Assalam o alaikum! Can you send me photos of your ${CATEGORY_LABELS[key].toLowerCase()}?`
                )}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center mt-6 rounded-full bg-primary px-6 text-[0.88rem] font-medium text-background transition-colors hover:bg-primary-dark"
              >
                Ask on WhatsApp
              </a>
            </div>
          )}
        </div></div>
      </main>
      <SiteFooter />
    </>
  );
}
