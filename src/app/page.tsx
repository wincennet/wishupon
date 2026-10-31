import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WallStage } from "@/components/shop/WallStage";
import { HomeHero } from "@/components/hero/HomeHero";
import { RangeSwatches } from "@/components/shop/RangeSwatches";
import { BrandStory } from "@/components/shop/BrandStory";
import { ProductRow } from "@/components/shop/ProductRow";
import { FeedbackSection } from "@/components/shop/FeedbackSection";
import { EXTENDED_SCHEMA } from "@/lib/features";
import type { Feedback, Product } from "@/lib/types";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  const pieces = (data ?? []) as Product[];

  // Both need the 0002 migration; with it off they simply do not appear.
  const approved: Feedback[] = [];
  if (EXTENDED_SCHEMA) {
    const { data: fb } = await supabase
      .from("feedback")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(6);
    approved.push(...((fb ?? []) as Feedback[]));
  }
  const inStock = pieces.filter((p) => p.stock_qty > 0);
  const newest = EXTENDED_SCHEMA ? inStock.filter((p) => p.is_new) : [];
  const bestsellers = EXTENDED_SCHEMA ? inStock.filter((p) => p.is_bestseller) : [];

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <HomeHero />
        <RangeSwatches />
        <ProductRow
          title="New arrivals"
          blurb="Just strung and ready to post."
          pieces={newest}
        />
        <ProductRow
          title="Best sellers"
          blurb="The pieces people ask for most."
          pieces={bestsellers}
        />
        <WallStage products={pieces} />
        <BrandStory />
        {EXTENDED_SCHEMA && <FeedbackSection approved={approved} />}
      </main>
      <SiteFooter />
    </>
  );
}
