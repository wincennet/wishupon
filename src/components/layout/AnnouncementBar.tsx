import { DELIVERY } from "@/lib/constants";

/** A slow ticker above the header, as on the reference store. Every line is
 *  something the shop actually does; the delivery line comes from DELIVERY so
 *  it changes in one place when the owner settles the fee. */
const MESSAGE = [
  "✦ Cash on delivery across Pakistan",
  DELIVERY.fee === null
    ? "Delivery confirmed when we call you"
    : `Flat Rs. ${DELIVERY.fee} delivery`,
  "Made to your colours — ask on WhatsApp",
  "Made by hand in Pakistan",
].join("  •  ");

export function AnnouncementBar() {
  return (
    <div className="marquee-wrap w-full overflow-hidden bg-primary text-[0.75rem] tracking-wide text-white sm:text-[0.8rem]">
      <div className="marquee-track flex w-max whitespace-nowrap py-2.5">
        <span className="px-6">{MESSAGE}</span>
        <span aria-hidden className="px-6">
          {MESSAGE}
        </span>
      </div>
    </div>
  );
}
