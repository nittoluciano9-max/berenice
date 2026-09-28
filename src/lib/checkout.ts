import type {
  DatosPedido,
  FormaEntrega,
  FormaPago,
  OrderErrors,
} from "@/types/cart";

export const ENTREGA_LABELS: Record<FormaEntrega, string> = {
  envio: "Envío",
  retiro: "Retiro",
};

export const PAGO_LABELS: Record<FormaPago, string> = {
  transferencia: "Transferencia",
  efectivo: "Efectivo",
};

export const COMENTARIO_MAX = 300;

export const EMPTY_ORDER: DatosPedido = {
  nombre: "",
  celular: "",
  pago: null,
  entrega: null,
  direccion: "",
  comentario: "",
};

const digitos = (s: string) => s.replace(/\D/g, "").length;

/** Errores por campo, en español y listos para mostrar; objeto vacío = formulario válido. */
export function validateOrderDetails(datos: DatosPedido): OrderErrors {
  const errores: OrderErrors = {};
  const nombre = datos.nombre.trim();
  const celular = datos.celular.trim();

  if (!nombre) errores.nombre = "Ingresá tu nombre y apellido.";
  else if (nombre.split(/\s+/).length < 2)
    errores.nombre = "Ingresá nombre y apellido.";

  if (!celular) errores.celular = "Ingresá un celular de contacto.";
  else if (
    !/^[\d\s+()-]+$/.test(celular) ||
    digitos(celular) < 8 ||
    digitos(celular) > 15
  )
    errores.celular = "Revisá el número: entre 8 y 15 dígitos.";

  if (!datos.pago) errores.pago = "Elegí una forma de pago.";
  if (!datos.entrega) errores.entrega = "Elegí envío o retiro.";

  if (datos.entrega === "envio" && datos.direccion.trim().length < 8)
    errores.direccion = "Ingresá la dirección de entrega.";

  if (datos.comentario.length > COMENTARIO_MAX)
    errores.comentario = `Máximo ${COMENTARIO_MAX} caracteres.`;

  return errores;
}

export function hasErrors(errores: OrderErrors): boolean {
  return Object.keys(errores).length > 0;
}
