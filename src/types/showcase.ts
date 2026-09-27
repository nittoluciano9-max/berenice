/** Tabs de la vidriera de la home. "ofertas" reutiliza el filtro `oferta` del catálogo. */
export type ShowcaseTab = "destacados" | "nuevos" | "ofertas";

export interface ShowcaseCategory {
  slug: string;
  nombre: string;
}

/** Una categoría raíz con sus subcategorías (o ella misma, si no tiene hijas). */
export interface ShowcaseCategoryGroup {
  titulo: string;
  items: ShowcaseCategory[];
}
