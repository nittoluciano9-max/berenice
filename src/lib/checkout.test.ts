import assert from "node:assert/strict";
import { test } from "node:test";

import { EMPTY_ORDER, hasErrors, validateOrderDetails } from "@/lib/checkout";
import type { DatosPedido } from "@/types/cart";

const valido: DatosPedido = {
  nombre: "Ana Pérez",
  celular: "341 555-1234",
  pago: "transferencia",
  entrega: "retiro",
  direccion: "",
  comentario: "",
};

test("un pedido completo con retiro es válido (sin dirección)", () => {
  assert.deepEqual(validateOrderDetails(valido), {});
});

test("formulario vacío: marca los cuatro obligatorios (la dirección solo aplica con envío)", () => {
  const e = validateOrderDetails(EMPTY_ORDER);
  assert.deepEqual(Object.keys(e).sort(), [
    "celular",
    "entrega",
    "nombre",
    "pago",
  ]);
  assert.ok(hasErrors(e));
});

test("nombre: exige nombre y apellido", () => {
  assert.ok(validateOrderDetails({ ...valido, nombre: "Ana" }).nombre);
  assert.ok(validateOrderDetails({ ...valido, nombre: "   " }).nombre);
  assert.equal(
    validateOrderDetails({ ...valido, nombre: " Ana  María Pérez " }).nombre,
    undefined,
  );
});

test("celular: 8 a 15 dígitos, admite espacios, +, guiones y paréntesis", () => {
  for (const ok of ["3415551234", "+54 9 341 555-1234", "(0341) 155-551234"])
    assert.equal(
      validateOrderDetails({ ...valido, celular: ok }).celular,
      undefined,
      ok,
    );
  for (const mal of ["", "1234567", "1234567890123456", "341-ABC-1234"])
    assert.ok(validateOrderDetails({ ...valido, celular: mal }).celular, mal);
});

test("dirección: obligatoria solo con envío", () => {
  const envio = { ...valido, entrega: "envio" as const };
  assert.ok(validateOrderDetails({ ...envio, direccion: "" }).direccion);
  assert.ok(validateOrderDetails({ ...envio, direccion: "Calle 1" }).direccion);
  assert.equal(
    validateOrderDetails({ ...envio, direccion: "Bv. Oroño 1234, Rosario" })
      .direccion,
    undefined,
  );
  assert.equal(
    validateOrderDetails({ ...valido, direccion: "" }).direccion,
    undefined,
  );
});

test("comentario: opcional y hasta 300 caracteres", () => {
  assert.equal(
    validateOrderDetails({ ...valido, comentario: "x".repeat(300) }).comentario,
    undefined,
  );
  assert.ok(
    validateOrderDetails({ ...valido, comentario: "x".repeat(301) }).comentario,
  );
});
