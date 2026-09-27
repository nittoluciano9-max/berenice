import { getPrecioFinal, hasOferta } from "@/lib/pricing";
import { isAgotado, isDisponible } from "@/lib/stock";
import type { CategoryNode } from "@/types/category";
import type { FilterOptions, ProductFilters, SortKey } from "@/types/filters";
import type { Product, ProductColor } from "@/types/product";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "relevancia", label: "Relevancia" },
  { value: "novedades", label: "Novedades" },
  { value: "precio-asc", label: "Menor precio" },
  { value: "precio-desc", label: "Mayor precio" },
];

export const DEFAULT_FILTERS: ProductFilters = {
  q: "",
  cat: null,
  talles: [],
  colores: [],
  oferta: false,
  orden: "relevancia",
};

/** Claves de URL que maneja el catálogo; el resto (ej. `ref`) se preserva intacto. */
const FILTER_KEYS = ["q", "cat", "talle", "color", "oferta", "orden"] as const;

const SIZE_ORDER = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];

// ---------- URL ----------

type ParamsReader = Pick<URLSearchParams, "get">;

function parseList(value: string | null): string[] {
  if (!value) return [];
  const values = value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  return [...new Set(values)];
}

function isSortKey(value: string | null): value is SortKey {
  return SORT_OPTIONS.some((o) => o.value === value);
}

export function parseFilters(params: ParamsReader): ProductFilters {
  const orden = params.get("orden");
  return {
    q: params.get("q")?.trim() ?? "",
    cat: params.get("cat")?.trim() || null,
    talles: parseList(params.get("talle")),
    colores: parseList(params.get("color")),
    oferta: params.get("oferta") === "1",
    orden: isSortKey(orden) ? orden : DEFAULT_FILTERS.orden,
  };
}

/** Query string canónica: orden fijo de claves, listas ordenadas y sin valores por defecto. */
export function buildQueryString(
  current: URLSearchParams,
  filters: ProductFilters,
): string {
  const params = new URLSearchParams(current);
  FILTER_KEYS.forEach((key) => params.delete(key));

  if (filters.q) params.set("q", filters.q);
  if (filters.cat) params.set("cat", filters.cat);
  if (filters.talles.length)
    params.set("talle", [...filters.talles].sort(compareTalles).join(","));
  if (filters.colores.length)
    params.set("color", [...filters.colores].sort().join(","));
  if (filters.oferta) params.set("oferta", "1");
  if (filters.orden !== DEFAULT_FILTERS.orden)
    params.set("orden", filters.orden);

  // Las comas se ven mejor sin codificar y siguen siendo una URL válida.
  const qs = params.toString().replaceAll("%2C", ",");
  return qs ? `?${qs}` : "";
}

/** Descarta valores que no existen en las opciones actuales (URLs viejas o editadas a mano). */
export function sanitizeFilters(
  filters: ProductFilters,
  options: FilterOptions,
  tree: CategoryNode[] | null,
): ProductFilters {
  const colorSlugs = new Set(options.colores.map((c) => c.slug));
  return {
    ...filters,
    cat:
      tree && filters.cat && findCategoryNode(tree, filters.cat)
        ? filters.cat
        : null,
    talles: filters.talles.filter((t) => options.talles.includes(t)),
    colores: filters.colores.filter((c) => colorSlugs.has(c)),
  };
}

export function countActiveFilters(filters: ProductFilters): number {
  return (
    (filters.cat ? 1 : 0) +
    filters.talles.length +
    filters.colores.length +
    (filters.oferta ? 1 : 0)
  );
}

// ---------- Categorías ----------

export function findCategoryNode(
  tree: CategoryNode[],
  slug: string,
): CategoryNode | null {
  for (const node of tree) {
    if (node.slug === slug) return node;
    const found = findCategoryNode(node.children, slug);
    if (found) return found;
  }
  return null;
}

function collectSlugs(node: CategoryNode): string[] {
  return [node.slug, ...node.children.flatMap(collectSlugs)];
}

