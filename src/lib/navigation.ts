export interface NavLink {
  href: string;
  label: string;
}

export const allProductsLink: NavLink = {
  href: "/productos",
  label: "Ver todo",
};

export const helpLinks: NavLink[] = [
  { href: "/guia-de-talles", label: "Guía de talles" },
  { href: "/envios-y-cambios", label: "Envíos y cambios" },
];

export function categoryHref(slug: string): string {
  return `/categoria/${slug}`;
}
