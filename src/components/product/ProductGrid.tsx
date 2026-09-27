import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types/product";

interface ProductGridProps {
  products: Product[];
  /** Se muestra cuando no hay productos. */
  empty?: React.ReactNode;
}

const PRELOAD_COUNT = 4;

export function ProductGrid({ products, empty }: ProductGridProps) {
  if (products.length === 0) return empty ?? null;

  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-4">
      {products.map((product, i) => (
        <li key={product.id}>
          <ProductCard product={product} preload={i < PRELOAD_COUNT} />
        </li>
      ))}
    </ul>
  );
}
