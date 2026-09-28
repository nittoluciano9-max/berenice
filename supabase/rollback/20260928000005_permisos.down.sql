-- Revierte 20260928000005_permisos.sql: los roles de la API vuelven a no tener acceso a las tablas
-- (la tienda en modo supabase no podría leer el catálogo; en modo mock no afecta).
revoke all on
  public.categories, public.colors, public.products, public.product_colors, public.product_sizes,
  public.product_variants, public.product_images, public.store_settings, public.admins,
  public.audit_log
from anon, authenticated;
