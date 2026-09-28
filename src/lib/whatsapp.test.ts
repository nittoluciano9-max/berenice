import assert from "node:assert/strict";
import { test } from "node:test";

import { buildCartItem } from "@/lib/cart";
import {
  buildOrderMessage,
  buildProductInquiry,
  buildWhatsAppUrl,
  generateOrderCode,
} from "@/lib/whatsapp";
import type { CartItem, DatosPedido } from "@/types/cart";
import type { Product } from "@/types/product";

const aurora: CartItem = {
  id: "p-001:negro:M",
  productId: "p-001",
  slug: "conjunto-aurora",
  nombre: "Conjunto Aurora",
  imagen: "",
  color: "negro",
  colorNombre: "Negro",
  talle: "M",
  precioUnitario: 25000,
  precioLista: 25000,
  cantidad: 1,
};
const lucia: CartItem = {
  ...aurora,
  id: "p-002:bordo:90",
  productId: "p-002",
  nombre: "Conjunto Lucía",
  colorNombre: "Bordó",
  talle: "90",
  precioUnitario: 27200,
  precioLista: 32000,
  cantidad: 2,
};
const envio: DatosPedido = {
  nombre: "Ana Pérez",
  celular: "341 555-1234",
  pago: "transferencia",
  entrega: "envio",
  direccion: "Bv. Oroño 1234, Rosario. Timbre 2B",
  comentario: "¿Lo tienen en negro?",
};

test("mensaje completo con envío, comentario y origen (formato aprobado)", () => {
  const msg = buildOrderMessage([aurora, lucia], {
    codigo: "BER-7K3P",
    datos: envio,
    origen: "instagram",
    tienda: "Berenice",
  });
  assert.equal(
    msg,
    [
      "🛍️ *NUEVO PEDIDO · BERENICE*",
      "━━━━━━━━━━━━━━━━━━",
      "👤 *DATOS DEL CLIENTE*",
      "Nombre: Ana Pérez",
      "Celular: 341 555-1234",
      "Pago: Transferencia",
      "Entrega: Envío",
      "Dirección: Bv. Oroño 1234, Rosario. Timbre 2B",
      "━━━━━━━━━━━━━━━━━━",
      "🩷 *PRODUCTOS*",
      "",
      "1x Conjunto Aurora",
      "Talle: M · Color: Negro",
      "$25.000",
      "",
      "2x Conjunto Lucía",
      "Talle: 90 · Color: Bordó",
      "$27.200 c/u · $54.400",
      "━━━━━━━━━━━━━━━━━━",
      "💰 *TOTAL: $79.400*",
      "Ahorrás $9.600 con ofertas",
      "El envío se coordina por este chat.",
      "",
      "📝 *COMENTARIO*",
      "¿Lo tienen en negro?",
      "━━━━━━━━━━━━━━━━━━",
      "Código de pedido: BER-7K3P",
      "Origen: instagram",
    ].join("\n"),
  );
});

test("retiro: sin dirección (aunque se haya escrito), sin comentario ni origen", () => {
  const msg = buildOrderMessage([aurora], {
    codigo: "BER-AAAA",
    tienda: "Berenice",
    datos: { ...envio, pago: "efectivo", entrega: "retiro", comentario: "  " },
  });
  assert.ok(msg.includes("Pago: Efectivo\nEntrega: Retiro\n━"));
  assert.ok(!msg.includes("Dirección"));
  assert.ok(!msg.includes("COMENTARIO"));
  assert.ok(!msg.includes("Origen"));
  assert.ok(!msg.includes("Ahorrás"), "sin ofertas no hay línea de ahorro");
  assert.ok(msg.includes("Coordinamos el retiro por este chat."));
  assert.ok(msg.endsWith("Código de pedido: BER-AAAA"));
});

test("producto con estampa: el rótulo viaja en la línea y el mensaje dice «Estampa»", () => {
  const colaless = {
    id: "p-x",
    slug: "colaless-regulable",
    nombre: "Colaless regulable",
    precio: 1000,
    imagenes: [{ src: "/a.jpeg", alt: "" }],
    tipoVariante: "estampa",
    colores: [{ slug: "cerezas", nombre: "Cerezas", hex: "#000" }],
  } as unknown as Product;
  const item = buildCartItem(colaless, "cerezas", "M", 1);
  assert.equal(item.colorLabel, "Estampa");
  const msg = buildOrderMessage([item], {
    codigo: "B",
    datos: envio,
    tienda: "Berenice",
  });
  assert.ok(msg.includes("Talle: M · Estampa: Cerezas"));
  assert.equal(
    buildCartItem({ ...colaless, tipoVariante: undefined }, "cerezas", "M", 1)
      .colorLabel,
    undefined,
  );
});

test("consulta de producto: usa el rótulo de la variante", () => {
  assert.equal(
    buildProductInquiry({
      nombre: "Colaless regulable",
      url: "u",
      talle: "M",
      colorNombre: "Flores",
      colorLabel: "Estampa",
    }),
    "Hola 👋 Quería consultar por Colaless regulable (Talle: M · Estampa: Flores).\nu",
  );
});

test("URL de WhatsApp: número normalizado y texto codificado sin pérdidas", () => {
  const msg = buildOrderMessage([aurora], {
    codigo: "BER-1",
    datos: envio,
    tienda: "Berenice",
  });
  const url = buildWhatsAppUrl("+54 9 341 555-1234", msg);
  assert.ok(url.startsWith("https://wa.me/5493415551234?text="));
  assert.equal(decodeURIComponent(url.split("?text=")[1]), msg);
});

test("código BER-XXXX sin caracteres ambiguos", () => {
  assert.match(generateOrderCode(), /^BER-[A-HJ-NP-Z2-9]{4}$/);
});
