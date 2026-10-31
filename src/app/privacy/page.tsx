import type { Metadata } from "next";
import { PolicyPage } from "@/components/layout/PolicyPage";

export const metadata: Metadata = { title: "Privacy — WishUpon" };

export default function PrivacyPage() {
  return (
    <PolicyPage
      title="Privacy"
      intro="What we keep about you, and what we do not."
    >
      <section>
        <h2>What we collect</h2>
        <p>
          When you place an order we save your name, phone number, delivery
          address and what you ordered, so we can call you and post it. If you
          leave feedback we save the name and note you typed.
        </p>
      </section>
      <section>
        <h2>What we do with it</h2>
        <p>
          We use it only to confirm, post and follow up on your order. We do
          not sell it, and we do not share it except with the courier, who
          needs your name, phone and address to deliver.
        </p>
      </section>
      <section>
        <h2>On your device</h2>
        <p>
          Your cart and wishlist are kept in your browser so they are still
          there when you come back. They are not sent to us until you place an
          order. Clearing your browser data removes them.
        </p>
      </section>
      <section>
        <h2>Asking us to delete it</h2>
        <p>Message us on WhatsApp and we will delete your order details.</p>
      </section>
    </PolicyPage>
  );
}
