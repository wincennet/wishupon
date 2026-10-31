import type { Category } from "./types";

/** The panels in the home hero's filmstrip, left to right.
 *
 *  To change the photography, drop files in `public/` and edit this list.
 *  Nothing else needs touching. `focus` is the part of the picture that stays
 *  in view when it is cropped to a 3:4 panel (x% y%), so keep the jewellery
 *  inside it. */
export type FilmPanel = {
  src: string;
  alt: string;
  focus: string;
  /** Names the range on the panel's caption. */
  category: Category;
  /** The caption under the photograph. */
  label: string;
  /** Optional second caption line, e.g. to disclose a generated image. */
  note?: string;
};

const BEADED = "/products/beaded-accessories";

export const FILM_PANELS: FilmPanel[] = [
  {
    src: "/hero/model-lilac-pearl.png",
    alt: "A model resting her cheek on her hand, wearing a lilac crystal-bead bracelet with gold tassels (AI-generated image)",
    focus: "50% 70%",
    category: "bangles",
    label: "Lilac pearl bracelet",
    note: "Model image is AI-generated",
  },
  {
    src: "/products/hoop-earrings/hoop-02-pastel-pearl-chain.jpg",
    alt: "Pastel pearl beaded hoop earrings",
    focus: "50% 50%",
    category: "hoop-earrings",
    label: "Pastel pearl hoops",
  },
  {
    src: `${BEADED}/beaded-03-maroon-worn.jpg`,
    alt: "Maroon beaded bangles worn on the wrist",
    focus: "50% 50%",
    category: "bangles",
    label: "Maroon bangles",
  },
  {
    src: "/products/ringlets/ringlet-02-pastel-kundan.jpg",
    alt: "Pastel kundan ringlet worn across the back of the hand",
    focus: "50% 50%",
    category: "ringlets",
    label: "Pastel kundan ringlet",
  },
  {
    src: `${BEADED}/beaded-07-lilac-pearl-flatlay.jpg`,
    alt: "Lilac pearl beaded bangle laid flat",
    focus: "50% 50%",
    category: "bangles",
    label: "Lilac pearl bangle",
  },
  {
    src: "/products/hoop-earrings/hoop-03-champagne-gold.jpg",
    alt: "Champagne gold beaded hoop earrings",
    focus: "50% 50%",
    category: "hoop-earrings",
    label: "Champagne gold hoops",
  },
];
