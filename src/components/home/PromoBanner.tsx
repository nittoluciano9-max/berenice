import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/catalog";
import { getMaxDescuento } from "@/lib/pricing";

export async function PromoBanner() {
  const ofertas = await getProducts({ oferta: true });
  // Sin ofertas vigentes el banner no se muestra: nunca promete un descuento que no existe.
  if (ofertas.length === 0) return null;
  const maximo = getMaxDescuento(ofertas);

  return (
    <section aria-labelledby="promo-titulo" className="bg-blush">
      {/* Franja baja: en desktop, texto y botón en una sola línea. */}
      <Container className="flex flex-col items-center gap-4 py-8 text-center lg:flex-row lg:justify-between lg:py-10 lg:text-left">
        <div>
          <p className="text-xs tracking-[0.3em] text-rosewood uppercase">
            Ofertas
          </p>
          <h2 id="promo-titulo" className="mt-2 text-2xl lg:text-3xl">
            Hasta {maximo}% de descuento en prendas seleccionadas
          </h2>
        </div>
        <Button asChild size="lg" className="w-full shrink-0 sm:w-auto">
          <Link href="/productos?oferta=1">Ver ofertas</Link>
        </Button>
      </Container>
    </section>
  );
}
