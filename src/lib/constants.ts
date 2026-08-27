export const BRAND = {
  name: "WishUpon",
  tagline: "Handmade, one at a time",
} as const;

/** Client's WhatsApp, in wa.me format (digits only, country code, no +). */
export const WHATSAPP_NUMBER = "923204605065";
export const WHATSAPP_DISPLAY = "+92 320 4605065";

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Delivery is by courier (TCS and similar). No flat fee has been decided, so
 *  the site must not invent one — it states the arrangement honestly instead
 *  of showing a number that would be wrong at the door. */
export const DELIVERY = {
  courier: "TCS & similar couriers",
  note: "Delivered anywhere in Pakistan by courier. Delivery charges are confirmed when we call you to verify your order.",
  fee: null as number | null,
} as const;
