import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { AddToCart } from "@/components/shop/AddToCart";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/categories";
import { DELIVERY, whatsappLink } from "@/lib/constants";

export const revalidate = 60;

export default async function PiecePage({ params }: PageProps<"/piece/[id]">) {
  const { id } = await params;

  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();

  if (!data) notFound();
  const piece = data as Product;

  const images = piece.image_urls.length
    ? piece.image_urls
    : ["/placeholder-piece.svg"];

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-neutral">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
          <Link
            href={`/shop/${piece.category}`}
            className="text-[0.8rem] text-primary underline underline-offset-4 hover:text-primary-dark"
          >
            ← Back to {CATEGORY_LABELS[piece.category]}
          </Link>

          {/* The detail page is one card pulled off the wall and laid flat. */}
          <article className="mt-5 overflow-hidden rounded-[2px] bg-background shadow-[var(--shadow-card-lifted)]">
            <div className="grid gap-0 lg:grid-cols-2">
              <div className="bg-neutral-soft">
                <div className="relative aspect-square">
                  <Image
                    src={images[0]}
                    alt={piece.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>

                {images.length > 1 && (
                  <div className="grid grid-cols-3 gap-1.5 p-1.5">
                    {images.slice(1).map((src) => (
                      <div
                        key={src}
                        className="relative aspect-square overflow-hidden"
                      >
                        <Image
                          src={src}
                          alt={`${piece.name} — another view`}
                          fill
                          sizes="20vw"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 sm:p-8 lg:p-10">
                <p className="text-[0.7rem] uppercase tracking-[0.2em] text-primary/75">
                  {CATEGORY_LABELS[piece.category]}
                </p>

                <h1 className="mt-2 font-display text-2xl leading-tight tracking-tight text-ink sm:text-3xl">
                  {piece.name}
                </h1>

                <p className="mt-4 font-display text-2xl tabular-nums text-primary">
                  {formatPrice(piece.price)}
                </p>

                {piece.description && (
                  <p className="mt-5 text-[0.92rem] leading-relaxed text-ink-soft">
                    {piece.description}
                  </p>
                )}

                <div className="mt-7">
                  <AddToCart product={piece} />
                </div>

                <dl className="mt-8 space-y-3 border-t border-neutral pt-6 text-[0.83rem]">
                  <div>
                    <dt className="font-medium text-ink">Delivery</dt>
                    <dd className="mt-0.5 leading-relaxed text-ink-soft">
                      {DELIVERY.note}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-ink">Want it in your colours?</dt>
                    <dd className="mt-0.5 leading-relaxed text-ink-soft">
                      Every piece can be made to order.{" "}
                      <a
                        href={whatsappLink(
                          `Assalam o alaikum! I'd like a custom version of "${piece.name}".`
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary underline underline-offset-2"
                      >
                        Message us on WhatsApp
                      </a>
                      .
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
