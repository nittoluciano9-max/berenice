import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/category/Breadcrumbs";
import { Container } from "@/components/layout/Container";
import { ProductDetail } from "@/components/product/ProductDetail";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCategoryPath, getProductBySlug, getProducts } from "@/lib/catalog";
import { categoryHref } from "@/lib/navigation";
import { baseOpenGraph, buildProductJsonLd } from "@/lib/seo";

// Igual que en categorías: sin `dynamicParams = false`, para que productos nuevos (V2)
// se rendericen a demanda. Un slug inexistente o inactivo termina en 404.
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/producto/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const [imagen] = product.imagenes;
  return {
    title: product.nombre,
    description: product.descripcion,
    alternates: { canonical: `/producto/${product.slug}` },
    openGraph: {
      ...baseOpenGraph,
      title: product.nombre,
      description: product.descripcion,
      images: imagen ? [{ url: imagen.src, alt: imagen.alt }] : undefined,
    },
  };
}

export default async function ProductoPage({
  params,
}: PageProps<"/producto/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const path = await getCategoryPath(product.subcategoria ?? product.categoria);

  return (
    <Container className="pt-4 pb-16 lg:pt-8 lg:pb-24">
      <div className="mb-4 lg:mb-8">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            ...path.map((c) => ({
              label: c.nombre,
              href: categoryHref(c.slug),
            })),
            { label: product.nombre },
          ]}
        />
      </div>

      <JsonLd data={buildProductJsonLd(product)} />
      <ProductDetail product={product} />
      <RelatedProducts product={product} />
    </Container>
  );
}
