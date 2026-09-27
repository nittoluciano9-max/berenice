"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import {
  useProductFilters,
  type FilterActions,
} from "@/hooks/useProductFilters";
import { getShowcaseTab } from "@/lib/showcase";

/** Estado de la vidriera desde la URL. Debe usarse dentro de <Suspense> (useSearchParams). */
export function useShowcase() {
  const searchParams = useSearchParams();
  const { filters, actions } = useProductFilters();

  // En la home la categoría la maneja la barra lateral: "Limpiar" solo borra talle y color.
  const showcaseActions = useMemo<FilterActions>(
    () => ({
      ...actions,
      clear: () => actions.setFilters({ talles: [], colores: [] }),
    }),
    [actions],
  );

  return {
    filters,
    actions: showcaseActions,
    tab: getShowcaseTab(filters, searchParams),
    params: searchParams.toString(),
  };
}
