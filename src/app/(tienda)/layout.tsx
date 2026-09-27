import { StoreShell } from "@/components/layout/StoreShell";

// Route group: "(tienda)" no aparece en la URL. Separa la tienda pública del futuro /admin.
export default function TiendaLayout({ children }: LayoutProps<"/">) {
  return <StoreShell>{children}</StoreShell>;
}
