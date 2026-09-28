import { getPrecioFinal } from "@/lib/pricing";
import { getColorLabel } from "@/lib/variants";
import type { AddResult, CartItem, VariantPatch } from "@/types/cart";
import type { Product } from "@/types/product";

export function getLineId(
  productId: string,
  color: string,
  talle: string,
): string {
  return `${productId}:${color}:${talle}`;
}

export function getImagenForColor(product: Product, color: string): string {
  const propias = product.colores.find((c) => c.slug === color)?.imagenes;
  return (propias?.[0] ?? product.imagenes[0])?.src ?? "";
}

/** Snapshot de la línea: precios y nombres quedan fijos al momento de agregar. */
export function buildCartItem(
  product: Product,
  color: string,
  talle: string,
  cantidad: number,
): CartItem {
  return {
    id: getLineId(product.id, color, talle),
    productId: product.id,
    slug: product.slug,
    nombre: product.nombre,
    imagen: getImagenForColor(product, color),
    color,
    colorNombre: product.colores.find((c) => c.slug === color)?.nombre ?? color,
    // Solo si no es el default: los carritos ya guardados (sin el campo) siguen leyendo "Color".
    ...(product.tipoVariante === "estampa" && {
      colorLabel: getColorLabel(product),
    }),
    talle,
    precioUnitario: getPrecioFinal(product),
    precioLista: product.precio,
    cantidad,
  };
}

const clamp = (cantidad: number, max: number) =>
  Math.max(1, Math.min(cantidad, max));

// ---------- Transformaciones puras de la lista (las usa el store) ----------

/** Misma combinación producto + color + talle suma cantidad, con tope de stock. */
export function addLine(
  items: CartItem[],
  item: CartItem,
  max: number,
): { items: CartItem[]; result: AddResult } {
  if (max <= 0)
    return { items, result: { agregadas: 0, cantidad: 0, limitado: true } };

  const existente = items.find((i) => i.id === item.id);
  const previa = existente?.cantidad ?? 0;
  const cantidad = Math.min(previa + item.cantidad, max);
  const result: AddResult = {
    agregadas: cantidad - previa,
    cantidad,
    limitado: previa + item.cantidad > max,
  };

  const next = existente
    ? items.map((i) => (i.id === item.id ? { ...i, cantidad } : i))
    : [...items, { ...item, cantidad }];
  return { items: next, result };
}

export function updateLineQuantity(
  items: CartItem[],
  id: string,
  cantidad: number,
  max: number,
): CartItem[] {
  return items.map((i) =>
    i.id === id ? { ...i, cantidad: clamp(cantidad, max) } : i,
  );
}

/** Si la variante nueva ya está en el carrito, las líneas se unen respetando el tope. */
export function changeLineVariant(
  items: CartItem[],
  id: string,
  patch: VariantPatch,
  max: number,
): CartItem[] {
  const linea = items.find((i) => i.id === id);
  if (!linea || max <= 0) return items;

  const nuevoId = getLineId(linea.productId, patch.color, patch.talle);
  if (nuevoId === id) return items;

  const destino = items.find((i) => i.id === nuevoId);
  if (destino) {
    const cantidad = clamp(destino.cantidad + linea.cantidad, max);
    return items
      .filter((i) => i.id !== id)
      .map((i) => (i.id === nuevoId ? { ...i, cantidad } : i));
  }

  return items.map((i) =>
    i.id === id
      ? { ...i, ...patch, id: nuevoId, cantidad: clamp(i.cantidad, max) }
      : i,
  );
}

// ---------- Derivados ----------

export function getItemCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.cantidad, 0);
}

export function getSubtotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.precioUnitario * i.cantidad, 0);
}

export function getAhorro(items: CartItem[]): number {
  return items.reduce(
    (sum, i) => sum + (i.precioLista - i.precioUnitario) * i.cantidad,
    0,
  );
}

/** En V1 el envío se acuerda por WhatsApp, así que el total es el subtotal. */
export function getTotal(items: CartItem[]): number {
  return getSubtotal(items);
}
