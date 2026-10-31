/** The site's public address, for metadata, the sitemap and share previews.
 *  Set NEXT_PUBLIC_SITE_URL once the owner has a custom domain; until then it
 *  falls back to the Vercel production address. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");
