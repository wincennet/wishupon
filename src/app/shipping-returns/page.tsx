import type { Metadata } from "next";
import { PolicyPage } from "@/components/layout/PolicyPage";
import { DELIVERY, WHATSAPP_DISPLAY } from "@/lib/constants";

export const metadata: Metadata = { title: "Delivery & returns — WishUpon" };

export default function ShippingReturnsPage() {
  return (
    <PolicyPage
      title="Delivery & returns"
      intro="How your order reaches you, and what to do if something is not right."
    >
      <section>
        <h2>Delivery</h2>
        <p>
          We post anywhere in Pakistan with {DELIVERY.courier}. {DELIVERY.note}
        </p>
      </section>
      <section>
        <h2>Paying</h2>
        <ul>
          <li>Cash on delivery: you pay the courier when the parcel arrives.</li>
          <li>Bank transfer: we share the account details when we call to confirm.</li>
        </ul>
      </section>
      <section>
        <h2>How an order goes</h2>
        <ul>
          <li>You place the order on the site.</li>
          <li>We call the number you gave to confirm it before anything is posted.</li>
          <li>Your piece is posted and the courier brings it to your door.</li>
        </ul>
      </section>
      <section>
        <h2>If something is not right</h2>
        <p>
          Every piece is made by hand, so tell us as soon as your parcel
          arrives if it is damaged or is not what you ordered. Message us on
          WhatsApp ({WHATSAPP_DISPLAY}) with a photo and we will put it right.
        </p>
      </section>
    </PolicyPage>
  );
}
