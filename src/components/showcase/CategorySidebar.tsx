import Link from "next/link";

import { buildShowcaseHref } from "@/lib/showcase";
import { cn } from "@/lib/utils";
import type { ShowcaseCategoryGroup } from "@/types/showcase";

interface CategorySidebarProps {
  groups: ShowcaseCategoryGroup[];
  selected: string | null;
  params: string;
}

const titleClass = "text-xs tracking-[0.18em] text-muted-foreground uppercase";

export function CategorySidebar({
  groups,
  selected,
  params,
}: CategorySidebarProps) {
  const item = (slug: string | null, nombre: string) => {
    const active = selected === slug;
    return (
      <li key={slug ?? "todos"}>
        {/* Link con historial (push): "Atrás" vuelve a la categoría anterior. */}
        <Link
          href={buildShowcaseHref(params, { cat: slug })}
          scroll={false}
          aria-current={active ? "true" : undefined}
          className={cn(
            "group flex min-h-10 items-center gap-3 text-sm transition-colors",
            active
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "size-1.5 rounded-full transition-colors",
              active ? "bg-rosewood" : "bg-transparent group-hover:bg-nude",
            )}
          />
          <span className={cn(active && "font-medium")}>{nombre}</span>
        </Link>
      </li>
    );
  };

  return (
    <nav aria-label="Categorías" className="space-y-6">
      <div>
        <p className={titleClass}>Categorías</p>
        <ul className="mt-3">{item(null, "Todos")}</ul>
      </div>
      {groups.map((group) => (
        <div key={group.titulo}>
          <p className={titleClass}>{group.titulo}</p>
          <ul className="mt-3">
            {group.items.map((c) => item(c.slug, c.nombre))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
