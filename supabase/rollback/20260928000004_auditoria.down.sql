-- Revierte 20260928000004_auditoria.sql
drop trigger if exists auditoria on public.store_settings;
drop trigger if exists auditoria on public.product_images;
drop trigger if exists auditoria on public.product_variants;
drop trigger if exists auditoria on public.product_sizes;
drop trigger if exists auditoria on public.product_colors;
drop trigger if exists auditoria on public.products;
drop trigger if exists auditoria on public.colors;
drop trigger if exists auditoria on public.categories;
drop function if exists private.registrar_auditoria();
