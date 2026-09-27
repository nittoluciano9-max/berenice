import { CartDrawer } from "@/components/cart/CartDrawer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { VisitOriginTracker } from "@/components/layout/VisitOriginTracker";

interface StoreShellProps {
  children: React.ReactNode;
}

/**
 * Marco de la tienda pública. Lo usan el layout de `(tienda)` y el `not-found` raíz: una URL
 * inexistente cae fuera del route group y, sin esto, el 404 quedaría sin header ni footer.
 */
export function StoreShell({ children }: StoreShellProps) {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
      <CartDrawer />
      <FloatingWhatsApp />
      <VisitOriginTracker />
    </>
  );
}
