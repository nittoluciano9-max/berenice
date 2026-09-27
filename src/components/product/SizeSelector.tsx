import Link from "next/link";
import { useId } from "react";

import { cn } from "@/lib/utils";

interface SizeSelectorProps {
  talles: string[];
  value: string | null;
  onChange: (talle: string) => void;
  isDisponible: (talle: string) => boolean;
}

export function SizeSelector({
  talles,
  value,
  onChange,
  isDisponible,
}: SizeSelectorProps) {
  const labelId = useId();

  // radiogroup + aria-labelledby en vez de fieldset/legend: el legend no se deja maquetar
  // en una fila junto al link de la guía.
  return (
    <div role="radiogroup" aria-labelledby={labelId}>
      <div className="mb-1 flex items-center justify-between">
        <p id={labelId} className="text-xs tracking-[0.18em] uppercase">
          Talle
          {value && (
            <span className="tracking-normal text-muted-foreground normal-case">
              : {value}
            </span>
          )}
        </p>
        <Link
          href="/guia-de-talles"
          className="inline-flex min-h-11 items-center text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Guía de talles
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {talles.map((talle) => {
          const disponible = isDisponible(talle);
          return (
            <label key={talle} className="relative">
              <input
                type="radio"
                name="talle"
                value={talle}
                checked={value === talle}
                disabled={!disponible}
                onChange={() => onChange(talle)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "flex h-11 min-w-11 cursor-pointer items-center justify-center border border-input px-3 text-sm transition-colors",
                  "peer-checked:border-ink peer-checked:bg-ink peer-checked:text-ivory peer-focus-visible:ring-1 peer-focus-visible:ring-ink peer-focus-visible:ring-offset-2",
                  disponible
                    ? "hover:border-ink"
                    : "cursor-not-allowed text-muted-foreground/60 line-through",
                )}
              >
                {talle}
                {!disponible && <span className="sr-only"> (sin stock)</span>}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
