import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SORT_OPTIONS } from "@/lib/filters";
import type { SortKey } from "@/types/filters";

interface SortSelectProps {
  value: SortKey;
  onChange?: (value: SortKey) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(v) => {
        const option = SORT_OPTIONS.find((o) => o.value === v);
        if (option) onChange?.(option.value);
      }}
    >
      <SelectTrigger
        aria-label="Ordenar por"
        className="min-w-40 border-transparent px-2 sm:border-input sm:px-3"
      >
        {/* Texto explícito: sin él, Radix deja el valor vacío hasta hidratar. */}
        <SelectValue>
          {SORT_OPTIONS.find((o) => o.value === value)?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent position="popper" align="end">
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
