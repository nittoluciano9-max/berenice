export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string;
          email: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      audit_log: {
        Row: {
          accion: string;
          actor: string | null;
          antes: Json | null;
          created_at: string;
          despues: Json | null;
          id: number;
          registro_id: string;
          tabla: string;
        };
        Insert: {
          accion: string;
          actor?: string | null;
          antes?: Json | null;
          created_at?: string;
          despues?: Json | null;
          id?: never;
          registro_id: string;
          tabla: string;
        };
        Update: {
          accion?: string;
          actor?: string | null;
          antes?: Json | null;
          created_at?: string;
          despues?: Json | null;
          id?: never;
          registro_id?: string;
          tabla?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          activo: boolean;
          created_at: string;
          descripcion: string | null;
          id: string;
          imagen_path: string | null;
          nombre: string;
          orden: number;
          parent_id: string | null;
          slug: string;
          updated_at: string;
        };
        Insert: {
          activo?: boolean;
          created_at?: string;
          descripcion?: string | null;
          id?: string;
          imagen_path?: string | null;
          nombre: string;
          orden?: number;
          parent_id?: string | null;
          slug: string;
          updated_at?: string;
        };
        Update: {
          activo?: boolean;
          created_at?: string;
          descripcion?: string | null;
          id?: string;
          imagen_path?: string | null;
          nombre?: string;
          orden?: number;
          parent_id?: string | null;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      colors: {
        Row: {
          created_at: string;
          hex: string;
          id: string;
          nombre: string;
          slug: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          hex: string;
          id?: string;
          nombre: string;
          slug: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          hex?: string;
          id?: string;
          nombre?: string;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      product_colors: {
        Row: {
          color_id: string;
          orden: number;
          product_id: string;
        };
        Insert: {
          color_id: string;
          orden?: number;
          product_id: string;
        };
        Update: {
          color_id?: string;
          orden?: number;
          product_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_colors_color_id_fkey";
            columns: ["color_id"];
            isOneToOne: false;
            referencedRelation: "colors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_colors_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_images: {
        Row: {
          alt: string;
          color_id: string | null;
          created_at: string;
          height: number | null;
          id: string;
          orden: number;
          product_id: string;
          storage_path: string | null;
          url: string | null;
          width: number | null;
        };
        Insert: {
          alt?: string;
          color_id?: string | null;
          created_at?: string;
          height?: number | null;
          id?: string;
          orden?: number;
          product_id: string;
          storage_path?: string | null;
          url?: string | null;
          width?: number | null;
        };
        Update: {
          alt?: string;
          color_id?: string | null;
          created_at?: string;
          height?: number | null;
          id?: string;
          orden?: number;
          product_id?: string;
          storage_path?: string | null;
          url?: string | null;
          width?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "product_images_color_id_fkey";
            columns: ["color_id"];
            isOneToOne: false;
            referencedRelation: "colors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_images_product_id_color_id_fkey";
            columns: ["product_id", "color_id"];
            isOneToOne: false;
            referencedRelation: "product_colors";
            referencedColumns: ["product_id", "color_id"];
          },
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_sizes: {
        Row: {
          orden: number;
          product_id: string;
          talle: string;
        };
        Insert: {
          orden?: number;
          product_id: string;
          talle: string;
        };
        Update: {
          orden?: number;
          product_id?: string;
          talle?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_sizes_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_variants: {
        Row: {
          color_id: string;
          id: string;
          product_id: string;
          sku: string | null;
          stock: number;
          talle: string;
        };
        Insert: {
          color_id: string;
          id?: string;
          product_id: string;
          sku?: string | null;
          stock?: number;
          talle: string;
        };
        Update: {
          color_id?: string;
          id?: string;
          product_id?: string;
          sku?: string | null;
          stock?: number;
          talle?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_variants_color_id_fkey";
            columns: ["color_id"];
            isOneToOne: false;
            referencedRelation: "colors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_variants_product_id_color_id_fkey";
            columns: ["product_id", "color_id"];
            isOneToOne: false;
            referencedRelation: "product_colors";
            referencedColumns: ["product_id", "color_id"];
          },
          {
            foreignKeyName: "product_variants_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_variants_product_id_talle_fkey";
            columns: ["product_id", "talle"];
            isOneToOne: false;
            referencedRelation: "product_sizes";
            referencedColumns: ["product_id", "talle"];
          },
        ];
      };
      products: {
        Row: {
          activo: boolean;
          category_id: string;
          created_at: string;
          deleted_at: string | null;
          descripcion: string;
          destacado: boolean;
          id: string;
          legacy_id: string | null;
          nombre: string;
          nuevo: boolean;
          precio: number;
          precio_oferta: number | null;
          slug: string;
          stock: number;
          tags: string[];
          tipo_variante: string;
          updated_at: string;
        };
        Insert: {
          activo?: boolean;
          category_id: string;
          created_at?: string;
          deleted_at?: string | null;
          descripcion?: string;
          destacado?: boolean;
          id?: string;
          legacy_id?: string | null;
          nombre: string;
          nuevo?: boolean;
          precio: number;
          precio_oferta?: number | null;
          slug: string;
          stock?: number;
          tags?: string[];
          tipo_variante?: string;
          updated_at?: string;
        };
        Update: {
          activo?: boolean;
          category_id?: string;
          created_at?: string;
          deleted_at?: string | null;
          descripcion?: string;
          destacado?: boolean;
          id?: string;
          legacy_id?: string | null;
          nombre?: string;
          nuevo?: boolean;
          precio?: number;
          precio_oferta?: number | null;
          slug?: string;
          stock?: number;
          tags?: string[];
          tipo_variante?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      store_settings: {
        Row: {
          id: number;
          instagram_url: string | null;
          updated_at: string;
          updated_by: string | null;
          whatsapp_group_url: string | null;
          whatsapp_number: string | null;
        };
        Insert: {
          id?: number;
          instagram_url?: string | null;
          updated_at?: string;
          updated_by?: string | null;
          whatsapp_group_url?: string | null;
          whatsapp_number?: string | null;
        };
        Update: {
          id?: number;
          instagram_url?: string | null;
          updated_at?: string;
          updated_by?: string | null;
          whatsapp_group_url?: string | null;
          whatsapp_number?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
