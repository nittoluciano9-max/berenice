import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface OrderFieldProps {
  id: string;
  label: string;
  icon: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  hint?: string;
  multiline?: boolean;
  maxLength?: number;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}

export const fieldLabelClass =
  "flex items-center gap-2 text-xs tracking-[0.18em] uppercase";

export function OrderField({
  id,
  label,
  icon: Icono,
  value,
  onChange,
  required = false,
  error,
  hint,
  multiline = false,
  maxLength,
  autoComplete,
  inputMode,
}: OrderFieldProps) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`]
    .filter(Boolean)
    .join(" ");
  const shared = {
    id,
    value,
    required,
    maxLength,
    autoComplete,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy || undefined,
    className: cn(
      "w-full bg-transparent text-base outline-none placeholder:text-muted-foreground",
      multiline
        ? "min-h-20 resize-y border border-input px-3 py-2 focus:border-ink"
        : "h-11 border-b border-input px-1 focus:border-ink",
      error && "border-rosewood",
    ),
  };

  return (
    <div>
      <label htmlFor={id} className={fieldLabelClass}>
        <Icono strokeWidth={1.5} className="size-4 text-rosewood" aria-hidden />
        {label}
        {required ? (
          <span aria-hidden> *</span>
        ) : (
          <span className="tracking-normal text-muted-foreground normal-case">
            {" "}
            (opcional)
          </span>
        )}
      </label>
      {multiline ? (
        <textarea
          {...shared}
          rows={2}
          onChange={(e) => onChange(e.target.value)}
          className={cn(shared.className, "mt-2")}
        />
      ) : (
        <input
          {...shared}
          inputMode={inputMode}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-rosewood">
          {error}
        </p>
      )}
    </div>
  );
}
