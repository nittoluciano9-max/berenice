import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { config } from "@/lib/config";
import { mainNav } from "@/lib/navigation";

const linkClass =
  "inline-flex min-h-11 items-center text-sm text-muted-foreground hover:text-foreground";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-secondary">
      <Container className="grid gap-10 py-14 sm:grid-cols-3 lg:py-20">
        <div className="space-y-3">
          <p className="font-serif text-2xl tracking-[0.25em] uppercase">
            {config.siteName}
          </p>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Lencería e indumentaria femenina.
          </p>
        </div>

        <nav aria-label="Pie de página">
          <h2 className="mb-3 font-sans text-xs tracking-[0.18em] uppercase">
            Tienda
          </h2>
          <ul>
            {mainNav.map((link) => (
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
            <h2 className="mb-3 font-sans text-xs tracking-[0.18em] uppercase">
              Seguinos
            </h2>
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
