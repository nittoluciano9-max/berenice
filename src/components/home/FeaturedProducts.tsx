import { SectionHeader } from "@/components/home/SectionHeader";
import { Container } from "@/components/layout/Container";
import { ProductRail } from "@/components/product/ProductRail";
import { getProducts } from "@/lib/catalog";
import { allProductsLink } from "@/lib/navigation";

export async function FeaturedProducts() {
  const destacados = await getProducts({ destacado: true, limit: 4 });
  if (destacados.length === 0) return null;

  return (
    <Container
      as="section"
      aria-labelledby="destacados-titulo"
      className="py-8 lg:py-12"
    >
      <SectionHeader
        id="destacados-titulo"
        titulo="Favoritos de la casa"
        link={allProductsLink}
      />
      <ProductRail products={destacados} />
    </Container>
  );
}
