"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/components/cart/CartProvider";
import { AddToCart } from "@/components/shop/AddToCart";
import { CATEGORIES, categoryOf } from "@/lib/categories";
import { formatPrice } from "@/lib/format";
import { EXTENDED_SCHEMA } from "@/lib/features";
import type { Product } from "@/lib/types";

/** Everything that opens over the page: the wishlist drawer, the search panel
 *  and the product quick-view. One provider owns all three so the header, the
 *  cards and the overlays share state without prop-drilling. */
type ShopUi = {
  wishlist: string[];
  inWishlist: (id: string) => boolean;
  toggleWishlist: (id: string) => void;
  openWishlist: () => void;
  openSearch: () => void;
  openQuickView: (product: Product) => void;
};

const Ctx = createContext<ShopUi | null>(null);
const WISHLIST_KEY = "wishupon-wishlist";

export function useShopUi() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useShopUi must be used inside ShopUiProvider");
  return ctx;
}

const Icon = {
  x: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  ),
  search: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  ),
  trash: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
    </svg>
  ),
};

export function ShopUiProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_KEY);
      if (stored) setWishlist(JSON.parse(stored));
    } catch {
      // Unreadable storage should never break the shop.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist, ready]);

  // Page behind an open overlay should not scroll.
  const anyOpen = wishlistOpen || searchOpen || quickView !== null;
  useEffect(() => {
    document.body.style.overflow = anyOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [anyOpen]);

  useEffect(() => {
    if (!anyOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setWishlistOpen(false);
      setSearchOpen(false);
      setQuickView(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [anyOpen]);

  const toggleWishlist = useCallback((id: string) => {
    setWishlist((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]
    );
  }, []);

  const value = useMemo<ShopUi>(
    () => ({
      wishlist,
      inWishlist: (id) => wishlist.includes(id),
      toggleWishlist,
      openWishlist: () => setWishlistOpen(true),
      openSearch: () => setSearchOpen(true),
      openQuickView: (product) => setQuickView(product),
    }),
    [wishlist, toggleWishlist]
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <WishlistDrawer
        open={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        ids={wishlist}
        onRemove={toggleWishlist}
        onView={(p) => {
          setWishlistOpen(false);
          setQuickView(p);
        }}
      />
      <SearchPanel
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onPick={(p) => {
          setSearchOpen(false);
          setQuickView(p);
        }}
      />
      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </Ctx.Provider>
  );
}

/* ── Shared bits ─────────────────────────────────────────────────────────── */

function Thumb({ product, size }: { product: Product; size: string }) {
  return (
    <Image
      src={product.image_urls[0] ?? "/placeholder-piece.svg"}
      alt={product.name}
      fill
      sizes={size}
      className="object-cover"
    />
  );
}

/* ── Wishlist drawer ─────────────────────────────────────────────────────── */

function WishlistDrawer({
  open,
  onClose,
  ids,
  onRemove,
  onView,
}: {
  open: boolean;
  onClose: () => void;
  ids: string[];
  onRemove: (id: string) => void;
  onView: (p: Product) => void;
}) {
  const { add } = useCart();
  const [products, setProducts] = useState<Product[]>([]);

  // Fetched fresh each time it opens, so a saved piece never shows a stale
  // price or an old stock count.
  useEffect(() => {
    if (!open || ids.length === 0) {
      setProducts([]);
      return;
    }
    let cancelled = false;
    createClient()
      .from("products")
      .select("*")
      .in("id", ids)
      .eq("is_active", true)
      .then(({ data }) => {
        if (!cancelled) setProducts((data ?? []) as Product[]);
      });
    return () => {
      cancelled = true;
    };
  }, [open, ids]);

  const hasOptions = (p: Product) =>
    EXTENDED_SCHEMA && Boolean(p.sizes?.length || p.colors?.length);
  const buyable = products.filter((p) => p.stock_qty > 0 && !hasOptions(p));

  return (
    <div className={`fixed inset-0 z-[100] ${open ? "" : "pointer-events-none"}`}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-label="Wishlist"
        aria-hidden={!open}
        className={`depth-3 absolute right-0 top-0 bg-background flex h-full w-full max-w-md flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-neutral p-5">
          <h2 className="font-display text-xl font-bold text-primary">
            Wishlist{" "}
            <span className="font-body text-sm font-normal text-ink-soft">
              ({ids.length})
            </span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close wishlist"
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-white/60"
          >
            {Icon.x}
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {ids.length === 0 ? (
            <div className="py-20 text-center text-ink-soft">
              <p className="font-display text-lg text-primary">No saved pieces yet</p>
              <p className="mt-1 text-sm">Tap the heart on any piece to save it here.</p>
              <Link
                href="/shop/bangles"
                onClick={onClose}
                className="btn btn-ghost mt-4 px-5 py-2.5 text-sm"
              >
                Browse the shop
              </Link>
            </div>
          ) : (
            products.map((p) => (
              <div key={p.id} className="depth-1 flex gap-3 rounded-[3px] bg-white p-3">
                <button
                  type="button"
                  onClick={() => onView(p)}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[2px]"
                  aria-label={`View ${p.name}`}
                >
                  <Thumb product={p} size="80px" />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm font-semibold text-ink">
                    {p.name.replace(/ — .*/, "")}
                  </p>
                  <p className="text-xs text-ink-soft">{categoryOf(p.category).label}</p>
                  <p className="mt-0.5 text-sm font-semibold text-primary">
                    {formatPrice(p.price)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      disabled={p.stock_qty <= 0}
                      onClick={() => (hasOptions(p) ? onView(p) : add(p))}
                      className="btn btn-primary px-3 py-1.5 text-xs"
                    >
                      {p.stock_qty <= 0
                        ? "Sold out"
                        : hasOptions(p)
                          ? "Choose options"
                          : "Add to cart"}
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(p.id)}
                      aria-label={`Remove ${p.name} from wishlist`}
                      className="ml-auto flex h-11 w-11 items-center justify-center rounded-[2px] text-err hover:bg-black/5"
                    >
                      {Icon.trash}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {buyable.length > 0 && (
          <div className="space-y-2 border-t border-neutral bg-background p-5">
            <button
              type="button"
              onClick={() => {
                buyable.forEach((p) => add(p));
                onClose();
              }}
              className="btn btn-primary w-full py-3 text-sm"
            >
              Move all to cart
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

/* ── Search panel ────────────────────────────────────────────────────────── */

function SearchPanel({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (p: Product) => void;
}) {
  const [query, setQuery] = useState("");
  const [catalogue, setCatalogue] = useState<Product[] | null>(null);

  // The catalogue is small (one owner, handmade), so it is fetched once on
  // first open and filtered in the browser: results update on every keystroke.
  useEffect(() => {
    if (!open || catalogue) return;
    let cancelled = false;
    createClient()
      .from("products")
      .select("*")
      .eq("is_active", true)
      .then(({ data }) => {
        if (!cancelled) setCatalogue((data ?? []) as Product[]);
      });
    return () => {
      cancelled = true;
    };
  }, [open, catalogue]);

  const q = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!q || !catalogue) return [];
    return catalogue
      .filter((p) =>
        [p.name, p.description ?? "", categoryOf(p.category).label]
          .join(" ")
          .toLowerCase()
          .includes(q)
      )
      .slice(0, 12);
  }, [q, catalogue]);

  return (
    <div className={`fixed inset-0 z-[110] ${open ? "" : "pointer-events-none"}`}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />
      <div
        role="dialog"
        aria-label="Search"
        aria-hidden={!open}
        className={`depth-3 absolute inset-x-0 top-0 bg-background max-h-[85vh] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="mx-auto max-w-3xl p-5">
          <div className="flex items-center gap-3">
            <span className="text-ink-soft">{Icon.search}</span>
            <input
              autoFocus={open}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pieces…"
              aria-label="Search pieces"
              className="min-h-11 flex-1 bg-transparent text-lg text-ink outline-none"
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close search"
              className="flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-white/60"
            >
              {Icon.x}
            </button>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                href={`/shop/${c.id}`}
                onClick={onClose}
                className="flex min-h-11 items-center rounded-full bg-neutral-soft px-3.5 text-xs text-ink"
              >
                {c.label}
              </Link>
            ))}
          </div>

          <div className="mt-5 max-h-[60vh] overflow-y-auto">
            {!q ? (
              <p className="py-10 text-center text-sm text-ink-soft">
                Start typing to search our pieces…
              </p>
            ) : !catalogue ? (
              <p className="py-10 text-center text-sm text-ink-soft">Searching…</p>
            ) : results.length === 0 ? (
              <p className="py-10 text-center text-sm text-ink-soft">
                No matches for “{query.trim()}”. Try “bangles”, “hoops” or a colour.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {results.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onPick(p)}
                    className="depth-1 hover:depth-2 overflow-hidden rounded-[3px] bg-white text-left transition"
                  >
                    <span className="relative block aspect-square overflow-hidden">
                      <Thumb product={p} size="(max-width: 640px) 45vw, 200px" />
                    </span>
                    <span className="block p-2.5">
                      <span className="block truncate text-[0.8rem] font-semibold leading-tight text-ink">
                        {p.name.replace(/ — .*/, "")}
                      </span>
                      <span className="mt-0.5 block text-xs text-primary">
                        {formatPrice(p.price)}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Quick view ──────────────────────────────────────────────────────────── */

function QuickView({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const { inWishlist, toggleWishlist } = useShopUi();
  const [shown, setShown] = useState(0);

  useEffect(() => setShown(0), [product?.id]);

  if (!product) return null;

  const images = product.image_urls.length
    ? product.image_urls
    : ["/placeholder-piece.svg"];
  const saved = inWishlist(product.id);

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center sm:p-6">
      <div onClick={onClose} className="absolute inset-0 bg-black/50" />
      <div
        role="dialog"
        aria-label={product.name}
        className="depth-3 relative grid max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-[3px] bg-background sm:rounded-[3px] md:grid-cols-2"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="glass absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full text-ink"
        >
          {Icon.x}
        </button>

        <div className="bg-neutral-soft">
          <div className="relative aspect-square">
            <Image
              src={images[shown] ?? images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 450px"
              className="object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto p-3">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setShown(i)}
                  aria-label={`Photo ${i + 1}`}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-[2px] ${i === shown ? "ring-2 ring-primary" : "opacity-70"}`}
                >
                  <Image src={src} alt="" fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col p-6 sm:p-8">
          <span className="text-[0.7rem] uppercase tracking-wide text-ink-soft">
            {categoryOf(product.category).label}
          </span>
          <h2 className="mt-1 font-display text-2xl font-semibold leading-tight text-ink">
            {product.name}
          </h2>
          <p className="mt-3 flex items-baseline gap-3 font-display text-2xl font-semibold text-primary">
            {formatPrice(product.price)}
            {EXTENDED_SCHEMA && product.old_price && product.old_price > product.price && (
              <span className="text-base font-normal text-ink-soft line-through">
                {formatPrice(product.old_price)}
              </span>
            )}
          </p>
          {product.description && (
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              {product.description}
            </p>
          )}

          <div className="mt-6">
            <AddToCart product={product} />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-neutral pt-5 text-sm">
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className="link-underline flex min-h-11 items-center text-ink"
            >
              {saved ? "Saved to wishlist ♥" : "Save to wishlist ♡"}
            </button>
            <Link
              href={`/piece/${product.id}`}
              onClick={onClose}
              className="link-underline flex min-h-11 items-center text-ink"
            >
              View full details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
