export interface CartItem {
  /** `productId:color:talle`, identidad de la línea. */
  id: string;
  productId: string;
  slug: string;
  nombre: string;
  imagen: string;
  color: string;
  talle: string;
  /** Precio vigente al agregar (oferta si corresponde), en pesos enteros. */
  precioUnitario: number;
  /** Precio de lista al agregar; permite calcular el ahorro. */
  precioLista: number;
  cantidad: number;
}
