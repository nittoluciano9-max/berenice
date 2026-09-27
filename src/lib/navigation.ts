export interface NavLink {
  href: string;
  label: string;
}

// Se reemplaza por getCategoryTree() en la etapa 2.
export const mainNav: NavLink[] = [
  { href: "/productos", label: "Productos" },
  { href: "/guia-de-talles", label: "Guía de talles" },
  { href: "/envios-y-cambios", label: "Envíos y cambios" },
];
