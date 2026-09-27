import { ProductCard } from "@/components/product/ProductCard";
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
      {/* Mobile: fila deslizable con scroll-snap. Desktop: grilla de 4. */}
      <ul className="-mx-4 flex snap-x snap-mandatory scroll-px-4 [scrollbar-width:none] gap-3 overflow-x-auto px-4 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
        {relacionados.map((p) => (
          <li
            key={p.id}
            className="w-[44%] shrink-0 snap-start sm:w-[30%] lg:w-auto"
          >
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}
