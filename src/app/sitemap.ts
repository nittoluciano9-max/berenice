import type { MetadataRoute } from "next";

import { getCategoryTree, getProducts } from "@/lib/catalog";
import { flattenCategoryTree } from "@/lib/filters";
import { categoryHref } from "@/lib/navigation";
import { absoluteUrl } from "@/lib/seo";

// Solo URLs canónicas: sin variantes de filtros (?cat=, ?orden=…), que apuntan a /productos.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, tree] = await Promise.all([
    getProducts(),
    getCategoryTree(),
  ]);

  const estaticas = ["/", "/productos", "/guia-de-talles", "/envios-y-cambios"];

  return [
    ...estaticas.map((path) => ({ url: absoluteUrl(path) })),
    ...flattenCategoryTree(tree).map((c) => ({
      url: absoluteUrl(categoryHref(c.slug)),
    })),
    ...products.map((p) => ({
      url: absoluteUrl(`/producto/${p.slug}`),
      lastModified: p.creadoEn,
    })),
  ];
}
