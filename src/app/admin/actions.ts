"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/lib/types";
import { EXTENDED_SCHEMA } from "@/lib/features";

/** Every action re-checks the session. Row-level security would block an
 *  unauthenticated write anyway, but failing here gives a clear error rather
 *  than a silent no-op. */
async function requireClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

function refreshShop() {
  revalidatePath("/", "layout");
}

export async function saveProduct(formData: FormData) {
  const supabase = await requireClient();

  const id = formData.get("id") as string | null;
  const images = String(formData.get("image_urls") ?? "")
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const list = (key: string) =>
    String(formData.get(key) ?? "")
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

  // Only written once the 0002 migration has added the columns; writing them
  // earlier would make Supabase reject the whole save.
  const extras = EXTENDED_SCHEMA
    ? {
        sizes: list("sizes"),
        colors: list("colors"),
        old_price: formData.get("old_price")
          ? Number(formData.get("old_price"))
          : null,
        is_new: formData.get("is_new") === "on",
        is_bestseller: formData.get("is_bestseller") === "on",
      }
    : {};

  const record: Record<string, unknown> = {
    ...extras,
    name: String(formData.get("name")).trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    price: Number(formData.get("price")),
    category: String(formData.get("category")),
    stock_qty: Number(formData.get("stock_qty")),
    image_urls: images,
    is_active: formData.get("is_active") === "on",
  };

  if (id) {
    await supabase.from("products").update(record).eq("id", id);
  } else {
    // A repeated tap or a retried request sends the same piece again. Skip it
    // if an identical one was added in the last two minutes.
    const since = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    const { data: twin } = await supabase
      .from("products")
      .select("id")
      .eq("name", record.name as string)
      .eq("price", record.price as number)
      .eq("category", record.category as string)
      .gte("created_at", since)
      .limit(1);
    if (!twin || twin.length === 0) {
      await supabase.from("products").insert(record);
    }
  }

  refreshShop();
  redirect("/admin");
}

/** Remove a piece for good. Orders keep their own copy of what was bought, so
 *  past orders are not affected. The confirm step lives on the pieces page. */
export async function deleteProduct(formData: FormData) {
  const supabase = await requireClient();
  await supabase.from("products").delete().eq("id", String(formData.get("id")));
  refreshShop();
  revalidatePath("/admin");
}

/** Stock in / stock out, the two buttons she will press most often. */
export async function adjustStock(formData: FormData) {
  const supabase = await requireClient();

  const id = String(formData.get("id"));
  const delta = Number(formData.get("delta"));

  const { data } = await supabase
    .from("products")
    .select("stock_qty")
    .eq("id", id)
    .single();

  if (data) {
    await supabase
      .from("products")
      .update({ stock_qty: Math.max(0, data.stock_qty + delta) })
      .eq("id", id);
  }

  refreshShop();
}

/** Sell out or restock in one press. Kept separate from adjustStock so the
 *  owner never has to press minus five times to take something off sale. */
export async function setStock(formData: FormData) {
  const supabase = await requireClient();
  await supabase
    .from("products")
    .update({ stock_qty: Math.max(0, Number(formData.get("stock_qty"))) })
    .eq("id", String(formData.get("id")));
  refreshShop();
}

/** Archive rather than delete: an order's line items reference this piece,
 *  and its history should not lose the product it points at. */
export async function archiveProduct(formData: FormData) {
  const supabase = await requireClient();
  await supabase
    .from("products")
    .update({ is_active: false })
    .eq("id", String(formData.get("id")));
  refreshShop();
}

export async function restoreProduct(formData: FormData) {
  const supabase = await requireClient();
  await supabase
    .from("products")
    .update({ is_active: true })
    .eq("id", String(formData.get("id")));
  refreshShop();
}

export async function setOrderStatus(formData: FormData) {
  const supabase = await requireClient();
  await supabase
    .from("orders")
    .update({ status: String(formData.get("status")) as OrderStatus })
    .eq("id", String(formData.get("id")));
  revalidatePath("/admin/orders");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/** Approve a piece of feedback so it appears on the shop. */
export async function approveFeedback(formData: FormData) {
  const supabase = await requireClient();
  await supabase
    .from("feedback")
    .update({ approved: true })
    .eq("id", String(formData.get("id")));
  revalidatePath("/admin/feedback");
  revalidatePath("/");
}

export async function deleteFeedback(formData: FormData) {
  const supabase = await requireClient();
  await supabase.from("feedback").delete().eq("id", String(formData.get("id")));
  revalidatePath("/admin/feedback");
  revalidatePath("/");
}

/** Delete an order for good. Used for test orders and mistakes; the confirm
 *  step lives in the orders page so it can not be pressed by accident. */
export async function deleteOrder(formData: FormData) {
  const supabase = await requireClient();
  await supabase.from("orders").delete().eq("id", String(formData.get("id")));
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}

/** Save the delivery rule. Blank fields mean "not set". */
export async function saveDelivery(formData: FormData) {
  const supabase = await requireClient();

  const num = (key: string) => {
    const raw = String(formData.get(key) ?? "").trim();
    if (raw === "") return null;
    const n = Number(raw);
    return Number.isFinite(n) && n >= 0 ? Math.round(n) : null;
  };

  await supabase.from("site_settings").upsert({
    key: "delivery",
    value: { fee: num("fee"), free_over: num("free_over") },
    updated_at: new Date().toISOString(),
  });

  revalidatePath("/", "layout");
  redirect("/admin/settings?saved=1");
}
