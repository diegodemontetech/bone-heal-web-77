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
      automation_flows: {
        Row: {
          created_at: string | null
          description: string | null
          edges: Json | null
          id: string
          is_active: boolean | null
          name: string
          nodes: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          edges?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          nodes?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          edges?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          nodes?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      clientes_omie: {
        Row: {
          bairro: string | null
          cep: string | null
          cidade: string | null
          cnpj_cpf: string | null
          codigo_cliente_omie: string | null
          complemento: string | null
          created_at: string | null
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          nome_cliente: string | null
          numero: string | null
          telefone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          cnpj_cpf?: string | null
          codigo_cliente_omie?: string | null
          complemento?: string | null
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome_cliente?: string | null
          numero?: string | null
          telefone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          cnpj_cpf?: string | null
          codigo_cliente_omie?: string | null
          complemento?: string | null
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome_cliente?: string | null
          numero?: string | null
          telefone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      commercial_conditions: {
        Row: {
          created_at: string
          customer_group: string | null
          description: string | null
          discount_type: string
          discount_value: number
          free_shipping: boolean | null
          id: string
          is_active: boolean | null
          min_amount: number | null
          min_items: number | null
          name: string
          payment_method: string | null
          region: string | null
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          created_at?: string
          customer_group?: string | null
          description?: string | null
          discount_type: string
          discount_value: number
          free_shipping?: boolean | null
          id?: string
          is_active?: boolean | null
          min_amount?: number | null
          min_items?: number | null
          name: string
          payment_method?: string | null
          region?: string | null
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          created_at?: string
          customer_group?: string | null
          description?: string | null
          discount_type?: string
          discount_value?: number
          free_shipping?: boolean | null
          id?: string
          is_active?: boolean | null
          min_amount?: number | null
          min_items?: number | null
          name?: string
          payment_method?: string | null
          region?: string | null
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: []
      }
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
      crm_attachments: {
        Row: {
          contact_id: string
          created_at: string
          file_name: string
          file_type: string | null
          file_url: string
          id: string
          user_id: string | null
        }
        Insert: {
          contact_id: string
          created_at?: string
          file_name: string
          file_type?: string | null
          file_url: string
          id?: string
          user_id?: string | null
        }
        Update: {
          contact_id?: string
          created_at?: string
          file_name?: string
          file_type?: string | null
          file_url?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      crm_contacts: {
        Row: {
          address: string | null
          city: string | null
          client_type: string | null
          clinic_name: string | null
          cpf_cnpj: string | null
          created_at: string
          cro: string | null
          email: string | null
          full_name: string
          id: string
          last_interaction: string | null
          next_interaction_date: string | null
          next_steps: string | null
          observations: string | null
          pipeline_id: string | null
          responsible_id: string | null
          specialty: string | null
          stage_id: string | null
          state: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          client_type?: string | null
          clinic_name?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          cro?: string | null
          email?: string | null
          full_name: string
          id?: string
          last_interaction?: string | null
          next_interaction_date?: string | null
          next_steps?: string | null
          observations?: string | null
          pipeline_id?: string | null
          responsible_id?: string | null
          specialty?: string | null
          stage_id?: string | null
          state?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          client_type?: string | null
          clinic_name?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          cro?: string | null
          email?: string | null
          full_name?: string
          id?: string
          last_interaction?: string | null
          next_interaction_date?: string | null
          next_steps?: string | null
          observations?: string | null
          pipeline_id?: string | null
          responsible_id?: string | null
          specialty?: string | null
          stage_id?: string | null
          state?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_contacts_pipeline_id_fkey"
            columns: ["pipeline_id"]
            isOneToOne: false
            referencedRelation: "crm_pipelines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_contacts_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "crm_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_departments: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      crm_fields: {
        Row: {
          created_at: string
          default_value: string | null
          display_in_kanban: boolean
          id: string
          label: string
          mask: string | null
          name: string
          options: string[] | null
          required: boolean
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_value?: string | null
          display_in_kanban?: boolean
          id?: string
          label: string
          mask?: string | null
          name: string
          options?: string[] | null
          required?: boolean
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_value?: string | null
          display_in_kanban?: boolean
          id?: string
          label?: string
          mask?: string | null
          name?: string
          options?: string[] | null
          required?: boolean
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      crm_form_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          pipeline_id: string | null
          redirect_url: string | null
          success_message: string | null
          theme_color: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          pipeline_id?: string | null
          redirect_url?: string | null
          success_message?: string | null
          theme_color?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          pipeline_id?: string | null
          redirect_url?: string | null
          success_message?: string | null
          theme_color?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_form_settings_pipeline_id_fkey"
            columns: ["pipeline_id"]
            isOneToOne: false
            referencedRelation: "crm_pipelines"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_interactions: {
        Row: {
          contact_id: string
          content: string
          created_at: string
          id: string
          interaction_date: string
          interaction_type: string
          user_id: string | null
        }
        Insert: {
          contact_id: string
          content: string
          created_at?: string
          id?: string
          interaction_date?: string
          interaction_type: string
          user_id?: string | null
        }
        Update: {
          contact_id?: string
          content?: string
          created_at?: string
          id?: string
          interaction_date?: string
          interaction_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      crm_pipeline_permissions: {
        Row: {
          created_at: string | null
          id: string
          permission: string
          pipeline_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission: string
          pipeline_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          permission?: string
          pipeline_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_pipeline_permissions_pipeline_id_fkey"
            columns: ["pipeline_id"]
            isOneToOne: false
            referencedRelation: "crm_pipelines"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_pipelines: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          form_url: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          form_url?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          form_url?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      crm_stage_automations: {
        Row: {
          action_data: Json
          action_type: string
          created_at: string
          hours_trigger: number | null
          id: string
          is_active: boolean
          next_stage: string | null
          stage: string
          updated_at: string
        }
        Insert: {
          action_data: Json
          action_type: string
          created_at?: string
          hours_trigger?: number | null
          id?: string
          is_active?: boolean
          next_stage?: string | null
          stage: string
          updated_at?: string
        }
        Update: {
          action_data?: Json
          action_type?: string
          created_at?: string
          hours_trigger?: number | null
          id?: string
          is_active?: boolean
          next_stage?: string | null
          stage?: string
          updated_at?: string
        }
        Relationships: []
      }
      crm_stages: {
        Row: {
          color: string
          created_at: string
          department_id: string | null
          id: string
          name: string
          order: number
          order_index: number | null
          pipeline_id: string | null
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          department_id?: string | null
          id?: string
          name: string
          order?: number
          order_index?: number | null
          pipeline_id?: string | null
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          department_id?: string | null
          id?: string
          name?: string
          order?: number
          order_index?: number | null
          pipeline_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_stages_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "crm_departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_stages_pipeline_id_fkey"
            columns: ["pipeline_id"]
            isOneToOne: false
            referencedRelation: "crm_pipelines"
            referencedColumns: ["id"]
          },
        ]
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
          id: number
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
          id: number
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
      leads: {
        Row: {
          assigned_to: string | null
          created_at: string
          email: string | null
          id: string
          last_contact: string
          name: string | null
          needs_human: boolean
          notes: string | null
          phone: string
          source: string
          stage: string
          status: string
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          email?: string | null
          id?: string
          last_contact?: string
          name?: string | null
          needs_human?: boolean
          notes?: string | null
          phone: string
          source?: string
          stage?: string
          status?: string
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          email?: string | null
          id?: string
          last_contact?: string
          name?: string | null
          needs_human?: boolean
          notes?: string | null
          phone?: string
          source?: string
          stage?: string
          status?: string
          tags?: string[] | null
          updated_at?: string
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
      notification_settings: {
        Row: {
          browser_notifications: boolean
          created_at: string | null
          email_notifications: boolean
          id: string
          new_tickets: boolean
          sla_alerts: boolean
          system_updates: boolean
          ticket_updates: boolean
          user_id: string
        }
        Insert: {
          browser_notifications?: boolean
          created_at?: string | null
          email_notifications?: boolean
          id?: string
          new_tickets?: boolean
          sla_alerts?: boolean
          system_updates?: boolean
          ticket_updates?: boolean
          user_id: string
        }
        Update: {
          browser_notifications?: boolean
          created_at?: string | null
          email_notifications?: boolean
          id?: string
          new_tickets?: boolean
          sla_alerts?: boolean
          system_updates?: boolean
          ticket_updates?: boolean
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          content: string
          created_at: string
          id: string
          link: string | null
          message: string | null
          read: boolean | null
          read_at: string | null
          status: string
          title: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          link?: string | null
          message?: string | null
          read?: boolean | null
          read_at?: string | null
          status?: string
          title?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          link?: string | null
          message?: string | null
          read?: boolean | null
          read_at?: string | null
          status?: string
          title?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      omie_cities: {
        Row: {
          created_at: string | null
          ibge_code: string | null
          id: number
          name: string
          omie_code: string
          state: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          ibge_code?: string | null
          id?: number
          name: string
          omie_code: string
          state: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          ibge_code?: string | null
          id?: number
          name?: string
          omie_code?: string
          state?: string
          updated_at?: string | null
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
      pedidos_omie: {
        Row: {
          cliente_id: string | null
          cnpj_cpf: string | null
          codigo_produto: string | null
          created_at: string | null
          data_emissao: string | null
          Desconto: string | null
          Frete: string | null
          id: string
          nome_fantasia: string | null
          numero_nota_fiscal: number | null
          Operação: string | null
          outras_despesas: string | null
          quantidade_total: number | null
          razao_social: string | null
          Seguro: string | null
          Situação: string | null
          "Total da Nota Fiscal": number | null
          total_mercadoria: string | null
          updated_at: string | null
          valor_icms_st: string | null
          valor_ipi: string | null
        }
        Insert: {
          cliente_id?: string | null
          cnpj_cpf?: string | null
          codigo_produto?: string | null
          created_at?: string | null
          data_emissao?: string | null
          Desconto?: string | null
          Frete?: string | null
          id?: string
          nome_fantasia?: string | null
          numero_nota_fiscal?: number | null
          Operação?: string | null
          outras_despesas?: string | null
          quantidade_total?: number | null
          razao_social?: string | null
          Seguro?: string | null
          Situação?: string | null
          "Total da Nota Fiscal"?: number | null
          total_mercadoria?: string | null
          updated_at?: string | null
          valor_icms_st?: string | null
          valor_ipi?: string | null
        }
        Update: {
          cliente_id?: string | null
          cnpj_cpf?: string | null
          codigo_produto?: string | null
          created_at?: string | null
          data_emissao?: string | null
          Desconto?: string | null
          Frete?: string | null
          id?: string
          nome_fantasia?: string | null
          numero_nota_fiscal?: number | null
          Operação?: string | null
          outras_despesas?: string | null
          quantidade_total?: number | null
          razao_social?: string | null
          Seguro?: string | null
          Situação?: string | null
          "Total da Nota Fiscal"?: number | null
          total_mercadoria?: string | null
          updated_at?: string | null
          valor_icms_st?: string | null
          valor_ipi?: string | null
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          created_at: string | null
          department_id: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department_id?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department_id?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "product_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      product_departments: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
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
      product_subcategories: {
        Row: {
          category_id: string | null
          created_at: string | null
          default_fields: Json | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          default_fields?: Json | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          default_fields?: Json | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          category_id: string | null
          created_at: string
          default_image_url: string | null
          department_id: string | null
          description: string | null
          full_description: string | null
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
          subcategory_id: string | null
          technical_details: Json | null
          updated_at: string
          video_url: string | null
          weight: number | null
          width: number | null
        }
        Insert: {
          active?: boolean | null
          category_id?: string | null
          created_at?: string
          default_image_url?: string | null
          department_id?: string | null
          description?: string | null
          full_description?: string | null
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
          subcategory_id?: string | null
          technical_details?: Json | null
          updated_at?: string
          video_url?: string | null
          weight?: number | null
          width?: number | null
        }
        Update: {
          active?: boolean | null
          category_id?: string | null
          created_at?: string
          default_image_url?: string | null
          department_id?: string | null
          description?: string | null
          full_description?: string | null
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
          subcategory_id?: string | null
          technical_details?: Json | null
          updated_at?: string
          video_url?: string | null
          weight?: number | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "product_departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "product_subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          bloqueado: boolean | null
          cidade_codigo: string | null
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
          nome_fantasia: string | null
          omie_code: string | null
          omie_sync: boolean | null
          optante_simples_nacional: boolean | null
          pessoa_fisica: boolean | null
          phone: string | null
          razao_social: string | null
          receive_news: boolean | null
          role: string | null
          specialty: string | null
          state: string | null
          telefone1_ddd: string | null
          telefone1_numero: string | null
          tipo_atividade: string | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          bloqueado?: boolean | null
          cidade_codigo?: string | null
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
          nome_fantasia?: string | null
          omie_code?: string | null
          omie_sync?: boolean | null
          optante_simples_nacional?: boolean | null
          pessoa_fisica?: boolean | null
          phone?: string | null
          razao_social?: string | null
          receive_news?: boolean | null
          role?: string | null
          specialty?: string | null
          state?: string | null
          telefone1_ddd?: string | null
          telefone1_numero?: string | null
          tipo_atividade?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          bloqueado?: boolean | null
          cidade_codigo?: string | null
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
          nome_fantasia?: string | null
          omie_code?: string | null
          omie_sync?: boolean | null
          optante_simples_nacional?: boolean | null
          pessoa_fisica?: boolean | null
          phone?: string | null
          razao_social?: string | null
          receive_news?: boolean | null
          role?: string | null
          specialty?: string | null
          state?: string | null
          telefone1_ddd?: string | null
          telefone1_numero?: string | null
          tipo_atividade?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      quotations: {
        Row: {
          created_at: string
          customer_info: Json | null
          discount_amount: number | null
          discount_type: string | null
          id: string
          items: Json | null
          notes: string | null
          payment_method: string | null
          sent_by_email: boolean | null
          shipping_info: Json | null
          status: string
          subtotal_amount: number
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          customer_info?: Json | null
          discount_amount?: number | null
          discount_type?: string | null
          id?: string
          items?: Json | null
          notes?: string | null
          payment_method?: string | null
          sent_by_email?: boolean | null
          shipping_info?: Json | null
          status?: string
          subtotal_amount: number
          total_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          customer_info?: Json | null
          discount_amount?: number | null
          discount_type?: string | null
          id?: string
          items?: Json | null
          notes?: string | null
          payment_method?: string | null
          sent_by_email?: boolean | null
          shipping_info?: Json | null
          status?: string
          subtotal_amount?: number
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          additional_kg_rate: number | null
          created_at: string
          delivery_days: number
          estimated_days: number | null
          flat_rate: number | null
          id: string
          insurance_percentage: number
          is_active: boolean | null
          price_per_kg: number
          rate: number
          region: string | null
          region_type: string
          service_type: string
          state: string
          updated_at: string
          zip_code_end: string | null
          zip_code_start: string | null
        }
        Insert: {
          additional_kg_price?: number
          additional_kg_rate?: number | null
          created_at?: string
          delivery_days?: number
          estimated_days?: number | null
          flat_rate?: number | null
          id?: string
          insurance_percentage?: number
          is_active?: boolean | null
          price_per_kg?: number
          rate: number
          region?: string | null
          region_type?: string
          service_type?: string
          state: string
          updated_at?: string
          zip_code_end?: string | null
          zip_code_start?: string | null
        }
        Update: {
          additional_kg_price?: number
          additional_kg_rate?: number | null
          created_at?: string
          delivery_days?: number
          estimated_days?: number | null
          flat_rate?: number | null
          id?: string
          insurance_percentage?: number
          is_active?: boolean | null
          price_per_kg?: number
          rate?: number
          region?: string | null
          region_type?: string
          service_type?: string
          state?: string
          updated_at?: string
          zip_code_end?: string | null
          zip_code_start?: string | null
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          category: string
          created_at: string
          customer_id: string
          description: string
          id: string
          priority: string
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string
          created_at?: string
          customer_id: string
          description: string
          id?: string
          priority?: string
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          category?: string
          created_at?: string
          customer_id?: string
          description?: string
          id?: string
          priority?: string
          status?: string
          subject?: string
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
      ticket_messages: {
        Row: {
          created_at: string
          id: string
          is_from_customer: boolean
          message: string
          sender_id: string
          ticket_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_from_customer?: boolean
          message: string
          sender_id: string
          ticket_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_from_customer?: boolean
          message?: string
          sender_id?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_permissions: {
        Row: {
          created_at: string
          id: string
          permission: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          permission: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          permission?: string
          user_id?: string | null
        }
        Relationships: []
      }
      vouchers: {
        Row: {
          code: string
          created_at: string | null
          current_uses: number | null
          discount_amount: number
          discount_type: string
          id: string
          is_active: boolean | null
          max_uses: number | null
          min_amount: number | null
          min_items: number | null
          payment_method: string | null
          updated_at: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          current_uses?: number | null
          discount_amount: number
          discount_type: string
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_amount?: number | null
          min_items?: number | null
          payment_method?: string | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          current_uses?: number | null
          discount_amount?: number
          discount_type?: string
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_amount?: number | null
          min_items?: number | null
          payment_method?: string | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      whatsapp_instances: {
        Row: {
          created_at: string
          id: string
          instance_name: string
          qr_code: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          instance_name: string
          qr_code?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          instance_name?: string
          qr_code?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_messages: {
        Row: {
          created_at: string
          direction: string
          id: string
          instance_id: string | null
          is_bot: boolean
          lead_id: string
          media_type: string | null
          media_url: string | null
          message: string
          sender_id: string | null
        }
        Insert: {
          created_at?: string
          direction: string
          id?: string
          instance_id?: string | null
          is_bot?: boolean
          lead_id: string
          media_type?: string | null
          media_url?: string | null
          message: string
          sender_id?: string | null
        }
        Update: {
          created_at?: string
          direction?: string
          id?: string
          instance_id?: string | null
          is_bot?: boolean
          lead_id?: string
          media_type?: string | null
          media_url?: string | null
          message?: string
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_messages_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
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
      workflow_execution_logs: {
        Row: {
          data: Json | null
          execution_id: string
          id: string
          node_id: string
          status: string
          timestamp: string | null
        }
        Insert: {
          data?: Json | null
          execution_id: string
          id?: string
          node_id: string
          status: string
          timestamp?: string | null
        }
        Update: {
          data?: Json | null
          execution_id?: string
          id?: string
          node_id?: string
          status?: string
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_execution_logs_execution_id_fkey"
            columns: ["execution_id"]
            isOneToOne: false
            referencedRelation: "workflow_executions"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_executions: {
        Row: {
          completed_at: string | null
          created_at: string | null
          flow_id: string
          id: string
          result: Json | null
          started_at: string | null
          status: string
          trigger_data: Json | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          flow_id: string
          id?: string
          result?: Json | null
          started_at?: string | null
          status?: string
          trigger_data?: Json | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          flow_id?: string
          id?: string
          result?: Json | null
          started_at?: string | null
          status?: string
          trigger_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_executions_flow_id_fkey"
            columns: ["flow_id"]
            isOneToOne: false
            referencedRelation: "automation_flows"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_view_profile: {
        Args: {
          profile_id: string
        }
        Returns: boolean
      }
      generate_default_password: {
        Args: {
          document: string
        }
        Returns: string
      }
      gerar_usuarios_a_partir_de_pedidos: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_user_admin_status: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      get_user_profile_by_id: {
        Args: {
          user_id: string
        }
        Returns: Json
      }
      version: {
        Args: Record<PropertyKey, never>
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
