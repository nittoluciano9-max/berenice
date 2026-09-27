import { X } from "lucide-react";

import type { FilterActions } from "@/hooks/useProductFilters";
import type { FilterOptions, ProductFilters } from "@/types/filters";

interface ActiveFiltersProps {
  filters: ProductFilters;
  options: FilterOptions;
  categoryLabel: string | null;
  actions?: FilterActions;
}

interface Chip {
  key: string;
  label: string;
  onRemove: () => void;
}

export function ActiveFilters({
  filters,
  options,
  categoryLabel,
  actions,
}: ActiveFiltersProps) {
  const chips: Chip[] = [
    ...(categoryLabel
      ? [
          {
            key: "cat",
            label: categoryLabel,
            onRemove: () => actions?.setFilters({ cat: null }),
          },
        ]
      : []),
    ...filters.talles.map((t) => ({
      key: `talle-${t}`,
      label: `Talle ${t}`,
      onRemove: () => actions?.toggle("talles", t),
    })),
    ...filters.colores.map((slug) => ({
      key: `color-${slug}`,
      label: options.colores.find((c) => c.slug === slug)?.nombre ?? slug,
      onRemove: () => actions?.toggle("colores", slug),
    })),
    ...(filters.oferta
      ? [
          {
            key: "oferta",
            label: "Ofertas",
            onRemove: () => actions?.setFilters({ oferta: false }),
          },
        ]
      : []),
  ];

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <ul className="contents">
        {chips.map((chip) => (
          <li key={chip.key}>
            <button
              type="button"
              onClick={chip.onRemove}
              aria-label={`Quitar filtro ${chip.label}`}
              className="inline-flex min-h-11 items-center gap-1.5 bg-secondary px-3 text-xs transition-colors hover:bg-nude/40"
            >
              {chip.label}
              <X aria-hidden strokeWidth={1.5} className="size-3.5" />
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => actions?.clear()}
        className="min-h-11 px-2 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
      >
        Limpiar todo
      </button>
    </div>
  );
}
