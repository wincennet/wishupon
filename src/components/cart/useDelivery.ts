"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  NO_DELIVERY_SETTINGS,
  parseDelivery,
  quoteDelivery,
  type DeliverySettings,
} from "@/lib/settings";

/** Reads the owner's delivery rule and prices a basket against it. If the
 *  settings table is missing or empty the shop behaves exactly as before:
 *  nothing is added and delivery is confirmed by phone. */
export function useDelivery(subtotal: number) {
  const [settings, setSettings] = useState<DeliverySettings>(NO_DELIVERY_SETTINGS);

  useEffect(() => {
    let cancelled = false;
    createClient()
      .from("site_settings")
      .select("value")
      .eq("key", "delivery")
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled && data) setSettings(parseDelivery(data.value));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const quote = quoteDelivery(subtotal, settings);
  return { ...quote, total: subtotal + (quote.amount ?? 0) };
}
