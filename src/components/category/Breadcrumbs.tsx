import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Ruta de navegación">
      <ol className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li
              key={`${item.label}-${i}`}
              className="flex items-center gap-x-2"
            >
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center hover:text-foreground"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className="text-foreground"
                >
                  {item.label}
                </span>
              )}
              {!isLast && <span aria-hidden>/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
