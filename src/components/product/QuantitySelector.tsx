import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  value: number;
  max: number;
  onChange: (cantidad: number) => void;
  disabled?: boolean;
}

export function QuantitySelector({
  value,
  max,
  onChange,
  disabled = false,
}: QuantitySelectorProps) {
  const buttonClass =
    "flex size-11 items-center justify-center transition-colors hover:bg-secondary disabled:pointer-events-none disabled:opacity-30";

  return (
    <div
      role="group"
      aria-label="Cantidad"
      className="inline-flex items-center border border-input"
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={disabled || value <= 1}
        aria-label="Restar una unidad"
        className={buttonClass}
      >
        <Minus strokeWidth={1.5} className="size-4" />
      </button>
      <output
        aria-live="polite"
        className="w-10 text-center text-sm tabular-nums"
      >
        {value}
      </output>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={disabled || value >= max}
        aria-label="Sumar una unidad"
        className={buttonClass}
      >
        <Plus strokeWidth={1.5} className="size-4" />
      </button>
    </div>
  );
}
