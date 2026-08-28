import { createClient } from "@/lib/supabase/server";
import { AccountForm } from "@/components/admin/AccountForm";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-serif text-2xl tracking-tight text-ink">
        Your login
      </h1>
      <p className="mt-1 text-[0.85rem] text-ink-soft">
        Change the password you use to sign in, and the email you sign in with.
      </p>

      <AccountForm email={user?.email ?? ""} />
    </div>
  );
}
