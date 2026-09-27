import { ProductRail } from "@/components/product/ProductRail";
import { getRelatedProducts } from "@/lib/catalog";
import type { Product } from "@/types/product";

interface RelatedProductsProps {
  product: Product;
}

export async function RelatedProducts({ product }: RelatedProductsProps) {
  const relacionados = await getRelatedProducts(product, 4);
  if (relacionados.length === 0) return null;

  return (
    <section aria-labelledby="relacionados-titulo" className="mt-20 lg:mt-28">
      <h2 id="relacionados-titulo" className="mb-6 text-3xl lg:mb-8">
        También te puede gustar
      </h2>
      <ProductRail products={relacionados} />
    </section>
  );
}
