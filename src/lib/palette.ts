/** Colour families are the spine of the whole shop: the hero bracelet
 *  disassembles into these columns, the wall sorts left-to-right by them, and
 *  the flying add-to-cart beads borrow their colours. Derived from the piece's
 *  own colour name so the owner never has to tag anything by hand. */

export type FamilyId = "ivory" | "lilac" | "ruby" | "midnight";

export type Family = {
  id: FamilyId;
  label: string;
  /** Bead colours used for this family in 3D and in the cart burst. */
  beads: string[];
  /** The one saturated colour this family lends a card when it is in focus. */
  focus: string;
};

export const FAMILIES: Family[] = [
  {
    id: "ivory",
    label: "Ivory & Pearl",
    beads: ["#f3ece2", "#e6d8c6", "#d9b26a", "#fbf7f1"],
    focus: "#d9b26a",
  },
  {
    id: "lilac",
    label: "Lilac & Violet",
    beads: ["#c9a9e0", "#a87fc7", "#7d54a3", "#e0d0ee"],
    focus: "#c9a9e0",
  },
  {
    id: "ruby",
    label: "Ruby & Rose",
    beads: ["#9d2235", "#c8415b", "#e08a9c", "#7a1526"],
    focus: "#c8415b",
  },
  {
    id: "midnight",
    label: "Midnight & Spectrum",
    beads: ["#2f2a35", "#5b3a7a", "#4a7c8c", "#c9a227"],
    focus: "#5b3a7a",
  },
];

const COLOUR_TO_FAMILY: Record<string, FamilyId> = {
  "white & gold": "ivory",
  "blush pink": "ivory",
  lilac: "lilac",
  magenta: "lilac",
  red: "ruby",
  maroon: "ruby",
  black: "midnight",
  multicolour: "midnight",
  yellow: "midnight",
};

/** Everything after the em dash in a product name is its colour. */
export function colourOf(name: string): string {
  return name.includes(" — ") ? name.split(" — ")[1].trim() : "";
}

export function familyOf(name: string): Family {
  const key = colourOf(name).toLowerCase();
  const id = COLOUR_TO_FAMILY[key] ?? "midnight";
  return FAMILIES.find((f) => f.id === id)!;
}

/** A stable per-piece stamp taken from the row's own id. Unlike a position in
 *  a paginated list, this never changes when stock moves, so it can honestly
 *  be presented as the piece's mark. */
export function pieceMark(id: string): string {
  return id.replace(/[^0-9a-f]/gi, "").slice(0, 3).toUpperCase();
}
