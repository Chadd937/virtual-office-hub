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
      agents: {
        Row: {
          created_at: string
          department: string
          id: string
          kind: string
          manager_id: string | null
          name: string
          owner_id: string
          policy: string
          role: string
          status: string
        }
        Insert: {
          created_at?: string
          department?: string
          id?: string
          kind: string
          manager_id?: string | null
          name: string
          owner_id: string
          policy?: string
          role: string
          status?: string
        }
        Update: {
          created_at?: string
          department?: string
          id?: string
          kind?: string
          manager_id?: string | null
          name?: string
          owner_id?: string
          policy?: string
          role?: string
          status?: string
        }
        Relationships: []
      }
      audit_events: {
        Row: {
          action: string
          created_at: string
          detail: string
          id: string
          owner_id: string
          target_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          detail?: string
          id?: string
          owner_id: string
          target_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          detail?: string
          id?: string
          owner_id?: string
          target_id?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          owner_id: string
          role: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          owner_id: string
          role: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          owner_id?: string
          role?: string
        }
        Relationships: []
      }
      crypto_payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          network: string
          owner_id: string
          plan: string
          token: string
          tx_hash: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          network: string
          owner_id: string
          plan: string
          token: string
          tx_hash: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          network?: string
          owner_id?: string
          plan?: string
          token?: string
          tx_hash?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          created_at: string
          id: string
          name: string
          owner_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          owner_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner_id?: string
        }
        Relationships: []
      }
      integration_connections: {
        Row: {
          account_label: string
          created_at: string
          id: string
          owner_id: string
          provider: string
          status: string
        }
        Insert: {
          account_label?: string
          created_at?: string
          id?: string
          owner_id: string
          provider: string
          status?: string
        }
        Update: {
          account_label?: string
          created_at?: string
          id?: string
          owner_id?: string
          provider?: string
          status?: string
        }
        Relationships: []
      }
      offices: {
        Row: {
          ai_blocked: string | null
          created_at: string
          id: string
          name: string
          owner_id: string
          paused: boolean
        }
        Insert: {
          ai_blocked?: string | null
          created_at?: string
          id?: string
          name?: string
          owner_id: string
          paused?: boolean
        }
        Update: {
          ai_blocked?: string | null
          created_at?: string
          id?: string
          name?: string
          owner_id?: string
          paused?: boolean
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          domain: string
          id: string
          name: string
          objective: string
          owner_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          domain?: string
          id?: string
          name: string
          objective?: string
          owner_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          domain?: string
          id?: string
          name?: string
          objective?: string
          owner_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          current_period_end: string | null
          method: string
          owner_id: string
          plan: string
          status: string
          updated_at: string
        }
        Insert: {
          current_period_end?: string | null
          method: string
          owner_id: string
          plan: string
          status?: string
          updated_at?: string
        }
        Update: {
          current_period_end?: string | null
          method?: string
          owner_id?: string
          plan?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          agent_id: string | null
          approved_at: string | null
          created_at: string
          criteria: string
          error: string | null
          id: string
          input_tokens: number | null
          objective: string
          output: string | null
          output_tokens: number | null
          owner_id: string
          run_id: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          approved_at?: string | null
          created_at?: string
          criteria?: string
          error?: string | null
          id?: string
          input_tokens?: number | null
          objective: string
          output?: string | null
          output_tokens?: number | null
          owner_id: string
          run_id?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          approved_at?: string | null
          created_at?: string
          criteria?: string
          error?: string | null
          id?: string
          input_tokens?: number | null
          objective?: string
          output?: string | null
          output_tokens?: number | null
          owner_id?: string
          run_id?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
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
    Enums: {},
  },
} as const
