import { ScrollRow } from "@/components/layout/ScrollRow";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types/product";

interface ProductRailProps {
  products: Product[];
}

export function ProductRail({ products }: ProductRailProps) {
  return (
    <ScrollRow>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </ScrollRow>
  );
}
