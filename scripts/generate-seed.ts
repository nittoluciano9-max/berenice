// Genera supabase/seed.sql desde los mocks (src/data/*.ts): una sola fuente de verdad.
// Uso: npm run db:seed:generate   (después: npm run db:push para aplicarlo al proyecto vinculado)
//
// Idempotente: upsert por slug en categorías/colores/productos; los hijos de cada producto
// (colores, talles, variantes, imágenes) se reemplazan completos. Relaciones por slug, no por UUID.
import { writeFileSync } from "node:fs";

import { categories } from "@/data/categories";
import { products } from "@/data/products";
import type { ProductColor } from "@/types/product";

const q = (v: string | null | undefined): string =>
  v === null || v === undefined ? "null" : `'${v.replace(/'/g, "''")}'`;
const n = (v: number | null | undefined): string =>
  v === null || v === undefined ? "null" : String(Math.trunc(v));
const b = (v: boolean): string => (v ? "true" : "false");
const arr = (v: string[] | undefined): string =>
  v?.length ? `array[${v.map(q).join(", ")}]::text[]` : "'{}'::text[]";
const valores = (filas: string[][]): string =>
  filas.map((f) => `  (${f.join(", ")})`).join(",\n");

const slugDeCategoria = new Map(categories.map((c) => [c.id, c.slug]));
const profundidad = (id: string | null): number => {
  const c = categories.find((x) => x.id === id);
  return c?.parentId ? 1 + profundidad(c.parentId) : 0;
};

const sql: string[] = [
  "-- AUTO-GENERADO por scripts/generate-seed.ts desde src/data/*.ts.",
  "-- No editar a mano: cambiar los mocks y correr `npm run db:seed:generate`.",
  "-- Datos de desarrollo: incluye productos y categorías inactivos para mantener paridad con el mock.",
  "",
  "begin;",
  "set local app.omitir_auditoria = 'on';",
  "",
];

// ---------- categorías: por niveles, así el padre ya existe al insertar la hija ----------
const niveles = [...new Set(categories.map((c) => profundidad(c.id)))].sort();
for (const nivel of niveles) {
  const filas = categories
    .filter((c) => profundidad(c.id) === nivel)
    .sort((a, b2) => a.slug.localeCompare(b2.slug))
    .map((c) => [
      q(c.slug),
      q(c.nombre),
      q(c.descripcion),
      q(c.imagen),
      c.parentId
        ? `(select id from public.categories where slug = ${q(slugDeCategoria.get(c.parentId))})`
        : "null",
      n(c.orden),
      b(c.activo),
    ]);
  sql.push(
    `-- categorías (nivel ${nivel})`,
    "insert into public.categories (slug, nombre, descripcion, imagen_path, parent_id, orden, activo) values",
    valores(filas),
    "on conflict (slug) do update set nombre = excluded.nombre, descripcion = excluded.descripcion,",
    "  imagen_path = excluded.imagen_path, parent_id = excluded.parent_id, orden = excluded.orden,",
    "  activo = excluded.activo;",
    "",
  );
}

// ---------- paleta: colores y estampas deduplicados por slug ----------
const paleta = new Map<string, ProductColor>();
for (const p of products) for (const c of p.colores) paleta.set(c.slug, c);
const colores = [...paleta.values()].sort((a, b2) =>
  a.slug.localeCompare(b2.slug),
);
sql.push(
  "-- paleta",
  "insert into public.colors (slug, nombre, hex) values",
  valores(colores.map((c) => [q(c.slug), q(c.nombre), q(c.hex.toLowerCase())])),
  "on conflict (slug) do update set nombre = excluded.nombre, hex = excluded.hex;",
  "",
);

// ---------- productos ----------
const ordenados = [...products].sort((a, b2) => a.id.localeCompare(b2.id));
sql.push(
  "-- productos",
  "insert into public.products (legacy_id, slug, nombre, descripcion, category_id, precio, precio_oferta,",
  "  tipo_variante, stock, destacado, nuevo, activo, tags, created_at) values",
  valores(
    ordenados.map((p) => [
      q(p.id),
      q(p.slug),
      q(p.nombre),
      q(p.descripcion),
      `(select id from public.categories where slug = ${q(p.subcategoria ?? p.categoria)})`,
      n(p.precio),
      n(p.precioOferta),
      q(p.tipoVariante ?? "color"),
      n(p.stock),
      b(p.destacado),
      b(p.nuevo),
      b(p.activo),
      arr(p.tags),
      p.creadoEn ? `${q(p.creadoEn)}::timestamptz` : "now()",
    ]),
  ),
  "on conflict (slug) do update set legacy_id = excluded.legacy_id, nombre = excluded.nombre,",
  "  descripcion = excluded.descripcion, category_id = excluded.category_id, precio = excluded.precio,",
  "  precio_oferta = excluded.precio_oferta, tipo_variante = excluded.tipo_variante,",
  "  stock = excluded.stock, destacado = excluded.destacado, nuevo = excluded.nuevo,",
  "  activo = excluded.activo, tags = excluded.tags, created_at = excluded.created_at;",
  "",
);

