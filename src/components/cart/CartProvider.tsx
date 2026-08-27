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

type CartContext = {
  items: OrderItem[];
  add: (product: Product) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
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
      add: (product) =>
        setItems((current) => {
          const existing = current.find((i) => i.product_id === product.id);
          if (existing) {
            // Never let the cart promise more than she has made.
            const capped = Math.min(existing.quantity + 1, product.stock_qty);
            return current.map((i) =>
              i.product_id === product.id ? { ...i, quantity: capped } : i
            );
          }
          return [
            ...current,
            {
              product_id: product.id,
              name: product.name,
              price: product.price,
              quantity: 1,
              image_url: product.image_urls[0] ?? null,
            },
          ];
        }),
      remove: (productId) =>
        setItems((current) => current.filter((i) => i.product_id !== productId)),
      setQuantity: (productId, quantity) =>
        setItems((current) =>
          quantity <= 0
            ? current.filter((i) => i.product_id !== productId)
            : current.map((i) =>
                i.product_id === productId ? { ...i, quantity } : i
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
