import assert from "node:assert/strict";
import { test } from "node:test";

import { getProductBySlug, getProducts } from "@/lib/catalog";
import { getStock } from "@/lib/stock";
import { getColorLabel } from "@/lib/variants";

test("Colaless regulable: producto real con 3 estampas y fotos reales", async () => {
  const p = await getProductBySlug("colaless-regulable");
  assert.ok(p, "visible en el catálogo");
  assert.equal(p.tipoVariante, "estampa");
  assert.equal(getColorLabel(p), "Estampa");
  assert.deepEqual(
    p.colores.map((c) => c.nombre),
    ["Cerezas", "Flores", "Onda rosa"],
  );
  assert.deepEqual(p.talles, ["S", "M", "L"]);
  for (const c of p.colores)
    assert.match(
      c.imagenes?.[0]?.src ?? "",
      /^\/images\/productos-reales\/.+\.jpeg$/,
    );
  assert.equal(p.precio, 12000);
  assert.equal(p.precioOferta, 9900);
  assert.ok(p.nuevo && p.destacado);
});

test("stock provisorio por estampa y talle", async () => {
  const p = await getProductBySlug("colaless-regulable");
  assert.ok(p);
  const esperado = {
    cerezas: [4, 6, 3],
    flores: [5, 4, 3],
    "onda-rosa": [3, 5, 4],
  };
  for (const [estampa, stocks] of Object.entries(esperado))
    assert.deepEqual(
      p.talles.map((t): number => getStock(p, estampa, t)),
      stocks,
      estampa,
    );
  assert.equal(p.stock, 37, "stock total = suma de variantes");
});

test("Bombachas muestra solo el producto real; los mocks de otras categorías siguen", async () => {
  const bombachas = await getProducts({ categoria: "bombachas" });
  assert.deepEqual(
    bombachas.map((p) => p.slug),
    ["colaless-regulable"],
  );
  for (const slug of ["culotte-sofia", "colaless-valentina", "vedetina-clara"])
    assert.equal(await getProductBySlug(slug), null, `${slug} oculto`);
  for (const slug of [
    "conjunto-aurora",
    "conjunto-lucia",
    "corpino-emma",
    "body-isabella",
  ])
    assert.ok(await getProductBySlug(slug), `${slug} sigue visible`);
});
