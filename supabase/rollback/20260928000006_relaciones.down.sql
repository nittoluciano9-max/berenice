-- Revierte 20260928000006_relaciones.sql
drop index if exists public.product_images_color_id_idx;
drop index if exists public.product_variants_color_id_idx;
alter table public.product_images drop constraint if exists product_images_color_id_fkey;
alter table public.product_variants
  drop constraint if exists product_variants_color_id_fkey,
  drop constraint if exists product_variants_product_id_fkey;
