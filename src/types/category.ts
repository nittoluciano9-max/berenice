export interface Category {
  id: string;
  slug: string;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  parentId: string | null;
  orden: number;
  activo: boolean;
}

export interface CategoryNode extends Category {
  children: CategoryNode[];
}
