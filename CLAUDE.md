# CLAUDE.md — Berenice

Tienda web de indumentaria femenina. Empieza con lencería, pero la arquitectura es **multi-categoría** desde el día uno.
Este archivo define reglas técnicas y alcance. Leelo antes de cualquier cambio.

---

## 1. Alcance

### Versión actual: V1 — catálogo → carrito → WhatsApp

**Incluido en V1**

- Home, catálogo (`/productos`), categorías, detalle de producto.
- Carrito persistido en `localStorage`.
- Finalización del pedido por WhatsApp (`wa.me`).
- Guía de talles y página de envíos/cambios (contenido estático).
- Diseño responsive, **mobile first**.
- Productos y categorías **simulados** en archivos TypeScript.

**Fuera de V1 — NO implementar, NO instalar, NO dejar stubs funcionales**

- Login, usuarios, cuentas.
- Backend, API routes, base de datos, ORM.
- Mercado Pago o cualquier pago online.
- Gestión o reserva de stock, validación contra servidor.
- Panel administrativo.
- Integración con la API de Instagram (la sección es visual/mock).
- CMS, i18n, analytics de terceros.

Si una tarea parece requerir algo de esta lista, **frená y preguntá**.

### Roadmap (solo referencia, no implementar)

V2 BD + panel admin · V3 stock por variante + pedidos + clientes · V4 Mercado Pago / envíos (WhatsApp queda como segunda opción) · V5 ecommerce completo.

---

## 2. Stack

| Uso            | Paquete                                                                        |
| -------------- | ------------------------------------------------------------------------------ |
| Framework      | `next` 16 (App Router), `react` 19                                             |
| Lenguaje       | TypeScript (`strict: true`)                                                    |
| Estilos        | Tailwind CSS v4 (tokens en `@theme`, `globals.css`)                            |
| UI             | shadcn/ui — **solo** los componentes usados (Sheet, Button, Accordion, Select) |
| Íconos         | `lucide-react`                                                                 |
| Estado carrito | `zustand` (+ `persist`)                                                        |
| Utilidades     | `clsx`, `tailwind-merge`                                                       |
| Calidad        | ESLint, Prettier + `prettier-plugin-tailwindcss`                               |

**Dependencias al mínimo.** No agregar paquetes sin justificarlo y sin aprobación.
Antes de instalar algo, preguntate si se resuelve con CSS, con la plataforma o con 20 líneas propias.
Explícitamente evitados: librerías de carrusel (usar CSS scroll-snap), de formularios, de fechas, UI kits adicionales, SDKs de pago/auth.
`motion` (Framer Motion) queda opcional y requiere aprobación.

---

## 3. Arquitectura

```
UI (app/, components/)  →  lib/catalog.ts (async)  →  data/*.ts (mock)
Carrito (store/cart.ts, cliente)  →  lib/whatsapp.ts  →  https://wa.me/<numero>?text=...
```

Reglas:

1. **La UI nunca importa `data/` directamente.** Todo acceso a productos/categorías pasa por `lib/catalog.ts` (`getProducts`, `getProductBySlug`, `getCategoryTree`, `getCategoryBySlug`, `getRelatedProducts`). Las funciones son `async` aunque hoy lean arrays, para migrar a BD sin tocar la UI.
2. **Server Components por defecto.** `"use client"` solo donde hay interacción (carrito, selectores, filtros, menú, galería).
3. **Filtros, orden y búsqueda viven en la URL** (`?cat=&talle=&color=&orden=&q=&oferta=`). Lógica pura en `lib/filters.ts`. La vidriera de la home reutiliza esos mismos parámetros y suma solo `?vista=nuevos` (tab "Nuevos"; "Ofertas" es `oferta=1`); su lógica pura está en `lib/showcase.ts`. En la home, cambiar de categoría agrega al historial; tabs y filtros lo reemplazan.
4. **Configuración centralizada** en `lib/config.ts` (lee `process.env.NEXT_PUBLIC_*`). Ningún componente lee `process.env` ni hardcodea número de WhatsApp, Instagram o dominio.
5. **Categorías extensibles**: agregar una categoría o subcategoría es agregar datos, nunca código ni rutas nuevas.
6. Páginas estáticas con `generateStaticParams` para producto y categoría.

