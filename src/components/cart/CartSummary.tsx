"use client";

import { formatPrice } from "@/lib/currency";
import {
  selectAhorro,
  selectSubtotal,
  selectTotal,
  useCartStore,
} from "@/store/cart";

export function CartSummary() {
  const subtotal = useCartStore(selectSubtotal);
  const ahorro = useCartStore(selectAhorro);
  const total = useCartStore(selectTotal);

  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between">
        <dt className="text-muted-foreground">Subtotal</dt>
        <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
      </div>
      {ahorro > 0 && (
        <div className="flex justify-between text-rosewood">
          <dt>Ahorrás</dt>
          <dd className="tabular-nums">{formatPrice(ahorro)}</dd>
        </div>
      )}
      <div className="flex justify-between border-t pt-3 text-base">
        <dt>Total</dt>
        <dd className="font-medium tabular-nums">{formatPrice(total)}</dd>
      </div>
      <p className="pt-1 text-xs text-muted-foreground">
        El envío se coordina por WhatsApp.
      </p>
    </dl>
  );
}
