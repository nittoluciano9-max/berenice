"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getImagenForColor } from "@/lib/cart";
import { getMaxCantidad, getStock, isDisponible } from "@/lib/stock";
import { useCartStore } from "@/store/cart";
import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";

interface CartVariantEditorProps {
  item: CartItem;
  product: Product;
  onDone: () => void;
}

export function CartVariantEditor({
  item,
  product,
  onDone,
}: CartVariantEditorProps) {
  const changeVariant = useCartStore((s) => s.changeVariant);
  const [color, setColor] = useState(item.color);
  const [talle, setTalle] = useState<string | null>(item.talle);

  const onColorChange = (nuevo: string) => {
    setColor(nuevo);
    // El talle actual puede no existir con stock en el color nuevo.
    if (talle && getStock(product, nuevo, talle) <= 0) setTalle(null);
  };

  const sinCambios = color === item.color && talle === item.talle;
  const colorNombre =
    product.colores.find((c) => c.slug === color)?.nombre ?? color;

  const aplicar = () => {
    if (!talle || sinCambios) return onDone();
    changeVariant(
      item.id,
      { color, colorNombre, talle, imagen: getImagenForColor(product, color) },
      getMaxCantidad(product, color, talle),
    );
    onDone();
  };

  return (
    <div className="mt-3 space-y-3 bg-secondary/50 p-3">
      <div className="grid grid-cols-2 gap-2">
        <Select value={color} onValueChange={onColorChange}>
          <SelectTrigger aria-label="Color" className="w-full bg-background">
            <SelectValue>{colorNombre}</SelectValue>
          </SelectTrigger>
          <SelectContent position="popper">
            {product.colores.map((c) => (
              <SelectItem
                key={c.slug}
                value={c.slug}
                disabled={!isDisponible(product, { colores: [c.slug] })}
              >
                {c.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={talle ?? ""} onValueChange={setTalle}>
          <SelectTrigger aria-label="Talle" className="w-full bg-background">
            <SelectValue placeholder="Talle">{talle ?? undefined}</SelectValue>
          </SelectTrigger>
          <SelectContent position="popper">
            {product.talles.map((t) => {
              const disponible = getStock(product, color, t) > 0;
              return (
                <SelectItem key={t} value={t} disabled={!disponible}>
                  {t}
                  {!disponible && " · sin stock"}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button className="px-3" onClick={aplicar} disabled={!talle}>
          {sinCambios ? "Listo" : "Aplicar"}
        </Button>
        <Button variant="outline" className="px-3" onClick={onDone}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
