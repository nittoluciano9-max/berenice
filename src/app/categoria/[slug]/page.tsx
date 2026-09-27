import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Breadcrumbs } from "@/components/category/Breadcrumbs";
import { Container } from "@/components/layout/Container";
import { ProductCatalog } from "@/components/product/ProductCatalog";
import { ProductCatalogView } from "@/components/product/ProductCatalogView";
import {
  getCategoryBySlug,
  getCategoryPath,
  getCategoryTree,
  getProducts,
} from "@/lib/catalog";
import {
  DEFAULT_FILTERS,
  findCategoryNode,
  flattenCategoryTree,
} from "@/lib/filters";
import { categoryHref } from "@/lib/navigation";
import { baseOpenGraph, defaultOgImage } from "@/lib/seo";
import type { CategoryFilterConfig } from "@/types/filters";

// Sin `dynamicParams = false` a propósito: cuando las categorías vengan de la BD (V2), una
// categoría nueva se renderiza a demanda sin rebuild. Un slug inexistente igual termina en 404.
export async function generateStaticParams() {
  const tree = await getCategoryTree();
  return flattenCategoryTree(tree).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/categoria/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const categoria = await getCategoryBySlug(slug);
  if (!categoria) return {};
  return {
    title: categoria.nombre,
    description: categoria.descripcion,
    alternates: { canonical: categoryHref(slug) },
    openGraph: {
      ...baseOpenGraph,
      title: categoria.nombre,
      description: categoria.descripcion,
      images: categoria.imagen
        ? [{ url: categoria.imagen, alt: categoria.nombre }]
        : [defaultOgImage],
    },
  };
}

export default async function CategoriaPage({
  params,
}: PageProps<"/categoria/[slug]">) {
  const { slug } = await params;
  const categoria = await getCategoryBySlug(slug);
  if (!categoria) notFound();

  const [products, path, tree] = await Promise.all([
    getProducts({ categoria: slug }),
    getCategoryPath(slug),
    getCategoryTree(),
  ]);
  const subcategorias = findCategoryNode(tree, slug)?.children ?? [];
  const categoryConfig: CategoryFilterConfig = {
    mode: "links",
    links: subcategorias.map((c) => ({
      href: categoryHref(c.slug),
      label: c.nombre,
    })),
  };

  return (
    <Container className="pt-4 pb-16 lg:pt-8 lg:pb-24">
      <header className="mb-6 lg:mb-10">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Productos", href: "/productos" },
            ...path.map((c) => ({
              label: c.nombre,
              href: categoryHref(c.slug),
            })),
          ]}
        />
        <h1 className="mt-2 text-4xl lg:text-5xl">{categoria.nombre}</h1>
        {categoria.descripcion && (
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {categoria.descripcion}
          </p>
        )}
      </header>

      <Suspense
        fallback={
          <ProductCatalogView
            products={products}
            categoryConfig={categoryConfig}
            filters={DEFAULT_FILTERS}
          />
        }
      >
        <ProductCatalog products={products} categoryConfig={categoryConfig} />
      </Suspense>
    </Container>
  );
}
