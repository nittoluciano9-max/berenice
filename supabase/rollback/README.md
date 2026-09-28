# Rollback de migraciones

Las migraciones son **solo hacia adelante**: el CLI nunca ejecuta estos archivos. Son la reversión
documentada de cada migración, para aplicar **a mano y en orden inverso** (06 → 05 → 04 → 03 → 02 → 01) si
hiciera falta deshacer V2.1 en el proyecto de desarrollo.

```powershell
# 1. Backup previo (sin Docker, el CLI no puede hacer db dump): exportar desde el panel de Supabase
#    → Database → Backups, o copiar los datos necesarios.
# 2. Ejecutar cada archivo en el SQL Editor del panel, del más nuevo al más viejo.
# 3. Borrar las filas correspondientes de supabase_migrations.schema_migrations
#    (el último bloque de 20260928000001_esquema.down.sql lo hace para V2.1 completa).
```

- `seed.down.sql` vacía los datos del catálogo sin tocar el esquema (el seed es idempotente: se
  puede volver a aplicar con `npm run db:push`).
- Último recurso, **destructivo**: `npx supabase db reset --linked` borra toda la base de desarrollo.
  Solo con confirmación explícita.
