import type { NextConfig } from "next";

import { isIndexingAllowed } from "./src/lib/config";

const NOINDEX = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];

const nextConfig: NextConfig = {
  // El header cubre también lo que no es HTML (imágenes, sitemap), donde el <meta> no llega.
  async headers() {
    const admin = [
      { source: "/admin", headers: NOINDEX },
      { source: "/admin/:path*", headers: NOINDEX },
    ];
    if (isIndexingAllowed(process.env.NEXT_PUBLIC_ALLOW_INDEXING)) return admin;
    return [{ source: "/:path*", headers: NOINDEX }, ...admin];
  },
};

export default nextConfig;
