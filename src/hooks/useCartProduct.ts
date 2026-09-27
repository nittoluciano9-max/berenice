"use client";

import { useEffect, useState } from "react";

import type { Product } from "@/types/product";

type Lookup =
  | { status: "loading" }
  | { status: "ready"; product: Product }
  | { status: "missing" };

const cache = new Map<string, Promise<Product | null>>();

// El catálogo se importa recién cuando hace falta (carrito abierto): así los datos mock no viajan
// en el bundle de todas las páginas. En V2 esto pasa a ser un fetch sin cambiar la interfaz.
function loadProduct(slug: string): Promise<Product | null> {
  let pending = cache.get(slug);
  if (!pending) {
    pending = import("@/lib/catalog").then(({ getProductBySlug }) =>
      getProductBySlug(slug),
    );
    cache.set(slug, pending);
  }
  return pending;
}

/** Datos vigentes del producto de una línea (opciones de variante y stock). */
export function useCartProduct(slug: string): Lookup {
  const [lookup, setLookup] = useState<{ slug: string; value: Lookup }>({
    slug,
    value: { status: "loading" },
  });

  useEffect(() => {
    let cancelled = false;
    void loadProduct(slug).then((product) => {
      if (cancelled) return;
      setLookup({
        slug,
        value: product ? { status: "ready", product } : { status: "missing" },
      });
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return lookup.slug === slug ? lookup.value : { status: "loading" };
}
