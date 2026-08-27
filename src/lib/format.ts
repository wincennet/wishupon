/** All prices on the site are Pakistani Rupees. Kept in one place so a
 *  currency change later is a one-line edit, not a find-and-replace. */
export function formatPrice(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
