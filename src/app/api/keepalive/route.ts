import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Free Supabase projects pause after about a week with no activity. Vercel
 *  calls this once a day (see vercel.json), and the tiny query below counts as
 *  activity, so the shop's database never goes to sleep. */
export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const { error } = await supabase.from("products").select("id").limit(1);
  return NextResponse.json({ ok: !error }, { status: error ? 503 : 200 });
}
