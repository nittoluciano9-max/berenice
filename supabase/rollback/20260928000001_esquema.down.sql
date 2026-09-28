-- Revierte 20260928000001_esquema.sql (aplicar después de 06, 05, 04, 03 y 02). Borra TODOS los datos.
drop table if exists public.audit_log;
drop table if exists public.admins;
drop table if exists public.store_settings;
drop table if exists public.product_images;
drop table if exists public.product_variants;
drop table if exists public.product_sizes;
drop table if exists public.product_colors;
drop table if exists public.products;
drop table if exists public.colors;
drop table if exists public.categories;
drop function if exists public.set_updated_at();
drop schema if exists private;

-- Marca V2.1 como no aplicada, para poder volver a empujarla con el CLI.
delete from supabase_migrations.schema_migrations
where version in ('20260928000001', '20260928000002', '20260928000003', '20260928000004', '20260928000005', '20260928000006');
