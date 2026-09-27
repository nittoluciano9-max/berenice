import { MessageCircle } from "lucide-react";

import { config } from "@/lib/config";
import { buildProductInquiry, buildWhatsAppUrl } from "@/lib/whatsapp";

interface ProductInquiryLinkProps {
  nombre: string;
  slug: string;
  talle: string | null;
  colorNombre?: string;
}

export function ProductInquiryLink({
  nombre,
  slug,
  talle,
  colorNombre,
}: ProductInquiryLinkProps) {
  const texto = buildProductInquiry({
    nombre,
    url: `${config.siteUrl}/producto/${slug}`,
    talle,
    colorNombre,
  });

  return (
    <a
      href={buildWhatsAppUrl(config.whatsappNumber, texto)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center gap-2 text-sm underline underline-offset-4 hover:text-muted-foreground"
    >
      <MessageCircle strokeWidth={1.5} className="size-4" />
      Consultar por WhatsApp
      <span className="sr-only"> (se abre en una pestaña nueva)</span>
    </a>
  );
}
