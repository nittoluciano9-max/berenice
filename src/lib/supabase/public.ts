import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getSupabaseEnv } from "@/lib/supabase/env";
import type { Database } from "@/types/database";

/**
 * Cliente de solo lectura para el catálogo público (V2.2): sin cookies ni sesión, así las páginas
 * pueden seguir siendo estáticas y cacheables. RLS le deja ver únicamente lo visible.
 */
export function createPublicClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createClient<Database>(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
