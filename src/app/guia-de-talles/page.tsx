import type { Metadata } from "next";

import { ContentPage } from "@/components/content/ContentPage";
import { SizeTable } from "@/components/content/SizeTable";
import { WhatsAppHelp } from "@/components/content/WhatsAppHelp";

export const metadata: Metadata = {
  title: "Guía de talles",
  description:
    "Cómo medirte y qué talle elegir en corpiños, conjuntos y bombachas de Berenice.",
  alternates: { canonical: "/guia-de-talles" },
};

// PROVISORIO: medidas de referencia en cm. Reemplazar por la tabla real de la marca.
const TALLES_LETRA = [
  ["S", "84–88", "64–68", "90–94"],
  ["M", "88–92", "68–72", "94–98"],
  ["L", "92–96", "72–76", "98–102"],
  ["XL", "96–100", "76–80", "102–106"],
];

const TALLES_CORPINO = [
  ["85", "63–67", "83–87"],
  ["90", "68–72", "88–92"],
  ["95", "73–77", "93–97"],
  ["100", "78–82", "98–102"],
];

const COMO_MEDIRTE = [
  {
    titulo: "Contorno de busto",
    texto: "Por la parte más saliente del busto, con la cinta horizontal.",
  },
  {
    titulo: "Bajo busto",
    texto: "Justo debajo del busto, donde apoya la banda del corpiño.",
  },
  { titulo: "Cintura", texto: "En la parte más angosta del torso." },
  { titulo: "Cadera", texto: "Por la parte más ancha de la cadera." },
];

export default function GuiaDeTallesPage() {
  return (
    <ContentPage
      titulo="Guía de talles"
      bajada="Medite con una cinta métrica sobre ropa interior liviana, sin ajustar. Si quedás entre dos talles, te recomendamos el más grande."
    >
      <section aria-labelledby="medirte-titulo">
        <h2 id="medirte-titulo" className="text-3xl">
          Cómo medirte
        </h2>
        <ol className="mt-6 grid gap-5 sm:grid-cols-2">
          {COMO_MEDIRTE.map((paso, i) => (
            <li key={paso.titulo} className="flex gap-4">
              <span
                aria-hidden
                className="font-serif text-2xl leading-none text-rosewood"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="font-sans text-xs tracking-[0.18em] uppercase">
                  {paso.titulo}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {paso.texto}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="tablas-titulo" className="space-y-10">
        <h2 id="tablas-titulo" className="text-3xl">
          Tablas de medidas
        </h2>
        <SizeTable
          titulo="Conjuntos, bralettes, bodys y bombachas (cm)"
          columnas={["Talle", "Busto", "Cintura", "Cadera"]}
          filas={TALLES_LETRA}
        />
        <SizeTable
          titulo="Corpiños con talle numérico (cm)"
          columnas={["Talle", "Bajo busto", "Busto"]}
          filas={TALLES_CORPINO}
        />
      </section>

      <WhatsAppHelp
        titulo="¿Dudas con tu talle?"
        texto="Contanos tus medidas y la prenda que te gusta: te ayudamos a elegir."
        mensaje="Hola 👋 Quería consultar por un talle."
      />
    </ContentPage>
  );
}
