import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { WhatsAppGroupQr } from "@/components/community/WhatsAppGroupQr";
import { Button } from "@/components/ui/button";

interface WhatsAppGroupCardProps {
  url: string;
}

// Mobile: texto → QR → botón. Desde sm: texto y botón a la izquierda, QR a la derecha.
export function WhatsAppGroupCard({ url }: WhatsAppGroupCardProps) {
  return (
    <article className="grid gap-6 bg-blush p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-x-8 lg:p-8">
      <div className="sm:col-start-1">
        <WhatsAppIcon
          strokeWidth={1.5}
          className="size-6 text-rosewood"
          aria-hidden
        />
        <h3 className="mt-4 text-2xl lg:text-3xl">
          Sumate al grupo de WhatsApp
        </h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Enterate primero de nuevos ingresos, promociones y novedades.
        </p>
      </div>

      <figure className="flex flex-col items-center gap-2 sm:col-start-2 sm:row-span-2 sm:row-start-1">
        <WhatsAppGroupQr url={url} className="size-30 sm:size-36" />
        <figcaption className="max-w-40 text-center text-xs text-muted-foreground">
          ¿Estás en otro dispositivo? Escaneá el código.
        </figcaption>
      </figure>

      <Button
        asChild
        size="lg"
        className="w-full sm:col-start-1 sm:w-auto sm:justify-self-start"
      >
        <a href={url} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon strokeWidth={1.5} />
          Sumarme al grupo
          <span className="sr-only"> (se abre WhatsApp)</span>
        </a>
      </Button>
    </article>
  );
}
