# AGENTS.md

Las reglas técnicas y el alcance del proyecto están en [`CLAUDE.md`](./CLAUDE.md). Es la única fuente de verdad: cualquier agente de IA (Claude, Copilot, Cursor, Codex, etc.) debe leerlo antes de hacer cambios.

Resumen mínimo:

- Versión actual: **V1** (catálogo → carrito → WhatsApp). Nada de backend, BD, login, pagos ni panel admin.
- Stack: Next.js 16 + TypeScript + Tailwind v4 + shadcn/ui + lucide-react + zustand. No agregar dependencias sin aprobación.
- Datos simulados en `src/data/`, siempre accedidos a través de `src/lib/catalog.ts`.
