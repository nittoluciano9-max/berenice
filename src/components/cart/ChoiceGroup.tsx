import type { LucideIcon } from "lucide-react";

import { fieldLabelClass } from "@/components/cart/OrderField";
import { cn } from "@/lib/utils";

interface ChoiceGroupProps<T extends string> {
  name: string;
  legend: string;
  icon: LucideIcon;
  options: Record<T, string>;
  /** Ícono de cada opción (misma clave que `options`). */
  optionIcons: Record<T, LucideIcon>;
  value: T | null;
  onChange: (value: T) => void;
  error?: string;
}

/**
 * Opciones excluyentes como tarjetas seleccionables (48 px). Debajo hay radios nativos ocultos:
 * teclado, lector de pantalla y `required` funcionan sin JS extra.
 */
export function ChoiceGroup<T extends string>({
  name,
  legend,
  icon: Icono,
  options,
  optionIcons,
  value,
  onChange,
  error,
}: ChoiceGroupProps<T>) {
  const errorId = `${name}-error`;
  return (
    // aria-invalid no aplica a radios: el error se marca en el grupo y se anuncia con describedby.
    <fieldset data-invalid={error ? true : undefined}>
      <legend className={cn(fieldLabelClass, "mb-2")}>
        <Icono strokeWidth={1.5} className="size-4 text-rosewood" aria-hidden />
        {legend}
        <span aria-hidden> *</span>
      </legend>
      <div className="grid grid-cols-2 gap-2">
        {(Object.keys(options) as T[]).map((opcion) => {
          const IconoOpcion: LucideIcon = optionIcons[opcion];
          return (
            <label key={opcion} className="relative">
              <input
                type="radio"
                name={name}
                value={opcion}
                checked={value === opcion}
                onChange={() => onChange(opcion)}
                required
                aria-describedby={error ? errorId : undefined}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "flex min-h-12 cursor-pointer items-center justify-center gap-2 border px-3 text-sm transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-ivory peer-focus-visible:ring-1 peer-focus-visible:ring-ink peer-focus-visible:ring-offset-2 hover:border-ink",
                  error ? "border-rosewood" : "border-input",
                )}
              >
                <IconoOpcion strokeWidth={1.5} className="size-5" aria-hidden />
                {options[opcion]}
              </span>
            </label>
          );
        })}
      </div>
      {error && (
        <p id={errorId} className="mt-1 text-xs text-rosewood">
          {error}
        </p>
      )}
    </fieldset>
  );
}
