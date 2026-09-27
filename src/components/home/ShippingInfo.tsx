import { MessageCircle, RefreshCw, Truck } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/Container";

// Textos generales a propósito: plazos, costos y condiciones se acuerdan por WhatsApp en V1.
const PUNTOS = [
  {
    icono: Truck,
    titulo: "Envío o retiro",
    texto: "Coordinamos la entrega con vos: a domicilio o para retirar.",
  },
  {
    icono: RefreshCw,
    titulo: "Cambios",
    texto: "Si el talle no es el indicado, te ayudamos a cambiarlo.",
  },
  {
    icono: MessageCircle,
    titulo: "Pedido por WhatsApp",
    texto: "Armá tu carrito y envianos el pedido en un mensaje.",
  },
];

export function ShippingInfo() {
  return (
    <section aria-labelledby="envios-titulo" className="bg-sand">
      <Container className="py-8 lg:py-10">
        <h2 id="envios-titulo" className="sr-only">
          Cómo comprar
        </h2>
        <ul className="grid gap-6 sm:grid-cols-3">
          {PUNTOS.map(({ icono: Icono, titulo, texto }) => (
            <li key={titulo} className="flex gap-4 sm:flex-col sm:gap-3">
              <Icono
                strokeWidth={1.5}
                aria-hidden
                className="size-6 shrink-0 text-rosewood"
              />
              <div>
                <h3 className="font-sans text-xs tracking-[0.18em] uppercase">
                  {titulo}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {texto}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <Link
          href="/envios-y-cambios"
          className="mt-4 inline-flex min-h-11 items-center text-sm underline underline-offset-4 hover:text-muted-foreground"
        >
          Ver envíos y cambios
        </Link>
      </Container>
    </section>
  );
}
