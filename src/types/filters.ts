import type { CategoryNode } from "@/types/category";
import type { ProductColor } from "@/types/product";

export type SortKey = "relevancia" | "novedades" | "precio-asc" | "precio-desc";

export interface ProductFilters {
  q: string;
  /** Slug de categoría o subcategoría; solo aplica en /productos. */
  cat: string | null;
  talles: string[];
  colores: string[];
  oferta: boolean;
  orden: SortKey;
}

export interface FilterOptions {
  talles: string[];
  colores: ProductColor[];
}

export interface CategoryLink {
  href: string;
  label: string;
}

/**
 * En /productos la categoría es un filtro más (`?cat=`).
 * En /categoria/[slug] las subcategorías son páginas propias, así que se navega.
 */
export type CategoryFilterConfig =
  | { mode: "param"; tree: CategoryNode[] }
  | { mode: "links"; links: CategoryLink[] };
