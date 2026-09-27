import type { MetadataRoute } from "next";

import { config } from "@/lib/config";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  // Sin Disallow: / a propósito: si se bloquea el rastreo, el buscador no llega a leer el
  // noindex (meta + X-Robots-Tag) y una URL enlazada desde afuera podría indexarse igual.
  const rules = { userAgent: "*", allow: "/", disallow: "/admin" };
  return config.allowIndexing
    ? { rules, sitemap: absoluteUrl("/sitemap.xml") }
    : { rules };
}
