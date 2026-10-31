"use client";

import { useFormStatus } from "react-dom";

/** A submit button that locks while its form is saving, so a second tap can
 *  not send the same piece twice, and shows that something is happening. */
export function SubmitButton({
  children,
  pendingText = "Saving…",
  className,
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={`${className ?? ""} disabled:cursor-wait disabled:opacity-60`}
    >
      {pending ? pendingText : children}
    </button>
  );
}
