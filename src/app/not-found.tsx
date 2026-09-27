import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { allProductsLink } from "@/lib/navigation";

export default function NotFound() {
  return (
    <Container className="flex flex-1 flex-col items-center justify-center gap-6 py-24 text-center">
      <p className="text-xs tracking-[0.3em] text-rosewood uppercase">
        Error 404
      </p>
      <h1 className="max-w-md text-4xl leading-tight sm:text-5xl">
        No encontramos esta página
      </h1>
      <p className="max-w-sm text-base leading-relaxed text-muted-foreground">
        Puede que el producto ya no esté disponible o que el link haya cambiado.
      </p>
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Button asChild size="lg">
          <Link href={allProductsLink.href}>Ver productos</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/">Ir al inicio</Link>
        </Button>
      </div>
    </Container>
  );
}
