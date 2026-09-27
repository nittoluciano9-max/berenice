import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { allProductsLink } from "@/lib/navigation";

export function StyleSection() {
  return (
    <Container
      as="section"
      aria-labelledby="estilo-titulo"
      className="grid items-center gap-6 py-8 lg:grid-cols-[5fr_7fr] lg:gap-16 lg:py-12"
    >
      {/* Mobile: foto baja como en el hero. Desktop: 4:5 con ancho tope para no estirar la sección. */}
      <div className="relative h-56 w-full overflow-hidden bg-secondary lg:aspect-[4/5] lg:h-auto lg:max-w-sm lg:justify-self-end">
        <Image
          src="/images/categorias/conjuntos.png"
          alt="Conjunto de lencería sobre fondo claro"
          fill
          sizes="(min-width: 1024px) 384px, 100vw"
          className="object-cover"
        />
      </div>

      <div className="lg:max-w-md">
        <p className="text-xs tracking-[0.3em] text-rosewood uppercase">
          Estilo Berenice
        </p>
        <h2
          id="estilo-titulo"
          className="mt-3 text-3xl leading-tight lg:mt-4 lg:text-4xl"
        >
          Simple, suave y <em>tuya</em>
        </h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground lg:mt-4">
          Prendas pensadas para el día a día: encajes delicados, cortes que
          acompañan y colores fáciles de combinar. Lencería que se siente tan
          bien como se ve.
        </p>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="mt-6 w-full sm:w-auto"
        >
          <Link href={allProductsLink.href}>Descubrí la colección</Link>
        </Button>
      </div>
    </Container>
  );
}
