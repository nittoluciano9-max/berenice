-- V2.1 · Row Level Security: última capa de seguridad (la app igual valida con requireAdmin()).
-- Reversión: supabase/rollback/20260928000002_rls.down.sql
--
-- Público (anon y authenticated): solo lee lo visible. Admin: whitelist en public.admins.
-- Un usuario logueado que no está en admins tiene exactamente los permisos de un visitante.

-- Funciones de seguridad en un schema NO expuesto por la API (no se llaman como /rpc/…).
create schema if not exists private;
grant usage on schema private to anon, authenticated;

create function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  );
$$;

-- Producto visible para la tienda: activo y fuera de la papelera.
create function private.producto_visible(p_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.products
    where id = p_id and activo and deleted_at is null
  );
$$;

revoke all on function private.is_admin() from public;
revoke all on function private.producto_visible(uuid) from public;
grant execute on function private.is_admin() to anon, authenticated;
grant execute on function private.producto_visible(uuid) to anon, authenticated;

-- ---------- activar RLS en todas las tablas ----------

alter table public.categories       enable row level security;
alter table public.colors           enable row level security;
alter table public.products         enable row level security;
alter table public.product_colors   enable row level security;
alter table public.product_sizes    enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images   enable row level security;
alter table public.store_settings   enable row level security;
alter table public.admins           enable row level security;
alter table public.audit_log        enable row level security;

-- ---------- lectura pública ----------

create policy "público lee categorías activas" on public.categories
  for select to anon, authenticated using (activo);

create policy "público lee la paleta" on public.colors
  for select to anon, authenticated using (true);

create policy "público lee productos visibles" on public.products
  for select to anon, authenticated using (activo and deleted_at is null);

create policy "público lee colores de productos visibles" on public.product_colors
  for select to anon, authenticated using ((select private.producto_visible(product_id)));

create policy "público lee talles de productos visibles" on public.product_sizes
  for select to anon, authenticated using ((select private.producto_visible(product_id)));

create policy "público lee variantes de productos visibles" on public.product_variants
  for select to anon, authenticated using ((select private.producto_visible(product_id)));

create policy "público lee imágenes de productos visibles" on public.product_images
  for select to anon, authenticated using ((select private.producto_visible(product_id)));

-- WhatsApp e Instagram se muestran en la web: son datos públicos.
create policy "público lee la configuración" on public.store_settings
  for select to anon, authenticated using (true);

-- Cada usuario ve solo su propia fila: la app puede saber si es admin sin exponer la lista.
create policy "cada usuario ve si es admin" on public.admins
  for select to authenticated using (user_id = (select auth.uid()));

-- ---------- escritura: solo admins ----------

create policy "admin gestiona categorías" on public.categories
  for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));

create policy "admin gestiona la paleta" on public.colors
  for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));

create policy "admin gestiona productos" on public.products
  for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));

create policy "admin gestiona colores de productos" on public.product_colors
  for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));

create policy "admin gestiona talles" on public.product_sizes
  for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));

create policy "admin gestiona variantes y stock" on public.product_variants
  for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));

create policy "admin gestiona imágenes" on public.product_images
  for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));

-- La fila única no se crea ni se borra desde la API: solo se actualiza.
create policy "admin actualiza la configuración" on public.store_settings
  for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));

-- audit_log: solo lectura para admins; lo escriben los triggers (security definer).
create policy "admin lee la auditoría" on public.audit_log
  for select to authenticated using ((select private.is_admin()));

-- public.admins: sin políticas de escritura a propósito (solo panel de Supabase o SQL).
