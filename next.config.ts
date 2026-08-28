import type { NextConfig } from "next";

/** Photos the owner uploads live in Supabase Storage, on a different host to
 *  the site. Without this the image optimiser refuses them and every photo she
 *  adds through the admin panel fails to render on the shop. */
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
