-- V2.1 · Claves foráneas directas para que la API (PostgREST) pueda anidar relaciones.
-- Reversión: supabase/rollback/20260928000006_relaciones.down.sql
--
-- Las FK compuestas de la migración 01 garantizan la integridad (una variante solo usa colores y
-- talles de su producto), pero PostgREST necesita la relación DIRECTA para responder en una sola
-- consulta, p. ej. products?select=*,product_variants(talle,stock,colors(slug)). Son redundantes
-- para la integridad y necesarias para el catálogo de V2.2.

alter table public.product_variants
  add constraint product_variants_product_id_fkey
    foreign key (product_id) references public.products (id) on delete cascade,
  add constraint product_variants_color_id_fkey
    foreign key (color_id) references public.colors (id) on delete restrict;

alter table public.product_images
  add constraint product_images_color_id_fkey
    foreign key (color_id) references public.colors (id) on delete restrict;

create index product_variants_color_id_idx on public.product_variants (color_id);
create index product_images_color_id_idx on public.product_images (color_id);
