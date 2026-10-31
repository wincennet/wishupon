import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES } from "@/lib/categories";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("id, created_at")
    .eq("is_active", true);

  const fixed = ["", "/about", "/contact", "/shipping-returns", "/privacy", "/terms"].map(
    (path) => ({ url: `${SITE_URL}${path}` })
  );
  const ranges = CATEGORIES.map((c) => ({ url: `${SITE_URL}/shop/${c.id}` }));
  const pieces = (data ?? []).map((p) => ({
    url: `${SITE_URL}/piece/${p.id}`,
    lastModified: p.created_at,
  }));

  return [...fixed, ...ranges, ...pieces];
}
