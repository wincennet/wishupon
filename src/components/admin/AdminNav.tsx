"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = { href: string; label: string; badge?: number };

/** The admin's tab bar. The current page is underlined, and a number appears on
 *  any tab that has something waiting for her (new orders, feedback to read),
 *  so she can tell at a glance whether there is work to do. */
export function AdminNav({ tabs }: { tabs: Tab[] }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" || pathname.startsWith("/admin/pieces") : pathname.startsWith(href);

  return (
    <nav aria-label="Admin sections" className="-mb-px flex gap-1 overflow-x-auto">
      {tabs.map((tab) => {
        const active = isActive(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`relative flex min-h-12 shrink-0 items-center gap-2 px-4 text-[0.88rem] transition-colors ${
              active ? "text-primary" : "text-ink-soft hover:text-ink"
            }`}
          >
            {tab.label}
            {tab.badge ? (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[0.68rem] font-medium text-background">
                {tab.badge}
              </span>
            ) : null}
            <span
              aria-hidden
              className={`absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-primary transition-opacity ${
                active ? "opacity-100" : "opacity-0"
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
}
