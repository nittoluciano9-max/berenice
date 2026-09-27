import {
  buildQueryString,
  filterProducts,
  parseFilters,
  sortProducts,
} from "@/lib/filters";
import type { CategoryNode } from "@/types/category";
import type { ProductFilters } from "@/types/filters";
import type { Product } from "@/types/product";
import type { ShowcaseCategoryGroup, ShowcaseTab } from "@/types/showcase";

// Única clave de URL propia de la vidriera; el resto (cat, talle, oferta…) es la del catálogo.
export const VISTA_PARAM = "vista";

export const SHOWCASE_TABS: { value: ShowcaseTab; label: string }[] = [
  { value: "destacados", label: "Destacados" },
  { value: "nuevos", label: "Nuevos" },
  { value: "ofertas", label: "Ofertas" },
];

type ParamsReader = Pick<URLSearchParams, "get">;

export function getShowcaseTab(
  filters: ProductFilters,
  params: ParamsReader,
): ShowcaseTab {
  if (filters.oferta) return "ofertas";
  return params.get(VISTA_PARAM) === "nuevos" ? "nuevos" : "destacados";
}

/**
 * "Destacados" no filtra: muestra todo con los destacados primero (orden por relevancia).
 * Filtrar estricto dejaría vacías varias categorías.
 */
export function getShowcaseProducts(
  products: Product[],
  filters: ProductFilters,
  tab: ShowcaseTab,
  tree: CategoryNode[],
): Product[] {
  const filtrados = filterProducts(products, filters, tree);
  const porTab =
    tab === "nuevos" ? filtrados.filter((p) => p.nuevo) : filtrados;
  return sortProducts(porTab, filters.orden);
}

interface ShowcasePatch {
  /** `null` = Todos. */
  cat?: string | null;
  tab?: ShowcaseTab;
}

/** Link de la vidriera que conserva el resto del estado de la URL. */
export function buildShowcaseHref(
  current: string | URLSearchParams,
  patch: ShowcasePatch,
): string {
  const params = new URLSearchParams(current);
  const filters = parseFilters(params);

  if (patch.cat !== undefined && patch.cat !== filters.cat) {
    filters.cat = patch.cat;
    // Talles y colores de otra categoría suelen no existir en la nueva (letra vs. número).
    filters.talles = [];
    filters.colores = [];
  }
  if (patch.tab) {
    filters.oferta = patch.tab === "ofertas";
    if (patch.tab === "nuevos") params.set(VISTA_PARAM, "nuevos");
    else params.delete(VISTA_PARAM);
  }
  return `/${buildQueryString(params, filters)}`;
}

/** Grupos para la barra de categorías: se arman del árbol, así que una categoría nueva aparece sola. */
export function getShowcaseGroups(
  tree: CategoryNode[],
): ShowcaseCategoryGroup[] {
  return tree.map((root) => ({
    titulo: root.nombre,
    items: (root.children.length > 0 ? root.children : [root]).map((c) => ({
      slug: c.slug,
      nombre: c.nombre,
    })),
  }));
}
