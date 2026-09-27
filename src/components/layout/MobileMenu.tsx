"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { allProductsLink, categoryHref, helpLinks } from "@/lib/navigation";
import type { CategoryNode } from "@/types/category";

interface MobileMenuProps {
  categorias: CategoryNode[];
  instagramUrl: string;
}

const secondaryLinkClass =
  "inline-flex min-h-11 items-center text-xs tracking-[0.18em] text-muted-foreground uppercase hover:text-foreground";

export function MobileMenu({ categorias, instagramUrl }: MobileMenuProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="-ml-3 lg:hidden"
          aria-label="Abrir menú"
        >
          <Menu strokeWidth={1.5} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85%] max-w-sm gap-0">
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle className="tracking-[0.2em] uppercase">
            Berenice
          </SheetTitle>
          <SheetDescription className="sr-only">
            Menú de navegación
          </SheetDescription>
        </SheetHeader>

        <nav
          aria-label="Menú principal"
          className="flex-1 overflow-y-auto px-6 py-4"
        >
          <ul>
            {categorias.map((categoria) => (
              <li key={categoria.id} className="border-b py-2">
                <SheetClose asChild>
                  <Link
                    href={categoryHref(categoria.slug)}
                    className="flex min-h-12 items-center font-serif text-2xl"
                  >
                    {categoria.nombre}
                  </Link>
                </SheetClose>
                {categoria.children.length > 0 && (
                  <ul className="pb-2 pl-4">
                    {categoria.children.map((sub) => (
                      <li key={sub.id}>
                        <SheetClose asChild>
                          <Link
                            href={categoryHref(sub.slug)}
                            className="flex min-h-11 items-center text-sm text-muted-foreground hover:text-foreground"
                          >
                            {sub.nombre}
                          </Link>
                        </SheetClose>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            <li className="py-2">
              <SheetClose asChild>
                <Link
                  href={allProductsLink.href}
                  className="flex min-h-12 items-center font-serif text-2xl"
                >
                  {allProductsLink.label}
                </Link>
              </SheetClose>
            </li>
          </ul>
        </nav>

        <div className="flex flex-col border-t px-6 py-4">
          {helpLinks.map((link) => (
            <SheetClose key={link.href} asChild>
              <Link href={link.href} className={secondaryLinkClass}>
                {link.label}
              </Link>
            </SheetClose>
          ))}
          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={secondaryLinkClass}
            >
              Instagram
            </a>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
