import Image from "next/image";

import { cn } from "@/lib/utils";

interface LogoProps {
  /** Tamaño visible vía clases (ej. `size-12 lg:size-14`); el logo es cuadrado. */
  className?: string;
  /** Lado máximo en px que llega a mostrarse; define la resolución que se pide. */
  maxSize?: number;
  preload?: boolean;
}

export function Logo({ className, maxSize = 56, preload = false }: LogoProps) {
  return (
    <Image
      src="/images/brand/logo-berenice.jpg"
      alt="Berenice"
      width={maxSize}
      height={maxSize}
      preload={preload}
      // El JPG trae fondo blanco: multiply lo funde con el fondo (ivory, sand) y rounded-full
      // recorta las esquinas, que por la compresión no son blanco puro.
      className={cn(
        "aspect-square rounded-full object-contain mix-blend-multiply",
        className,
      )}
    />
  );
}
