import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";

/** Four numbers she looks at first: what has come in, how many orders, how
 *  many are waiting on her, and what has sold out. Cancelled orders are left
 *  out of the money total because that money never arrived. */
export async function AdminStats() {
  const supabase = await createClient();

  const [{ data: orders }, { count: soldOut }] = await Promise.all([
    supabase.from("orders").select("total_price, status"),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true)
      .eq("stock_qty", 0),
  ]);

  const all = orders ?? [];
  const live = all.filter((o) => o.status !== "cancelled");
  const revenue = live.reduce((sum, o) => sum + (o.total_price ?? 0), 0);
  const waiting = all.filter((o) => o.status === "pending").length;

  const stats = [
    { label: "Total orders value", value: formatPrice(revenue), note: "Cancelled orders left out" },
    { label: "Orders", value: String(all.length), note: "All time" },
    {
      label: "Waiting for you",
      value: String(waiting),
      note: waiting === 1 ? "order to confirm" : "orders to confirm",
      highlight: waiting > 0,
    },
    { label: "Sold out", value: String(soldOut ?? 0), note: "pieces showing as sold" },
  ];

  return (
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`rounded-xl border bg-background p-4 ${
            s.highlight ? "border-primary/40" : "border-ink/10"
          }`}
        >
          <dt className="text-[0.74rem] uppercase tracking-[0.14em] text-ink-soft">
            {s.label}
          </dt>
          <dd className="mt-2 font-serif text-[1.9rem] leading-none tabular-nums text-ink">
            {s.value}
          </dd>
          <p className="mt-1.5 text-[0.76rem] text-ink-soft">{s.note}</p>
        </div>
      ))}
    </dl>
  );
}
