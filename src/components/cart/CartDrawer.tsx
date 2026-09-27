"use client";

import Link from "next/link";
import { useRef } from "react";

import { CartClearButton } from "@/components/cart/CartClearButton";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { selectItemCount, useCartHydration, useCartStore } from "@/store/cart";

export function CartDrawer() {
  useCartHydration();
  const items = useCartStore((s) => s.items);
  const count = useCartStore(selectItemCount);
  const isOpen = useCartStore((s) => s.isOpen);
  const aviso = useCartStore((s) => s.aviso);
  const { open, close } = useCartStore.getState();
  // Se abre desde afuera (badge, Agregar, StickyBuyBar) sin Dialog.Trigger: Radix no sabría
  // a dónde devolver el foco al cerrar.
  const opener = useRef<HTMLElement | null>(null);

  return (
    <Sheet open={isOpen} onOpenChange={(next) => (next ? open() : close())}>
      <SheetContent
        side="right"
        className="w-full gap-0 outline-none sm:max-w-md"
        // Radix enfocaría el primer botón (Eliminar): un Enter accidental borraría la línea.
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          opener.current = document.activeElement as HTMLElement | null;
          (e.currentTarget as HTMLElement).focus();
        }}
        onCloseAutoFocus={(e) => {
          if (!opener.current?.isConnected) return;
          e.preventDefault();
          opener.current.focus({ preventScroll: true });
        }}
      >
        <SheetHeader className="border-b px-5 py-5">
          <SheetTitle className="text-2xl">
            Tu carrito
            {count > 0 && (
              <span className="text-muted-foreground"> ({count})</span>
            )}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Productos elegidos, cantidades y total del pedido.
          </SheetDescription>
        </SheetHeader>

        {aviso && (
          <p
            role="status"
            className="border-b bg-blush px-5 py-3 text-sm text-rosewood"
          >
            {aviso}
          </p>
        )}

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-5 text-center">
            <p className="font-serif text-2xl">Tu carrito está vacío</p>
            <p className="text-sm text-muted-foreground">
              Elegí tus prendas favoritas y agregalas acá.
            </p>
            <Button asChild variant="outline">
              <Link href="/productos" onClick={close}>
                Ver productos
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y overflow-y-auto px-5">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </ul>

            <SheetFooter className="gap-4 border-t px-5 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <CartSummary />
              {/* El botón de finalizar por WhatsApp se suma en la etapa 6. */}
              <div className="flex items-center justify-between gap-3 text-xs">
                <button
                  type="button"
                  onClick={close}
                  className="min-h-11 underline underline-offset-4 hover:text-muted-foreground"
                >
                  Seguir comprando
                </button>
                <CartClearButton />
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
