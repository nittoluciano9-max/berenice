export interface CartItem {
  /** `productId:color:talle`, identidad de la línea. */
  id: string;
  productId: string;
  slug: string;
  nombre: string;
  /** Foto del color elegido si tiene propias; si no, la principal del producto. */
  imagen: string;
  /** Slug del color (identidad). */
  color: string;
  /** Nombre visible del color, para la UI y el mensaje de WhatsApp. */
  colorNombre: string;
  /** Cómo se nombra la variante ("Estampa" en prendas estampadas); ausente = "Color". */
  colorLabel?: string;
  talle: string;
  /** Precio vigente al agregar (oferta si corresponde), en pesos enteros. */
  precioUnitario: number;
  /** Precio de lista al agregar; permite calcular el ahorro. */
  precioLista: number;
  cantidad: number;
}

/** Datos que cambian al editar la variante de una línea desde el carrito. */
export type VariantPatch = Pick<
  CartItem,
  "color" | "colorNombre" | "talle" | "imagen"
>;

export type FormaEntrega = "envio" | "retiro";
export type FormaPago = "transferencia" | "efectivo";

/** Datos del formulario previo al pedido. Viven solo en memoria: nunca en localStorage. */
export interface DatosPedido {
  /** Nombre y apellido. Obligatorio. */
  nombre: string;
  celular: string;
  pago: FormaPago | null;
  entrega: FormaEntrega | null;
  /** Obligatoria solo con envío: calle, altura, localidad y referencia en un campo. */
  direccion: string;
  comentario: string;
}

export type OrderErrors = Partial<Record<keyof DatosPedido, string>>;

export interface AddResult {
  /** Unidades que se sumaron realmente (puede ser menos de lo pedido por el tope de stock). */
  agregadas: number;
  /** Cantidad final de la línea. */
  cantidad: number;
  limitado: boolean;
}
