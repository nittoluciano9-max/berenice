import { config } from "@/lib/config";

/** Credenciales públicas de Supabase; falla con un mensaje claro si faltan en el entorno. */
export function getSupabaseEnv(): { url: string; anonKey: string } {
  const { supabaseUrl: url, supabaseAnonKey: anonKey } = config;
  if (!url || !anonKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY (ver .env.example).",
    );
  }
  return { url, anonKey };
}
