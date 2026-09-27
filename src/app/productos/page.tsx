import type { Metadata } from "next";
import { Suspense } from "react";

import { Breadcrumbs } from "@/components/category/Breadcrumbs";
import { Container } from "@/components/layout/Container";
import { ProductCatalog } from "@/components/product/ProductCatalog";
import { ProductCatalogView } from "@/components/product/ProductCatalogView";
import { getCategoryTree, getProducts } from "@/lib/catalog";
import { DEFAULT_FILTERS } from "@/lib/filters";
import type { CategoryFilterConfig } from "@/types/filters";

export const metadata: Metadata = {
  title: "Productos",
  description:
    "Toda la colección de lencería e indumentaria femenina de Berenice.",
};

export default async function ProductosPage() {
  const [products, tree] = await Promise.all([
    getProducts(),
    getCategoryTree(),
  ]);
  const categoryConfig: CategoryFilterConfig = { mode: "param", tree };

  return (
    <Container className="pt-4 pb-16 lg:pt-8 lg:pb-24">
      <header className="mb-6 lg:mb-10">
        <Breadcrumbs
          items={[{ label: "Inicio", href: "/" }, { label: "Productos" }]}
        />
        <h1 className="mt-2 text-4xl lg:text-5xl">Productos</h1>
      </header>

      {/* La página se genera estática; el filtrado por URL ocurre en el cliente. El fallback es
          la grilla completa sin filtros, así el HTML inicial ya lista todos los productos. */}
      <Suspense
        fallback={
          <ProductCatalogView
            products={products}
            categoryConfig={categoryConfig}
            filters={DEFAULT_FILTERS}
          />
        }
      >
        <ProductCatalog products={products} categoryConfig={categoryConfig} />
      </Suspense>
    </Container>
  );
}
