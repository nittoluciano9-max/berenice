import { getAhorro, getTotal } from "@/lib/cart";
import { ENTREGA_LABELS, PAGO_LABELS } from "@/lib/checkout";
import { formatPrice } from "@/lib/currency";
import { getItemColorLabel } from "@/lib/variants";
import type { CartItem, DatosPedido } from "@/types/cart";

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

// WhatsApp: *texto* es negrita. El separador se ve igual en Android, iOS y Web.
const SEPARADOR = "━━━━━━━━━━━━━━━━━━";

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
    `Talle: ${item.talle} · ${getItemColorLabel(item)}: ${item.colorNombre}`,
    importe,
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
  const esEnvio = datos.entrega === "envio";
  const ahorro = getAhorro(items);

  const cliente = [
    "👤 *DATOS DEL CLIENTE*",
    rotulo("Nombre", datos.nombre),
    rotulo("Celular", datos.celular),
    rotulo("Pago", datos.pago ? PAGO_LABELS[datos.pago] : ""),
    rotulo("Entrega", datos.entrega ? ENTREGA_LABELS[datos.entrega] : ""),
    ...(esEnvio ? [rotulo("Dirección", datos.direccion)] : []),
  ].join("\n");

  const productos = ["🩷 *PRODUCTOS*", ...items.map(formatLinea)].join("\n\n");

  const total = [
    `💰 *TOTAL: ${precio(getTotal(items))}*`,
    ...(ahorro > 0 ? [`Ahorrás ${precio(ahorro)} con ofertas`] : []),
    datos.entrega === "retiro"
      ? "Coordinamos el retiro por este chat."
      : "El envío se coordina por este chat.",
  ].join("\n");

  const comentario = datos.comentario.trim();
  const cierre = [
    `Código de pedido: ${codigo}`,
    ...(origen ? [`Origen: ${origen}`] : []),
  ].join("\n");

  return [
    `🛍️ *NUEVO PEDIDO · ${tienda.toUpperCase()}*`,
    SEPARADOR,
    cliente,
    SEPARADOR,
    productos,
    SEPARADOR,
    total + (comentario ? `\n\n📝 *COMENTARIO*\n${comentario}` : ""),
    SEPARADOR,
    cierre,
  ].join("\n");
}

interface ProductInquiryOptions {
  nombre: string;
  url: string;
  talle?: string | null;
  colorNombre?: string | null;
  /** "Color" o "Estampa" (ver lib/variants). */
  colorLabel?: string;
}

export function buildProductInquiry({
  nombre,
  url,
  talle,
  colorNombre,
  colorLabel = "Color",
}: ProductInquiryOptions): string {
  const variante = [
    talle && `Talle: ${talle}`,
    colorNombre && `${colorLabel}: ${colorNombre}`,
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
