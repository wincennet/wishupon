import type { Category } from "./types";

/** The shop's six ranges. This is the single place the order, the labels and
 *  the accent colour of every category live, so the nav, the wall, the
 *  category pages and the admin form can never drift apart. */
export type CategoryMeta = {
  id: Category;
  label: string;
  /** Shown on the category page under its heading. */
  blurb: string;
  /** The one saturated colour reserved for a piece in this range when it is
   *  in focus, and the colours its beads carry in 3D. */
  accent: string;
  beads: string[];
  /** Ranges made to order have no fixed stock, so they invite a message
   *  rather than showing an apologetic empty shelf. */
  madeToOrder?: boolean;
};

export const CATEGORIES: CategoryMeta[] = [
  {
    id: "bangles",
    label: "Bangles",
    blurb:
      "Crystal and glass beads clustered by hand on gold-tone wire. Made in your wrist size.",
    accent: "#c9a9e0",
    beads: ["#c9a9e0", "#a87fc7", "#7d54a3", "#e0d0ee"],
  },
  {
    id: "hoop-earrings",
    label: "Hoop Earrings",
    blurb: "Beaded hoops, light enough to wear all day.",
    accent: "#d9b26a",
    beads: ["#f3ece2", "#e6d8c6", "#d9b26a", "#fbf7f1"],
  },
  {
    id: "ringlets",
    label: "Ringlets",
    blurb:
      "Hand harnesses: a ring joined by a beaded chain to a matching bracelet, worn as one piece across the back of the hand.",
    accent: "#c8415b",
    beads: ["#9d2235", "#c8415b", "#e08a9c", "#7a1526"],
  },
  {
    id: "necklaces",
    label: "Necklaces",
    blurb: "Strung to the length you ask for, with a matched clasp.",
    accent: "#5b8c8c",
    beads: ["#4a7c8c", "#7fb3b3", "#2f5d63", "#cfe3e1"],
  },
  {
    id: "special-packs",
    label: "Special & Offer Packs",
    blurb:
      "Matched sets and gift bundles, priced below the pieces bought separately.",
    accent: "#c9a227",
    beads: ["#c9a227", "#e3c65a", "#8a6f1c", "#f2e3a8"],
  },
  {
    id: "custom",
    label: "Custom Orders",
    blurb:
      "Tell us your colours, your size and when you need it. We make it for you.",
    accent: "#5b3a7a",
    beads: ["#5b3a7a", "#c9a9e0", "#2f2a35", "#a87fc7"],
    madeToOrder: true,
  },
];

const BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]));

export function categoryOf(id: string): CategoryMeta {
  return BY_ID.get(id as Category) ?? CATEGORIES[0];
}

export function isCategory(id: string): id is Category {
  return BY_ID.has(id as Category);
}

export const CATEGORY_LABELS: Record<Category, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c.label])
) as Record<Category, string>;

/** A stable per-piece stamp taken from the row's own id. Unlike a position in
 *  a paginated list, this never changes when stock moves, so it can honestly
 *  be presented as the piece's mark. */
export function pieceMark(id: string): string {
  return id.replace(/[^0-9a-f]/gi, "").slice(0, 3).toUpperCase();
}

/** Everything after the em dash in a product name is its colour. */
export function colourOf(name: string): string {
  return name.includes(" — ") ? name.split(" — ")[1].trim() : "";
}
