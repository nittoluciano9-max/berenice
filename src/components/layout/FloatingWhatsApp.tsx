"use client";

import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { config } from "@/lib/config";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { useCartStore } from "@/store/cart";

const MENSAJE = "Hola 👋 Tengo una consulta.";

export function FloatingWhatsApp() {
  const drawerAbierto = useCartStore((s) => s.isOpen);
  if (drawerAbierto) return null;

  return (
    <a
      href={buildWhatsAppUrl(config.whatsappNumber, MENSAJE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp (se abre en una pestaña nueva)"
      className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 flex size-14 items-center justify-center rounded-full bg-ink text-ivory shadow-md transition-[bottom,background-color] duration-300 hover:bg-ink/85 lg:right-8 lg:bottom-8 max-lg:sticky-bar-visible:bottom-[calc(5rem+max(0.75rem,env(safe-area-inset-bottom)))] xl:showcase:hidden"
    >
      <WhatsAppIcon strokeWidth={1.5} className="size-6" />
    </a>
  );
}
