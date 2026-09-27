import type { Product, StockStatus } from "@/types/product";

interface StockCriteria {
  talles?: string[];
  colores?: string[];
}

// Stock simulado (V1): solo informa disponibilidad, nunca se reserva ni se descuenta.
export function isDisponible(
  product: Product,
  criteria: StockCriteria = {},
): boolean {
  const matchTalle = (talle: string) =>
    !criteria.talles?.length || criteria.talles.includes(talle);
  const matchColor = (color: string) =>
    !criteria.colores?.length || criteria.colores.includes(color);

  if (product.variantes?.length) {
    return product.variantes.some(
      (v) => v.stock > 0 && matchTalle(v.talle) && matchColor(v.color),
    );
  }
  return (
    product.stock > 0 &&
    product.talles.some(matchTalle) &&
    product.colores.some((c) => matchColor(c.slug))
  );
}

export function isAgotado(product: Product): boolean {
  return !isDisponible(product);
}

/** Hasta este stock se muestra "Últimas unidades". */
export const LOW_STOCK_THRESHOLD = 2;

/**
 * Stock de una combinación. Sin variantes, el stock es global del producto:
 * no se puede distinguir por talle ni color.
 */
export function getStock(
  product: Product,
  color: string,
  talle: string,
): number {
  if (!product.variantes?.length) return product.stock;
  return (
    product.variantes.find((v) => v.color === color && v.talle === talle)
      ?.stock ?? 0
  );
}

export function getStockStatus(stock: number): StockStatus {
  if (stock <= 0) return "agotado";
  if (stock <= LOW_STOCK_THRESHOLD) return "ultimas";
  return "disponible";
}

export const STOCK_LABELS: Record<StockStatus, string> = {
  disponible: "Disponible",
  ultimas: "Últimas unidades",
  agotado: "Sin stock",
};

/** Tope de unidades por línea, aunque el stock simulado sea mayor. */
export const MAX_CANTIDAD = 10;

export function getMaxCantidad(
  product: Product,
  color: string,
  talle: string | null,
): number {
  if (!talle) return MAX_CANTIDAD;
  return Math.min(getStock(product, color, talle), MAX_CANTIDAD);
}

/** Primer color con stock; si no hay ninguno, el primero. */
export function getDefaultColor(product: Product): string {
  const conStock = product.colores.find((c) =>
    isDisponible(product, { colores: [c.slug] }),
  );
  return (conStock ?? product.colores[0])?.slug ?? "";
}
