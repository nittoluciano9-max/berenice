import { SectionHeader } from "@/components/home/SectionHeader";
import { Container } from "@/components/layout/Container";
import { ProductRail } from "@/components/product/ProductRail";
import { getProducts } from "@/lib/catalog";

export async function NewArrivals() {
  const nuevos = await getProducts({ nuevo: true, limit: 4 });
  if (nuevos.length === 0) return null;

  return (
    <Container
      as="section"
      aria-labelledby="novedades-titulo"
      className="py-8 lg:py-12"
    >
      <SectionHeader
        id="novedades-titulo"
        titulo="Recién llegados"
        bajada="Lo último que sumamos a la colección."
        link={{ href: "/productos?orden=novedades", label: "Ver novedades" }}
      />
      <ProductRail products={nuevos} />
    </Container>
  );
}
