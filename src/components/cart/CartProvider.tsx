"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { OrderItem, Product } from "@/lib/types";

/** A cart line is a piece plus the size and colour chosen for it, so the same
 *  bracelet in two colours is two lines. */
export function lineKey(i: Pick<OrderItem, "product_id" | "size" | "color">) {
  return `${i.product_id}|${i.size ?? ""}|${i.color ?? ""}`;
}

export type LineOptions = { size?: string; color?: string };

type CartContext = {
  items: OrderItem[];
  add: (product: Product, options?: LineOptions) => void;
  remove: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clear: () => void;
  total: number;
  count: number;
  ready: boolean;
};

const Cart = createContext<CartContext | null>(null);

const STORAGE_KEY = "wishupon-cart";

/** The cart lives in localStorage, not the database: a shopper should never
 *  have to sign up to buy. It only becomes a database row at checkout. */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // Corrupt or unavailable storage should not break the shop.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const value = useMemo<CartContext>(() => {
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const count = items.reduce((sum, i) => sum + i.quantity, 0);

    return {
      items,
      total,
      count,
      ready,
      add: (product, options = {}) =>
        setItems((current) => {
          const line = {
            product_id: product.id,
            size: options.size,
            color: options.color,
          };
          const key = lineKey(line);
          const existing = current.find((i) => lineKey(i) === key);
          // Never let the cart promise more of a piece than she has made,
          // counting every colour and size of it together.
          const inCart = current
            .filter((i) => i.product_id === product.id)
            .reduce((n, i) => n + i.quantity, 0);
          if (inCart >= product.stock_qty) return current;

          if (existing) {
            return current.map((i) =>
              lineKey(i) === key ? { ...i, quantity: i.quantity + 1 } : i
            );
          }
          return [
            ...current,
            {
              ...line,
              name: product.name,
              price: product.price,
              quantity: 1,
              image_url: product.image_urls[0] ?? null,
            },
          ];
        }),
      remove: (key) =>
        setItems((current) => current.filter((i) => lineKey(i) !== key)),
      setQuantity: (key, quantity) =>
        setItems((current) =>
          quantity <= 0
            ? current.filter((i) => lineKey(i) !== key)
            : current.map((i) =>
                lineKey(i) === key ? { ...i, quantity } : i
              )
        ),
      clear: () => setItems([]),
    };
  }, [items, ready]);

  return <Cart.Provider value={value}>{children}</Cart.Provider>;
}

export function useCart() {
  const context = useContext(Cart);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
