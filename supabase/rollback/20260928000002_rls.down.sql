-- Revierte 20260928000002_rls.sql
-- Atención: sin RLS, la clave pública podría leer y ESCRIBIR todas las tablas. Revertir esta
-- migración solo junto con la 01 (que borra las tablas), nunca sola.
do $$
declare
  t text;
  p record;
begin
  foreach t in array array[
    'categories', 'colors', 'products', 'product_colors', 'product_sizes',
    'product_variants', 'product_images', 'store_settings', 'admins', 'audit_log'
  ] loop
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = t loop
      execute format('drop policy %I on public.%I', p.policyname, t);
    end loop;
    execute format('alter table public.%I disable row level security', t);
  end loop;
end $$;

drop function if exists private.producto_visible(uuid);
drop function if exists private.is_admin();
