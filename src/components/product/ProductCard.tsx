import Image from "next/image";
import Link from "next/link";

import { PriceTag } from "@/components/product/PriceTag";
import { getDescuento } from "@/lib/pricing";
import { isAgotado } from "@/lib/stock";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  /** Precarga la imagen (para las tarjetas visibles sin scroll). */
  preload?: boolean;
}

const SIZES = "(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 50vw";

export function ProductCard({ product, preload = false }: ProductCardProps) {
  const [principal, secundaria] = product.imagenes;
  const agotado = isAgotado(product);
  const descuento = getDescuento(product);
  const badge = agotado
    ? { label: "Sin stock", className: "bg-ivory text-muted-foreground" }
    : descuento > 0
      ? { label: `-${descuento}%`, className: "bg-rosewood text-ivory" }
      : product.nuevo
        ? { label: "Nuevo", className: "bg-ivory text-ink" }
        : null;

  return (
    <article className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
        {principal && (
          <Image
            src={principal.src}
            alt={principal.alt}
            fill
            sizes={SIZES}
            preload={preload}
            className="object-cover"
          />
        )}
        {secundaria && (
          <Image
            src={secundaria.src}
            alt=""
            aria-hidden
            fill
            sizes={SIZES}
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        {badge && (
          <span
            className={cn(
              "absolute top-2 left-2 px-2 py-1 text-[0.625rem] tracking-[0.18em] uppercase",
              badge.className,
            )}
          >
            {badge.label}
          </span>
        )}
      </div>

      <div className="mt-3 space-y-1 text-sm">
        <h3 className="font-sans text-sm font-normal tracking-normal">
          {/* El link cubre toda la tarjeta: un solo destino táctil grande. */}
          <Link
            href={`/producto/${product.slug}`}
            className="after:absolute after:inset-0"
          >
            {product.nombre}
          </Link>
        </h3>
        <PriceTag product={product} />
      </div>
    </article>
  );
}
