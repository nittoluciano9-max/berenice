import type { Metadata } from "next";

import { ContentPage } from "@/components/content/ContentPage";
import { WhatsAppHelp } from "@/components/content/WhatsAppHelp";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Envíos y cambios",
  description:
    "Cómo comprar en Berenice, cómo coordinamos envíos y retiros, y cómo funcionan los cambios.",
  alternates: { canonical: "/envios-y-cambios" },
};

const PASOS = [
  "Elegí tus prendas, talle y color, y agregalas al carrito.",
  "Desde el carrito, enviá el pedido por WhatsApp.",
  "Te respondemos para confirmar disponibilidad, forma de pago y entrega.",
];

// PROVISORIO: textos generales. Completar con costos, plazos y condiciones reales de la marca.
const PREGUNTAS = [
  {
    id: "envios",
    pregunta: "¿Hacen envíos?",
    respuesta:
      "Sí. Coordinamos el envío por WhatsApp: el costo y el plazo dependen de tu localidad y te los confirmamos antes de cerrar el pedido.",
  },
  {
    id: "retiro",
    pregunta: "¿Puedo retirar mi pedido?",
    respuesta:
      "Sí. Elegí «Retiro» al enviar el pedido y coordinamos el lugar y el horario.",
  },
  {
    id: "cambios",
    pregunta: "¿Cómo hago un cambio?",
    respuesta:
      "Escribinos por WhatsApp con el código de tu pedido (BER-XXXX) y te indicamos cómo seguir. Por higiene, las prendas tienen que estar sin uso y con su etiqueta.",
  },
  {
    id: "talle",
    pregunta: "¿Y si no me queda el talle?",
    respuesta:
      "Te ayudamos a cambiarlo por otro talle o color, según disponibilidad. Antes de comprar podés revisar la guía de talles o consultarnos.",
  },
  {
    id: "pago",
    pregunta: "¿Cómo pago?",
    respuesta:
      "Te contamos las formas de pago disponibles cuando confirmamos tu pedido por WhatsApp.",
  },
];

export default function EnviosYCambiosPage() {
  return (
    <ContentPage
      titulo="Envíos y cambios"
      bajada="Comprar en Berenice es simple: armás tu pedido en la web y lo confirmamos por WhatsApp."
    >
      <section aria-labelledby="comprar-titulo">
        <h2 id="comprar-titulo" className="text-3xl">
          Cómo comprar
        </h2>
        <ol className="mt-6 space-y-4">
          {PASOS.map((paso, i) => (
            <li key={paso} className="flex gap-4">
              <span
                aria-hidden
                className="font-serif text-2xl leading-none text-rosewood"
              >
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed">{paso}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="preguntas-titulo">
        <h2 id="preguntas-titulo" className="text-3xl">
          Preguntas frecuentes
        </h2>
        <Accordion type="multiple" className="mt-4">
          {PREGUNTAS.map((p) => (
            <AccordionItem key={p.id} value={p.id}>
              <AccordionTrigger>{p.pregunta}</AccordionTrigger>
              <AccordionContent className="leading-relaxed text-muted-foreground">
                {p.respuesta}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <WhatsAppHelp
        titulo="¿Tenés otra consulta?"
        texto="Escribinos y te respondemos a la brevedad."
        mensaje="Hola 👋 Tengo una consulta sobre envíos o cambios."
      />
    </ContentPage>
  );
}
