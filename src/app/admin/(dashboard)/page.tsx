import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";
import { CATEGORY_LABELS, type Product } from "@/lib/types";
import { adjustStock, archiveProduct, restoreProduct } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("is_active", { ascending: false })
    .order("created_at", { ascending: true });

  const products = (data ?? []) as Product[];
  const live = products.filter((p) => p.is_active);
  const soldOut = live.filter((p) => p.stock_qty === 0).length;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl tracking-tight text-ink">
            My pieces
          </h1>
          <p className="mt-1 text-[0.85rem] text-ink-soft">
            {live.length} on the shop
            {soldOut > 0 && ` · ${soldOut} showing as sold`}
          </p>
        </div>

        <Link
          href="/admin/pieces/new"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 text-[0.88rem] font-medium text-background transition-colors hover:bg-primary-dark"
        >
          + Add a piece
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="mt-8 rounded-[2px] bg-background p-10 text-center shadow-[var(--shadow-card)]">
          <p className="font-display text-lg text-ink">No pieces yet.</p>
          <p className="mt-1.5 text-[0.87rem] text-ink-soft">
            Add your first piece and it will appear on the shop straight away.
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {products.map((product) => (
            <li
              key={product.id}
              className={`rounded-[2px] bg-background p-3 shadow-[var(--shadow-card)] ${
                product.is_active ? "" : "opacity-60"
              }`}
            >
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[2px] bg-neutral-soft">
                  <Image
                    src={product.image_urls[0] ?? "/placeholder-piece.svg"}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-[0.95rem] text-ink">
                    {product.name}
                  </p>
                  <p className="mt-0.5 text-[0.78rem] text-ink-soft">
                    {CATEGORY_LABELS[product.category]} ·{" "}
                    {formatPrice(product.price)}
                    {!product.is_active && " · hidden from shop"}
                  </p>
                </div>

                {/* Stock in / stock out — the two most-used controls, kept
                    big and unmistakable for a non-technical owner. */}
                <div className="flex items-center gap-2">
                  <form action={adjustStock}>
                    <input type="hidden" name="id" value={product.id} />
                    <input type="hidden" name="delta" value="-1" />
                    <button
                      type="submit"
                      disabled={product.stock_qty === 0}
                      aria-label={`Reduce stock of ${product.name}`}
                      className="h-9 w-9 rounded-full border border-neutral text-lg leading-none text-ink transition-colors hover:border-primary hover:text-primary disabled:opacity-35"
                    >
                      −
                    </button>
                  </form>

                  <div className="min-w-[4.5rem] text-center">
                    <p className="font-display text-lg tabular-nums text-ink">
                      {product.stock_qty}
                    </p>
                    <p className="text-[0.65rem] uppercase tracking-[0.1em] text-ink-soft">
                      {product.stock_qty === 0 ? "Sold out" : "in stock"}
                    </p>
                  </div>

                  <form action={adjustStock}>
                    <input type="hidden" name="id" value={product.id} />
                    <input type="hidden" name="delta" value="1" />
                    <button
                      type="submit"
                      aria-label={`Add stock of ${product.name}`}
                      className="h-9 w-9 rounded-full border border-neutral text-lg leading-none text-ink transition-colors hover:border-primary hover:text-primary"
                    >
                      +
                    </button>
                  </form>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/pieces/${product.id}`}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-neutral px-4 text-[0.82rem] text-ink transition-colors hover:border-primary hover:text-primary"
                  >
                    Edit
                  </Link>

                  <form action={product.is_active ? archiveProduct : restoreProduct}>
                    <input type="hidden" name="id" value={product.id} />
                    <button
                      type="submit"
                      className="inline-flex min-h-11 items-center justify-center rounded-full px-3 text-[0.82rem] text-ink-soft underline underline-offset-2 hover:text-primary"
                    >
                      {product.is_active ? "Hide" : "Show again"}
                    </button>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
