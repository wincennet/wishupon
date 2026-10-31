import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { approveFeedback, deleteFeedback } from "@/app/admin/actions";
import { formatDate } from "@/lib/format";
import { EXTENDED_SCHEMA } from "@/lib/features";
import type { Feedback } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminFeedbackPage() {
  if (!EXTENDED_SCHEMA) redirect("/admin");

  const supabase = await createClient();
  const { data } = await supabase
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false });
  const all = (data ?? []) as Feedback[];

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Customer feedback</h1>
      <p className="mt-1 text-[0.88rem] text-ink-soft">
        Nothing shows on the shop until you press Approve.
      </p>

      {all.length === 0 ? (
        <p className="mt-8 text-[0.9rem] text-ink-soft">No feedback yet.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {all.map((f) => (
            <li key={f.id} className="rounded-[2px] bg-background p-4 shadow-[var(--shadow-card)]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[0.95rem] text-primary">
                    {"★".repeat(f.rating)}
                    <span className="text-neutral">{"★".repeat(5 - f.rating)}</span>
                  </p>
                  <p className="mt-1 text-[0.82rem] text-ink-soft">
                    {f.name} · {formatDate(f.created_at)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-[0.72rem] ${
                    f.approved ? "bg-accent-soft text-primary" : "bg-neutral-soft text-ink-soft"
                  }`}
                >
                  {f.approved ? "On the shop" : "Waiting"}
                </span>
              </div>
              <p className="mt-3 text-[0.92rem] leading-relaxed text-ink">{f.message}</p>
              <div className="mt-4 flex gap-2">
                {!f.approved && (
                  <form action={approveFeedback}>
                    <input type="hidden" name="id" value={f.id} />
                    <button className="min-h-11 rounded-full bg-primary px-5 text-[0.85rem] font-medium text-background hover:bg-primary-dark">
                      Approve
                    </button>
                  </form>
                )}
                <form action={deleteFeedback}>
                  <input type="hidden" name="id" value={f.id} />
                  <button className="min-h-11 rounded-full border border-neutral px-5 text-[0.85rem] text-ink hover:border-primary hover:text-primary">
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
