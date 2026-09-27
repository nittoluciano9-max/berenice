"use client";

import Link from "next/link";
import { useMemo } from "react";

import { Container } from "@/components/layout/Container";
import { ActiveFilters } from "@/components/product/ActiveFilters";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CategoryChips } from "@/components/showcase/CategoryChips";
import { CategorySidebar } from "@/components/showcase/CategorySidebar";
import { MiniHero } from "@/components/showcase/MiniHero";
import { QuickAccess } from "@/components/showcase/QuickAccess";
import { ShowcaseToolbar } from "@/components/showcase/ShowcaseToolbar";
import { Button } from "@/components/ui/button";
import type { FilterActions } from "@/hooks/useProductFilters";
import {
  findCategoryNode,
  getFilterOptions,
  sanitizeFilters,
} from "@/lib/filters";
import {
  buildShowcaseHref,
  getShowcaseGroups,
  getShowcaseProducts,
} from "@/lib/showcase";
import type { CategoryNode } from "@/types/category";
import type { ProductFilters } from "@/types/filters";
import type { Product } from "@/types/product";
import type { ShowcaseTab } from "@/types/showcase";

export interface ShowcaseViewProps {
  products: Product[];
  tree: CategoryNode[];
  maxDescuento: number;
  filters: ProductFilters;
  tab: ShowcaseTab;
  /** Query string actual (sin "?"): base de todos los links de la vidriera. */
  params: string;
  /** Ausente en el render previo a leer la URL (fallback estático). */
  actions?: FilterActions;
  gridRef?: React.Ref<HTMLDivElement>;
}

const aside =
  "sticky top-20 hidden max-h-[calc(100dvh-5rem)] self-start overflow-y-auto py-6";

export function ShowcaseView(props: ShowcaseViewProps) {
  const { products, tree, maxDescuento, tab, params, actions, gridRef } = props;
  const options = useMemo(() => getFilterOptions(products), [products]);
  const filters = useMemo(
    () => sanitizeFilters(props.filters, options, tree),
    [props.filters, options, tree],
  );
  const result = useMemo(
    () => getShowcaseProducts(products, filters, tab, tree),
    [products, filters, tab, tree],
  );
  const groups = useMemo(() => getShowcaseGroups(tree), [tree]);
  const categoria = filters.cat ? findCategoryNode(tree, filters.cat) : null;
  const titulo = categoria?.nombre ?? "Todos";
  const ofertasHref = buildShowcaseHref(params, { tab: "ofertas" });

  return (
    <Container
      data-showcase
      className="max-w-[100rem] lg:grid lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[12rem_minmax(0,1fr)_15rem] 2xl:grid-cols-[13rem_minmax(0,1fr)_17rem]"
    >
      {/* Sin aria-label propio: el <nav aria-label="Categorías"> de adentro ya lo nombra. */}
      <aside className={`${aside} lg:block`}>
        <CategorySidebar
          groups={groups}
          selected={filters.cat}
          params={params}
        />
      </aside>

      <div className="min-w-0 space-y-4 pt-4 pb-10 lg:pt-6 lg:pb-12">
        <MiniHero />

        <div className="sticky top-16 z-30 -mx-4 bg-background/95 px-4 py-2 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:hidden">
          <CategoryChips
            groups={groups}
            selected={filters.cat}
            params={params}
          />
        </div>

        <div ref={gridRef} className="scroll-mt-32 space-y-4 lg:scroll-mt-24">
          <ShowcaseToolbar
            tab={tab}
            params={params}
            filters={filters}
            options={options}
            resultCount={result.length}
            titulo={titulo}
            actions={actions}
          />
          <ActiveFilters
            filters={{ ...filters, oferta: false }}
            options={options}
            categoryLabel={null}
            actions={actions}
          />
          <ProductGrid
            products={result}
            columns="auto"
            empty={
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <p className="font-serif text-2xl">
                  No hay productos para mostrar acá
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {tab !== "destacados" && (
                    <Button asChild variant="outline">
                      <Link
                        href={buildShowcaseHref(params, { tab: "destacados" })}
                        replace
                        scroll={false}
                      >
                        Ver todo {categoria ? categoria.nombre : ""}
                      </Link>
                    </Button>
                  )}
                  {categoria && (
                    <Button asChild variant="outline">
                      <Link
                        href={buildShowcaseHref(params, { cat: null })}
                        scroll={false}
                      >
                        Ver todas las categorías
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            }
          />
        </div>

        {/* Sin columna derecha (< xl): los accesos rápidos van al final de la grilla. */}
        <QuickAccess
          maxDescuento={maxDescuento}
          ofertasHref={ofertasHref}
          className="pt-6 sm:grid-cols-2 xl:hidden"
        />
      </div>

      <aside aria-label="Accesos rápidos" className={`${aside} xl:block`}>
        <QuickAccess maxDescuento={maxDescuento} ofertasHref={ofertasHref} />
      </aside>
    </Container>
  );
}
