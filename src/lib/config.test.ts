import assert from "node:assert/strict";
import { test } from "node:test";

import { isIndexingAllowed } from "./config.ts";

test("solo el valor exacto 'true' habilita la indexación", () => {
  assert.equal(isIndexingAllowed("true"), true);
});

test("cualquier otro valor deja el sitio en noindex (lado seguro)", () => {
  for (const valor of [
    undefined,
    "",
    "false",
    "TRUE",
    "True",
    "1",
    "yes",
    " true",
  ]) {
    assert.equal(
      isIndexingAllowed(valor),
      false,
      `valor: ${JSON.stringify(valor)}`,
    );
  }
});
