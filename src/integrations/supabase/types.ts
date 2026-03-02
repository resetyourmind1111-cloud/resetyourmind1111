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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      assessment_results: {
        Row: {
          answers: Json
          category_scores: Json
          completed_at: string
          email: string
          first_name: string
          id: string
          percentage_score: number
          thermostat_type: string
          total_score: number
          user_id: string | null
        }
        Insert: {
          answers: Json
          category_scores: Json
          completed_at?: string
          email: string
          first_name: string
          id?: string
          percentage_score: number
          thermostat_type: string
          total_score: number
          user_id?: string | null
        }
        Update: {
          answers?: Json
          category_scores?: Json
          completed_at?: string
          email?: string
          first_name?: string
          id?: string
          percentage_score?: number
          thermostat_type?: string
          total_score?: number
          user_id?: string | null
        }
        Relationships: []
      }
      card_pulls: {
        Row: {
          cards_pulled: Json
          created_at: string
          id: string
          journal_entry: string | null
          points_awarded: number
          question_asked: string | null
          reading_type: string
          user_id: string
        }
        Insert: {
          cards_pulled: Json
          created_at?: string
          id?: string
          journal_entry?: string | null
          points_awarded?: number
          question_asked?: string | null
          reading_type: string
          user_id: string
        }
        Update: {
          cards_pulled?: Json
          created_at?: string
          id?: string
          journal_entry?: string | null
          points_awarded?: number
          question_asked?: string | null
          reading_type?: string
          user_id?: string
        }
        Relationships: []
      }
      healing_tool_entries: {
        Row: {
          created_at: string
          entry_data: Json
          id: string
          tool_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          entry_data?: Json
          id?: string
          tool_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          entry_data?: Json
          id?: string
          tool_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          source: string | null
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          source?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          source?: string | null
        }
        Relationships: []
      }
      oracle_cards: {
        Row: {
          affirmation: string
          card_number: number
          category: string
          created_at: string
          deck_name: string
          deep_love_question: string
          guidebook_text: string
          id: string
          image_url: string | null
          integration_prompt: string
          message: string
          related_meditation_id: string | null
          title: string
        }
        Insert: {
          affirmation: string
          card_number: number
          category: string
          created_at?: string
          deck_name: string
          deep_love_question: string
          guidebook_text: string
          id?: string
          image_url?: string | null
          integration_prompt: string
          message: string
          related_meditation_id?: string | null
          title: string
        }
        Update: {
          affirmation?: string
          card_number?: number
          category?: string
          created_at?: string
          deck_name?: string
          deep_love_question?: string
          guidebook_text?: string
          id?: string
          image_url?: string | null
          integration_prompt?: string
          message?: string
          related_meditation_id?: string | null
          title?: string
        }
        Relationships: []
      }
      permission_slips_accepted: {
        Row: {
          category: string
          created_at: string
          id: string
          is_custom: boolean
          slip_text: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          is_custom?: boolean
          slip_text: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          is_custom?: boolean
          slip_text?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          body_type: string | null
          body_type_completed_at: string | null
          created_at: string
          current_streak: number | null
          full_name: string | null
          human_design_type: string | null
          id: string
          last_login: string | null
          phone: string | null
          profile_photo_url: string | null
          subscription_tier: string | null
          total_points: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          body_type?: string | null
          body_type_completed_at?: string | null
          created_at?: string
          current_streak?: number | null
          full_name?: string | null
          human_design_type?: string | null
          id?: string
          last_login?: string | null
          phone?: string | null
          profile_photo_url?: string | null
          subscription_tier?: string | null
          total_points?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          body_type?: string | null
          body_type_completed_at?: string | null
          created_at?: string
          current_streak?: number | null
          full_name?: string | null
          human_design_type?: string | null
          id?: string
          last_login?: string | null
          phone?: string | null
          profile_photo_url?: string | null
          subscription_tier?: string | null
          total_points?: number | null
          updated_at?: string
          user_id?: string
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
