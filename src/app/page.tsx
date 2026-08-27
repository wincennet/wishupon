import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Hero } from "@/components/hero/Hero";
import { PieceCard } from "@/components/shop/PieceCard";
import type { Product } from "@/lib/types";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true })
    .limit(8);

  const pieces = (data ?? []) as Product[];

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />

        <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[0.7rem] uppercase tracking-[0.2em] text-primary/75">
                On the wall
              </p>
              <h2 className="mt-2 font-display text-2xl tracking-tight text-ink sm:text-3xl">
                Ready to post
              </h2>
            </div>
            <Link
              href="/shop/beaded-accessories"
              className="shrink-0 text-[0.85rem] text-primary underline underline-offset-4 hover:text-primary-dark"
            >
              See all
            </Link>
          </div>

          {pieces.length > 0 ? (
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4">
              {pieces.map((piece, i) => (
                <PieceCard key={piece.id} product={piece} index={i} />
              ))}
            </div>
          ) : (
            <p className="mt-10 text-[0.9rem] text-ink-soft">
              New pieces are being photographed. Check back shortly.
            </p>
          )}
        </section>

        {/* The three things that are actually true about this shop, stated
            plainly. No invented reviews, no fabricated credentials. */}
        <section className="border-y border-neutral/60 bg-neutral-soft">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-14 sm:grid-cols-3 sm:px-6">
            {[
              {
                title: "Made to order",
                body: "Tell us the colours and your wrist size. We string it for you.",
              },
              {
                title: "One of a kind",
                body: "Each piece is made once. When a card comes off the wall, it is gone.",
              },
              {
                title: "Everyday prices",
                body: "Handmade should be wearable on a Tuesday, not saved for weddings.",
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="font-display text-lg text-primary">{item.title}</h3>
                <p className="mt-2 text-[0.86rem] leading-relaxed text-ink-soft">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
