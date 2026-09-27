"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import { buildQueryString, DEFAULT_FILTERS, parseFilters } from "@/lib/filters";
import type { ProductFilters } from "@/types/filters";

export interface FilterActions {
  setFilters: (patch: Partial<ProductFilters>) => void;
  toggle: (key: "talles" | "colores", value: string) => void;
  clear: () => void;
}

export function useProductFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);

  const setFilters = useCallback(
    (patch: Partial<ProductFilters>) => {
      const qs = buildQueryString(new URLSearchParams(searchParams), {
        ...filters,
        ...patch,
      });
      // replace: tocar filtros no debería llenar el historial del botón "atrás".
      router.replace(`${pathname}${qs}`, { scroll: false });
    },
    [filters, pathname, router, searchParams],
  );

  const actions = useMemo<FilterActions>(
    () => ({
      setFilters,
      toggle: (key, value) => {
        const current = filters[key];
        setFilters({
          [key]: current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value],
        });
      },
      clear: () =>
        setFilters({ ...DEFAULT_FILTERS, q: filters.q, orden: filters.orden }),
    }),
    [filters, setFilters],
  );

  const queryString = buildQueryString(
    new URLSearchParams(searchParams),
    filters,
  );

  return { filters, actions, queryString };
}
