"use client";

import { useMemo } from "react";

import { ActiveFilters } from "@/components/product/ActiveFilters";
import { FilterPanel } from "@/components/product/FilterPanel";
import { ProductFilters } from "@/components/product/ProductFilters";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SortSelect } from "@/components/product/SortSelect";
import { Button } from "@/components/ui/button";
import type { FilterActions } from "@/hooks/useProductFilters";
import {
  countActiveFilters,
  filterProducts,
  findCategoryNode,
  getFilterOptions,
  sanitizeFilters,
  sortProducts,
} from "@/lib/filters";
import type {
  CategoryFilterConfig,
  ProductFilters as Filters,
} from "@/types/filters";
import type { Product } from "@/types/product";

export interface ProductCatalogViewProps {
  products: Product[];
  categoryConfig: CategoryFilterConfig;
  filters: Filters;
  queryString?: string;
  /** Ausente en el render previo a leer la URL (fallback estático). */
  actions?: FilterActions;
}

export function ProductCatalogView({
  products,
  categoryConfig,
  filters: rawFilters,
  queryString = "",
  actions,
}: ProductCatalogViewProps) {
  const tree = categoryConfig.mode === "param" ? categoryConfig.tree : null;
  const options = useMemo(() => getFilterOptions(products), [products]);
  const filters = useMemo(
    () => sanitizeFilters(rawFilters, options, tree),
    [rawFilters, options, tree],
  );
  const result = useMemo(
    () =>
      sortProducts(
        filterProducts(products, filters, tree ?? []),
        filters.orden,
      ),
    [products, filters, tree],
  );
  const categoryLabel =
    tree && filters.cat
      ? (findCategoryNode(tree, filters.cat)?.nombre ?? null)
      : null;
  const panelProps = { filters, options, categoryConfig, queryString, actions };

  return (
    <div className="lg:grid lg:grid-cols-[15rem_1fr] lg:gap-12">
      <aside aria-label="Filtros" className="hidden lg:block">
        <FilterPanel {...panelProps} />
      </aside>

      <div className="min-w-0">
        {filters.q && (
          <div className="mb-4 flex flex-wrap items-baseline gap-x-3">
            <p className="font-serif text-2xl">Resultados para «{filters.q}»</p>
            <button
              type="button"
              onClick={() => actions?.setFilters({ q: "" })}
              className="min-h-11 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              Borrar búsqueda
            </button>
          </div>
        )}

        <div className="sticky top-16 z-30 -mx-4 flex items-center justify-between gap-2 border-b bg-background/95 px-4 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:border-b-0 lg:bg-transparent lg:px-0 lg:backdrop-blur-none">
          <div className="lg:hidden">
            <ProductFilters {...panelProps} resultCount={result.length} />
          </div>
          <p className="text-xs text-muted-foreground" aria-live="polite">
            {result.length} {result.length === 1 ? "producto" : "productos"}
          </p>
          <SortSelect
            value={filters.orden}
            onChange={(orden) => actions?.setFilters({ orden })}
          />
        </div>

        <div className="mt-4 mb-6">
          <ActiveFilters
            filters={filters}
            options={options}
            categoryLabel={categoryLabel}
            actions={actions}
          />
        </div>

        <ProductGrid
          products={result}
          empty={
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <p className="font-serif text-2xl">No encontramos productos</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Probá con otros filtros o buscá con otras palabras.
              </p>
              {countActiveFilters(filters) > 0 ? (
                <Button variant="outline" onClick={() => actions?.clear()}>
                  Limpiar filtros
                </Button>
              ) : (
                filters.q && (
                  <Button
                    variant="outline"
                    onClick={() => actions?.setFilters({ q: "" })}
                  >
                    Borrar búsqueda
                  </Button>
                )
              )}
            </div>
          }
        />
      </div>
    </div>
  );
}
