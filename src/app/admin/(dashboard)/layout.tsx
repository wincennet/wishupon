import Link from "next/link";
import { signOut } from "@/app/admin/actions";
import { createClient } from "@/lib/supabase/server";
import { AdminNav } from "@/components/admin/AdminNav";
import { EXTENDED_SCHEMA } from "@/lib/features";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const supabase = await createClient();

  // Counts for the badges: only what is waiting on her.
  const { count: newOrders } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  let unreadFeedback = 0;
  if (EXTENDED_SCHEMA) {
    const { count } = await supabase
      .from("feedback")
      .select("id", { count: "exact", head: true })
      .eq("approved", false);
    unreadFeedback = count ?? 0;
  }

  const tabs = [
    { href: "/admin", label: "My pieces" },
    { href: "/admin/orders", label: "Orders", badge: newOrders ?? 0 },
    ...(EXTENDED_SCHEMA
      ? [{ href: "/admin/feedback", label: "Feedback", badge: unreadFeedback }]
      : []),
    { href: "/admin/settings", label: "Delivery" },
    { href: "/admin/account", label: "My login" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-neutral-soft">
      <header className="border-b border-ink/10 bg-background">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 pt-4 sm:px-6">
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-2xl text-primary">WishUpon</span>
            <span className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-ink-soft">
              Owner panel
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="flex min-h-11 items-center text-[0.82rem] text-ink-soft underline underline-offset-2 hover:text-primary"
            >
              View shop
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="min-h-11 rounded-lg border border-ink/15 px-4 text-[0.82rem] text-ink transition-colors hover:border-primary hover:text-primary"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>

        <div className="mx-auto w-full max-w-5xl px-2 sm:px-4">
          <AdminNav tabs={tabs} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
