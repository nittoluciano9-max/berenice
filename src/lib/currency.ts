const formatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** 25000 → "$ 25.000" */
export function formatPrice(pesos: number): string {
  return formatter.format(pesos);
}
