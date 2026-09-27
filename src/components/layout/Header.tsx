import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { config } from "@/lib/config";
import { getCategoryTree } from "@/lib/catalog";
import { allProductsLink, categoryHref } from "@/lib/navigation";

export async function Header() {
  const categorias = await getCategoryTree();
  const links = [
    ...categorias.map((c) => ({ href: categoryHref(c.slug), label: c.nombre })),
    allProductsLink,
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm">
      <Container className="grid h-16 grid-cols-[1fr_auto_1fr] items-center lg:h-20">
        <div className="flex items-center">
          <MobileMenu
            categorias={categorias}
            instagramUrl={config.instagramUrl}
          />
          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="py-2 text-xs tracking-[0.18em] uppercase underline-offset-8 hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <Link
          href="/"
          aria-label={`${config.siteName}, ir al inicio`}
          className="font-serif text-2xl tracking-[0.25em] uppercase lg:text-3xl"
        >
          {config.siteName}
        </Link>

        {/* Reservado para búsqueda (etapa 3) y carrito (etapa 5). */}
        <div className="flex items-center justify-end" />
      </Container>
    </header>
  );
}
