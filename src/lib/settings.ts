/** The owner's delivery rule, stored in the site_settings table.
 *
 *  fee       Rs. charged for delivery. Empty means "not decided": the shop
 *            says delivery is confirmed by phone and adds nothing.
 *  freeOver  Orders at or above this amount are delivered free. Optional. */
export type DeliverySettings = {
  fee: number | null;
  freeOver: number | null;
};

export const NO_DELIVERY_SETTINGS: DeliverySettings = { fee: null, freeOver: null };

export function parseDelivery(value: unknown): DeliverySettings {
  const v = (value ?? {}) as { fee?: unknown; free_over?: unknown };
  const num = (x: unknown) =>
    typeof x === "number" && Number.isFinite(x) && x >= 0 ? x : null;
  return { fee: num(v.fee), freeOver: num(v.free_over) };
}

/** What delivery costs for a basket, and the sentence to show about it. */
export function quoteDelivery(subtotal: number, s: DeliverySettings) {
  if (s.fee === null) {
    return {
      amount: null as number | null,
      text: "Delivery is confirmed when we call you.",
    };
  }
  if (s.freeOver !== null && subtotal >= s.freeOver) {
    return { amount: 0, text: "Free delivery on this order." };
  }
  const hint =
    s.freeOver !== null
      ? ` Free on orders from Rs. ${s.freeOver.toLocaleString("en-PK")}.`
      : "";
  return { amount: s.fee, text: `Delivery across Pakistan.${hint}` };
}
