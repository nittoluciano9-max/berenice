-- V2.1 · Permisos de tabla (GRANT) explícitos y mínimos.
-- Reversión: supabase/rollback/20260928000005_permisos.down.sql
--
-- RLS decide QUÉ FILAS ve cada rol, pero antes el rol necesita permiso sobre la TABLA. Los proyectos
-- nuevos de Supabase no lo dan automáticamente para tablas creadas por SQL, así que se declara acá:
-- dos capas independientes (sin GRANT no hay acceso aunque una política se equivoque, y viceversa).

-- Punto de partida conocido: nada para los roles de la API.
revoke all on
  public.categories, public.colors, public.products, public.product_colors, public.product_sizes,
  public.product_variants, public.product_images, public.store_settings, public.admins,
  public.audit_log
from anon, authenticated;

-- Catálogo: lectura para todos (RLS filtra lo inactivo).
grant select on
  public.categories, public.colors, public.products, public.product_colors, public.product_sizes,
  public.product_variants, public.product_images, public.store_settings
to anon, authenticated;

-- Escritura solo para usuarios logueados; RLS la limita a los admins de la whitelist.
-- anon no recibe ningún permiso de escritura: ni siquiera llega a evaluar las políticas.
grant insert, update, delete on
  public.categories, public.colors, public.products, public.product_colors, public.product_sizes,
  public.product_variants, public.product_images
to authenticated;
grant update on public.store_settings to authenticated;

-- Tablas privadas: solo lectura para logueados (RLS: cada uno su fila / solo admins).
grant select on public.admins, public.audit_log to authenticated;
