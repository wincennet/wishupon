import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatPrice } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";
import { setOrderStatus } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const FILTERS: { value: string; label: string }[] = [
  { value: "pending", label: "Needs your attention" },
  { value: "confirmed", label: "Confirmed" },
  { value: "fulfilled", label: "Posted" },
  { value: "all", label: "Everything" },
];

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-accent-soft text-primary",
  confirmed: "bg-primary text-background",
  fulfilled: "bg-neutral text-ink",
  cancelled: "bg-neutral-soft text-ink-soft line-through",
};

export default async function AdminOrdersPage({
  searchParams,
}: PageProps<"/admin/orders">) {
  const { status = "pending" } = await searchParams;
  const filter = typeof status === "string" ? status : "pending";

  const supabase = await createClient();
  let query = supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (filter !== "all") query = query.eq("status", filter);

  const { data } = await query;
  const orders = (data ?? []) as Order[];

  return (
    <>
      <h1 className="font-display text-2xl tracking-tight text-ink">Orders</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((option) => (
          <Link
            key={option.value}
            href={`/admin/orders?status=${option.value}`}
            className={`rounded-full px-4 py-2 text-[0.83rem] transition-colors ${
              filter === option.value
                ? "bg-primary text-background"
                : "border border-neutral text-ink hover:border-primary hover:text-primary"
            }`}
          >
            {option.label}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="mt-6 rounded-[2px] bg-background p-10 text-center shadow-[var(--shadow-card)]">
          <p className="font-display text-lg text-ink">Nothing here.</p>
          <p className="mt-1.5 text-[0.87rem] text-ink-soft">
            {filter === "pending"
              ? "No new orders waiting. You are all caught up."
              : "No orders in this list yet."}
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="rounded-[2px] bg-background p-5 shadow-[var(--shadow-card)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg text-ink">
                    {order.customer_name}
                  </p>
                  <p className="mt-0.5 text-[0.85rem] text-ink-soft">
                    <a
                      href={`tel:${order.phone}`}
                      className="text-primary underline underline-offset-2"
                    >
                      {order.phone}
                    </a>
                    {" · "}
                    {formatDate(order.created_at)}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-[0.72rem] uppercase tracking-[0.1em] ${STATUS_STYLES[order.status]}`}
                >
                  {order.status}
                </span>
              </div>

              <p className="mt-3 text-[0.87rem] leading-relaxed text-ink-soft">
                {order.address}
              </p>

              <ul className="mt-4 space-y-1.5 border-t border-neutral pt-3">
                {order.items.map((item) => (
                  <li
                    key={item.product_id}
                    className="flex justify-between gap-4 text-[0.87rem]"
                  >
                    <span className="text-ink">
                      {item.quantity} × {item.name}
                    </span>
                    <span className="shrink-0 tabular-nums text-ink-soft">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex items-center justify-between border-t border-neutral pt-3">
                <span className="text-[0.82rem] text-ink-soft">
                  {order.payment_method === "cod"
                    ? "Cash on delivery"
                    : "Bank transfer"}
                  {order.payment_reference && ` · ref ${order.payment_reference}`}
                </span>
                <span className="font-display text-lg tabular-nums text-primary">
                  {formatPrice(order.total_price)}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {order.status === "pending" && (
                  <>
                    <StatusButton id={order.id} status="confirmed" primary>
                      Confirm this order
                    </StatusButton>
                    <StatusButton id={order.id} status="cancelled">
                      Cancel
                    </StatusButton>
                  </>
                )}
                {order.status === "confirmed" && (
                  <StatusButton id={order.id} status="fulfilled" primary>
                    Mark as posted
                  </StatusButton>
                )}
                {order.status === "cancelled" && (
                  <StatusButton id={order.id} status="pending">
                    Put back to pending
                  </StatusButton>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function StatusButton({
  id,
  status,
  primary = false,
  children,
}: {
  id: string;
  status: OrderStatus;
  primary?: boolean;
  children: React.ReactNode;
}) {
  return (
    <form action={setOrderStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button
        type="submit"
        className={
          primary
            ? "rounded-full bg-primary px-5 py-2.5 text-[0.85rem] font-medium text-background transition-colors hover:bg-primary-dark"
            : "rounded-full border border-neutral px-5 py-2.5 text-[0.85rem] text-ink transition-colors hover:border-primary hover:text-primary"
        }
      >
        {children}
      </button>
    </form>
  );
}
