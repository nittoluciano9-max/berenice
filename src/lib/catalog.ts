import { categories } from "@/data/categories";
import { products } from "@/data/products";
import type { Category, CategoryNode } from "@/types/category";
import type { Product } from "@/types/product";

// Todas las funciones son async a propósito: la firma no cambia cuando los datos vengan de una BD.

export interface GetProductsOptions {
  /** Slug de categoría; incluye los productos de todas sus subcategorías. */
  categoria?: string;
  destacado?: boolean;
  nuevo?: boolean;
  limit?: number;
}

const byOrden = (a: Category, b: Category) => a.orden - b.orden;

/** Categorías activas cuyo camino hasta la raíz también está activo. */
function visibleCategories(): Category[] {
  const byId = new Map(categories.map((c) => [c.id, c]));
  const isVisible = (category: Category): boolean => {
    if (!category.activo) return false;
    if (category.parentId === null) return true;
    const parent = byId.get(category.parentId);
    return parent !== undefined && isVisible(parent);
  };
  return categories.filter(isVisible);
}

function visibleCategorySlugs(): Set<string> {
  return new Set(visibleCategories().map((c) => c.slug));
}

function isProductVisible(product: Product, slugs: Set<string>): boolean {
  return (
    product.activo &&
    slugs.has(product.categoria) &&
    (product.subcategoria === null || slugs.has(product.subcategoria))
  );
}

function descendantSlugs(slug: string): Set<string> {
  const visible = visibleCategories();
  const root = visible.find((c) => c.slug === slug);
  if (!root) return new Set();

  const result = new Set([root.slug]);
  const pending = [root.id];
  while (pending.length > 0) {
    const parentId = pending.pop();
    for (const child of visible.filter((c) => c.parentId === parentId)) {
      result.add(child.slug);
      pending.push(child.id);
    }
  }
  return result;
}

export async function getProducts(
  options: GetProductsOptions = {},
): Promise<Product[]> {
  const slugs = visibleCategorySlugs();
  const inCategoria = options.categoria
    ? descendantSlugs(options.categoria)
    : null;

  const result = products.filter(
    (p) =>
      isProductVisible(p, slugs) &&
      (inCategoria === null ||
        inCategoria.has(p.categoria) ||
        (p.subcategoria !== null && inCategoria.has(p.subcategoria))) &&
      (options.destacado === undefined || p.destacado === options.destacado) &&
      (options.nuevo === undefined || p.nuevo === options.nuevo),
  );

  return options.limit === undefined ? result : result.slice(0, options.limit);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const slugs = visibleCategorySlugs();
  return (
    products.find((p) => p.slug === slug && isProductVisible(p, slugs)) ?? null
  );
}

export async function getCategoryTree(): Promise<CategoryNode[]> {
  const visible = visibleCategories().sort(byOrden);
  const build = (parentId: string | null): CategoryNode[] =>
    visible
      .filter((c) => c.parentId === parentId)
      .map((c) => ({ ...c, children: build(c.id) }));
  return build(null);
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  return visibleCategories().find((c) => c.slug === slug) ?? null;
}

/** Camino desde la raíz hasta la categoría (para breadcrumbs). */
export async function getCategoryPath(slug: string): Promise<Category[]> {
  const visible = visibleCategories();
  const path: Category[] = [];
  let current = visible.find((c) => c.slug === slug);
  while (current) {
    path.unshift(current);
    const parentId = current.parentId;
    current =
      parentId === null ? undefined : visible.find((c) => c.id === parentId);
  }
  return path;
}

/** Misma subcategoría primero, después misma categoría raíz. */
export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const candidates = (
    await getProducts({ categoria: product.categoria })
  ).filter((p) => p.id !== product.id);
  const sameSub = candidates.filter(
    (p) =>
      product.subcategoria !== null && p.subcategoria === product.subcategoria,
  );
  const rest = candidates.filter((p) => !sameSub.includes(p));
  return [...sameSub, ...rest].slice(0, limit);
}
