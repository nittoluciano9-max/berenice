import { CategoryCard } from "@/components/category/CategoryCard";
import { SectionHeader } from "@/components/home/SectionHeader";
import { Container } from "@/components/layout/Container";
import { ScrollRow } from "@/components/layout/ScrollRow";
import { getFeaturedCategories } from "@/lib/catalog";

export async function FeaturedCategories() {
  const categorias = await getFeaturedCategories(4);
  if (categorias.length === 0) return null;

  return (
    <Container
      as="section"
      aria-labelledby="categorias-titulo"
      className="py-16 lg:py-24"
    >
      <SectionHeader id="categorias-titulo" titulo="Elegí por categoría" />
      <ScrollRow>
        {categorias.map((c) => (
          <CategoryCard key={c.id} category={c} />
        ))}
      </ScrollRow>
    </Container>
  );
}
