import type { Metadata } from "next";
import { Suspense } from "react";

import { InstagramSection } from "@/components/home/InstagramSection";
import { ShopShowcase } from "@/components/showcase/ShopShowcase";
import { ShowcaseView } from "@/components/showcase/ShowcaseView";
import { getCategoryTree, getProducts } from "@/lib/catalog";
import { DEFAULT_FILTERS } from "@/lib/filters";
import { getMaxDescuento } from "@/lib/pricing";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [products, tree, ofertas] = await Promise.all([
    getProducts(),
    getCategoryTree(),
    getProducts({ oferta: true }),
  ]);
  const data = { products, tree, maxDescuento: getMaxDescuento(ofertas) };

  // Igual que /productos: la página es estática y la vidriera filtra en el cliente según la URL.
  // El fallback (sin filtros) hace que el HTML inicial ya liste todos los productos.
  return (
    <>
      <Suspense
        fallback={
          <ShowcaseView
            {...data}
            filters={DEFAULT_FILTERS}
            tab="destacados"
            params=""
          />
        }
      >
        <ShopShowcase {...data} />
      </Suspense>
      <InstagramSection />
    </>
  );
}
