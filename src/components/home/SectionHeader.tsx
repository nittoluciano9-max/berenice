import Link from "next/link";

import type { NavLink } from "@/lib/navigation";

interface SectionHeaderProps {
  id: string;
  titulo: string;
  bajada?: string;
  link?: NavLink;
}

export function SectionHeader({
  id,
  titulo,
  bajada,
  link,
}: SectionHeaderProps) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 lg:mb-10">
      <div>
        <h2 id={id} className="text-3xl lg:text-4xl">
          {titulo}
        </h2>
        {bajada && (
          <p className="mt-2 text-sm text-muted-foreground">{bajada}</p>
        )}
      </div>
      {link && (
        <Link
          href={link.href}
          className="inline-flex min-h-11 shrink-0 items-center text-xs tracking-[0.18em] uppercase underline underline-offset-4 hover:text-muted-foreground"
        >
          {link.label}
        </Link>
      )}
    </div>
  );
}