---

## 4. Estructura

```
src/
  app/            layout.tsx, page.tsx, productos/, categoria/[slug]/, producto/[slug]/,
                  guia-de-talles/, envios-y-cambios/, not-found.tsx, sitemap.ts, robots.ts, globals.css
  components/
    ui/           shadcn (no editar salvo estilos de marca)
    layout/       Header, MobileMenu, Footer, FloatingWhatsApp, SearchBar
    showcase/     vidriera de la home: ShopShowcase (URL) + ShowcaseView (layout 3 columnas),
                  CategorySidebar, CategoryChips, ShowcaseTabs, ShowcaseToolbar, MiniHero,
                  QuickAccess, CartQuickView
    home/         InstagramSection, SectionHeader
    content/      ContentPage, SizeTable, WhatsAppHelp (páginas estáticas)
    product/      ProductCard, ProductGrid, ProductGallery, ProductFilters, ColorSelector,
                  SizeSelector, QuantitySelector, PriceTag, AddToCartButton, StickyBuyBar, RelatedProducts
    category/     Breadcrumbs
    cart/         CartDrawer, CartItem, CartSummary, CartButton, WhatsAppCheckout
  data/           products.ts, categories.ts, instagram.ts (mock)
  lib/            catalog.ts, filters.ts, showcase.ts, whatsapp.ts, currency.ts, config.ts, seo.ts, utils.ts
  store/          cart.ts
  types/          product.ts, category.ts, cart.ts, showcase.ts
public/images/    fotos mock (vertical 4:5)
```

---

## 5. Modelo de datos

- `Category`: `id, slug (único global), nombre, descripcion?, imagen?, parentId | null, orden, activo`. El árbol se deriva de `parentId`.
- `Product`: `id, slug, nombre, descripcion, categoria, subcategoria, precio, precioOferta?, imagenes, talles, colores, stock, variantes?, destacado, nuevo, activo, tags?, creadoEn?`.
- `ProductColor`: `nombre, slug, hex, imagenes?`.
- `ProductVariant`: `color, talle, stock, sku?`.

Reglas V1:

- **Stock y variantes son simulados.** Se usan solo para mostrar "Disponible / Sin stock / Últimas unidades" y deshabilitar talles sin stock. Sin reservas, sin descuento de stock, sin validación contra backend.
- Precios en **pesos enteros** (ARS, sin decimales). Formatear solo con `lib/currency.ts` (`Intl.NumberFormat('es-AR')`).
- El % de descuento se **calcula**, no se guarda.
- Solo se muestran productos y categorías con `activo: true`.

---

## 6. Carrito

- Store Zustand en `store/cart.ts`, `persist` con clave `berenice-cart` y `version: 1`.
- Identidad de línea: `productId + color + talle`. Misma combinación = suma cantidad.
- La línea guarda un snapshot: `id, productId, slug, nombre, imagen, color, talle, precioUnitario, cantidad`.
- Acciones: `addItem, removeItem, updateQuantity, changeVariant, clear, open, close`.
- Derivados (selectores, no estado): `itemCount, subtotal, ahorro, total`. En V1 `total = subtotal` (el envío se acuerda por WhatsApp).
- Evitar hydration mismatch: el badge del carrito y el drawer renderizan contenido persistido solo después de montar.

---

## 7. WhatsApp

