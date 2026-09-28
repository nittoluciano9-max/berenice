import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { config } from "@/lib/config";
import { getColorLabel } from "@/lib/variants";
import { buildProductInquiry, buildWhatsAppUrl } from "@/lib/whatsapp";
import type { Product } from "@/types/product";

interface ProductInquiryLinkProps {
  product: Pick<Product, "nombre" | "slug" | "colores" | "tipoVariante">;
  /** Slug del color o estampa elegido. */
  color: string;
  talle: string | null;
}

export function ProductInquiryLink({
  product,
  color,
  talle,
}: ProductInquiryLinkProps) {
  const texto = buildProductInquiry({
    nombre: product.nombre,
    url: `${config.siteUrl}/producto/${product.slug}`,
    talle,
    colorNombre: product.colores.find((c) => c.slug === color)?.nombre,
    colorLabel: getColorLabel(product),
  });

  return (
    <a
      href={buildWhatsAppUrl(config.whatsappNumber, texto)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center gap-2 text-sm underline underline-offset-4 hover:text-muted-foreground"
    >
      <WhatsAppIcon strokeWidth={1.5} className="size-4" />
      Consultar por WhatsApp
      <span className="sr-only"> (se abre en una pestaña nueva)</span>
    </a>
  );
}
