import Image from "next/image";

// Franja de identidad (~128 px en desktop): la protagonista de la home es la grilla, no el hero.
export function MiniHero() {
  return (
    <section
      aria-labelledby="hero-titulo"
      className="flex items-center justify-between gap-4 overflow-hidden bg-sand/40 py-3 pr-3 pl-5 lg:h-32 lg:py-4 lg:pr-4 lg:pl-8"
    >
      <div className="min-w-0">
        <p className="text-[0.625rem] tracking-[0.3em] text-rosewood uppercase lg:text-xs">
          Nueva colección
        </p>
        <h1
          id="hero-titulo"
          className="mt-1 text-2xl leading-tight lg:mt-2 lg:text-3xl xl:text-4xl"
        >
          Delicadeza para <em>todos los días</em>
        </h1>
        <p className="mt-1 hidden text-sm text-muted-foreground md:block">
          Lencería e indumentaria femenina pensada para acompañarte.
        </p>
      </div>
      <div className="flex h-20 shrink-0 gap-2 lg:h-full">
        <div className="relative aspect-[4/5] h-full overflow-hidden bg-secondary">
          <Image
            src="/images/categorias/lenceria.png"
            alt="Lencería de encaje de la nueva colección de Berenice"
            fill
            sizes="96px"
            preload
            className="object-cover"
          />
        </div>
        <div className="relative hidden aspect-[4/5] h-full overflow-hidden bg-secondary sm:block">
          <Image
            src="/images/productos/conjunto-lucia-1.png"
            alt="Conjunto Lucía bordó de la nueva colección"
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
