export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          company_id: number
          created_at: string | null
          name: string | null
          notification_email: string | null
        }
        Insert: {
          company_id: number
          created_at?: string | null
          name?: string | null
          notification_email?: string | null
        }
        Update: {
          company_id?: number
          created_at?: string | null
          name?: string | null
          notification_email?: string | null
        }
        Relationships: []
      }
      company_product_supplier_info: {
        Row: {
          company_id: number | null
          discount: number | null
          id_transaction: number
          is_last_used: boolean | null
          last_purchase_date: string | null
          price_paid: number | null
          product_id: number | null
          quantity: number | null
          supplier_id: number | null
          unit_price: number | null
        }
        Insert: {
          company_id?: number | null
          discount?: number | null
          id_transaction: number
          is_last_used?: boolean | null
          last_purchase_date?: string | null
          price_paid?: number | null
          product_id?: number | null
          quantity?: number | null
          supplier_id?: number | null
          unit_price?: number | null
        }
        Update: {
          company_id?: number | null
          discount?: number | null
          id_transaction?: number
          is_last_used?: boolean | null
          last_purchase_date?: string | null
          price_paid?: number | null
          product_id?: number | null
          quantity?: number | null
          supplier_id?: number | null
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "company_product_supplier_info_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "company_product_supplier_info_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "company_product_supplier_info_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["supplier_id"]
          },
        ]
      }
      company_supplier_relationships: {
        Row: {
          company_id: number | null
          created_at: string | null
          notes: string | null
          relationship_id: string
          relationship_type: string | null
          supplier_id: string | null
        }
        Insert: {
          company_id?: number | null
          created_at?: string | null
          notes?: string | null
          relationship_id: string
          relationship_type?: string | null
          supplier_id?: string | null
        }
        Update: {
          company_id?: number | null
          created_at?: string | null
          notes?: string | null
          relationship_id?: string
          relationship_type?: string | null
          supplier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_supplier_relationships_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
        ]
      }
      products: {
        Row: {
          company_id: number | null
          created_at: string | null
          current_stock: number | null
          description: string | null
          name: string | null
          needs_reorder_flag: boolean | null
          predicted_days_left: number | null
          product_id: number
          reorder_threshold_days: number | null
          sku: string | null
          unit_of_measure: string | null
          updated_at: string | null
        }
        Insert: {
          company_id?: number | null
          created_at?: string | null
          current_stock?: number | null
          description?: string | null
          name?: string | null
          needs_reorder_flag?: boolean | null
          predicted_days_left?: number | null
          product_id: number
          reorder_threshold_days?: number | null
          sku?: string | null
          unit_of_measure?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: number | null
          created_at?: string | null
          current_stock?: number | null
          description?: string | null
          name?: string | null
          needs_reorder_flag?: boolean | null
          predicted_days_left?: number | null
          product_id?: number
          reorder_threshold_days?: number | null
          sku?: string | null
          unit_of_measure?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
        ]
      }
      stock_movements: {
        Row: {
          created_at: string | null
          movement_id: string
          movement_type: string | null
          product_id: string
          quantity: number | null
          supplier_id: string | null
          update_type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          movement_id: string
          movement_type?: string | null
          product_id: string
          quantity?: number | null
          supplier_id?: string | null
          update_type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          movement_id?: string
          movement_type?: string | null
          product_id?: string
          quantity?: number | null
          supplier_id?: string | null
          update_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          name: string
          phone: string | null
          source: string | null
          supplier_id: number
          type: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          name: string
          phone?: string | null
          source?: string | null
          supplier_id: number
          type?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          name?: string
          phone?: string | null
          source?: string | null
          supplier_id?: number
          type?: string | null
          website?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          company_id: number
          created_at: string | null
          email: string | null
          password: string | null
          user_id: number
        }
        Insert: {
          company_id: number
          created_at?: string | null
          email?: string | null
          password?: string | null
          user_id: number
        }
        Update: {
          company_id?: number
          created_at?: string | null
          email?: string | null
          password?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
