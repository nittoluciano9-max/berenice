-- Vacía los datos del catálogo cargados por el seed, sin tocar el esquema ni admins.
begin;
set local app.omitir_auditoria = 'on';
delete from public.product_images;
delete from public.product_variants;
delete from public.product_sizes;
delete from public.product_colors;
delete from public.products;
delete from public.colors;
delete from public.categories where parent_id is not null;
delete from public.categories;
update public.store_settings set whatsapp_number = null, instagram_url = null, whatsapp_group_url = null;
commit;
