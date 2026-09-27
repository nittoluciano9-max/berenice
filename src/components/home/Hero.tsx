import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

// Hero compacto: en el primer viewport tienen que asomar las categorías.
// Mobile: texto, botones y una foto baja. Desktop: texto + dos fotos 4:5 con altura tope.
export function Hero() {
  return (
    <section aria-labelledby="hero-titulo" className="bg-sand/40">
      <Container className="grid gap-6 py-6 lg:grid-cols-[5fr_7fr] lg:items-center lg:gap-12 lg:py-8">
        <div className="text-center lg:text-left">
          <p className="text-xs tracking-[0.3em] text-rosewood uppercase">
            Nueva colección
          </p>
          <h1
            id="hero-titulo"
            className="mx-auto mt-3 max-w-xl text-4xl leading-tight sm:text-5xl lg:mx-0 lg:mt-4 xl:text-6xl"
          >
            Delicadeza para <em>todos los días</em>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-muted-foreground lg:mx-0 lg:mt-4">
            Lencería e indumentaria femenina pensada para acompañarte.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:mx-auto sm:max-w-sm lg:mx-0 lg:mt-8 lg:flex lg:max-w-none">
            <Button asChild size="lg" className="px-3 sm:px-8">
              <Link href="/productos">Ver productos</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="px-3 sm:px-8"
            >
              <Link href="/productos?oferta=1">Ver ofertas</Link>
            </Button>
          </div>
        </div>

        {/* flex en desktop: el ancho de cada foto sale de su alto (4:5), no de la columna. */}
        <div className="grid gap-3 lg:flex lg:h-[min(48vh,25rem)] lg:justify-end">
          <div className="relative h-48 overflow-hidden bg-secondary lg:aspect-[4/5] lg:h-full">
            <Image
              src="/images/categorias/lenceria.png"
              alt="Lencería de encaje de la nueva colección de Berenice"
              fill
              sizes="(min-width: 1024px) 28vw, 100vw"
              preload
              className="object-cover"
            />
          </div>
          <div className="relative hidden aspect-[4/5] h-full overflow-hidden bg-secondary lg:block">
            <Image
              src="/images/productos/conjunto-lucia-1.png"
              alt="Conjunto Lucía bordó de la nueva colección"
              fill
              sizes="28vw"
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
