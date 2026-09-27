import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <Container className="flex flex-1 flex-col items-center justify-center gap-8 py-24 text-center">
      <p className="text-xs tracking-[0.3em] text-rosewood uppercase">
        Nueva colección
      </p>
      <h1 className="max-w-xl text-5xl leading-tight sm:text-6xl">
        Delicadeza para <em>todos los días</em>
      </h1>
      <p className="max-w-md text-base leading-relaxed text-muted-foreground">
        Lencería e indumentaria femenina pensada para acompañarte.
      </p>
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Button asChild size="lg">
          <Link href="/productos">Ver productos</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/guia-de-talles">Guía de talles</Link>
        </Button>
      </div>
    </Container>
  );
}
