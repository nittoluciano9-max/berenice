import { formatPrice } from "@/lib/currency";
import { getPrecioFinal, hasOferta } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface PriceTagProps {
  product: Pick<Product, "precio" | "precioOferta">;
  className?: string;
}

export function PriceTag({ product, className }: PriceTagProps) {
  const oferta = hasOferta(product);

  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-2", className)}>
      {oferta && (
        <>
          <span className="sr-only">Precio anterior:</span>
          <s className="text-muted-foreground">{formatPrice(product.precio)}</s>
          <span className="sr-only">Precio actual:</span>
        </>
      )}
      <span className={cn(oferta && "text-rosewood")}>
        {formatPrice(getPrecioFinal(product))}
      </span>
    </p>
  );
}
