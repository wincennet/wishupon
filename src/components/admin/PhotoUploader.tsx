"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

/** Photo handling for someone who does not know what a URL is.
 *
 *  She picks photos from her phone or computer, watches them upload, drags
 *  nothing, and never sees a file path. The form still submits a plain list
 *  of addresses, so the server action and the database are unchanged — the
 *  addresses are just collected by this component instead of typed by hand. */
export function PhotoUploader({ initial }: { initial: string[] }) {
  const [urls, setUrls] = useState<string[]>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError(null);

    const supabase = createClient();
    const added: string[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        setError("Only photos can be added here.");
        continue;
      }
      // Phone cameras produce very large files; anything past ~8MB is almost
      // certainly a mistake and would be slow for shoppers to load.
      if (file.size > 8 * 1024 * 1024) {
        setError(`"${file.name}" is too large. Please use a photo under 8MB.`);
        continue;
      }

      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(path, file, { cacheControl: "31536000", upsert: false });

      if (uploadError) {
        setError("That photo could not be uploaded. Please try again.");
        continue;
      }

      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      added.push(data.publicUrl);
    }

    setUrls((current) => [...current, ...added]);
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function remove(url: string) {
    setUrls((current) => current.filter((u) => u !== url));
  }

  function move(index: number, delta: number) {
    setUrls((current) => {
      const next = [...current];
      const target = index + delta;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <div>
      <span className="block text-[0.85rem] font-medium text-ink">Photos</span>
      <p className="mt-0.5 text-[0.76rem] text-ink-soft">
        The first photo is the one shoppers see on the wall.
      </p>

      {urls.length > 0 && (
        <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {urls.map((url, i) => (
            <li key={url} className="relative">
              <div className="relative aspect-square overflow-hidden rounded-[2px] border border-neutral bg-neutral-soft">
                <Image
                  src={url}
                  alt={`Photo ${i + 1}`}
                  fill
                  sizes="120px"
                  className="object-cover"
                  unoptimized
                />
                {i === 0 && (
                  <span className="absolute left-0 top-0 bg-primary px-1.5 py-0.5 text-[0.6rem] uppercase tracking-[0.1em] text-background">
                    Main
                  </span>
                )}
              </div>

              <div className="mt-1 flex items-center justify-between gap-1">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label="Move photo earlier"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral text-ink transition-colors hover:border-primary hover:text-primary disabled:opacity-30"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === urls.length - 1}
                    aria-label="Move photo later"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral text-ink transition-colors hover:border-primary hover:text-primary disabled:opacity-30"
                  >
                    →
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => remove(url)}
                  className="px-1 text-[0.75rem] text-ink-soft underline underline-offset-2 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          id="photo-input"
        />
        <label
          htmlFor="photo-input"
          className={`inline-flex min-h-11 cursor-pointer items-center rounded-full border border-primary/40 px-5 text-[0.86rem] text-primary transition-colors hover:bg-primary hover:text-background ${
            busy ? "pointer-events-none opacity-60" : ""
          }`}
        >
          {busy ? "Uploading…" : urls.length ? "Add more photos" : "Add photos"}
        </label>
      </div>

      {error && <p className="mt-2 text-[0.8rem] text-red-700">{error}</p>}

      {/* What the form actually submits. The owner never sees or types these. */}
      <input type="hidden" name="image_urls" value={urls.join("\n")} />
    </div>
  );
}
