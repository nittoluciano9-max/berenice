# AGENTS.md

Las reglas técnicas y el alcance del proyecto están en [`CLAUDE.md`](./CLAUDE.md). Es la única fuente de verdad: cualquier agente de IA (Claude, Copilot, Cursor, Codex, etc.) debe leerlo antes de hacer cambios.

Resumen mínimo:

- Versión actual: **V2 Administrable, en curso por etapas** (`feature/v2-*`). La V1 pública (catálogo → carrito → WhatsApp) no debe romperse. Sin login de clientes, pagos ni pedidos.
- Stack: Next.js 16 + TypeScript + Tailwind v4 + shadcn/ui + lucide-react + zustand; para V2 están aprobados Supabase (`@supabase/supabase-js`, `@supabase/ssr`) y `zod`. No agregar otras dependencias sin aprobación.
- Productos y categorías siempre a través de `src/lib/catalog.ts` (hoy datos simulados en `src/data/`).
