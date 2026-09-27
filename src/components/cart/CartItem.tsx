"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useState } from "react";

import { CartVariantEditor } from "@/components/cart/CartVariantEditor";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { useCartProduct } from "@/hooks/useCartProduct";
import { formatPrice } from "@/lib/currency";
import { getMaxCantidad } from "@/lib/stock";
import { useCartStore } from "@/store/cart";
import type { CartItem as CartItemData } from "@/types/cart";

interface CartItemProps {
  item: CartItemData;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem, close } = useCartStore.getState();
  const lookup = useCartProduct(item.slug);
  const [editando, setEditando] = useState(false);

  const product = lookup.status === "ready" ? lookup.product : null;
  const noDisponible = lookup.status === "missing";
  // Mientras carga el producto no se deja superar la cantidad actual.
  const max = product
    ? getMaxCantidad(product, item.color, item.talle)
    : item.cantidad;
  const conOferta = item.precioLista > item.precioUnitario;
  const href = `/producto/${item.slug}`;

  return (
    <li className="flex gap-4 py-5">
      <Link
        href={href}
        onClick={close}
        className="relative aspect-[4/5] w-20 shrink-0 bg-secondary"
        tabIndex={-1}
        aria-hidden
      >
        {item.imagen && (
          <Image
            src={item.imagen}
            alt=""
            fill
            sizes="80px"
            className="object-cover"
          />
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={href}
            onClick={close}
            className="text-sm leading-snug hover:underline"
          >
            {item.nombre}
          </Link>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            aria-label={`Eliminar ${item.nombre} del carrito`}
            className="-mt-3 -mr-3 flex size-11 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <Trash2 strokeWidth={1.5} className="size-4" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground">
          Talle: {item.talle} · Color: {item.colorNombre}
          {product && !editando && (
            <>
              {" · "}
              <button
                type="button"
                onClick={() => setEditando(true)}
                aria-label={`Cambiar talle o color de ${item.nombre}`}
                className="-my-3 py-3 text-foreground underline underline-offset-4"
              >
                Cambiar
              </button>
            </>
          )}
        </p>

        {noDisponible && (
          <p className="mt-2 text-xs text-rosewood">
            Este producto ya no está disponible.
          </p>
        )}

        {editando && product && (
          <CartVariantEditor
            item={item}
            product={product}
            onDone={() => setEditando(false)}
          />
        )}

        <div className="mt-3 flex items-center justify-between gap-3">
          <QuantitySelector
            value={item.cantidad}
            max={max}
            onChange={(cantidad) => updateQuantity(item.id, cantidad, max)}
            disabled={noDisponible}
          />
          <p className="flex flex-col items-end text-sm tabular-nums">
            {conOferta && (
              <s className="text-xs text-muted-foreground">
                <span className="sr-only">Antes </span>
                {formatPrice(item.precioLista * item.cantidad)}
              </s>
            )}
            <span className={conOferta ? "text-rosewood" : undefined}>
              {formatPrice(item.precioUnitario * item.cantidad)}
            </span>
          </p>
        </div>
      </div>
    </li>
  );
}
