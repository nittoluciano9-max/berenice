import { SlidersHorizontal } from "lucide-react";

import { FilterPanel } from "@/components/product/FilterPanel";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { FilterActions } from "@/hooks/useProductFilters";
import { countActiveFilters } from "@/lib/filters";
import type {
  CategoryFilterConfig,
  FilterOptions,
  ProductFilters as Filters,
} from "@/types/filters";

interface ProductFiltersProps {
  filters: Filters;
  options: FilterOptions;
  categoryConfig: CategoryFilterConfig;
  queryString: string;
  resultCount: number;
  actions?: FilterActions;
  /** "right" para desktop (vidriera de la home); por defecto, bottom sheet. */
  side?: "bottom" | "right";
}

/** Filtros en bottom sheet para mobile; en desktop el mismo FilterPanel va en la barra lateral. */
export function ProductFilters({
  resultCount,
  side = "bottom",
  ...panelProps
}: ProductFiltersProps) {
  const active = countActiveFilters(panelProps.filters);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="-ml-2 gap-2 px-2 text-xs tracking-[0.18em] uppercase"
        >
          <SlidersHorizontal strokeWidth={1.5} />
          Filtrar{active > 0 && ` (${active})`}
        </Button>
      </SheetTrigger>
      <SheetContent
        side={side}
        className={
          side === "bottom" ? "max-h-[85dvh] gap-0" : "w-full gap-0 sm:max-w-sm"
        }
      >
        <SheetHeader className="border-b px-4 py-4">
          <SheetTitle className="text-xl">Filtros</SheetTitle>
          <SheetDescription className="sr-only">
            Filtrá los productos por categoría, talle, color y precio.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4">
          <FilterPanel {...panelProps} />
        </div>
        <SheetFooter className="grid grid-cols-2 gap-3 border-t px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button
            variant="outline"
            onClick={() => panelProps.actions?.clear()}
            disabled={active === 0}
          >
            Limpiar
          </Button>
          <SheetClose asChild>
            <Button>
              Ver {resultCount} {resultCount === 1 ? "producto" : "productos"}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
