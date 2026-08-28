import type { Metadata } from "next";
import { Bricolage_Grotesque, Archivo, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { FlyToCartProvider } from "@/components/cart/FlyToCart";

/* Faces chosen against the brief's pinned cream ground. A high-contrast display
   serif on warm cream is the exact cluster generated interfaces fall into, so
   display duty goes to a grotesque with real character instead. Warmth is
   carried by the card stock, pin shadows, and the photography — not the type. */
const display = Bricolage_Grotesque({
  variable: "--font-display-face",
  subsets: ["latin"],
  display: "swap",
});

const body = Archivo({
  variable: "--font-body-face",
  subsets: ["latin"],
  display: "swap",
});

/* Piece names get a serif with a real hand to it — the register jewellery is
   named in — while the grotesque keeps the interface voice. */
const serif = Instrument_Serif({
  variable: "--font-serif-face",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "WishUpon — Handmade beaded & steel accessories",
  description:
    "Handmade beaded bracelets, earrings, necklaces and steel pieces. Custom made-to-order, one of a kind, at everyday prices. Cash on delivery across Pakistan.",
};

const DIRECTION_CONTRACT = `<!--
THESIS: Every piece is one of a kind, so every piece gets its own numbered card,
and the shop is the wall those cards hang on, sorted by colour family. Refuses
the neutral square-photo grid every handmade shop ships.
OWN-WORLD: Cream #FAF7F5 card stock on kraft-beige #D9C9B8 board, violet #5B3A7A
as ink, lilac #C9A9E0 as the single reserved focus colour. Cards are physical:
real edge, real pin, real cast shadow. Bead photography supplies the only
saturation on screen. Bricolage Grotesque display, Archivo text.
STORY: She sees a wall of individual pieces sorted by colour, understands
instantly that each is unique and made by hand, finds her colour, and orders
with cash on delivery without needing to message anyone.
FIRST VIEWPORT: Full-bleed board. One featured card pulled forward and lit, its
bead cluster live in 3D and draggable. Behind it the wall recedes in colour
order. Wordmark top-left, cart top-right, primary action on the featured card.
FORM: The Card Wall — candidate 7 of the grounded list, assigned by roll.
Seed key 80c730b5.
FINISH: unreviewed and undocumented is unfinished; this build ends with the
finish review, the verdict, DESIGN.md, and every shipping raster carrying its
provenance.
-->`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Emitted as a real HTML comment, not a JSX one: React strips JSX
            comments at compile time, and a direction contract that does not
            survive the production build cannot be audited. */}
        <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: DIRECTION_CONTRACT }} />
        <CartProvider>
          <FlyToCartProvider>{children}</FlyToCartProvider>
        </CartProvider>
      </body>
    </html>
  );
}
