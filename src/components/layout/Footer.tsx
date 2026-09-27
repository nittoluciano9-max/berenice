import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/layout/Logo";
import { getCategoryTree } from "@/lib/catalog";
import { config } from "@/lib/config";
import { allProductsLink, categoryHref, helpLinks } from "@/lib/navigation";

const linkClass =
  "inline-flex min-h-11 items-center text-sm text-muted-foreground hover:text-foreground";
const headingClass = "mb-3 font-sans text-xs tracking-[0.18em] uppercase";

export async function Footer() {
  const categorias = await getCategoryTree();
  const tiendaLinks = [
    ...categorias.map((c) => ({ href: categoryHref(c.slug), label: c.nombre })),
    allProductsLink,
  ];
  const year = new Date().getFullYear();

  return (
    <footer className="bg-secondary">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:py-20">
        <div className="space-y-3">
          <Logo className="size-28" maxSize={112} />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Lencería e indumentaria femenina.
          </p>
        </div>

        <nav aria-label="Tienda">
          <h2 className={headingClass}>Tienda</h2>
          <ul>
            {tiendaLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Ayuda">
          <h2 className={headingClass}>Ayuda</h2>
          <ul>
            {helpLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {config.instagramUrl && (
          <div>
            <h2 className={headingClass}>Seguinos</h2>
            <a
              href={config.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              Instagram
            </a>
          </div>
        )}
      </Container>

      <div className="border-t border-nude/50">
        <Container className="py-6 text-xs text-muted-foreground">
          © {year} {config.siteName}. Todos los derechos reservados.
        </Container>
      </div>
    </footer>
  );
}
