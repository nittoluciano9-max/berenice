import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { config } from "@/lib/config";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface WhatsAppHelpProps {
  titulo: string;
  texto: string;
  /** Mensaje precargado en WhatsApp. */
  mensaje: string;
}

export function WhatsAppHelp({ titulo, texto, mensaje }: WhatsAppHelpProps) {
  return (
    <section className="bg-blush px-5 py-8 text-center sm:px-10">
      <h2 className="text-2xl">{titulo}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        {texto}
      </p>
      <Button asChild size="lg" className="mt-6 w-full sm:w-auto">
        <a
          href={buildWhatsAppUrl(config.whatsappNumber, mensaje)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle strokeWidth={1.5} />
          Escribinos por WhatsApp
          <span className="sr-only"> (se abre en una pestaña nueva)</span>
        </a>
      </Button>
    </section>
  );
}
