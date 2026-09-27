"use client";

import {
  ProductCatalogView,
  type ProductCatalogViewProps,
} from "@/components/product/ProductCatalogView";
import { useProductFilters } from "@/hooks/useProductFilters";

type ProductCatalogProps = Pick<
  ProductCatalogViewProps,
  "products" | "categoryConfig"
>;

/** Conecta la vista con la URL. Debe renderizarse dentro de <Suspense> (usa useSearchParams). */
export function ProductCatalog(props: ProductCatalogProps) {
  const { filters, actions, queryString } = useProductFilters();
  return (
    <ProductCatalogView
      {...props}
      filters={filters}
      actions={actions}
      queryString={queryString}
    />
  );
}
