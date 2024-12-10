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
      contact_form_configs: {
        Row: {
          active: boolean | null
          created_at: string | null
          department: string
          email: string
          id: number
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          department: string
          email: string
          id?: number
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          department?: string
          email?: string
          id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      dental_specialties: {
        Row: {
          created_at: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          author: string | null
          category: string | null
          content: string
          created_at: string | null
          featured_home: boolean | null
          featured_image: string | null
          id: number
          published_at: string | null
          slug: string
          summary: string | null
          tags: string | null
          title: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          author?: string | null
          category?: string | null
          content: string
          created_at?: string | null
          featured_home?: boolean | null
          featured_image?: string | null
          id?: number
          published_at?: string | null
          slug: string
          summary?: string | null
          tags?: string | null
          title: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string
          created_at?: string | null
          featured_home?: boolean | null
          featured_image?: string | null
          id?: number
          published_at?: string | null
          slug?: string
          summary?: string | null
          tags?: string | null
          title?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: []
      }
      news_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      news_tags: {
        Row: {
          created_at: string | null
          id: number
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      news_tags_junction: {
        Row: {
          news_id: number
          tag_id: number
        }
        Insert: {
          news_id: number
          tag_id: number
        }
        Update: {
          news_id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "news_tags_junction_news_id_fkey"
            columns: ["news_id"]
            isOneToOne: false
            referencedRelation: "news"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_tags_junction_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "news_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          id: number
          order_id: number
          product_id: number
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          order_id: number
          product_id: number
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: number
          order_id?: number
          product_id?: number
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address: Json
          created_at: string | null
          estimated_delivery_date: string | null
          id: number
          notes: string | null
          payment_method: string
          payment_status: string
          shipping_address: Json
          shipping_fee: number
          status: string
          total_amount: number
          tracking_code: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          billing_address: Json
          created_at?: string | null
          estimated_delivery_date?: string | null
          id?: number
          notes?: string | null
          payment_method: string
          payment_status?: string
          shipping_address: Json
          shipping_fee: number
          status?: string
          total_amount: number
          tracking_code?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          billing_address?: Json
          created_at?: string | null
          estimated_delivery_date?: string | null
          id?: number
          notes?: string | null
          payment_method?: string
          payment_status?: string
          shipping_address?: Json
          shipping_fee?: number
          status?: string
          total_amount?: number
          tracking_code?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          certifications: string[] | null
          created_at: string | null
          documents: Json | null
          full_description: string | null
          gallery: string[] | null
          id: number
          main_image: string | null
          name: string
          price: number | null
          short_description: string | null
          slug: string
          stock: number | null
          technical_details: Json | null
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          certifications?: string[] | null
          created_at?: string | null
          documents?: Json | null
          full_description?: string | null
          gallery?: string[] | null
          id?: number
          main_image?: string | null
          name: string
          price?: number | null
          short_description?: string | null
          slug: string
          stock?: number | null
          technical_details?: Json | null
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          certifications?: string[] | null
          created_at?: string | null
          documents?: Json | null
          full_description?: string | null
          gallery?: string[] | null
          id?: number
          main_image?: string | null
          name?: string
          price?: number | null
          short_description?: string | null
          slug?: string
          stock?: number | null
          technical_details?: Json | null
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          billing_address: Json | null
          city: string | null
          clinic_name: string | null
          cnpj: string | null
          created_at: string | null
          cro: string
          full_name: string
          id: string
          neighborhood: string | null
          phone: string
          receive_news: boolean | null
          shipping_address: Json | null
          specialty: string
          state: string | null
          tax_id: string | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          billing_address?: Json | null
          city?: string | null
          clinic_name?: string | null
          cnpj?: string | null
          created_at?: string | null
          cro: string
          full_name: string
          id: string
          neighborhood?: string | null
          phone: string
          receive_news?: boolean | null
          shipping_address?: Json | null
          specialty?: string
          state?: string | null
          tax_id?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          billing_address?: Json | null
          city?: string | null
          clinic_name?: string | null
          cnpj?: string | null
          created_at?: string | null
          cro?: string
          full_name?: string
          id?: string
          neighborhood?: string | null
          phone?: string
          receive_news?: boolean | null
          shipping_address?: Json | null
          specialty?: string
          state?: string | null
          tax_id?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_specialty_fkey"
            columns: ["specialty"]
            isOneToOne: false
            referencedRelation: "dental_specialties"
            referencedColumns: ["name"]
          },
        ]
      }
      scientific_studies: {
        Row: {
          authors: string[] | null
          created_at: string | null
          description: string | null
          file_url: string
          id: number
          published_date: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          authors?: string[] | null
          created_at?: string | null
          description?: string | null
          file_url: string
          id?: number
          published_date?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          authors?: string[] | null
          created_at?: string | null
          description?: string | null
          file_url?: string
          id?: number
          published_date?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      shipping_rates: {
        Row: {
          created_at: string | null
          delivery_time_max: number
          delivery_time_min: number
          id: number
          price: number
          updated_at: string | null
          zip_code_end: string
          zip_code_start: string
        }
        Insert: {
          created_at?: string | null
          delivery_time_max: number
          delivery_time_min: number
          id?: number
          price: number
          updated_at?: string | null
          zip_code_end: string
          zip_code_start: string
        }
        Update: {
          created_at?: string | null
          delivery_time_max?: number
          delivery_time_min?: number
          id?: number
          price?: number
          updated_at?: string | null
          zip_code_end?: string
          zip_code_start?: string
        }
        Relationships: []
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
