export interface ProductImage {
  src: string;
  alt: string;
}

export interface ProductColor {
  nombre: string;
  slug: string;
  hex: string;
  imagenes?: ProductImage[];
}

export interface ProductVariant {
  /** Slug del color. */
  color: string;
  talle: string;
  stock: number;
  sku?: string;
}

export interface Product {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string;
  /** Slug de la categoría raíz. */
  categoria: string;
  /** Slug de la subcategoría, si el producto está en una. */
  subcategoria: string | null;
  /** Pesos enteros (ARS). */
  precio: number;
  precioOferta?: number;
  imagenes: ProductImage[];
  talles: string[];
  colores: ProductColor[];
  /**
   * Cómo se muestra la variante de `colores` en UI y mensajes. "estampa": misma lógica de
   * stock y carrito que un color, pero se lee "Estampa: Cerezas". Ausente = "color".
   */
  tipoVariante?: "color" | "estampa";
  /** Stock total simulado; si hay variantes, manda el stock de cada variante. */
  stock: number;
  variantes?: ProductVariant[];
  destacado: boolean;
  nuevo: boolean;
  activo: boolean;
  tags?: string[];
  /** Fecha ISO (YYYY-MM-DD). */
  creadoEn?: string;
}

export type StockStatus = "disponible" | "ultimas" | "agotado";
