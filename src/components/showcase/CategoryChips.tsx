import Link from "next/link";

import { buildShowcaseHref } from "@/lib/showcase";
import { cn } from "@/lib/utils";
import type { ShowcaseCategoryGroup } from "@/types/showcase";

interface CategoryChipsProps {
  groups: ShowcaseCategoryGroup[];
  selected: string | null;
  params: string;
}

/** Versión mobile de la barra de categorías: fila deslizable con scroll-snap. */
export function CategoryChips({
  groups,
  selected,
  params,
}: CategoryChipsProps) {
  const chips = [
    { slug: null, nombre: "Todos" },
    ...groups.flatMap((g) => g.items),
  ];

  return (
    <nav aria-label="Categorías">
      <ul className="-mx-4 flex snap-x scroll-px-4 [scrollbar-width:none] gap-2 overflow-x-auto px-4 sm:-mx-6 sm:scroll-px-6 sm:px-6 [&::-webkit-scrollbar]:hidden">
        {chips.map(({ slug, nombre }) => {
          const active = selected === slug;
          return (
            <li key={slug ?? "todos"} className="shrink-0 snap-start">
              <Link
                href={buildShowcaseHref(params, { cat: slug })}
                scroll={false}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "flex h-11 items-center border px-4 text-xs tracking-[0.12em] whitespace-nowrap uppercase transition-colors",
                  active
                    ? "border-ink bg-ink text-ivory"
                    : "border-input bg-background hover:border-ink",
                )}
              >
                {nombre}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
