import { ProductForm } from "@/components/admin/ProductForm";

export default function NewPiecePage() {
  return (
    <div className="mx-auto max-w-2xl rounded-[2px] bg-background p-6 shadow-[var(--shadow-card)] sm:p-8">
      <h1 className="font-display text-2xl tracking-tight text-ink">
        Add a piece
      </h1>
      <p className="mt-1 text-[0.85rem] text-ink-soft">
        It appears on the shop as soon as you save.
      </p>
      <ProductForm />
    </div>
  );
}
