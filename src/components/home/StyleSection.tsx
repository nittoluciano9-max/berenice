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
      className="grid items-center gap-10 py-16 lg:grid-cols-2 lg:gap-20 lg:py-24"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-secondary">
        <Image
          src="/images/categorias/conjuntos.png"
          alt="Conjunto de lencería sobre fondo claro"
          fill
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="lg:max-w-md">
        <p className="text-xs tracking-[0.3em] text-rosewood uppercase">
          Estilo Berenice
        </p>
        <h2
          id="estilo-titulo"
          className="mt-5 text-4xl leading-tight lg:text-5xl"
        >
          Simple, suave y <em>tuya</em>
        </h2>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          Prendas pensadas para el día a día: encajes delicados, cortes que
          acompañan y colores fáciles de combinar. Lencería que se siente tan
          bien como se ve.
        </p>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="mt-8 w-full sm:w-auto"
        >
          <Link href={allProductsLink.href}>Descubrí la colección</Link>
        </Button>
      </div>
    </Container>
  );
}
