import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

export function Hero() {
  // Mobile: texto y botones primero, para que el llamado a la acción entre sin scroll.
  return (
    <section aria-labelledby="hero-titulo" className="bg-sand/40">
      <Container className="grid items-center gap-10 py-12 lg:grid-cols-2 lg:gap-16 lg:py-20">
        <div className="text-center lg:text-left">
          <p className="text-xs tracking-[0.3em] text-rosewood uppercase">
            Nueva colección
          </p>
          <h1
            id="hero-titulo"
            className="mx-auto mt-5 max-w-xl text-5xl leading-tight sm:text-6xl lg:mx-0"
          >
            Delicadeza para <em>todos los días</em>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted-foreground lg:mx-0">
            Lencería e indumentaria femenina pensada para acompañarte.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Button asChild size="lg">
              <Link href="/productos">Ver productos</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/productos?oferta=1">Ver ofertas</Link>
            </Button>
          </div>
        </div>

        <div className="relative aspect-[4/5] w-full overflow-hidden bg-secondary">
          <Image
            src="/images/categorias/lenceria.png"
            alt="Lencería de encaje de la nueva colección de Berenice"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            preload
            className="object-cover"
          />
        </div>
      </Container>
    </section>
  );
}
