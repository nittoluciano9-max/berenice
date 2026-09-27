"use client";

import { ShoppingBag } from "lucide-react";
import { useId, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/currency";
import { selectItemCount, selectTotal, useCartStore } from "@/store/cart";

// Hasta que el store lee localStorage no se sabe si hay carrito: se muestra un marcador neutro
// en vez de "vacío" para no parpadear (y el server siempre renderiza el marcador).
function useCartHydrated() {
  return useSyncExternalStore(
    (onChange) => useCartStore.persist.onFinishHydration(onChange),
    () => useCartStore.persist.hasHydrated(),
    () => false,
  );
}

export function CartQuickView() {
  const id = useId();
  const hydrated = useCartHydrated();
  const count = useCartStore(selectItemCount);
  const total = useCartStore(selectTotal);
  const open = useCartStore((s) => s.open);

  return (
    <section aria-labelledby={id} className="border p-5">
      <h2
        id={id}
        className="flex items-center gap-2 font-sans text-xs tracking-[0.18em] uppercase"
      >
        <ShoppingBag strokeWidth={1.5} className="size-4" aria-hidden />
        Tu carrito
      </h2>
      {!hydrated ? (
        <div aria-hidden className="mt-3 h-12 bg-secondary/60" />
      ) : count === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Todavía no agregaste productos.
        </p>
      ) : (
        <>
          <p className="mt-3 text-sm text-muted-foreground">
            {count} {count === 1 ? "producto" : "productos"}
          </p>
          <p className="font-serif text-2xl tabular-nums">
            {formatPrice(total)}
          </p>
          <Button className="mt-4 w-full" onClick={() => open()}>
            Ver carrito
          </Button>
        </>
      )}
    </section>
  );
}
