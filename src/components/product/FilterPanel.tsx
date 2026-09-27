import { CategoryFilter } from "@/components/product/CategoryFilter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FilterActions } from "@/hooks/useProductFilters";
import { cn } from "@/lib/utils";
import type {
  CategoryFilterConfig,
  FilterOptions,
  ProductFilters,
} from "@/types/filters";

interface FilterPanelProps {
  filters: ProductFilters;
  options: FilterOptions;
  categoryConfig: CategoryFilterConfig;
  queryString: string;
  actions?: FilterActions;
}

export function FilterPanel({
  filters,
  options,
  categoryConfig,
  queryString,
  actions,
}: FilterPanelProps) {
  const hasCategories =
    categoryConfig.mode === "param"
      ? categoryConfig.tree.length > 0
      : categoryConfig.links.length > 0;
  const sections = [
    hasCategories && "categoria",
    "talle",
    "color",
    "oferta",
  ].filter((s): s is string => Boolean(s));

  return (
    <Accordion type="multiple" defaultValue={sections}>
      {hasCategories && (
        <AccordionItem value="categoria">
          <AccordionTrigger>Categoría</AccordionTrigger>
          <AccordionContent>
            <CategoryFilter
              config={categoryConfig}
              selected={filters.cat}
              queryString={queryString}
              onSelect={(cat) => actions?.setFilters({ cat })}
            />
          </AccordionContent>
        </AccordionItem>
      )}

      <AccordionItem value="talle">
        <AccordionTrigger>Talle</AccordionTrigger>
        <AccordionContent>
          <ul className="flex flex-wrap gap-2">
            {options.talles.map((talle) => {
              const active = filters.talles.includes(talle);
              return (
                <li key={talle}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => actions?.toggle("talles", talle)}
                    className={cn(
                      "flex size-11 items-center justify-center border text-sm transition-colors",
                      active
                        ? "border-ink bg-ink text-ivory"
                        : "border-input hover:border-ink",
                    )}
                  >
                    {talle}
                  </button>
                </li>
              );
            })}
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="color">
        <AccordionTrigger>Color</AccordionTrigger>
        <AccordionContent>
          <ul className="grid grid-cols-2 gap-x-2">
            {options.colores.map((color) => {
              const active = filters.colores.includes(color.slug);
              return (
                <li key={color.slug}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => actions?.toggle("colores", color.slug)}
                    className="flex min-h-11 w-full items-center gap-3 text-left text-sm"
                  >
                    <span
                      aria-hidden
                      style={{ backgroundColor: color.hex }}
                      className={cn(
                        "size-6 shrink-0 rounded-full border border-ink/15 ring-offset-2 ring-offset-background",
                        active && "ring-1 ring-ink",
                      )}
                    />
                    <span
                      className={cn(
                        active ? "font-medium" : "text-muted-foreground",
                      )}
                    >
                      {color.nombre}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="oferta">
        <AccordionTrigger>Precio</AccordionTrigger>
        <AccordionContent>
          <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={filters.oferta}
              onChange={(e) =>
                actions?.setFilters({ oferta: e.target.checked })
              }
              className="size-5 accent-ink"
            />
            Solo ofertas
          </label>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
