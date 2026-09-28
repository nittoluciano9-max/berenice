import { buildQrSvg } from "@/lib/qr";
import { cn } from "@/lib/utils";

interface WhatsAppGroupQrProps {
  url: string;
  className?: string;
}

/** Server Component: el QR sale del mismo enlace que el botón, así nunca se desincronizan. */
export async function WhatsAppGroupQr({
  url,
  className,
}: WhatsAppGroupQrProps) {
  const svg = await buildQrSvg(url);
  return (
    <div
      role="img"
      aria-label="Código QR para sumarte al grupo de WhatsApp de Berenice"
      // Fondo claro y padding = margen de silencio que el lector necesita alrededor del código.
      className={cn(
        "shrink-0 bg-background p-3 text-ink [&>svg]:block [&>svg]:size-full",
        className,
      )}
      // SVG generado por nosotros a partir de la configuración (no es contenido de usuarios).
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
