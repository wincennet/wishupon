import Link from "next/link";
import { saveProduct } from "@/app/admin/actions";
import type { Product } from "@/lib/types";
import { CATEGORIES } from "@/lib/categories";
import { PhotoUploader } from "./PhotoUploader";

/** One form for both adding and editing. Labels are written the way the
 *  owner would say them out loud, not the way the database names them. */
export function ProductForm({ product }: { product?: Product }) {
  return (
    <form action={saveProduct} className="mt-6 space-y-5">
      {product && <input type="hidden" name="id" value={product.id} />}

      <Row label="Name of the piece" htmlFor="name">
        <input
          id="name"
          name="name"
          required
          defaultValue={product?.name}
          placeholder="Crystal Cluster Bracelet — Emerald"
          className={inputClass}
        />
      </Row>

      <Row
        label="Description"
        htmlFor="description"
        hint="What is it made of, and who is it for? Two or three lines is plenty."
      >
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={product?.description ?? ""}
          className={inputClass}
        />
      </Row>

      <div className="grid gap-5 sm:grid-cols-2">
        <Row label="Price (Rs.)" htmlFor="price">
          <input
            id="price"
            name="price"
            type="number"
            min={0}
            step={50}
            required
            defaultValue={product?.price}
            className={inputClass}
          />
        </Row>

        <Row label="How many do you have?" htmlFor="stock_qty">
          <input
            id="stock_qty"
            name="stock_qty"
            type="number"
            min={0}
            required
            defaultValue={product?.stock_qty ?? 1}
            className={inputClass}
          />
        </Row>
      </div>

      <Row label="Category" htmlFor="category">
        <select
          id="category"
          name="category"
          defaultValue={product?.category ?? "bangles"}
          className={inputClass}
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </Row>

      <PhotoUploader initial={product?.image_urls ?? []} />

      <label className="flex items-center gap-2.5">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={product?.is_active ?? true}
          className="h-4 w-4 accent-[#5b3a7a]"
        />
        <span className="text-[0.88rem] text-ink">Show this on the shop</span>
      </label>

      <div className="flex items-center gap-3 border-t border-neutral pt-5">
        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-7 text-[0.9rem] font-medium text-background transition-colors hover:bg-primary-dark"
        >
          {product ? "Save changes" : "Add this piece"}
        </button>
        <Link
          href="/admin"
          className="text-[0.85rem] text-ink-soft underline underline-offset-2 hover:text-primary"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

const inputClass =
  "mt-1.5 w-full rounded-[2px] border border-neutral bg-neutral-soft/50 px-3.5 py-2.5 text-[0.9rem] text-ink placeholder:text-ink-soft/45 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

function Row({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-[0.85rem] font-medium text-ink">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-[0.76rem] text-ink-soft">{hint}</p>}
    </div>
  );
}
