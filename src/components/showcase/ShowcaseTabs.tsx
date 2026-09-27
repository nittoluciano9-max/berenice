import Link from "next/link";

import { buildShowcaseHref, SHOWCASE_TABS } from "@/lib/showcase";
import { cn } from "@/lib/utils";
import type { ShowcaseTab } from "@/types/showcase";

interface ShowcaseTabsProps {
  tab: ShowcaseTab;
  params: string;
}

export function ShowcaseTabs({ tab, params }: ShowcaseTabsProps) {
  return (
    <ul aria-label="Mostrar" className="flex gap-6">
      {SHOWCASE_TABS.map(({ value, label }) => {
        const active = value === tab;
        return (
          <li key={value}>
            {/* replace: los tabs no llenan el historial; las categorías sí (ver CategorySidebar). */}
            <Link
              href={buildShowcaseHref(params, { tab: value })}
              replace
              scroll={false}
              aria-current={active ? "true" : undefined}
              className={cn(
                "flex min-h-11 items-center border-b text-xs tracking-[0.18em] uppercase transition-colors",
                active
                  ? "border-ink text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
