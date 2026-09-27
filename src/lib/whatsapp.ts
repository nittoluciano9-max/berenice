import { getTotal } from "@/lib/cart";
import { formatPrice } from "@/lib/currency";
import type { CartItem, DatosPedido, FormaEntrega } from "@/types/cart";

export const ENTREGA_LABELS: Record<FormaEntrega, string> = {
  envio: "Envío",
  retiro: "Retiro",
};

// Sin 0/O ni 1/I: el código se lee y se dicta por chat.
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Referencia `BER-XXXX` solo para el mensaje: no se persiste ni identifica nada. */
export function generateOrderCode(random: () => number = Math.random): string {
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += CODE_CHARS[Math.floor(random() * CODE_CHARS.length)];
  }
  return `BER-${code}`;
}

// En el chat "$25.000" se lee mejor que el "$ 25.000" de la UI.
const precio = (pesos: number) => formatPrice(pesos).replace(/\s/g, "");

const rotulo = (label: string, valor = "") =>
  valor.trim() ? `${label}: ${valor.trim()}` : `${label}:`;

function formatLinea(item: CartItem): string {
  const unitario = precio(item.precioUnitario);
  const importe =
    item.cantidad > 1
      ? `${unitario} c/u · ${precio(item.precioUnitario * item.cantidad)}`
      : unitario;
  return [
    `${item.cantidad}x ${item.nombre}`,
    `Talle: ${item.talle} · Color: ${item.colorNombre}`,
    `Precio: ${importe}`,
  ].join("\n");
}

interface OrderMessageOptions {
  codigo: string;
  datos: DatosPedido;
  /** `?ref=` de la visita (QR, Instagram…); si no hay, no se agrega la línea. */
  origen?: string | null;
  tienda: string;
}

export function buildOrderMessage(
  items: CartItem[],
  { codigo, datos, origen, tienda }: OrderMessageOptions,
): string {
  const cliente = [
    rotulo("Nombre", datos.nombre),
    rotulo(
      "Forma de entrega",
      datos.entrega ? ENTREGA_LABELS[datos.entrega] : "",
    ),
    rotulo("Localidad", datos.localidad),
  ];
  if (origen) cliente.push(rotulo("Origen", origen));

  return [
    `Hola 👋\nQuiero realizar el siguiente pedido en ${tienda} (${codigo}):`,
    ...items.map(formatLinea),
    `Total: ${precio(getTotal(items))}`,
    cliente.join("\n"),
  ].join("\n\n");
}

interface ProductInquiryOptions {
  nombre: string;
  url: string;
  talle?: string | null;
  colorNombre?: string | null;
}

export function buildProductInquiry({
  nombre,
  url,
  talle,
  colorNombre,
}: ProductInquiryOptions): string {
  const variante = [
    talle && `Talle: ${talle}`,
    colorNombre && `Color: ${colorNombre}`,
  ]
    .filter(Boolean)
    .join(" · ");
  return [
    `Hola 👋 Quería consultar por ${nombre}${variante ? ` (${variante})` : ""}.`,
    url,
  ].join("\n");
}

/** Sin número configurado, wa.me deja elegir el contacto: sirve en desarrollo. */
export function buildWhatsAppUrl(numero: string, texto: string): string {
  return `https://wa.me/${numero.replace(/\D/g, "")}?text=${encodeURIComponent(texto)}`;
}
