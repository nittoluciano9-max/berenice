import { buildShowcaseHref } from "@/lib/showcase";

export interface NavLink {
  href: string;
  label: string;
}

export const allProductsLink: NavLink = {
  href: "/productos",
  label: "Ver todo",
};

/** Accesos del header a la vidriera de la home, filtrada desde cualquier página. */
export const showcaseLinks: NavLink[] = [
  { href: buildShowcaseHref("", { tab: "nuevos" }), label: "Nuevos" },
  { href: buildShowcaseHref("", { tab: "ofertas" }), label: "Ofertas" },
];

export const helpLinks: NavLink[] = [
  { href: "/guia-de-talles", label: "Guía de talles" },
  { href: "/envios-y-cambios", label: "Envíos y cambios" },
];

export function categoryHref(slug: string): string {
  return `/categoria/${slug}`;
}
