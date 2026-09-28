import type { Product } from "@/types/product";

const LABELS = { color: "Color", estampa: "Estampa" } as const;

/** Rótulo visible de la variante: "Estampa" en prendas estampadas, "Color" en el resto. */
export function getColorLabel(product: Pick<Product, "tipoVariante">): string {
  return LABELS[product.tipoVariante ?? "color"];
}

/** Para líneas del carrito: el rótulo viaja en el snapshot (ausente = "Color"). */
export function getItemColorLabel(item: { colorLabel?: string }): string {
  return item.colorLabel ?? LABELS.color;
}
