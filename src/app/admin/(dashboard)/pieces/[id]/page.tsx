import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/ProductForm";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditPiecePage({
  params,
}: PageProps<"/admin/pieces/[id]">) {
  const { id } = await params;

  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  return (
    <div className="mx-auto max-w-2xl rounded-[2px] bg-background p-6 shadow-[var(--shadow-card)] sm:p-8">
      <h1 className="font-display text-2xl tracking-tight text-ink">
        Edit piece
      </h1>
      <p className="mt-1 text-[0.85rem] text-ink-soft">
        Changes show on the shop straight away.
      </p>
      <ProductForm product={data as Product} />
    </div>
  );
}
