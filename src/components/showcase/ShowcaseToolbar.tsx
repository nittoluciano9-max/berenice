import { ProductFilters } from "@/components/product/ProductFilters";
import { SortSelect } from "@/components/product/SortSelect";
import { ShowcaseTabs } from "@/components/showcase/ShowcaseTabs";
import type { FilterActions } from "@/hooks/useProductFilters";
import type {
  CategoryFilterConfig,
  FilterOptions,
  ProductFilters as Filters,
} from "@/types/filters";
import type { ShowcaseTab } from "@/types/showcase";

interface ShowcaseToolbarProps {
  tab: ShowcaseTab;
  params: string;
  filters: Filters;
  options: FilterOptions;
  resultCount: number;
  titulo: string;
  actions?: FilterActions;
}

// La categoría la maneja la barra lateral: el panel de filtros solo muestra talle, color y precio.
const SIN_CATEGORIAS: CategoryFilterConfig = { mode: "links", links: [] };

export function ShowcaseToolbar({
  tab,
  params,
  filters,
  options,
  resultCount,
  titulo,
  actions,
}: ShowcaseToolbarProps) {
  const panelProps = {
    filters: { ...filters, cat: null },
    options,
    categoryConfig: SIN_CATEGORIAS,
    queryString: "",
    resultCount,
    actions,
  };

  return (
    <div className="flex flex-col gap-1 border-b lg:flex-row lg:items-center lg:justify-between lg:gap-6">
      <ShowcaseTabs tab={tab} params={params} />
      <div className="flex items-center justify-between gap-4 lg:justify-end">
        {/* En mobile la categoría ya se ve en el chip activo: solo el número, en una línea. */}
        <p
          className="text-xs whitespace-nowrap text-muted-foreground"
          aria-live="polite"
        >
          <span className="hidden sm:inline">{titulo} · </span>
          {resultCount} {resultCount === 1 ? "producto" : "productos"}
        </p>
        <div className="flex items-center gap-1">
          <div className="lg:hidden">
            <ProductFilters {...panelProps} />
          </div>
          <div className="hidden lg:block">
            <ProductFilters {...panelProps} side="right" />
          </div>
          <SortSelect
            value={filters.orden}
            onChange={(orden) => actions?.setFilters({ orden })}
          />
        </div>
      </div>
    </div>
  );
}
