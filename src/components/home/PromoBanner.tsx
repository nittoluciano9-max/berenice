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
      <Container className="flex flex-col items-center gap-5 py-14 text-center lg:py-20">
        <p className="text-xs tracking-[0.3em] text-rosewood uppercase">
          Ofertas
        </p>
        <h2 id="promo-titulo" className="max-w-lg text-4xl lg:text-5xl">
          Hasta {maximo}% de descuento en prendas seleccionadas
        </h2>
        <Button asChild size="lg" className="mt-2 w-full sm:w-auto">
          <Link href="/productos?oferta=1">Ver ofertas</Link>
        </Button>
      </Container>
    </section>
  );
}
