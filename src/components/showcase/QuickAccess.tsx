import { MessageCircle, Ruler, Truck } from "lucide-react";
import Link from "next/link";
import { useId } from "react";

import { CartQuickView } from "@/components/showcase/CartQuickView";
import { Button } from "@/components/ui/button";
import { config } from "@/lib/config";
import { cn } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface QuickAccessProps {
  /** Mayor descuento vigente; 0 = sin ofertas (la tarjeta no se muestra). */
  maxDescuento: number;
  ofertasHref: string;
  className?: string;
}

const linkClass =
  "flex min-h-11 items-center gap-3 text-sm transition-colors hover:text-muted-foreground";

export function QuickAccess({
  maxDescuento,
  ofertasHref,
  className,
}: QuickAccessProps) {
  // Se renderiza dos veces (columna derecha y final de la grilla): ids únicos por instancia.
  const id = useId();
  return (
    <div className={cn("grid content-start gap-4", className)}>
      {maxDescuento > 0 && (
        <section aria-labelledby={`${id}-oferta`} className="bg-blush p-5">
          <p
            id={`${id}-oferta`}
            className="text-xs tracking-[0.18em] text-rosewood uppercase"
          >
            Oferta actual
          </p>
          <p className="mt-2 font-serif text-2xl leading-tight">
            Hasta {maxDescuento}% de descuento
          </p>
          <Button asChild className="mt-4 w-full">
            <Link href={ofertasHref} replace scroll={false}>
              Ver ofertas
            </Link>
          </Button>
        </section>
      )}

      <section aria-labelledby={`${id}-ayuda`} className="border p-5 pt-4">
        <h2
          id={`${id}-ayuda`}
          className="font-sans text-xs tracking-[0.18em] uppercase"
        >
          Te ayudamos
        </h2>
        <ul className="mt-1">
          <li>
            <Link href="/guia-de-talles" className={linkClass}>
              <Ruler
                strokeWidth={1.5}
                className="size-4 text-rosewood"
                aria-hidden
              />
              Guía de talles
            </Link>
          </li>
          <li>
            <Link href="/envios-y-cambios" className={linkClass}>
              <Truck
                strokeWidth={1.5}
                className="size-4 text-rosewood"
                aria-hidden
              />
              Envíos y cambios
            </Link>
          </li>
          <li>
            <a
              href={buildWhatsAppUrl(
                config.whatsappNumber,
                "Hola 👋 Tengo una consulta.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              <MessageCircle
                strokeWidth={1.5}
                className="size-4 text-rosewood"
                aria-hidden
              />
              Consultas por WhatsApp
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
          </li>
        </ul>
      </section>

      <CartQuickView />
    </div>
  );
}
