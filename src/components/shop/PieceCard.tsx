"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { categoryOf, colourOf } from "@/lib/categories";
import { useShopUi } from "./ShopUi";
import { EXTENDED_SCHEMA } from "@/lib/features";

/** One piece as a clean gallery card: a tall soft-cornered photograph with its
 *  name, colour and price underneath. The photograph does all the work, so
 *  nothing sits on top of it except two small buttons and, when needed, a tag.
 *
 *  `index` and `featured` are kept so existing callers need no change. */
export function PieceCard({
  product,
}: {
  product: Product;
  index?: number;
  featured?: boolean;
}) {
  const { inWishlist, toggleWishlist, openQuickView } = useShopUi();
  const saved = inWishlist(product.id);

  const soldOut = product.stock_qty <= 0;
  const category = categoryOf(product.category);
  const colour = colourOf(product.name);
  const onSale =
    EXTENDED_SCHEMA && !!product.old_price && product.old_price > product.price;
  const tag = !EXTENDED_SCHEMA
    ? null
    : product.is_new
      ? "New"
      : product.is_bestseller
        ? "Bestseller"
        : null;

  return (
    <article className="group relative">
      <Link
        href={`/piece/${product.id}`}
        className="block rounded-[22px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-neutral-soft shadow-[0_18px_36px_-22px_rgba(42,27,61,0.55)] transition-shadow duration-500 group-hover:shadow-[0_28px_48px_-24px_rgba(42,27,61,0.6)]">
          <Image
            src={product.image_urls[0] ?? "/placeholder-piece.svg"}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 46vw, (max-width: 1024px) 31vw, 22vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            style={{
              filter: soldOut
                ? "saturate(0.35) contrast(0.95) brightness(1.04)"
                : undefined,
            }}
          />

          {tag && !soldOut && (
            <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[0.64rem] font-medium uppercase tracking-[0.14em] text-primary">
              {tag}
            </span>
          )}

          {soldOut && (
            <span className="absolute inset-x-0 bottom-4 mx-auto w-fit rounded-full bg-background/90 px-4 py-1.5 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-primary">
              Sold
            </span>
          )}
        </div>

        <div className="px-1 pt-4">
          <p className="text-[0.66rem] uppercase tracking-[0.16em] text-ink-soft">
            {category.label}
          </p>
          <h3 className="mt-1 font-serif text-[1.2rem] leading-tight text-ink">
            {product.name.replace(/ — .*/, "")}
          </h3>
          <p className="mt-0.5 text-[0.8rem] text-ink-soft">{colour || "Handmade"}</p>
          <p className="mt-2 flex items-baseline gap-2 font-serif text-[1.05rem] tabular-nums text-primary">
            {formatPrice(product.price)}
            {onSale && (
              <span className="text-[0.8rem] text-ink-soft line-through">
                {formatPrice(product.old_price as number)}
              </span>
            )}
          </p>
        </div>
      </Link>

      {/* Save and quick look. Outside the link, so tapping them never opens
          the piece. */}
      <div className="absolute right-1.5 top-1.5 z-10 flex flex-col">
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-pressed={saved}
          aria-label={
            saved
              ? `Remove ${product.name} from wishlist`
              : `Save ${product.name} to wishlist`
          }
          className="flex h-11 w-11 items-center justify-center text-primary"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-background/90 shadow-[0_1px_4px_rgba(42,27,61,0.25)] transition-transform hover:scale-110">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill={saved ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M12 20s-7-4.4-8.6-8.6A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8.6 4.4C19 15.6 12 20 12 20Z" />
            </svg>
          </span>
        </button>

        <button
          type="button"
          onClick={() => openQuickView(product)}
          aria-label={`Quick view of ${product.name}`}
          className="flex h-11 w-11 items-center justify-center text-primary"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-background/90 shadow-[0_1px_4px_rgba(42,27,61,0.25)] transition-transform hover:scale-110">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </span>
        </button>
      </div>
    </article>
  );
}
