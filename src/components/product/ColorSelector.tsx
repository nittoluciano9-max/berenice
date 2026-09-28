import Image from "next/image";

import { cn } from "@/lib/utils";
import type { ProductColor } from "@/types/product";

interface ColorSelectorProps {
  colores: ProductColor[];
  value: string;
  onChange: (slug: string) => void;
  /** Colores sin stock en ningún talle. */
  agotados: string[];
  /** "Color" o "Estampa" (lib/variants). */
  label?: string;
  /** Estampas: la muestra es la foto de cada una (un punto de color no la representa). */
  conFoto?: boolean;
}

export function ColorSelector({
  colores,
  value,
  onChange,
  agotados,
  label = "Color",
  conFoto = false,
}: ColorSelectorProps) {
  const actual = colores.find((c) => c.slug === value);

  return (
    <fieldset>
      <legend className="mb-3 text-xs tracking-[0.18em] uppercase">
        {label}:{" "}
        <span className="tracking-normal text-muted-foreground normal-case">
          {actual?.nombre}
        </span>
      </legend>
      <div className={cn("flex flex-wrap", conFoto ? "gap-3" : "gap-1")}>
        {colores.map((color) => {
          const agotado = agotados.includes(color.slug);
          const foto = conFoto ? color.imagenes?.[0] : undefined;
          return (
            <label
              key={color.slug}
              title={agotado ? `${color.nombre} (sin stock)` : color.nombre}
              className={cn(
                "relative flex cursor-pointer items-center justify-center",
                foto ? "flex-col gap-1.5" : "size-11",
              )}
            >
              <input
                type="radio"
                name="color"
                value={color.slug}
                checked={value === color.slug}
                onChange={() => onChange(color.slug)}
                className="peer sr-only"
              />
              {foto ? (
                <>
                  <span
                    aria-hidden
                    className={cn(
                      "relative block aspect-[4/5] w-14 overflow-hidden bg-secondary ring-offset-2 ring-offset-background transition-shadow peer-checked:ring-1 peer-checked:ring-ink peer-focus-visible:ring-2 peer-focus-visible:ring-ink",
                      agotado && "opacity-40",
                    )}
                  >
                    <Image
                      src={foto.src}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </span>
                  <span className="text-xs text-muted-foreground peer-checked:text-foreground">
                    {color.nombre}
                    {agotado && <span className="sr-only"> (sin stock)</span>}
                  </span>
                </>
              ) : (
                <>
                  <span className="sr-only">
                    {color.nombre}
                    {agotado && " (sin stock)"}
                  </span>
                  <span
                    aria-hidden
                    style={{ backgroundColor: color.hex }}
                    className={cn(
                      "size-8 rounded-full border border-ink/15 ring-offset-2 ring-offset-background transition-shadow peer-checked:ring-1 peer-checked:ring-ink peer-focus-visible:ring-2 peer-focus-visible:ring-ink",
                      agotado && "opacity-40",
                    )}
                  />
                  {agotado && (
                    <span
                      aria-hidden
                      className="absolute h-px w-8 rotate-45 bg-ink/60"
                    />
                  )}
                </>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
