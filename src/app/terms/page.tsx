import type { Metadata } from "next";
import { PolicyPage } from "@/components/layout/PolicyPage";

export const metadata: Metadata = { title: "Terms — WishUpon" };

export default function TermsPage() {
  return (
    <PolicyPage title="Terms" intro="The simple rules of buying from WishUpon.">
      <section>
        <h2>Orders</h2>
        <p>
          An order is not final until we have called you and confirmed it. If
          we cannot reach you, or a piece has sold in the meantime, we will
          tell you and nothing is charged.
        </p>
      </section>
      <section>
        <h2>Made by hand</h2>
        <p>
          Every piece is made by hand and is made once, so a piece may differ
          slightly from its photograph. Custom orders are made to the colours
          and size you agree with us.
        </p>
      </section>
      <section>
        <h2>Prices</h2>
        <p>
          All prices are in Pakistani rupees. The price you see when you order
          is the price you pay for the piece. Delivery is confirmed when we
          call you.
        </p>
      </section>
    </PolicyPage>
  );
}
