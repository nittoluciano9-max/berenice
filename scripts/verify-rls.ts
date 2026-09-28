// Verifica RLS y Storage con la CLAVE PÚBLICA (lo mismo que puede hacer cualquier visitante).
// Uso: npm run db:verify   → exit 1 si algo falla. No escribe nada: todas las escrituras deben fallar.
import { createClient } from "@supabase/supabase-js";

import { categories } from "@/data/categories";
import { products } from "@/data/products";
import type { Database } from "@/types/database";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
if (!url || !key)
  throw new Error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY",
  );

const db = createClient<Database>(url, key, {
  auth: { persistSession: false },
});
const resultados: { ok: boolean; prueba: string; detalle: string }[] = [];
const check = (prueba: string, ok: boolean, detalle = "") =>
  resultados.push({ ok, prueba, detalle });

const activos = products.filter((p) => p.activo);
const inactivos = products.filter((p) => !p.activo);
const suma = (f: (p: (typeof products)[number]) => number) =>
  activos.reduce((s, p) => s + f(p), 0);

// ---------- lectura pública: solo lo visible ----------
{
  const { data, error } = await db.from("products").select("slug");
  const vistos = new Set((data ?? []).map((p) => p.slug));
  check(
    "productos visibles = activos del mock",
    !error && vistos.size === activos.length,
    `${vistos.size} de ${activos.length}${error ? " · " + error.message : ""}`,
  );
  const ocultos = inactivos
    .filter((p) => vistos.has(p.slug))
    .map((p) => p.slug);
  check(
    "productos inactivos NO se ven",
    ocultos.length === 0,
    ocultos.length
      ? `se ven: ${ocultos.join(", ")}`
      : inactivos.map((p) => p.slug).join(", "),
  );
}
{
  const { data } = await db.from("categories").select("slug, activo");
  const esperadas = categories.filter((c) => c.activo).length;
  check(
    "categorías visibles = activas",
    (data?.length ?? -1) === esperadas,
    `${data?.length} de ${esperadas}`,
  );
  check(
    "categorías inactivas NO se ven",
    !(data ?? []).some((c) => !c.activo),
    "ropa-de-dormir, mallas",
  );
}
const conteo = async (
  tabla:
    "product_colors" | "product_sizes" | "product_variants" | "product_images",
) => {
  const { count, error } = await db
    .from(tabla)
    .select("*", { count: "exact", head: true });
  return error ? -1 : (count ?? -1);
};
const imagenesEsperadas = suma(
  (p) =>
    p.imagenes.length +
    p.colores.reduce((s, c) => s + (c.imagenes?.length ?? 0), 0),
);
for (const [tabla, esperado] of [
  ["product_colors", suma((p) => p.colores.length)],
  ["product_sizes", suma((p) => p.talles.length)],
  ["product_variants", suma((p) => p.variantes?.length ?? 0)],
  ["product_images", imagenesEsperadas],
] as const) {
  const visto = await conteo(tabla);
  check(
    `${tabla}: solo de productos visibles`,
    visto === esperado,
    `${visto} de ${esperado}`,
  );
}
{
  const { data } = await db
    .from("products")
    .select(
      "slug, tipo_variante, precio, precio_oferta, product_variants(talle, stock, colors(slug))",
    )
    .eq("slug", "colaless-regulable")
    .single();
  const stock = Object.fromEntries(
    (data?.product_variants ?? []).map((v) => [
      `${v.colors?.slug}:${v.talle}`,
      v.stock,
    ]),
  );
  check(
    "Colaless: estampa, precio y 9 variantes",
    data?.tipo_variante === "estampa" &&
      data.precio === 12000 &&
      data.precio_oferta === 9900 &&
      Object.keys(stock).length === 9 &&
      stock["cerezas:M"] === 6 &&
      stock["onda-rosa:L"] === 4,
    JSON.stringify(stock),
  );
}
{
  const { data } = await db.from("colors").select("slug");
  check(
    "paleta pública",
    (data?.length ?? 0) === 10,
    `${data?.length} colores y estampas`,
  );
  const { data: conf } = await db
    .from("store_settings")
    .select("instagram_url, whatsapp_group_url, whatsapp_number");
  check(
    "configuración pública (1 fila)",
    conf?.length === 1 &&
      !!conf[0].instagram_url &&
      !!conf[0].whatsapp_group_url &&
      conf[0].whatsapp_number === null,
    conf?.length === 1
      ? "instagram + grupo cargados; número null (usa env)"
      : "sin fila",
  );
}

