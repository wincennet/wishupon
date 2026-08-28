"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/lib/types";

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

  const record = {
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
    await supabase.from("products").insert(record);
  }

  refreshShop();
  redirect("/admin");
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
