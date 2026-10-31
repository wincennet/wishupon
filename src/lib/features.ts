/** Switches for features that need the 0002 database migration
 *  (supabase/migrations). Off until the migration has been run and
 *  NEXT_PUBLIC_EXTENDED_SCHEMA=1 is set, so deploying the code first can
 *  never break saving a product or loading the shop. */
export const EXTENDED_SCHEMA = process.env.NEXT_PUBLIC_EXTENDED_SCHEMA === "1";
