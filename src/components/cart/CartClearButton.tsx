"use client";

import { useState } from "react";

import { useCartStore } from "@/store/cart";

export function CartClearButton() {
  const clear = useCartStore((s) => s.clear);
  const [confirmando, setConfirmando] = useState(false);

  if (!confirmando) {
    return (
      <button
        type="button"
        onClick={() => setConfirmando(true)}
        className="min-h-11 text-muted-foreground underline underline-offset-4 hover:text-foreground"
      >
        Vaciar carrito
      </button>
    );
  }

  return (
    <span
      className="flex items-center gap-1"
      role="group"
      aria-label="Confirmar vaciar carrito"
    >
      <span className="text-muted-foreground">¿Vaciar?</span>
      <button
        type="button"
        onClick={clear}
        className="min-h-11 px-2 font-medium text-rosewood"
      >
        Sí
      </button>
      <button
        type="button"
        onClick={() => setConfirmando(false)}
        className="min-h-11 px-2"
      >
        No
      </button>
    </span>
  );
}
