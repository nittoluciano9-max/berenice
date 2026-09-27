import Link from "next/link";

import { cn } from "@/lib/utils";
import type { CategoryNode } from "@/types/category";
import type { CategoryFilterConfig } from "@/types/filters";

interface CategoryFilterProps {
  config: CategoryFilterConfig;
  selected: string | null;
  queryString: string;
  onSelect?: (slug: string | null) => void;
}

const itemClass =
  "flex min-h-11 w-full items-center text-left text-sm transition-colors hover:text-foreground";

export function CategoryFilter({
  config,
  selected,
  queryString,
  onSelect,
}: CategoryFilterProps) {
  if (config.mode === "links") {
    return (
      <ul>
        {config.links.map((link) => (
          <li key={link.href}>
            <Link
              href={`${link.href}${queryString}`}
              className={cn(itemClass, "text-muted-foreground")}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  const option = (slug: string | null, label: string, nested = false) => (
    <button
      type="button"
      aria-pressed={selected === slug}
      onClick={() => onSelect?.(slug)}
      className={cn(
        itemClass,
        nested && "pl-4",
        selected === slug
          ? "font-medium text-foreground underline underline-offset-4"
          : "text-muted-foreground",
      )}
    >
      {label}
    </button>
  );

  const renderNode = (node: CategoryNode, depth: number) => (
    <li key={node.id}>
      {option(node.slug, node.nombre, depth > 0)}
      {node.children.length > 0 && (
        <ul>{node.children.map((child) => renderNode(child, depth + 1))}</ul>
      )}
    </li>
  );

  return (
    <ul>
      <li>{option(null, "Todas")}</li>
      {config.tree.map((node) => renderNode(node, 0))}
    </ul>
  );
}
