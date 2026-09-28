// Hook de resolución para `node --test`: traduce el alias `@/` (tsconfig) a `src/` y completa
// la extensión .ts / .tsx, como hace el bundler de Next. Sin dependencias.
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const SRC = new URL("../src/", import.meta.url);
const EXTENSIONES = ["", ".ts", ".tsx", "/index.ts"];

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    for (const ext of EXTENSIONES) {
      const url = new URL(specifier.slice(2) + ext, SRC);
      if (ext !== "" || /\.[cm]?[jt]sx?$/.test(url.pathname)) {
        if (existsSync(fileURLToPath(url)))
          return nextResolve(url.href, context);
      }
    }
  }
  return nextResolve(specifier, context);
}