// ---------- hijos de cada producto: se reemplazan completos ----------
const slugs = ordenados.map((p) => q(p.slug)).join(", ");
const deLosProductos = `(select id from public.products where slug in (${slugs}))`;
sql.push(
  "-- hijos: borrar y volver a cargar (las variantes y fotos por color caen en cascada)",
  `delete from public.product_images where product_id in ${deLosProductos};`,
  `delete from public.product_colors where product_id in ${deLosProductos};`,
  `delete from public.product_sizes where product_id in ${deLosProductos};`,
  "",
);

const hijos = (
  titulo: string,
  columnas: string,
  alias: string,
  filas: string[][],
  select: string,
) => {
  if (!filas.length) return;
  sql.push(
    `-- ${titulo}`,
    `insert into ${columnas}`,
    `${select}`,
    `from (values`,
    valores(filas),
    `) as ${alias}`,
  );
};

hijos(
  "colores de cada producto",
  "public.product_colors (product_id, color_id, orden)",
  "v (producto, color, orden)",
  ordenados.flatMap((p) =>
    p.colores.map((c, i) => [q(p.slug), q(c.slug), n(i)]),
  ),
  "select p.id, c.id, v.orden",
);
sql.push(
  "join public.products p on p.slug = v.producto",
  "join public.colors c on c.slug = v.color;",
  "",
);

hijos(
  "talles de cada producto",
  "public.product_sizes (product_id, talle, orden)",
  "v (producto, talle, orden)",
  ordenados.flatMap((p) => p.talles.map((t, i) => [q(p.slug), q(t), n(i)])),
  "select p.id, v.talle, v.orden",
);
sql.push("join public.products p on p.slug = v.producto;", "");

hijos(
  "variantes (stock por color/estampa + talle)",
  "public.product_variants (product_id, color_id, talle, stock, sku)",
  "v (producto, color, talle, stock, sku)",
  ordenados.flatMap((p) =>
    (p.variantes ?? []).map((v) => [
      q(p.slug),
      q(v.color),
      q(v.talle),
      n(v.stock),
      q(v.sku),
    ]),
  ),
  "select p.id, c.id, v.talle, v.stock, v.sku",
);
sql.push(
  "join public.products p on p.slug = v.producto",
  "join public.colors c on c.slug = v.color;",
  "",
);

// Fotos generales (color null) y propias de cada color; mientras no se migren, por ruta local.
const imagenes = ordenados.flatMap((p) => [
  ...p.imagenes.map((img, i) => [
    q(p.slug),
    "null",
    q(img.src),
    q(img.alt),
    n(i),
  ]),
  ...p.colores.flatMap((c) =>
    (c.imagenes ?? []).map((img, i) => [
      q(p.slug),
      q(c.slug),
      q(img.src),
      q(img.alt),
      n(i),
    ]),
  ),
]);
hijos(
  "imágenes (url local /images/… hasta migrarlas a Storage en V2.7)",
  "public.product_images (product_id, color_id, url, alt, orden)",
  "v (producto, color, url, alt, orden)",
  imagenes,
  "select p.id, c.id, v.url, v.alt, v.orden",
);
sql.push(
  "join public.products p on p.slug = v.producto",
  "left join public.colors c on c.slug = v.color;",
  "",
);

// ---------- configuración: solo datos públicos; null = la app usa la variable de entorno ----------
const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_URL || null;
const grupo = process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || null;
sql.push(
  "-- configuración (el número de pedidos queda null: se usa NEXT_PUBLIC_WHATSAPP_NUMBER)",
  `update public.store_settings set instagram_url = ${q(instagram)}, whatsapp_group_url = ${q(grupo)} where id = 1;`,
  "",
  "commit;",
  "",
);

const resumen = {
  categorias: categories.length,
  colores: colores.length,
  productos: products.length,
  coloresPorProducto: ordenados.reduce((s, p) => s + p.colores.length, 0),
  talles: ordenados.reduce((s, p) => s + p.talles.length, 0),
  variantes: ordenados.reduce((s, p) => s + (p.variantes?.length ?? 0), 0),
  imagenes: imagenes.length,
};
writeFileSync(new URL("../supabase/seed.sql", import.meta.url), sql.join("\n"));
console.log("supabase/seed.sql generado:", JSON.stringify(resumen));
