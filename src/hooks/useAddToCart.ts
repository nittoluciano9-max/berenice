"use client";

import { useState } from "react";

import { buildCartItem } from "@/lib/cart";
import { getMaxCantidad, getStock } from "@/lib/stock";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/types/product";

interface Selection {
  color: string;
  talle: string | null;
  cantidad: number;
}

/**
 * Lógica compartida por el botón principal y la StickyBuyBar.
 * `onMissingTalle` lleva al usuario al selector de talle.
 */
export function useAddToCart(
  product: Product,
  selection: Selection,
  onMissingTalle: () => void,
) {
  const addItem = useCartStore((s) => s.addItem);
  const open = useCartStore((s) => s.open);
  const [aviso, setAviso] = useState<string | null>(null);
  const [faltaTalle, setFaltaTalle] = useState(false);

  const add = () => {
    setAviso(null);
    if (!selection.talle) {
      setFaltaTalle(true);
      onMissingTalle();
      return;
    }
    setFaltaTalle(false);

    const max = getMaxCantidad(product, selection.color, selection.talle);
    const item = buildCartItem(
      product,
      selection.color,
      selection.talle,
      selection.cantidad,
    );
    const result = addItem(item, max);

    // El tope puede ser el stock o el máximo por línea: el aviso dice cuál.
    const porStock = getStock(product, selection.color, selection.talle) <= max;
    const unidades = max === 1 ? "1 unidad" : `${max} unidades`;
    const limite = porStock
      ? `${max === 1 ? "Solo queda" : "Solo quedan"} ${unidades}`
      : `Podés llevar hasta ${unidades}`;

    // El aviso se repite en el drawer: en mobile tapa la página, y desde la StickyBuyBar el
    // botón principal (donde se muestra el aviso) queda fuera de pantalla.
    const recorte = !result.limitado
      ? undefined
      : result.agregadas === 0
        ? `${limite} y ya ${max === 1 ? "está" : "están"} en tu carrito.`
        : `${limite}: agregamos ${result.agregadas}.`;
    setAviso(recorte ?? null);
    open(recorte);
  };

  return {
    add,
    aviso,
    faltaTalle: faltaTalle && !selection.talle,
  };
}
