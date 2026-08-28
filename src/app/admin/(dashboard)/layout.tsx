import Link from "next/link";
import { signOut } from "@/app/admin/actions";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-soft">
      <header className="border-b border-neutral bg-background">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-5">
            <span className="font-display text-lg text-primary">WishUpon</span>
            <nav className="flex gap-1">
              <Link
                href="/admin"
                className="flex min-h-11 items-center rounded-full px-3 text-[0.85rem] text-ink hover:bg-accent-soft hover:text-primary"
              >
                My pieces
              </Link>
              <Link
                href="/admin/orders"
                className="flex min-h-11 items-center rounded-full px-3 text-[0.85rem] text-ink hover:bg-accent-soft hover:text-primary"
              >
                Orders
              </Link>
              <Link
                href="/admin/account"
                className="flex min-h-11 items-center rounded-full px-3 text-[0.85rem] text-ink hover:bg-accent-soft hover:text-primary"
              >
                My login
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="text-[0.8rem] text-ink-soft underline underline-offset-2 hover:text-primary"
            >
              View shop
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-full border border-neutral px-3.5 py-1.5 text-[0.8rem] text-ink transition-colors hover:border-primary hover:text-primary"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
