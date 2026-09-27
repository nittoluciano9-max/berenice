import type { Product } from "@/types/product";

type Priced = Pick<Product, "precio" | "precioOferta">;

export function getPrecioFinal({ precio, precioOferta }: Priced): number {
  return precioOferta !== undefined && precioOferta < precio
    ? precioOferta
    : precio;
}

export function hasOferta(product: Priced): boolean {
  return getPrecioFinal(product) < product.precio;
}

/** Porcentaje entero redondeado; 0 si no hay oferta. */
export function getDescuento(product: Priced): number {
  return Math.round((1 - getPrecioFinal(product) / product.precio) * 100);
}
