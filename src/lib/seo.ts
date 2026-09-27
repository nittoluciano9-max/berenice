import type { Metadata } from "next";

import { config } from "@/lib/config";
import { getPrecioFinal } from "@/lib/pricing";
import { isAgotado } from "@/lib/stock";
import type { Product } from "@/types/product";

export function absoluteUrl(path: string): string {
  return new URL(path, config.siteUrl).toString();
}

// Next reemplaza el openGraph del layout (no lo combina): cada página parte de esta base.
export const baseOpenGraph = {
  type: "website",
  locale: "es_AR",
  siteName: config.siteName,
} satisfies NonNullable<Metadata["openGraph"]>;

export const defaultOgImage = {
  url: "/images/brand/logo-berenice.jpg",
  alt: `Logo de ${config.siteName}`,
};

/** schema.org/Product para resultados enriquecidos (precio y disponibilidad). */
export function buildProductJsonLd(product: Product) {
  const url = absoluteUrl(`/producto/${product.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.nombre,
    description: product.descripcion,
    image: product.imagenes.map((i) => absoluteUrl(i.src)),
    url,
    brand: { "@type": "Brand", name: config.siteName },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "ARS",
      price: getPrecioFinal(product),
      availability: isAgotado(product)
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
    },
  };
}
