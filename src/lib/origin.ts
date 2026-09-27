const STORAGE_KEY = "berenice-ref";
// Solo valores cortos y simples: el ref viaja tal cual dentro del mensaje de WhatsApp.
const VALID_REF = /^[\w-]{1,40}$/;

/** Guarda `?ref=` (QR, Instagram…) para toda la sesión de la pestaña. */
export function captureVisitOrigin(search: string): void {
  const ref = new URLSearchParams(search).get("ref")?.trim().toLowerCase();
  if (!ref || !VALID_REF.test(ref)) return;
  try {
    sessionStorage.setItem(STORAGE_KEY, ref);
  } catch {
    // Sin storage (modo privado estricto) el pedido sale sin origen.
  }
}

export function getVisitOrigin(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}
