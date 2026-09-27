"use client";

import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { selectItemCount, useCartStore } from "@/store/cart";

export function CartButton() {
  // El store arranca vacío en server y cliente (skipHydration): el contador aparece recién al
  // rehidratar, sin mismatch.
  const count = useCartStore(selectItemCount);
  const open = useCartStore((s) => s.open);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative -mr-3"
      onClick={() => open()}
      aria-label={
        count > 0
          ? `Abrir carrito, ${count} ${count === 1 ? "producto" : "productos"}`
          : "Abrir carrito"
      }
    >
      <ShoppingBag strokeWidth={1.5} />
      {count > 0 && (
        <span
          aria-hidden
          className="absolute top-1.5 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[0.625rem] leading-none text-ivory tabular-nums"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Button>
  );
}