- Número: `NEXT_PUBLIC_WHATSAPP_NUMBER` (formato `549XXXXXXXXXX`), leído **solo** en `lib/config.ts`.
- `lib/whatsapp.ts` contiene **funciones puras**: `buildOrderMessage`, `buildWhatsAppUrl`, `buildProductInquiry`, `generateOrderCode`.
- **Código de pedido `BER-XXXX`**: se genera localmente al finalizar, sirve **solo como referencia dentro del mensaje**. No se persiste, no es ID, no se usa para nada más.
- Datos opcionales del formulario: Nombre, Forma de entrega (envío/retiro), Localidad. Si están vacíos, se envían los rótulos vacíos.
- Origen de visita: si la URL trae `?ref=...` (QR, Instagram), se guarda en `sessionStorage` y se agrega como "Origen:" al mensaje.
- Usar `encodeURIComponent` para el texto. No vaciar el carrito automáticamente al enviar.
- Formato del mensaje:

```
Hola 👋
Quiero realizar el siguiente pedido en Berenice (BER-XXXX):

1x Conjunto Aurora
Talle: M · Color: Negro
Precio: $25.000

Total: $25.000

Nombre:
Forma de entrega:
Localidad:
```

---

## 8. Diseño

- Estética: elegante, femenina, minimalista, premium. Nada infantil, nada recargado, nada de dashboard.
- Tokens (usar siempre los tokens, nunca hex sueltos en componentes):
  `ivory #FAF7F2` (fondo) · `sand #EFE6DC` · `nude #D9B8A3` · `blush #F3E3E1` · `ink #1A1A1A` (texto/botones) · `rosewood #9E5A63` (ofertas/acentos).
- Tipografía (`next/font`): Cormorant Garamond (títulos) + Jost (texto/UI).
- Fotos grandes, verticales 4:5, siempre con `next/image` y `alt` descriptivo. Mucho espacio en blanco.
- Radio mínimo, botones negros sólidos u outline fino, íconos lucide `strokeWidth={1.5}`.
- **Mobile first**: diseñar en 375 px y escalar. Áreas táctiles ≥ 44 px. Filtros en bottom sheet, galería con swipe, barra fija de compra en producto, WhatsApp flotante (oculto con el drawer abierto).
- Accesibilidad: HTML semántico, foco visible, `aria-label` en botones de ícono, contraste AA.

---

## 9. Convenciones de código

- Componentes en `PascalCase.tsx`, un componente por archivo, **export nombrado**. Utilidades en `camelCase.ts`.
- **Dominio en español** (producto, precio, talle, categoría); **términos técnicos en inglés** (store, props, hooks). Textos de UI en español rioplatense (voseo: "Elegí", "Agregá").
- Archivos chicos: si un componente pasa ~150 líneas, dividirlo.
- Sin `any`. Tipos en `src/types/`. Props tipadas con `interface`.
- Sin lógica de negocio en componentes: cálculos en `lib/` o selectores del store.
- Alias de import `@/` → `src/`.
- Sin comentarios obvios; comentar solo el "por qué".

---

## 10. Forma de trabajo

- Avanzar **por etapas**; no generar todo el proyecto de una vez. Al terminar cada etapa, mostrar qué se hizo y esperar aprobación.
- Etapas V1: 1) setup + layout · 2) tipos, mocks y `lib/catalog.ts` · 3) grilla, `/productos`, `/categoria` y filtros · 4) detalle de producto · 5) carrito · 6) WhatsApp + flotante · 7) home completa · 8) pulido mobile, SEO, `sitemap`, `not-found`.
- Antes de dar una etapa por terminada: `npm run lint`, `npm run build` sin errores y revisión en viewport móvil.
- Gestor de paquetes: **npm**. Node LTS.

## Comandos

```
npm run dev     # desarrollo
npm run build   # build de producción
npm run lint    # lint
```

## Variables de entorno

Ver `.env.example`:

```
NEXT_PUBLIC_WHATSAPP_NUMBER=549XXXXXXXXXX
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/berenice
NEXT_PUBLIC_SITE_URL=https://berenice.com.ar
```
