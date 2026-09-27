"use client";

import { MessageCircle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { config } from "@/lib/config";
import { getVisitOrigin } from "@/lib/origin";
import {
  buildOrderMessage,
  buildWhatsAppUrl,
  generateOrderCode,
} from "@/lib/whatsapp";
import type { CartItem, DatosPedido } from "@/types/cart";

interface WhatsAppCheckoutProps {
  items: CartItem[];
  datos: DatosPedido;
}

export function WhatsAppCheckout({ items, datos }: WhatsAppCheckoutProps) {
  const [enviado, setEnviado] = useState<{ codigo: string; url: string }>();

  // El código se genera al finalizar; el carrito no se vacía por si hay que corregir el pedido.
  const enviar = () => {
    const codigo = generateOrderCode();
    const texto = buildOrderMessage(items, {
      codigo,
      datos,
      origen: getVisitOrigin(),
      tienda: config.siteName,
    });
    const url = buildWhatsAppUrl(config.whatsappNumber, texto);
    window.open(url, "_blank", "noopener,noreferrer");
    setEnviado({ codigo, url });
  };

  return (
    <div className="space-y-2">
      <Button size="lg" className="w-full" onClick={enviar}>
        <MessageCircle strokeWidth={1.5} />
        Enviar pedido por WhatsApp
      </Button>
      {enviado && (
        <p role="status" className="text-center text-xs text-muted-foreground">
          Abrimos WhatsApp con tu pedido {enviado.codigo}.{" "}
          <a
            href={enviado.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline underline-offset-4"
          >
            ¿No se abrió? Tocá acá
          </a>
        </p>
      )}
    </div>
  );
}
