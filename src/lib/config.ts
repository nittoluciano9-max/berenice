/**
 * Solo el valor exacto "true" habilita la indexación: ausente, vacío, "false", "TRUE", etc.
 * dejan el sitio en noindex. Es a propósito: mientras haya contenido provisorio, el error
 * de configuración tiene que caer del lado seguro.
 */
export function isIndexingAllowed(value: string | undefined): boolean {
  return value === "true";
}

export const config = {
  siteName: "Berenice",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "",
  /** Invitación al grupo de WhatsApp. Vacía = no se muestra nada del grupo (ni QR ni botón). */
  whatsappGroupUrl: process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL ?? "",
  allowIndexing: isIndexingAllowed(process.env.NEXT_PUBLIC_ALLOW_INDEXING),
  /** Supabase (V2): URL del proyecto y clave pública (publishable/anon), protegida por RLS. */
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
} as const;
