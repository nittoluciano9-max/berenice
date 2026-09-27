"use client";

import { useEffect, useState } from "react";

import { PriceTag } from "@/components/product/PriceTag";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface StickyBuyBarProps {
  product: Pick<Product, "nombre" | "precio" | "precioOferta">;
  onAdd: () => void;
  agotado: boolean;
  /** Botón principal: mientras esté en pantalla, la barra se oculta para no duplicarlo. */
  targetRef: React.RefObject<HTMLElement | null>;
}

export function StickyBuyBar({
  product,
  onAdd,
  agotado,
  targetRef,
}: StickyBuyBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(!entry.isIntersecting),
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [targetRef]);

  return (
    <div
      data-sticky-buy-bar
      aria-hidden={!visible}
      inert={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm transition-transform duration-300 lg:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm">{product.nombre}</p>
          <PriceTag product={product} className="text-sm" />
        </div>
        <Button onClick={onAdd} disabled={agotado} className="shrink-0">
          {agotado ? "Sin stock" : "Agregar"}
        </Button>
      </div>
    </div>
  );
}
