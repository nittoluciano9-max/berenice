-- V2.1 · Esquema inicial del catálogo de Berenice.
-- Reversión: supabase/rollback/20260928000001_esquema.down.sql
--
-- Convenciones: dominio en español (como el código), precios en pesos enteros, slugs en kebab-case.
-- El tipo `Product` de la UI se arma desde estas tablas en lib/catalog (V2.2); acá no hay lógica de UI.

-- ---------- utilidades ----------

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- categorías (árbol por parent_id) ----------

create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  nombre      text not null check (length(trim(nombre)) > 0),
  descripcion text,
  -- Ruta en Storage (catalogo/categorias/…) o, durante la migración, ruta local /images/…
  imagen_path text,
  parent_id   uuid references public.categories (id) on delete restrict,
  orden       int not null default 0,
  activo      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  check (parent_id is distinct from id)
);
create index categories_parent_id_idx on public.categories (parent_id);

-- ---------- paleta de colores / estampas (compartida entre productos) ----------

create table public.colors (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  nombre     text not null check (length(trim(nombre)) > 0),
  hex        text not null check (hex ~ '^#[0-9a-fA-F]{6}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- productos ----------

create table public.products (
  id            uuid primary key default gen_random_uuid(),
  -- "p-001"…: conserva los ids del mock para no romper carritos guardados ni referencias.
  legacy_id     text unique,
  slug          text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  nombre        text not null check (length(trim(nombre)) > 0),
  descripcion   text not null default '',
  -- La categoría más específica (subcategoría si tiene); la raíz se deriva del árbol.
  category_id   uuid not null references public.categories (id) on delete restrict,
  precio        int not null check (precio > 0),
  precio_oferta int check (precio_oferta > 0 and precio_oferta < precio),
  -- "estampa": misma lógica que color, pero la UI y el mensaje dicen "Estampa".
  tipo_variante text not null default 'color' check (tipo_variante in ('color', 'estampa')),
  -- Stock general: solo aplica a productos sin variantes (compatibilidad con el mock).
  stock         int not null default 0 check (stock >= 0),
  destacado     boolean not null default false,
  nuevo         boolean not null default false,
  activo        boolean not null default true,
  tags          text[] not null default '{}',
  -- Papelera: se oculta sin borrar (se puede restaurar).
  deleted_at    timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index products_category_id_idx on public.products (category_id);
create index products_visibles_idx on public.products (activo) where deleted_at is null;

create table public.product_colors (
  product_id uuid not null references public.products (id) on delete cascade,
  color_id   uuid not null references public.colors (id) on delete restrict,
  orden      int not null default 0,
  primary key (product_id, color_id)
);
create index product_colors_color_id_idx on public.product_colors (color_id);

create table public.product_sizes (
  product_id uuid not null references public.products (id) on delete cascade,
  talle      text not null check (length(trim(talle)) > 0),
  orden      int not null default 0,
  primary key (product_id, talle)
);

create table public.product_variants (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null,
  color_id   uuid not null,
  talle      text not null,
  stock      int not null default 0 check (stock >= 0),
  sku        text unique,
  unique (product_id, color_id, talle),
  -- Una variante solo puede usar un color y un talle que el producto tenga.
  foreign key (product_id, color_id)
    references public.product_colors (product_id, color_id) on delete cascade,
  foreign key (product_id, talle)
    references public.product_sizes (product_id, talle) on delete cascade
);

create table public.product_images (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid not null references public.products (id) on delete cascade,
  -- null = foto general del producto; con valor = foto propia de ese color/estampa.
  color_id     uuid,
  -- Storage: productos/{product_id}/{uuid}.webp (V2.7).
  storage_path text,
  -- Ruta local /images/… mientras las fotos no se migren a Storage.
  url          text,
  alt          text not null default '',
  orden        int not null default 0,
  width        int check (width > 0),
  height       int check (height > 0),
  created_at   timestamptz not null default now(),
  check (storage_path is not null or url is not null),
  foreign key (product_id, color_id)
    references public.product_colors (product_id, color_id) on delete cascade
);
create index product_images_product_idx on public.product_images (product_id, orden);

-- ---------- configuración de tienda (fila única) ----------

create table public.store_settings (
  id                 smallint primary key default 1 check (id = 1),
  -- null = la app usa la variable de entorno como respaldo.
  whatsapp_number    text check (whatsapp_number ~ '^[0-9]{10,15}$'),
  instagram_url      text check (instagram_url ~ '^https://'),
  whatsapp_group_url text check (whatsapp_group_url ~ '^https://chat\.whatsapp\.com/'),
  updated_at         timestamptz not null default now(),
  updated_by         uuid references auth.users (id) on delete set null
);
insert into public.store_settings (id) values (1);

-- ---------- administradores (whitelist) ----------

-- Estar logueado no alcanza: solo quien figura acá es admin (ver private.is_admin()).
-- Las filas se agregan desde el panel de Supabase o por SQL, nunca desde la API.
create table public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text not null,
  created_at timestamptz not null default now()
);

-- ---------- auditoría (la llenan triggers; ver migración 04) ----------

create table public.audit_log (
  id          bigint generated always as identity primary key,
  tabla       text not null,
  registro_id text not null,
  accion      text not null check (accion in ('INSERT', 'UPDATE', 'DELETE')),
  antes       jsonb,
  despues     jsonb,
  actor       uuid,
  created_at  timestamptz not null default now()
);
create index audit_log_registro_idx on public.audit_log (tabla, registro_id, created_at desc);

-- ---------- updated_at automático ----------

create trigger categories_updated_at before update on public.categories
  for each row execute function public.set_updated_at();
create trigger colors_updated_at before update on public.colors
  for each row execute function public.set_updated_at();
create trigger products_updated_at before update on public.products
  for each row execute function public.set_updated_at();
create trigger store_settings_updated_at before update on public.store_settings
  for each row execute function public.set_updated_at();
