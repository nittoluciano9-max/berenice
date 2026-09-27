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

/** Mayor descuento de la lista, para textos tipo "hasta 20% off"; 0 si no hay ofertas. */
export function getMaxDescuento(products: Priced[]): number {
  return products.reduce((max, p) => Math.max(max, getDescuento(p)), 0);
}
