import { Breadcrumbs } from "@/components/category/Breadcrumbs";
import { Container } from "@/components/layout/Container";

interface ContentPageProps {
  titulo: string;
  bajada: string;
  children: React.ReactNode;
}

/** Marco de las páginas estáticas (guía de talles, envíos): columna angosta para lectura. */
export function ContentPage({ titulo, bajada, children }: ContentPageProps) {
  return (
    <Container className="max-w-3xl pt-4 pb-16 lg:pt-8 lg:pb-24">
      <Breadcrumbs
        items={[{ label: "Inicio", href: "/" }, { label: titulo }]}
      />
      <header className="mt-6 mb-10 lg:mt-10 lg:mb-14">
        <h1 className="text-4xl leading-tight lg:text-5xl">{titulo}</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {bajada}
        </p>
      </header>
      <div className="space-y-14">{children}</div>
    </Container>
  );
}
