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
import type { NavLink } from "@/lib/navigation";

interface MobileMenuProps {
  links: NavLink[];
  instagramUrl: string;
}

export function MobileMenu({ links, instagramUrl }: MobileMenuProps) {
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
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <SheetClose asChild>
                  <Link
                    href={link.href}
                    className="flex min-h-14 items-center border-b font-serif text-2xl"
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>
        </nav>
        {instagramUrl && (
          <div className="border-t px-6 py-5">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-xs tracking-[0.18em] text-muted-foreground uppercase hover:text-foreground"
            >
              Instagram
            </a>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
