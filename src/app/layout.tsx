import type { Metadata } from "next";
import { Bricolage_Grotesque, Archivo, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { FlyToCartProvider } from "@/components/cart/FlyToCart";
import { ShopUiProvider } from "@/components/shop/ShopUi";

/* WishUpon's own faces: a grotesque with character for the interface, and a
   serif with a real hand for headlines and piece names. */
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

const serif = Instrument_Serif({
  variable: "--font-serif-face",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "WishUpon — Handmade beaded & steel accessories",
  description:
    "Handmade beaded bracelets, earrings, necklaces and steel pieces. Custom made-to-order, one of a kind, at everyday prices. Cash on delivery across Pakistan.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <CartProvider>
          <FlyToCartProvider>
            <ShopUiProvider>{children}</ShopUiProvider>
          </FlyToCartProvider>
        </CartProvider>
      </body>
    </html>
  );
}
