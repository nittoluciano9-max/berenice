"use client";

import { useEffect, useRef } from "react";

import {
  ShowcaseView,
  type ShowcaseViewProps,
} from "@/components/showcase/ShowcaseView";
import { useShowcase } from "@/hooks/useShowcase";

type ShopShowcaseProps = Pick<
  ShowcaseViewProps,
  "products" | "tree" | "maxDescuento"
>;

/** Conecta la vidriera con la URL. Debe renderizarse dentro de <Suspense> (usa useSearchParams). */
export function ShopShowcase(props: ShopShowcaseProps) {
  const { filters, actions, tab, params } = useShowcase();
  const gridRef = useRef<HTMLDivElement>(null);
  const prevCat = useRef(filters.cat);

  // Los links usan scroll={false} para no saltar arriba de todo; pero si al cambiar de
  // categoría la grilla quedó por encima del viewport, se vuelve al inicio de los productos.
  useEffect(() => {
    if (prevCat.current === filters.cat) return;
    prevCat.current = filters.cat;
    const grid = gridRef.current;
    if (grid && grid.getBoundingClientRect().top < 0) {
      grid.scrollIntoView({ block: "start" });
    }
  }, [filters.cat]);

  return (
    <ShowcaseView
      {...props}
      filters={filters}
      actions={actions}
      tab={tab}
      params={params}
      gridRef={gridRef}
    />
  );
}
