import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export function PolicyPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-neutral-soft">
        <article className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
          <h1 className="font-serif text-4xl tracking-tight text-primary">{title}</h1>
          {intro && (
            <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">{intro}</p>
          )}
          <div className="mt-8 space-y-6 text-[0.93rem] leading-relaxed text-ink [&_h2]:mb-2 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:text-ink [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
            {children}
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
