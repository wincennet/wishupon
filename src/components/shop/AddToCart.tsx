"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { useFlyToCart } from "@/components/cart/FlyToCart";
import type { Product } from "@/lib/types";
import { whatsappLink } from "@/lib/constants";
import { categoryOf } from "@/lib/categories";
import { EXTENDED_SCHEMA } from "@/lib/features";

export function AddToCart({ product }: { product: Product }) {
  const { add, items } = useCart();
  const { fly } = useFlyToCart();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [added, setAdded] = useState(false);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");

  const sizes = EXTENDED_SCHEMA ? (product.sizes ?? []) : [];
  const colors = EXTENDED_SCHEMA ? (product.colors ?? []) : [];
  const needsSize = sizes.length > 0 && !size;
  const needsColor = colors.length > 0 && !color;

  const inCart = items
    .filter((i) => i.product_id === product.id)
    .reduce((n, i) => n + i.quantity, 0);
  const soldOut = product.stock_qty <= 0;
  const maxed = inCart >= product.stock_qty;

  if (soldOut) {
    return (
      <div className="rounded-[2px] border border-neutral bg-neutral-soft px-5 py-4">
        <p className="font-display text-[0.95rem] text-ink">
          This one has sold.
        </p>
        <p className="mt-1 text-[0.83rem] leading-relaxed text-ink-soft">
          Each piece is made once — but we can string you the same colours.
        </p>
        <a
          href={whatsappLink(
            `Assalam o alaikum! Can you make me another "${product.name}"?`
          )}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-[0.85rem] font-medium text-background transition-colors hover:bg-primary-dark"
        >
          Request this piece
        </a>
      </div>
    );
  }

  const prompt =
    needsSize && needsColor
      ? "Choose a size and colour"
      : needsSize
        ? "Choose a size"
        : needsColor
          ? "Choose a colour"
          : "";

  return (
    <div>
      <Pills label="Size" values={sizes} value={size} onPick={setSize} />
      <Pills label="Colour" values={colors} value={color} onPick={setColor} />

      <div className="flex flex-wrap items-center gap-3">
        <button
          ref={buttonRef}
          type="button"
          disabled={maxed || Boolean(prompt)}
          onClick={() => {
            add(product, {
              size: size || undefined,
              color: color || undefined,
            });
            setAdded(true);
            // The beads that fly are this piece's own colours, so the burst
            // reads as the object moving rather than generic confetti.
            if (buttonRef.current) {
              fly(buttonRef.current, categoryOf(product.category).beads);
            }
          }}
          className="inline-flex min-h-12 items-center rounded-full bg-primary px-7 text-[0.92rem] font-medium text-background transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-45"
        >
          {maxed
            ? "All of them are in your cart"
            : prompt || "Add to cart"}
        </button>

        {added && (
          <Link
            href="/cart"
            className="inline-flex min-h-12 items-center rounded-full border border-primary/35 px-6 text-[0.9rem] text-primary transition-colors hover:bg-primary hover:text-background"
          >
            Go to cart
          </Link>
        )}
      </div>

      <p className="mt-3 text-[0.8rem] text-ink-soft">
        {product.stock_qty === 1
          ? "Only one of these exists."
          : `${product.stock_qty} available.`}
        {inCart > 0 && ` ${inCart} in your cart.`}
      </p>
    </div>
  );
}

function Pills({
  label,
  values,
  value,
  onPick,
}: {
  label: string;
  values: string[];
  value: string;
  onPick: (v: string) => void;
}) {
  if (values.length === 0) return null;
  return (
    <fieldset className="mb-4">
      <legend className="text-[0.8rem] font-medium text-ink">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {values.map((v) => (
          <button
            key={v}
            type="button"
            aria-pressed={value === v}
            onClick={() => onPick(v)}
            className={`min-h-11 rounded-full border px-4 text-[0.82rem] transition-colors ${
              value === v
                ? "border-primary bg-primary text-background"
                : "border-neutral bg-background text-ink hover:border-primary/50"
            }`}
          >
            {v}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
