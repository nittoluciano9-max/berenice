-- AUTO-GENERADO por scripts/generate-seed.ts desde src/data/*.ts.
-- No editar a mano: cambiar los mocks y correr `npm run db:seed:generate`.
-- Datos de desarrollo: incluye productos y categorías inactivos para mantener paridad con el mock.

begin;
set local app.omitir_auditoria = 'on';

-- categorías (nivel 0)
insert into public.categories (slug, nombre, descripcion, imagen_path, parent_id, orden, activo) values
  ('lenceria', 'Lencería', 'Conjuntos, corpiños, bombachas y bodys para todos los días.', '/images/categorias/lenceria.png', null, 1, true),
  ('mallas', 'Mallas', 'Próximamente.', null, null, 3, false),
  ('ropa-de-dormir', 'Ropa de dormir', 'Pijamas y camisones suaves para descansar.', '/images/categorias/ropa-de-dormir.png', null, 2, false)
on conflict (slug) do update set nombre = excluded.nombre, descripcion = excluded.descripcion,
  imagen_path = excluded.imagen_path, parent_id = excluded.parent_id, orden = excluded.orden,
  activo = excluded.activo;

-- categorías (nivel 1)
insert into public.categories (slug, nombre, descripcion, imagen_path, parent_id, orden, activo) values
  ('bodys', 'Bodys', 'Bodys de encaje y microfibra.', '/images/categorias/bodys.png', (select id from public.categories where slug = 'lenceria'), 4, true),
  ('bombachas', 'Bombachas', 'Culotte, colaless y vedetinas.', '/images/categorias/bombachas.png', (select id from public.categories where slug = 'lenceria'), 3, true),
  ('camisones', 'Camisones', null, null, (select id from public.categories where slug = 'ropa-de-dormir'), 2, true),
  ('conjuntos', 'Conjuntos', 'Corpiño y bombacha pensados para usarse juntos.', '/images/categorias/conjuntos.png', (select id from public.categories where slug = 'lenceria'), 1, true),
  ('corpinos', 'Corpiños', 'Con y sin aro, triangulitos y bralettes.', '/images/categorias/corpinos.png', (select id from public.categories where slug = 'lenceria'), 2, true),
  ('pijamas', 'Pijamas', null, null, (select id from public.categories where slug = 'ropa-de-dormir'), 1, true)
on conflict (slug) do update set nombre = excluded.nombre, descripcion = excluded.descripcion,
  imagen_path = excluded.imagen_path, parent_id = excluded.parent_id, orden = excluded.orden,
  activo = excluded.activo;

-- paleta
insert into public.colors (slug, nombre, hex) values
  ('blanco', 'Blanco', '#f7f4ee'),
  ('bordo', 'Bordó', '#6e2a35'),
  ('cerezas', 'Cerezas', '#1a1a1a'),
  ('champagne', 'Champagne', '#e8d6bc'),
  ('flores', 'Flores', '#f7f4ee'),
  ('negro', 'Negro', '#1a1a1a'),
  ('nude', 'Nude', '#d9b8a3'),
  ('onda-rosa', 'Onda rosa', '#e7a1ad'),
  ('rosa-viejo', 'Rosa viejo', '#c99a9a'),
  ('verde-salvia', 'Verde salvia', '#a3ad96')
on conflict (slug) do update set nombre = excluded.nombre, hex = excluded.hex;

-- productos
insert into public.products (legacy_id, slug, nombre, descripcion, category_id, precio, precio_oferta,
  tipo_variante, stock, destacado, nuevo, activo, tags, created_at) values
  ('p-001', 'conjunto-aurora', 'Conjunto Aurora', 'Conjunto de encaje elastizado con corpiño triangular sin aro y bombacha culotte. Breteles regulables y forro suave de algodón.', (select id from public.categories where slug = 'conjuntos'), 25000, null, 'color', 14, true, false, true, array['encaje', 'sin aro']::text[], '2026-06-10'::timestamptz),
  ('p-002', 'conjunto-lucia', 'Conjunto Lucía', 'Corpiño con aro y taza soft combinado con bombacha colaless de tul bordado. Cierre trasero de tres posiciones.', (select id from public.categories where slug = 'conjuntos'), 32000, 27200, 'color', 9, true, false, true, array['con aro', 'bordado']::text[], '2026-04-22'::timestamptz),
  ('p-003', 'conjunto-alba', 'Conjunto Alba', 'Conjunto de microfibra sin costuras, ideal para usar debajo de prendas claras. Corpiño deportivo liviano y bombacha vedetina.', (select id from public.categories where slug = 'conjuntos'), 21500, null, 'color', 20, false, true, true, array['sin costuras', 'microfibra']::text[], '2026-09-12'::timestamptz),
  ('p-004', 'bralette-julieta', 'Bralette Julieta', 'Bralette de encaje floral con espalda cruzada y banda elástica ancha. Sin aro y sin relleno.', (select id from public.categories where slug = 'corpinos'), 16800, null, 'color', 11, true, true, true, array['encaje', 'sin aro']::text[], '2026-09-02'::timestamptz),
  ('p-005', 'corpino-emma', 'Corpiño Emma', 'Corpiño con aro y taza moldeada que da soporte y forma natural. Breteles acolchados y regulables.', (select id from public.categories where slug = 'corpinos'), 19900, 15900, 'color', 16, false, false, true, array['con aro', 'soporte']::text[], '2026-03-15'::timestamptz),
  ('p-006', 'triangulito-mia', 'Triangulito Mía', 'Corpiño triangular de algodón y lycra, liviano y cómodo para todo el día.', (select id from public.categories where slug = 'corpinos'), 12500, null, 'color', 2, false, false, true, array['algodón', 'sin aro']::text[], '2026-02-08'::timestamptz),
  ('p-007', 'culotte-sofia', 'Culotte Sofía', 'Bombacha culotte de encaje con tiro medio y terminaciones sin elástico visible.', (select id from public.categories where slug = 'bombachas'), 8900, null, 'color', 30, false, false, false, array['encaje']::text[], '2026-05-19'::timestamptz),
  ('p-008', 'colaless-valentina', 'Colaless Valentina', 'Colaless de tul con detalle de puntilla en la cintura.', (select id from public.categories where slug = 'bombachas'), 7500, 5900, 'color', 24, false, false, false, array['tul']::text[], '2026-01-30'::timestamptz),
  ('p-009', 'vedetina-clara', 'Vedetina Clara', 'Vedetina de algodón peinado con cintura alta y cobertura total.', (select id from public.categories where slug = 'bombachas'), 6800, null, 'color', 0, false, false, false, array['algodón', 'tiro alto']::text[], '2025-12-04'::timestamptz),
  ('p-010', 'body-isabella', 'Body Isabella', 'Body de encaje con escote en V profundo, breteles finos y broche inferior.', (select id from public.categories where slug = 'bodys'), 34500, null, 'color', 7, true, true, true, array['encaje']::text[], '2026-09-18'::timestamptz),
  ('p-011', 'body-helena', 'Body Helena', 'Body de microfibra de manga larga con cuello redondo. Se usa como prenda exterior.', (select id from public.categories where slug = 'bodys'), 29900, null, 'color', 5, false, false, false, '{}'::text[], '2025-11-11'::timestamptz),
  ('p-012', 'pijama-luna', 'Pijama Luna', 'Pijama de satén con camisa manga larga con ribete en contraste y pantalón largo con cintura elástica.', (select id from public.categories where slug = 'pijamas'), 42000, null, 'color', 8, true, true, true, array['satén']::text[], '2026-09-20'::timestamptz),
  ('p-013', 'pijama-olivia', 'Pijama Olivia', 'Pijama corto de modal: musculosa de breteles finos y short con puntilla.', (select id from public.categories where slug = 'pijamas'), 27500, 22000, 'color', 12, false, false, true, array['modal']::text[], '2026-07-01'::timestamptz),
  ('p-014', 'camison-rocio', 'Camisón Rocío', 'Camisón midi de satén con escote en V de encaje y tajo lateral.', (select id from public.categories where slug = 'camisones'), 31000, null, 'color', 6, false, true, true, array['satén', 'encaje']::text[], '2026-08-27'::timestamptz),
  ('p-015', 'colaless-regulable', 'Colaless regulable', 'Colaless de microfibra elastizada con tiras laterales regulables y moño al frente. Tres estampas para elegir.', (select id from public.categories where slug = 'bombachas'), 12000, 9900, 'estampa', 37, true, true, true, array['microfibra', 'regulable', 'estampado']::text[], '2026-09-27'::timestamptz)
on conflict (slug) do update set legacy_id = excluded.legacy_id, nombre = excluded.nombre,
  descripcion = excluded.descripcion, category_id = excluded.category_id, precio = excluded.precio,
  precio_oferta = excluded.precio_oferta, tipo_variante = excluded.tipo_variante,
  stock = excluded.stock, destacado = excluded.destacado, nuevo = excluded.nuevo,
  activo = excluded.activo, tags = excluded.tags, created_at = excluded.created_at;

-- hijos: borrar y volver a cargar (las variantes y fotos por color caen en cascada)
delete from public.product_images where product_id in (select id from public.products where slug in ('conjunto-aurora', 'conjunto-lucia', 'conjunto-alba', 'bralette-julieta', 'corpino-emma', 'triangulito-mia', 'culotte-sofia', 'colaless-valentina', 'vedetina-clara', 'body-isabella', 'body-helena', 'pijama-luna', 'pijama-olivia', 'camison-rocio', 'colaless-regulable'));
delete from public.product_colors where product_id in (select id from public.products where slug in ('conjunto-aurora', 'conjunto-lucia', 'conjunto-alba', 'bralette-julieta', 'corpino-emma', 'triangulito-mia', 'culotte-sofia', 'colaless-valentina', 'vedetina-clara', 'body-isabella', 'body-helena', 'pijama-luna', 'pijama-olivia', 'camison-rocio', 'colaless-regulable'));
delete from public.product_sizes where product_id in (select id from public.products where slug in ('conjunto-aurora', 'conjunto-lucia', 'conjunto-alba', 'bralette-julieta', 'corpino-emma', 'triangulito-mia', 'culotte-sofia', 'colaless-valentina', 'vedetina-clara', 'body-isabella', 'body-helena', 'pijama-luna', 'pijama-olivia', 'camison-rocio', 'colaless-regulable'));

-- colores de cada producto
insert into public.product_colors (product_id, color_id, orden)
select p.id, c.id, v.orden
from (values
  ('conjunto-aurora', 'negro', 0),
  ('conjunto-aurora', 'nude', 1),
  ('conjunto-lucia', 'bordo', 0),
  ('conjunto-lucia', 'negro', 1),
  ('conjunto-alba', 'blanco', 0),
  ('conjunto-alba', 'nude', 1),
  ('conjunto-alba', 'negro', 2),
  ('bralette-julieta', 'rosa-viejo', 0),
  ('bralette-julieta', 'negro', 1),
  ('corpino-emma', 'nude', 0),
  ('corpino-emma', 'negro', 1),
  ('corpino-emma', 'blanco', 2),
  ('triangulito-mia', 'verde-salvia', 0),
  ('triangulito-mia', 'champagne', 1),
  ('culotte-sofia', 'negro', 0),
  ('culotte-sofia', 'nude', 1),
  ('culotte-sofia', 'bordo', 2),
  ('colaless-valentina', 'rosa-viejo', 0),
  ('colaless-valentina', 'negro', 1),
  ('colaless-valentina', 'blanco', 2),
  ('vedetina-clara', 'champagne', 0),
  ('vedetina-clara', 'blanco', 1),
  ('body-isabella', 'negro', 0),
  ('body-isabella', 'bordo', 1),
  ('body-helena', 'nude', 0),
  ('body-helena', 'negro', 1),
  ('pijama-luna', 'champagne', 0),
  ('pijama-luna', 'verde-salvia', 1),
  ('pijama-olivia', 'rosa-viejo', 0),
  ('pijama-olivia', 'blanco', 1),
  ('camison-rocio', 'bordo', 0),
  ('camison-rocio', 'negro', 1),
  ('colaless-regulable', 'cerezas', 0),
  ('colaless-regulable', 'flores', 1),
  ('colaless-regulable', 'onda-rosa', 2)
) as v (producto, color, orden)
join public.products p on p.slug = v.producto
join public.colors c on c.slug = v.color;

-- talles de cada producto
insert into public.product_sizes (product_id, talle, orden)
select p.id, v.talle, v.orden
from (values
  ('conjunto-aurora', 'S', 0),
  ('conjunto-aurora', 'M', 1),
  ('conjunto-aurora', 'L', 2),
  ('conjunto-aurora', 'XL', 3),
  ('conjunto-lucia', '85', 0),
  ('conjunto-lucia', '90', 1),
  ('conjunto-lucia', '95', 2),
  ('conjunto-lucia', '100', 3),
  ('conjunto-alba', 'S', 0),
  ('conjunto-alba', 'M', 1),
  ('conjunto-alba', 'L', 2),
  ('conjunto-alba', 'XL', 3),
  ('bralette-julieta', 'S', 0),
  ('bralette-julieta', 'M', 1),
  ('bralette-julieta', 'L', 2),
  ('bralette-julieta', 'XL', 3),
  ('corpino-emma', '85', 0),
  ('corpino-emma', '90', 1),
  ('corpino-emma', '95', 2),
  ('corpino-emma', '100', 3),
  ('triangulito-mia', 'S', 0),
  ('triangulito-mia', 'M', 1),
  ('triangulito-mia', 'L', 2),
  ('triangulito-mia', 'XL', 3),
  ('culotte-sofia', 'S', 0),
  ('culotte-sofia', 'M', 1),
  ('culotte-sofia', 'L', 2),
  ('culotte-sofia', 'XL', 3),
  ('colaless-valentina', 'S', 0),
  ('colaless-valentina', 'M', 1),
  ('colaless-valentina', 'L', 2),
  ('colaless-valentina', 'XL', 3),
  ('vedetina-clara', 'S', 0),
  ('vedetina-clara', 'M', 1),
  ('vedetina-clara', 'L', 2),
  ('vedetina-clara', 'XL', 3),
  ('body-isabella', 'S', 0),
  ('body-isabella', 'M', 1),
  ('body-isabella', 'L', 2),
  ('body-isabella', 'XL', 3),
  ('body-helena', 'S', 0),
  ('body-helena', 'M', 1),
  ('body-helena', 'L', 2),
  ('body-helena', 'XL', 3),
  ('pijama-luna', 'S', 0),
  ('pijama-luna', 'M', 1),
  ('pijama-luna', 'L', 2),
  ('pijama-luna', 'XL', 3),
  ('pijama-olivia', 'S', 0),
  ('pijama-olivia', 'M', 1),
  ('pijama-olivia', 'L', 2),
  ('pijama-olivia', 'XL', 3),
  ('camison-rocio', 'S', 0),
  ('camison-rocio', 'M', 1),
  ('camison-rocio', 'L', 2),
  ('camison-rocio', 'XL', 3),
  ('colaless-regulable', 'S', 0),
  ('colaless-regulable', 'M', 1),
  ('colaless-regulable', 'L', 2)
) as v (producto, talle, orden)
join public.products p on p.slug = v.producto;

-- variantes (stock por color/estampa + talle)
insert into public.product_variants (product_id, color_id, talle, stock, sku)
select p.id, c.id, v.talle, v.stock, v.sku
from (values
  ('conjunto-aurora', 'negro', 'S', 3, null),
  ('conjunto-aurora', 'negro', 'M', 4, null),
  ('conjunto-aurora', 'negro', 'L', 2, null),
  ('conjunto-aurora', 'negro', 'XL', 0, null),
  ('conjunto-aurora', 'nude', 'S', 1, null),
  ('conjunto-aurora', 'nude', 'M', 2, null),
  ('conjunto-aurora', 'nude', 'L', 2, null),
  ('conjunto-aurora', 'nude', 'XL', 0, null),
  ('conjunto-lucia', 'bordo', '85', 2, null),
  ('conjunto-lucia', 'bordo', '90', 3, null),
  ('conjunto-lucia', 'bordo', '95', 1, null),
  ('conjunto-lucia', 'bordo', '100', 0, null),
  ('conjunto-lucia', 'negro', '85', 0, null),
  ('conjunto-lucia', 'negro', '90', 2, null),
  ('conjunto-lucia', 'negro', '95', 1, null),
  ('conjunto-lucia', 'negro', '100', 0, null),
  ('triangulito-mia', 'verde-salvia', 'S', 0, null),
  ('triangulito-mia', 'verde-salvia', 'M', 1, null),
  ('triangulito-mia', 'verde-salvia', 'L', 0, null),
  ('triangulito-mia', 'verde-salvia', 'XL', 0, null),
  ('triangulito-mia', 'champagne', 'S', 0, null),
  ('triangulito-mia', 'champagne', 'M', 0, null),
  ('triangulito-mia', 'champagne', 'L', 1, null),
  ('triangulito-mia', 'champagne', 'XL', 0, null),
  ('colaless-regulable', 'cerezas', 'S', 4, null),
  ('colaless-regulable', 'cerezas', 'M', 6, null),
  ('colaless-regulable', 'cerezas', 'L', 3, null),
  ('colaless-regulable', 'flores', 'S', 5, null),
  ('colaless-regulable', 'flores', 'M', 4, null),
  ('colaless-regulable', 'flores', 'L', 3, null),
  ('colaless-regulable', 'onda-rosa', 'S', 3, null),
  ('colaless-regulable', 'onda-rosa', 'M', 5, null),
  ('colaless-regulable', 'onda-rosa', 'L', 4, null)
) as v (producto, color, talle, stock, sku)
join public.products p on p.slug = v.producto
join public.colors c on c.slug = v.color;

-- imágenes (url local /images/… hasta migrarlas a Storage en V2.7)
insert into public.product_images (product_id, color_id, url, alt, orden)
select p.id, c.id, v.url, v.alt, v.orden
from (values
  ('conjunto-aurora', null, '/images/productos/conjunto-aurora-1.png', 'Conjunto Aurora negro, vista de frente', 0),
  ('conjunto-aurora', null, '/images/productos/conjunto-aurora-2.png', 'Conjunto Aurora negro, vista de espalda', 1),
  ('conjunto-aurora', 'nude', '/images/productos/conjunto-aurora-nude-1.png', 'Conjunto Aurora nude, vista de frente', 0),
  ('conjunto-aurora', 'nude', '/images/productos/conjunto-aurora-nude-2.png', 'Conjunto Aurora nude, vista de espalda', 1),
  ('conjunto-lucia', null, '/images/productos/conjunto-lucia-1.png', 'Conjunto Lucía bordó, vista de frente', 0),
  ('conjunto-lucia', null, '/images/productos/conjunto-lucia-2.png', 'Conjunto Lucía bordó, vista de espalda', 1),
  ('conjunto-alba', null, '/images/productos/conjunto-alba-1.png', 'Conjunto Alba blanco, vista de frente', 0),
  ('conjunto-alba', null, '/images/productos/conjunto-alba-2.png', 'Conjunto Alba blanco, vista de espalda', 1),
  ('bralette-julieta', null, '/images/productos/bralette-julieta-1.png', 'Bralette Julieta rosa viejo, vista de frente', 0),
  ('bralette-julieta', null, '/images/productos/bralette-julieta-2.png', 'Bralette Julieta rosa viejo, vista de espalda', 1),
  ('corpino-emma', null, '/images/productos/corpino-emma-1.png', 'Corpiño Emma nude, vista de frente', 0),
  ('corpino-emma', null, '/images/productos/corpino-emma-2.png', 'Corpiño Emma nude, vista de espalda', 1),
  ('triangulito-mia', null, '/images/productos/triangulito-mia-1.png', 'Triangulito Mía verde salvia, vista de frente', 0),
  ('triangulito-mia', null, '/images/productos/triangulito-mia-2.png', 'Triangulito Mía verde salvia, vista de espalda', 1),
  ('culotte-sofia', null, '/images/productos/culotte-sofia-1.png', 'Culotte Sofía negro, vista de frente', 0),
  ('culotte-sofia', null, '/images/productos/culotte-sofia-2.png', 'Culotte Sofía negro, vista de espalda', 1),
  ('colaless-valentina', null, '/images/productos/colaless-valentina-1.png', 'Colaless Valentina rosa viejo, vista de frente', 0),
  ('colaless-valentina', null, '/images/productos/colaless-valentina-2.png', 'Colaless Valentina rosa viejo, vista de espalda', 1),
  ('vedetina-clara', null, '/images/productos/vedetina-clara-1.png', 'Vedetina Clara champagne, vista de frente', 0),
  ('vedetina-clara', null, '/images/productos/vedetina-clara-2.png', 'Vedetina Clara champagne, vista de espalda', 1),
  ('body-isabella', null, '/images/productos/body-isabella-1.png', 'Body Isabella negro, vista de frente', 0),
  ('body-isabella', null, '/images/productos/body-isabella-2.png', 'Body Isabella negro, vista de espalda', 1),
  ('body-isabella', null, '/images/productos/body-isabella-3.png', 'Body Isabella negro, vista en detalle', 2),
  ('body-helena', null, '/images/productos/body-helena-1.png', 'Body Helena nude, vista de frente', 0),
  ('body-helena', null, '/images/productos/body-helena-2.png', 'Body Helena nude, vista de espalda', 1),
  ('pijama-luna', null, '/images/productos/pijama-luna-1.png', 'Pijama Luna champagne, vista de frente', 0),
  ('pijama-luna', null, '/images/productos/pijama-luna-2.png', 'Pijama Luna champagne, vista de espalda', 1),
  ('pijama-olivia', null, '/images/productos/pijama-olivia-1.png', 'Pijama Olivia rosa viejo, vista de frente', 0),
  ('pijama-olivia', null, '/images/productos/pijama-olivia-2.png', 'Pijama Olivia rosa viejo, vista de espalda', 1),
  ('camison-rocio', null, '/images/productos/camison-rocio-1.png', 'Camisón Rocío bordó, vista de frente', 0),
  ('camison-rocio', null, '/images/productos/camison-rocio-2.png', 'Camisón Rocío bordó, vista de espalda', 1),
  ('colaless-regulable', null, '/images/productos-reales/bombachas-cerezas-negra.jpeg', 'Colaless regulable negra con estampa de cerezas rojas, tiras laterales regulables y moño', 0),
  ('colaless-regulable', null, '/images/productos-reales/bombachas-flores-blanca.jpeg', 'Colaless regulable blanca con estampa de flores negras y rosas y tiras laterales regulables', 1),
  ('colaless-regulable', null, '/images/productos-reales/bombachas-onda-rosa.jpeg', 'Colaless regulable con estampa de ondas rosa y rojo, tiras laterales rojas y moño', 2),
  ('colaless-regulable', 'cerezas', '/images/productos-reales/bombachas-cerezas-negra.jpeg', 'Colaless regulable negra con estampa de cerezas rojas, tiras laterales regulables y moño', 0),
  ('colaless-regulable', 'flores', '/images/productos-reales/bombachas-flores-blanca.jpeg', 'Colaless regulable blanca con estampa de flores negras y rosas y tiras laterales regulables', 0),
  ('colaless-regulable', 'onda-rosa', '/images/productos-reales/bombachas-onda-rosa.jpeg', 'Colaless regulable con estampa de ondas rosa y rojo, tiras laterales rojas y moño', 0)
) as v (producto, color, url, alt, orden)
join public.products p on p.slug = v.producto
left join public.colors c on c.slug = v.color;

-- configuración (el número de pedidos queda null: se usa NEXT_PUBLIC_WHATSAPP_NUMBER)
update public.store_settings set instagram_url = 'https://www.instagram.com/berenice_lenceria/', whatsapp_group_url = 'https://chat.whatsapp.com/FM4btTCifqcJZ5UB72KdZv?mode=gi_t' where id = 1;

commit;
