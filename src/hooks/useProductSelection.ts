"use client";

import { useState } from "react";

import {
  getDefaultColor,
  getMaxCantidad,
  getStock,
  getStockStatus,
  isAgotado,
} from "@/lib/stock";
import type { Product, StockStatus } from "@/types/product";

export function useProductSelection(product: Product) {
  const [color, setColorState] = useState(() => getDefaultColor(product));
  const [talle, setTalleState] = useState<string | null>(() => {
    // Con un único talle disponible no tiene sentido obligar a elegirlo.
    const [unico] = product.talles;
    return product.talles.length === 1 &&
      getStock(product, getDefaultColor(product), unico) > 0
      ? unico
      : null;
  });
  const [cantidadElegida, setCantidad] = useState(1);

  const maxCantidad = getMaxCantidad(product, color, talle);
  const cantidad = Math.max(1, Math.min(cantidadElegida, maxCantidad));

  const status: StockStatus | null = talle
    ? getStockStatus(getStock(product, color, talle))
    : isAgotado(product)
      ? "agotado"
      : null;

  const colorActual = product.colores.find((c) => c.slug === color);
  const imagenes = colorActual?.imagenes?.length
    ? colorActual.imagenes
    : product.imagenes;

  const setColor = (nuevo: string) => {
    setColorState(nuevo);
    if (talle && getStock(product, nuevo, talle) <= 0) setTalleState(null);
  };

  const setTalle = (nuevo: string) => {
    if (getStock(product, color, nuevo) > 0) setTalleState(nuevo);
  };

  return {
    color,
    colorNombre: colorActual?.nombre ?? "",
    talle,
    cantidad,
    maxCantidad,
    status,
    imagenes,
    setColor,
    setTalle,
    setCantidad,
  };
}
