import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { Button } from "@/components/ui/button";

interface InstagramCardProps {
  url: string;
  handle: string;
}

export function InstagramCard({ url, handle }: InstagramCardProps) {
  return (
    <article className="flex flex-col border p-6 lg:p-8">
      <InstagramIcon className="size-6 text-rosewood" />
      <h3 className="mt-4 text-2xl lg:text-3xl">Seguinos en Instagram</h3>
      <p className="mt-1 text-sm">{handle}</p>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Nuevos ingresos, promociones y contenido de Berenice.
      </p>
      <Button asChild size="lg" className="mt-6 w-full sm:w-auto sm:self-start">
        <a href={url} target="_blank" rel="noopener noreferrer">
          <InstagramIcon className="size-5" />
          Seguirnos en Instagram
          <span className="sr-only"> (se abre en una pestaña nueva)</span>
        </a>
      </Button>
    </article>
  );
}
