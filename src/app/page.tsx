import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WallStage } from "@/components/shop/WallStage";
import type { Product } from "@/lib/types";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  const pieces = (data ?? []) as Product[];

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <WallStage products={pieces} />

        {/* The three things that are actually true about this shop, stated
            plainly. No invented reviews, no fabricated credentials. */}
        <section className="border-t border-ink/8 bg-neutral-soft">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-16 sm:grid-cols-3 sm:px-6">
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
                <h3 className="font-serif text-xl text-primary">{item.title}</h3>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-ink-soft">
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
