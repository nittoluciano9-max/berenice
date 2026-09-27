import type { Product } from "@/types/product";

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
