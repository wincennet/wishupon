import { createClient } from "@/lib/supabase/server";
import { saveDelivery } from "@/app/admin/actions";
import { parseDelivery } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage({
  searchParams,
}: PageProps<"/admin/settings">) {
  const { saved } = await searchParams;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "delivery")
    .maybeSingle();

  const current = parseDelivery(data?.value);
  const missingTable = Boolean(error);

  return (
    <div className="max-w-xl">
      <h1 className="font-serif text-2xl tracking-tight text-ink">Delivery</h1>
      <p className="mt-1 text-[0.88rem] leading-relaxed text-ink-soft">
        What shoppers are charged for delivery. Leave the price empty and the
        shop tells them you will confirm delivery when you call.
      </p>

      {missingTable && (
        <p
          role="alert"
          className="mt-5 rounded-lg border border-err/40 bg-background p-4 text-[0.85rem] leading-relaxed text-ink"
        >
          This page needs one small database update first. It has not been run
          yet, so nothing can be saved here.
        </p>
      )}

      {saved && !missingTable && (
        <p
          role="status"
          className="mt-5 rounded-lg border border-ok/50 bg-background p-3 text-[0.85rem] text-ink"
        >
          Saved. The shop uses this straight away.
        </p>
      )}

      <form action={saveDelivery} className="mt-6 space-y-5 rounded-xl border border-ink/10 bg-background p-5 sm:p-6">
        <div>
          <label htmlFor="fee" className="block text-[0.85rem] font-medium text-ink">
            Delivery price (Rs.)
          </label>
          <input
            id="fee"
            name="fee"
            type="number"
            min={0}
            step={50}
            defaultValue={current.fee ?? ""}
            placeholder="Empty = we confirm by phone"
            className="mt-1.5 w-full rounded-lg border border-ink/15 bg-neutral-soft/50 px-3.5 py-2.5 text-[0.9rem] text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <p className="mt-1 text-[0.76rem] text-ink-soft">
            Added to every order. Put 0 for free delivery on everything.
          </p>
        </div>

        <div>
          <label htmlFor="free_over" className="block text-[0.85rem] font-medium text-ink">
            Free delivery from (Rs.)
          </label>
          <input
            id="free_over"
            name="free_over"
            type="number"
            min={0}
            step={100}
            defaultValue={current.freeOver ?? ""}
            placeholder="Empty = no free-delivery offer"
            className="mt-1.5 w-full rounded-lg border border-ink/15 bg-neutral-soft/50 px-3.5 py-2.5 text-[0.9rem] text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <p className="mt-1 text-[0.76rem] text-ink-soft">
            Orders at or above this total are delivered free.
          </p>
        </div>

        <button
          type="submit"
          className="min-h-11 rounded-lg bg-primary px-7 text-[0.9rem] font-medium text-background transition-colors hover:bg-primary-dark"
        >
          Save delivery
        </button>
      </form>
    </div>
  );
}
