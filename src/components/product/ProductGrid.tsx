import { ProductCard } from "@/components/product/ProductCard";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface ProductGridProps {
  products: Product[];
  /** Se muestra cuando no hay productos. */
  empty?: React.ReactNode;
  /**
   * "auto": en desktop entran tantas columnas como permita el ancho (vidriera de la home,
   * con barras laterales). Por defecto, columnas fijas por breakpoint.
   */
  columns?: "default" | "auto";
}

const PRELOAD_COUNT = 4;

export function ProductGrid({
  products,
  empty,
  columns = "default",
}: ProductGridProps) {
  if (products.length === 0) return empty ?? null;

  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5",
        columns === "default"
          ? "md:grid-cols-3 xl:grid-cols-4"
          : "md:grid-cols-3 lg:[grid-template-columns:repeat(auto-fill,minmax(10rem,1fr))] lg:gap-x-4 lg:gap-y-6",
      )}
    >
      {products.map((product, i) => (
        <li key={product.id}>
          <ProductCard product={product} preload={i < PRELOAD_COUNT} />
        </li>
      ))}
    </ul>
  );
}
