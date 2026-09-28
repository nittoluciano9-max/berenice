import { ChevronRight } from "lucide-react";
import { useId } from "react";

import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { config } from "@/lib/config";
import { getInstagramHandle } from "@/lib/instagram";

const rowClass =
  "group flex min-h-11 items-center gap-3 py-1 text-sm transition-colors hover:text-muted-foreground";

/** Versión compacta (columna derecha de la vidriera): dos filas-link, sin QR. */
export function CommunityLinks() {
  const id = useId();
  const handle = config.instagramUrl
    ? getInstagramHandle(config.instagramUrl)
    : null;
  if (!handle && !config.whatsappGroupUrl) return null;

  return (
    <section aria-labelledby={id} className="border p-4">
      <h2 id={id} className="font-sans text-xs tracking-[0.18em] uppercase">
        Comunidad Berenice
      </h2>
      <ul className="mt-1 divide-y">
        {handle && (
          <li>
            <a
              href={config.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={rowClass}
            >
              <InstagramIcon className="size-4 shrink-0 text-rosewood" />
              <span className="min-w-0 flex-1">
                <span className="block truncate">{handle}</span>
                <span className="block text-xs text-muted-foreground">
                  Nuevos ingresos y promos
                </span>
              </span>
              <ChevronRight strokeWidth={1.5} className="size-4" aria-hidden />
              <span className="sr-only"> (abre Instagram)</span>
            </a>
          </li>
        )}
        {config.whatsappGroupUrl && (
          <li>
            <a
              href={config.whatsappGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={rowClass}
            >
              <WhatsAppIcon
                strokeWidth={1.5}
                className="size-4 shrink-0 text-rosewood"
                aria-hidden
              />
              <span className="min-w-0 flex-1">
                <span className="block">Grupo de WhatsApp</span>
                <span className="block text-xs text-muted-foreground">
                  Enterate primero
                </span>
              </span>
              <ChevronRight strokeWidth={1.5} className="size-4" aria-hidden />
              <span className="sr-only"> (abre WhatsApp)</span>
            </a>
          </li>
        )}
      </ul>
    </section>
  );
}
