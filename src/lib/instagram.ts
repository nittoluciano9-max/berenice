import { instagramPosts } from "@/data/instagram";
import type { InstagramPost } from "@/types/instagram";

// Async como catalog.ts: si algún día se conecta la API, la UI no cambia.
export async function getInstagramPosts(limit = 6): Promise<InstagramPost[]> {
  return instagramPosts.slice(0, limit);
}

/** "https://instagram.com/berenice/" → "@berenice"; null si la URL no sirve. */
export function getInstagramHandle(url: string): string | null {
  try {
    const usuario = new URL(url).pathname.split("/").filter(Boolean)[0];
    return usuario ? `@${usuario}` : null;
  } catch {
    return null;
  }
}
