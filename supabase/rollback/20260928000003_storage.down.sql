-- Revierte 20260928000003_storage.sql
-- Ojo: borrar el bucket exige que esté vacío (en V2.1 lo está; desde V2.7 tendrá fotos).
drop policy if exists "catalogo: admin borra" on storage.objects;
drop policy if exists "catalogo: admin reemplaza" on storage.objects;
drop policy if exists "catalogo: admin sube" on storage.objects;
drop policy if exists "catalogo: admin lista" on storage.objects;
delete from storage.buckets where id = 'catalogo';
