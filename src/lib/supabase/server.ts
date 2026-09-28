import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabaseEnv } from "@/lib/supabase/env";
import type { Database } from "@/types/database";

/**
 * Cliente con la sesión del admin (cookies), para /admin y sus Server Actions (V2.3+).
 * Cada Server Action igual debe llamar a requireAdmin(): RLS es la última capa, no la única.
 */
export async function createSupabaseServerClient() {
  const { url, anonKey } = getSupabaseEnv();
  const cookieStore = await cookies();
  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (lista) => {
        try {
          for (const { name, value, options } of lista) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // En Server Components no se pueden escribir cookies: el refresco lo hace proxy.ts (V2.3).
        }
      },
    },
  });
}
