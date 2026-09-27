"use client";

import Link from "next/link";
import { useRef } from "react";

import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ColorSelector } from "@/components/product/ColorSelector";
import { PriceTag } from "@/components/product/PriceTag";
import { ProductGallery } from "@/components/product/ProductGallery";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { SizeSelector } from "@/components/product/SizeSelector";
import { StickyBuyBar } from "@/components/product/StickyBuyBar";
import { useAddToCart } from "@/hooks/useAddToCart";
import { useProductSelection } from "@/hooks/useProductSelection";
import { getDescuento } from "@/lib/pricing";
import { getStock, isDisponible, STOCK_LABELS } from "@/lib/stock";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const selection = useProductSelection(product);
  const sizeRef = useRef<HTMLDivElement>(null);
  const buyRef = useRef<HTMLDivElement>(null);

  const irAlTalle = () => {
    const el = sizeRef.current;
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.querySelector<HTMLInputElement>("input:not(:disabled)")?.focus({
      preventScroll: true,
    });
  };
  const { add, aviso, faltaTalle } = useAddToCart(
    product,
    selection,
    irAlTalle,
  );

  const descuento = getDescuento(product);
  const agotado = selection.status === "agotado";
  const coloresAgotados = product.colores
    .filter((c) => !isDisponible(product, { colores: [c.slug] }))
    .map((c) => c.slug);

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-14">
      {/* key: al cambiar de color con fotos propias, la galería vuelve a la primera imagen. */}
      <ProductGallery
        key={selection.imagenes[0]?.src}
        imagenes={selection.imagenes}
      />

      <div className="mt-6 lg:sticky lg:top-28 lg:mt-0 lg:self-start">
        <h1 className="text-3xl leading-tight lg:text-4xl">{product.nombre}</h1>
        <div className="mt-3 flex items-center gap-3 text-lg">
          <PriceTag product={product} />
          {descuento > 0 && (
            <span className="bg-rosewood px-2 py-0.5 text-[0.625rem] tracking-[0.18em] text-ivory uppercase">
              -{descuento}%
            </span>
          )}
        </div>

        <div className="mt-8 space-y-8">
          {product.colores.length > 0 && (
            <ColorSelector
              colores={product.colores}
              value={selection.color}
              onChange={selection.setColor}
              agotados={coloresAgotados}
            />
          )}
          <SizeSelector
            ref={sizeRef}
            talles={product.talles}
            value={selection.talle}
            onChange={selection.setTalle}
            isDisponible={(talle) =>
              getStock(product, selection.color, talle) > 0
            }
            error={faltaTalle ? "Elegí un talle para continuar." : undefined}
          />

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <QuantitySelector
              value={selection.cantidad}
              max={selection.maxCantidad}
              onChange={selection.setCantidad}
              disabled={agotado}
            />
            <p
              aria-live="polite"
              className={cn(
                "text-sm",
                selection.status === "ultimas"
                  ? "text-rosewood"
                  : "text-muted-foreground",
                selection.status === "disponible" && "text-foreground",
              )}
            >
              {selection.status
                ? STOCK_LABELS[selection.status]
                : "Elegí tu talle"}
            </p>
          </div>

          <AddToCartButton
            ref={buyRef}
            onAdd={add}
            agotado={agotado}
            aviso={aviso}
          />
        </div>

        <div className="mt-10 border-t pt-6">
          <h2 className="font-sans text-xs tracking-[0.18em] uppercase">
            Descripción
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {product.descripcion}
          </p>
          <p className="mt-6 text-sm text-muted-foreground">
            Consultá los{" "}
            <Link
              href="/envios-y-cambios"
              className="text-foreground underline underline-offset-4"
            >
              envíos y cambios
            </Link>
            .
          </p>
        </div>
      </div>

      <StickyBuyBar
        product={product}
        onAdd={add}
        agotado={agotado}
        targetRef={buyRef}
      />
    </div>
  );
}