export function flattenCategoryTree(tree: CategoryNode[]): CategoryNode[] {
  return tree.flatMap((node) => [node, ...flattenCategoryTree(node.children)]);
}

// ---------- Búsqueda ----------

export function normalizeText(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function searchableText(
  product: Product,
  categoryNames: Map<string, string>,
): string {
  return normalizeText(
    [
      product.nombre,
      product.descripcion,
      ...(product.tags ?? []),
      ...product.colores.map((c) => c.nombre),
      categoryNames.get(product.categoria) ?? product.categoria,
      product.subcategoria
        ? (categoryNames.get(product.subcategoria) ?? product.subcategoria)
        : "",
    ].join(" "),
  );
}

// ---------- Filtrado y orden ----------

export function filterProducts(
  products: Product[],
  filters: ProductFilters,
  tree: CategoryNode[],
): Product[] {
  const catNode = filters.cat ? findCategoryNode(tree, filters.cat) : null;
  const catSlugs = catNode ? new Set(collectSlugs(catNode)) : null;
  const categoryNames = new Map(
    flattenCategoryTree(tree).map((c) => [c.slug, c.nombre]),
  );
  const terms = normalizeText(filters.q).split(/\s+/).filter(Boolean);

  return products.filter((p) => {
    if (
      catSlugs &&
      !catSlugs.has(p.categoria) &&
      !(p.subcategoria && catSlugs.has(p.subcategoria))
    )
      return false;
    if (filters.oferta && !hasOferta(p)) return false;
    if (
      filters.colores.length &&
      !p.colores.some((c) => filters.colores.includes(c.slug))
    )
      return false;
    // Filtrar por talle implica querer comprarlo: se exige stock en esa combinación.
    if (
      filters.talles.length &&
      !isDisponible(p, { talles: filters.talles, colores: filters.colores })
    )
      return false;
    if (terms.length) {
      const text = searchableText(p, categoryNames);
      if (!terms.every((term) => text.includes(term))) return false;
    }
    return true;
  });
}

const byFecha = (a: Product, b: Product) =>
  (b.creadoEn ?? "").localeCompare(a.creadoEn ?? "");
const byNombre = (a: Product, b: Product) =>
  a.nombre.localeCompare(b.nombre, "es");

const comparators: Record<SortKey, (a: Product, b: Product) => number> = {
  relevancia: (a, b) =>
    Number(isAgotado(a)) - Number(isAgotado(b)) ||
    Number(b.destacado) - Number(a.destacado) ||
    byFecha(a, b),
  novedades: byFecha,
  "precio-asc": (a, b) => getPrecioFinal(a) - getPrecioFinal(b),
  "precio-desc": (a, b) => getPrecioFinal(b) - getPrecioFinal(a),
};

export function sortProducts(products: Product[], orden: SortKey): Product[] {
  return [...products].sort(
    (a, b) => comparators[orden](a, b) || byNombre(a, b),
  );
}

// ---------- Opciones disponibles ----------

export function compareTalles(a: string, b: string): number {
  const ia = SIZE_ORDER.indexOf(a.toUpperCase());
  const ib = SIZE_ORDER.indexOf(b.toUpperCase());
  if (ia !== -1 && ib !== -1) return ia - ib;
  if (ia !== -1) return -1;
  if (ib !== -1) return 1;
  const na = Number(a);
  const nb = Number(b);
  if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
  return a.localeCompare(b, "es");
}

export function getFilterOptions(products: Product[]): FilterOptions {
  const talles = new Set<string>();
  const colores = new Map<string, ProductColor>();
  for (const p of products) {
    p.talles.forEach((t) => talles.add(t));
    p.colores.forEach((c) => {
      if (!colores.has(c.slug)) colores.set(c.slug, c);
    });
  }
  return {
    talles: [...talles].sort(compareTalles),
    colores: [...colores.values()].sort((a, b) =>
      a.nombre.localeCompare(b.nombre, "es"),
    ),
  };
}
