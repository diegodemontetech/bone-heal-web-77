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
          created_at: string
          department: string
          email: string
          id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          department: string
          email: string
          id?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          department?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      contact_leads: {
        Row: {
          created_at: string
          id: string
          name: string
          phone: string
          reason: string | null
          source: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          phone: string
          reason?: string | null
          source?: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          phone?: string
          reason?: string | null
          source?: string
          status?: string
        }
        Relationships: []
      }
      dental_specialties: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          body: string
          error_message: string | null
          id: string
          recipient_email: string
          recipient_name: string | null
          sent_at: string
          status: string
          subject: string
          template_id: string | null
          variables_used: Json | null
        }
        Insert: {
          body: string
          error_message?: string | null
          id?: string
          recipient_email: string
          recipient_name?: string | null
          sent_at?: string
          status: string
          subject: string
          template_id?: string | null
          variables_used?: Json | null
        }
        Update: {
          body?: string
          error_message?: string | null
          id?: string
          recipient_email?: string
          recipient_name?: string | null
          sent_at?: string
          status?: string
          subject?: string
          template_id?: string | null
          variables_used?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          active: boolean | null
          auto_send: boolean | null
          body: string
          created_at: string
          event_type: string
          id: string
          name: string
          subject: string
          trigger_event: string | null
          updated_at: string
          variables: Json | null
        }
        Insert: {
          active?: boolean | null
          auto_send?: boolean | null
          body: string
          created_at?: string
          event_type: string
          id?: string
          name: string
          subject: string
          trigger_event?: string | null
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          active?: boolean | null
          auto_send?: boolean | null
          body?: string
          created_at?: string
          event_type?: string
          id?: string
          name?: string
          subject?: string
          trigger_event?: string | null
          updated_at?: string
          variables?: Json | null
        }
        Relationships: []
      }
      ibge_cities: {
        Row: {
          ibge_code: string
          id: number
          name: string
          state_id: number | null
        }
        Insert: {
          ibge_code: string
          id?: number
          name: string
          state_id?: number | null
        }
        Update: {
          ibge_code?: string
          id?: number
          name?: string
          state_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ibge_cities_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "ibge_states"
            referencedColumns: ["id"]
          },
        ]
      }
      ibge_states: {
        Row: {
          ibge_code: string
          id: number
          name: string
          uf: string
        }
        Insert: {
          ibge_code: string
          id?: number
          name: string
          uf: string
        }
        Update: {
          ibge_code?: string
          id?: number
          name?: string
          uf?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          author: string | null
          category: string | null
          content: string | null
          created_at: string
          featured_image: string | null
          id: string
          published_at: string
          slug: string
          summary: string | null
          tags: string | null
          title: string
          views: number | null
        }
        Insert: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          featured_image?: string | null
          id?: string
          published_at?: string
          slug: string
          summary?: string | null
          tags?: string | null
          title: string
          views?: number | null
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          featured_image?: string | null
          id?: string
          published_at?: string
          slug?: string
          summary?: string | null
          tags?: string | null
          title?: string
          views?: number | null
        }
        Relationships: []
      }
      news_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          discount: number
          id: string
          installments: number | null
          items: Json | null
          mp_preference_id: string | null
          omie_invoice_date: string | null
          omie_invoice_key: string | null
          omie_invoice_number: string | null
          omie_last_sync_attempt: string | null
          omie_last_update: string | null
          omie_order_id: string | null
          omie_shipping_code: string | null
          omie_shipping_company: string | null
          omie_status: string | null
          omie_sync_errors: Json | null
          omie_tracking_code: string | null
          payment_method: string | null
          shipping_address: Json | null
          shipping_fee: number
          status: string
          subtotal: number
          total_amount: number
          updated_at: string
          user_id: string | null
          voucher_id: string | null
        }
        Insert: {
          created_at?: string
          discount?: number
          id?: string
          installments?: number | null
          items?: Json | null
          mp_preference_id?: string | null
          omie_invoice_date?: string | null
          omie_invoice_key?: string | null
          omie_invoice_number?: string | null
          omie_last_sync_attempt?: string | null
          omie_last_update?: string | null
          omie_order_id?: string | null
          omie_shipping_code?: string | null
          omie_shipping_company?: string | null
          omie_status?: string | null
          omie_sync_errors?: Json | null
          omie_tracking_code?: string | null
          payment_method?: string | null
          shipping_address?: Json | null
          shipping_fee?: number
          status?: string
          subtotal?: number
          total_amount: number
          updated_at?: string
          user_id?: string | null
          voucher_id?: string | null
        }
        Update: {
          created_at?: string
          discount?: number
          id?: string
          installments?: number | null
          items?: Json | null
          mp_preference_id?: string | null
          omie_invoice_date?: string | null
          omie_invoice_key?: string | null
          omie_invoice_number?: string | null
          omie_last_sync_attempt?: string | null
          omie_last_update?: string | null
          omie_order_id?: string | null
          omie_shipping_code?: string | null
          omie_shipping_company?: string | null
          omie_status?: string | null
          omie_sync_errors?: Json | null
          omie_tracking_code?: string | null
          payment_method?: string | null
          shipping_address?: Json | null
          shipping_fee?: number
          status?: string
          subtotal?: number
          total_amount?: number
          updated_at?: string
          user_id?: string | null
          voucher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_voucher_id_fkey"
            columns: ["voucher_id"]
            isOneToOne: false
            referencedRelation: "vouchers"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_gateway_configs: {
        Row: {
          config: Json
          created_at: string
          gateway: string
          id: string
          is_active: boolean | null
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          gateway: string
          id?: string
          is_active?: boolean | null
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          gateway?: string
          id?: string
          is_active?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          boleto_url: string | null
          created_at: string
          external_id: string | null
          id: string
          mercadopago_payment_id: string | null
          mercadopago_payment_type: string | null
          mercadopago_status: string | null
          order_id: string
          paid_at: string | null
          payment_method: string
          pix_code: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          boleto_url?: string | null
          created_at?: string
          external_id?: string | null
          id?: string
          mercadopago_payment_id?: string | null
          mercadopago_payment_type?: string | null
          mercadopago_status?: string | null
          order_id: string
          paid_at?: string | null
          payment_method: string
          pix_code?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          boleto_url?: string | null
          created_at?: string
          external_id?: string | null
          id?: string
          mercadopago_payment_id?: string | null
          mercadopago_payment_type?: string | null
          mercadopago_status?: string | null
          order_id?: string
          paid_at?: string | null
          payment_method?: string
          pix_code?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      product_reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          product_id: string
          rating: number
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          product_id: string
          rating: number
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          product_id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          created_at: string
          default_image_url: string | null
          description: string | null
          gallery: string[] | null
          height: number | null
          id: string
          length: number | null
          main_image: string | null
          name: string
          omie_code: string | null
          omie_last_update: string | null
          omie_sync: boolean | null
          price: number | null
          short_description: string | null
          slug: string
          technical_details: Json | null
          updated_at: string
          video_url: string | null
          weight: number | null
          width: number | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          default_image_url?: string | null
          description?: string | null
          gallery?: string[] | null
          height?: number | null
          id?: string
          length?: number | null
          main_image?: string | null
          name: string
          omie_code?: string | null
          omie_last_update?: string | null
          omie_sync?: boolean | null
          price?: number | null
          short_description?: string | null
          slug: string
          technical_details?: Json | null
          updated_at?: string
          video_url?: string | null
          weight?: number | null
          width?: number | null
        }
        Update: {
          active?: boolean | null
          created_at?: string
          default_image_url?: string | null
          description?: string | null
          gallery?: string[] | null
          height?: number | null
          id?: string
          length?: number | null
          main_image?: string | null
          name?: string
          omie_code?: string | null
          omie_last_update?: string | null
          omie_sync?: boolean | null
          price?: number | null
          short_description?: string | null
          slug?: string
          technical_details?: Json | null
          updated_at?: string
          video_url?: string | null
          weight?: number | null
          width?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          bloqueado: boolean | null
          cidade_ibge: string | null
          city: string | null
          cnpj: string | null
          complemento: string | null
          contribuinte: string | null
          cpf: string | null
          created_at: string
          crm: string | null
          cro: string | null
          email: string | null
          endereco_numero: string | null
          estado_ibge: string | null
          exterior: boolean | null
          full_name: string | null
          id: string
          inativo: boolean | null
          is_admin: boolean | null
          neighborhood: string | null
          omie_code: string | null
          omie_sync: boolean | null
          optante_simples_nacional: boolean | null
          pessoa_fisica: boolean | null
          phone: string | null
          receive_news: boolean | null
          specialty: string | null
          state: string | null
          tipo_atividade: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          bloqueado?: boolean | null
          cidade_ibge?: string | null
          city?: string | null
          cnpj?: string | null
          complemento?: string | null
          contribuinte?: string | null
          cpf?: string | null
          created_at?: string
          crm?: string | null
          cro?: string | null
          email?: string | null
          endereco_numero?: string | null
          estado_ibge?: string | null
          exterior?: boolean | null
          full_name?: string | null
          id: string
          inativo?: boolean | null
          is_admin?: boolean | null
          neighborhood?: string | null
          omie_code?: string | null
          omie_sync?: boolean | null
          optante_simples_nacional?: boolean | null
          pessoa_fisica?: boolean | null
          phone?: string | null
          receive_news?: boolean | null
          specialty?: string | null
          state?: string | null
          tipo_atividade?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          bloqueado?: boolean | null
          cidade_ibge?: string | null
          city?: string | null
          cnpj?: string | null
          complemento?: string | null
          contribuinte?: string | null
          cpf?: string | null
          created_at?: string
          crm?: string | null
          cro?: string | null
          email?: string | null
          endereco_numero?: string | null
          estado_ibge?: string | null
          exterior?: boolean | null
          full_name?: string | null
          id?: string
          inativo?: boolean | null
          is_admin?: boolean | null
          neighborhood?: string | null
          omie_code?: string | null
          omie_sync?: boolean | null
          optante_simples_nacional?: boolean | null
          pessoa_fisica?: boolean | null
          phone?: string | null
          receive_news?: boolean | null
          specialty?: string | null
          state?: string | null
          tipo_atividade?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      scientific_studies: {
        Row: {
          created_at: string
          description: string | null
          file_url: string | null
          id: string
          published_date: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          published_date: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          published_date?: string
          title?: string
        }
        Relationships: []
      }
      shipping_configs: {
        Row: {
          active: boolean | null
          carrier: string
          created_at: string
          id: string
          omie_carrier_code: string | null
          omie_service_code: string | null
          settings: Json | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          carrier: string
          created_at?: string
          id?: string
          omie_carrier_code?: string | null
          omie_service_code?: string | null
          settings?: Json | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          carrier?: string
          created_at?: string
          id?: string
          omie_carrier_code?: string | null
          omie_service_code?: string | null
          settings?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      shipping_rates: {
        Row: {
          additional_kg_price: number
          created_at: string
          delivery_days: number
          id: string
          insurance_percentage: number
          price_per_kg: number
          rate: number
          service_type: string
          state: string
          updated_at: string
        }
        Insert: {
          additional_kg_price?: number
          created_at?: string
          delivery_days?: number
          id?: string
          insurance_percentage?: number
          price_per_kg?: number
          rate: number
          service_type?: string
          state: string
          updated_at?: string
        }
        Update: {
          additional_kg_price?: number
          created_at?: string
          delivery_days?: number
          id?: string
          insurance_percentage?: number
          price_per_kg?: number
          rate?: number
          service_type?: string
          state?: string
          updated_at?: string
        }
        Relationships: []
      }
      sync_progress: {
        Row: {
          created_at: string
          id: string
          last_processed_code: number | null
          stats: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          last_processed_code?: number | null
          stats?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_processed_code?: number | null
          stats?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      vouchers: {
        Row: {
          code: string
          created_at: string | null
          current_uses: number | null
          discount_type: string
          discount_value: number
          id: string
          max_uses: number | null
          updated_at: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          current_uses?: number | null
          discount_type: string
          discount_value: number
          id?: string
          max_uses?: number | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          current_uses?: number | null
          discount_type?: string
          discount_value?: number
          id?: string
          max_uses?: number | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      whatsapp_messages_config: {
        Row: {
          active: boolean | null
          agent_name: string | null
          agent_photo: string | null
          created_at: string
          id: string
          message_key: string
          message_text: string
          message_type: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          agent_name?: string | null
          agent_photo?: string | null
          created_at?: string
          id?: string
          message_key: string
          message_text: string
          message_type?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          agent_name?: string | null
          agent_photo?: string | null
          created_at?: string
          id?: string
          message_key?: string
          message_text?: string
          message_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_default_password: {
        Args: {
          document: string
        }
        Returns: string
      }
    }
    Enums: {
      payment_method_type: "credit_card" | "pix" | "boleto"
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
