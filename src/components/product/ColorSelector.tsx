import { cn } from "@/lib/utils";
import type { ProductColor } from "@/types/product";

interface ColorSelectorProps {
  colores: ProductColor[];
  value: string;
  onChange: (slug: string) => void;
  /** Colores sin stock en ningún talle. */
  agotados: string[];
}

export function ColorSelector({
  colores,
  value,
  onChange,
  agotados,
}: ColorSelectorProps) {
  const actual = colores.find((c) => c.slug === value);

  return (
    <fieldset>
      <legend className="mb-3 text-xs tracking-[0.18em] uppercase">
        Color:{" "}
        <span className="tracking-normal text-muted-foreground normal-case">
          {actual?.nombre}
        </span>
      </legend>
      <div className="flex flex-wrap gap-1">
        {colores.map((color) => {
          const agotado = agotados.includes(color.slug);
          return (
            <label
              key={color.slug}
              title={agotado ? `${color.nombre} (sin stock)` : color.nombre}
              className="relative flex size-11 cursor-pointer items-center justify-center"
            >
              <input
                type="radio"
                name="color"
                value={color.slug}
                checked={value === color.slug}
                onChange={() => onChange(color.slug)}
                className="peer sr-only"
              />
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
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