// ---------- tablas privadas ----------
for (const tabla of ["admins", "audit_log"] as const) {
  const { data, error } = await db.from(tabla).select("*");
  check(
    `${tabla}: la clave pública no ve nada`,
    !!error || data?.length === 0,
    error ? error.message : `${data?.length} filas`,
  );
}
{
  const { error } = await db.rpc("is_admin" as never);
  check(
    "funciones de seguridad no expuestas por la API",
    !!error,
    error?.message ?? "¡respondió!",
  );
}

// ---------- escrituras: todas deben fallar ----------
{
  const { error } = await db.from("products").insert({
    slug: "intruso",
    nombre: "x",
    category_id: "00000000-0000-0000-0000-000000000000",
    precio: 1,
  });
  check("no puede crear productos", !!error, error?.code ?? "¡lo creó!");
}
{
  const { data } = await db
    .from("products")
    .update({ precio: 1 })
    .eq("slug", "conjunto-aurora")
    .select("slug");
  const { data: despues } = await db
    .from("products")
    .select("precio")
    .eq("slug", "conjunto-aurora")
    .single();
  check(
    "no puede modificar precios",
    (data?.length ?? 0) === 0 && despues?.precio === 25000,
    `filas afectadas ${data?.length ?? 0} · precio ${despues?.precio}`,
  );
}
{
  const { data } = await db
    .from("categories")
    .delete()
    .eq("slug", "conjuntos")
    .select("slug");
  const { count } = await db
    .from("categories")
    .select("*", { count: "exact", head: true });
  check(
    "no puede borrar categorías",
    (data?.length ?? 0) === 0 &&
      count === categories.filter((c) => c.activo).length,
    `borradas ${data?.length ?? 0}`,
  );
}
{
  const { error } = await db
    .from("store_settings")
    .update({ whatsapp_number: "5490000000000" })
    .eq("id", 1)
    .select();
  const { data } = await db
    .from("store_settings")
    .select("whatsapp_number")
    .single();
  check(
    "no puede cambiar la configuración",
    data?.whatsapp_number === null,
    error?.code ?? "sin cambios",
  );
}
{
  const { error } = await db.from("admins").insert({
    user_id: "00000000-0000-0000-0000-000000000000",
    email: "x@x.com",
  });
  check(
    "no puede darse de alta como admin",
    !!error,
    error?.code ?? "¡lo insertó!",
  );
}

// ---------- Storage ----------
{
  const archivo = new Blob([new Uint8Array([0x52, 0x49, 0x46, 0x46])], {
    type: "image/webp",
  });
  const { error } = await db.storage
    .from("catalogo")
    .upload(`productos/verificacion-${Date.now()}.webp`, archivo);
  check("Storage: no puede subir fotos", !!error, error?.message ?? "¡subió!");
  const { data } = await db.storage.from("catalogo").list("productos");
  check(
    "Storage: no puede listar el bucket",
    (data?.length ?? 0) === 0,
    `${data?.length ?? 0} objetos listados`,
  );
  const publica = db.storage
    .from("catalogo")
    .getPublicUrl("productos/no-existe.webp").data.publicUrl;
  const r = await fetch(publica);
  const cuerpo = await r.text();
  check(
    "Storage: bucket público (lectura por URL)",
    /not.?found/i.test(cuerpo) && !/bucket not found/i.test(cuerpo),
    `HTTP ${r.status} para un archivo inexistente`,
  );
}

for (const r of resultados)
  console.log(
    `${r.ok ? "✔" : "✖"} ${r.prueba}${r.detalle ? `  (${r.detalle})` : ""}`,
  );
const fallas = resultados.filter((r) => !r.ok).length;
console.log(
  `\n${resultados.length - fallas}/${resultados.length} verificaciones OK`,
);
process.exit(fallas ? 1 : 0);
