export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      estimate_factor_options: {
        Row: {
          benefits: string
          drawbacks: string
          factor_id: string
          id: string
          is_default: boolean
          label: string
          multiplier: number
          sort: number
          value: number | null
        }
        Insert: {
          benefits?: string
          drawbacks?: string
          factor_id: string
          id?: string
          is_default?: boolean
          label: string
          multiplier?: number
          sort?: number
          value?: number | null
        }
        Update: {
          benefits?: string
          drawbacks?: string
          factor_id?: string
          id?: string
          is_default?: boolean
          label?: string
          multiplier?: number
          sort?: number
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "estimate_factor_options_factor_id_fkey"
            columns: ["factor_id"]
            isOneToOne: false
            referencedRelation: "estimate_factors"
            referencedColumns: ["id"]
          },
        ]
      }
      estimate_factors: {
        Row: {
          applies_to: string[]
          help: string
          id: string
          key: string
          label: string
          sort: number
        }
        Insert: {
          applies_to?: string[]
          help?: string
          id?: string
          key: string
          label: string
          sort?: number
        }
        Update: {
          applies_to?: string[]
          help?: string
          id?: string
          key?: string
          label?: string
          sort?: number
        }
        Relationships: []
      }
      estimate_items: {
        Row: {
          active: boolean
          basis: string
          benefits: string
          category: string
          created_at: string
          description: string | null
          drawbacks: string
          id: string
          is_default: boolean
          name: string
          option_group: string | null
          quantity: number
          rate: number
          scope: string
          sort: number
          unit: string
        }
        Insert: {
          active?: boolean
          basis?: string
          benefits?: string
          category: string
          created_at?: string
          description?: string | null
          drawbacks?: string
          id?: string
          is_default?: boolean
          name: string
          option_group?: string | null
          quantity?: number
          rate?: number
          scope?: string
          sort?: number
          unit: string
        }
        Update: {
          active?: boolean
          basis?: string
          benefits?: string
          category?: string
          created_at?: string
          description?: string | null
          drawbacks?: string
          id?: string
          is_default?: boolean
          name?: string
          option_group?: string | null
          quantity?: number
          rate?: number
          scope?: string
          sort?: number
          unit?: string
        }
        Relationships: []
      }
      estimate_links: {
        Row: {
          client_email: string | null
          client_name: string
          client_phone: string | null
          created_at: string
          created_by: string | null
          expires_at: string
          id: string
          note: string | null
          revoked: boolean
          token: string
        }
        Insert: {
          client_email?: string | null
          client_name: string
          client_phone?: string | null
          created_at?: string
          created_by?: string | null
          expires_at: string
          id?: string
          note?: string | null
          revoked?: boolean
          token?: string
        }
        Update: {
          client_email?: string | null
          client_name?: string
          client_phone?: string | null
          created_at?: string
          created_by?: string | null
          expires_at?: string
          id?: string
          note?: string | null
          revoked?: boolean
          token?: string
        }
        Relationships: []
      }
      estimate_settings: {
        Row: {
          contingency_pct: number
          default_expiry_days: number
          floor_factor: number
          gst_pct: number
          id: number
          location_factors: Json
        }
        Insert: {
          contingency_pct?: number
          default_expiry_days?: number
          floor_factor?: number
          gst_pct?: number
          id?: number
          location_factors?: Json
        }
        Update: {
          contingency_pct?: number
          default_expiry_days?: number
          floor_factor?: number
          gst_pct?: number
          id?: number
          location_factors?: Json
        }
        Relationships: []
      }
      estimate_submissions: {
        Row: {
          created_at: string
          id: string
          inputs: Json
          lines: Json
          link_id: string
          total: number
        }
        Insert: {
          created_at?: string
          id?: string
          inputs: Json
          lines: Json
          link_id: string
          total: number
        }
        Update: {
          created_at?: string
          id?: string
          inputs?: Json
          lines?: Json
          link_id?: string
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "estimate_submissions_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "estimate_links"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
