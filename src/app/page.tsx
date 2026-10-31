import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WallStage } from "@/components/shop/WallStage";
import { HomeHero } from "@/components/hero/HomeHero";
import { RangeSwatches } from "@/components/shop/RangeSwatches";
import { BrandStory } from "@/components/shop/BrandStory";
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
        <HomeHero />
        <RangeSwatches />
        <WallStage products={pieces} />
        <BrandStory />
      </main>
      <SiteFooter />
    </>
  );
}
