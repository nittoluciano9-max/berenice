import type { Metadata } from "next";

// Marco propio del panel (sin header, footer ni carrito de la tienda). Nunca indexable,
// aunque la tienda sí lo sea.
//
// V2.0: a propósito no hay page.tsx. Sin página, /admin no es una ruta y cae en el 404 de la
// tienda (igual que antes); un page.tsx con notFound() se prerenderiza como documento de error
// vacío. El panel y su login llegan en V2.3.
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <div className="flex flex-1 flex-col">{children}</div>;
}
