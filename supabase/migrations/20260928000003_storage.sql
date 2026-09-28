-- V2.1 · Storage de imágenes del catálogo.
-- Reversión: supabase/rollback/20260928000003_storage.down.sql
--
-- Bucket público de lectura (las fotos del catálogo se ven sin login, por URL directa).
-- Subir, reemplazar y borrar: solo admins. Listar el bucket: solo admins.
-- Rutas: productos/{product_id}/{uuid}.webp · categorias/{category_id}/{uuid}.webp

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'catalogo',
  'catalogo',
  true,
  10485760, -- 10 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "catalogo: admin lista" on storage.objects
  for select to authenticated
  using (bucket_id = 'catalogo' and (select private.is_admin()));

create policy "catalogo: admin sube" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'catalogo'
    and (select private.is_admin())
    and (storage.foldername(name))[1] in ('productos', 'categorias')
  );

create policy "catalogo: admin reemplaza" on storage.objects
  for update to authenticated
  using (bucket_id = 'catalogo' and (select private.is_admin()))
  with check (
    bucket_id = 'catalogo'
    and (select private.is_admin())
    and (storage.foldername(name))[1] in ('productos', 'categorias')
  );

create policy "catalogo: admin borra" on storage.objects
  for delete to authenticated
  using (bucket_id = 'catalogo' and (select private.is_admin()));
