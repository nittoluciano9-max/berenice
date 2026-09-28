import assert from "node:assert/strict";
import { test } from "node:test";

import { buildQrSvg } from "@/lib/qr";

const URL_GRUPO = "https://chat.whatsapp.com/EJEMPLO123?mode=gi_t";

test("QR en SVG con el color de la marca (currentColor) y sin fondo propio", async () => {
  const svg = await buildQrSvg(URL_GRUPO);
  assert.match(svg, /^<svg[^>]+viewBox="0 0 \d+ \d+"/);
  assert.ok(svg.includes('stroke="currentColor"'));
  assert.ok(!/#ffffff|#000000/i.test(svg), "sin colores hex sueltos");
});

test("mismo enlace → mismo QR; otro enlace → otro QR", async () => {
  assert.equal(await buildQrSvg(URL_GRUPO), await buildQrSvg(URL_GRUPO));
  assert.notEqual(
    await buildQrSvg(URL_GRUPO),
    await buildQrSvg(URL_GRUPO + "x"),
  );
});
