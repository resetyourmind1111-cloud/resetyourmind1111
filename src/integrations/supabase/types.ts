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
      ai_chat_sessions: {
        Row: {
          created_at: string
          id: string
          messages: Json
          title: string | null
          trap_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          messages?: Json
          title?: string | null
          trap_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          messages?: Json
          title?: string | null
          trap_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
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
          action_items_completed: Json | null
          cards_pulled: Json
          created_at: string
          deck_used: string | null
          id: string
          journal_entry: string | null
          points_awarded: number
          question_asked: string | null
          reading_type: string
          revisited_count: number | null
          spread_name: string | null
          user_id: string
        }
        Insert: {
          action_items_completed?: Json | null
          cards_pulled: Json
          created_at?: string
          deck_used?: string | null
          id?: string
          journal_entry?: string | null
          points_awarded?: number
          question_asked?: string | null
          reading_type: string
          revisited_count?: number | null
          spread_name?: string | null
          user_id: string
        }
        Update: {
          action_items_completed?: Json | null
          cards_pulled?: Json
          created_at?: string
          deck_used?: string | null
          id?: string
          journal_entry?: string | null
          points_awarded?: number
          question_asked?: string | null
          reading_type?: string
          revisited_count?: number | null
          spread_name?: string | null
          user_id?: string
        }
        Relationships: []
      }
      daily_shifts: {
        Row: {
          created_at: string
          entry_date: string
          id: string
          prompt: string
          response: string
          user_id: string
        }
        Insert: {
          created_at?: string
          entry_date?: string
          id?: string
          prompt: string
          response: string
          user_id: string
        }
        Update: {
          created_at?: string
          entry_date?: string
          id?: string
          prompt?: string
          response?: string
          user_id?: string
        }
        Relationships: []
      }
      founding_member_spots: {
        Row: {
          id: string
          spots_remaining: number
          updated_at: string
        }
        Insert: {
          id?: string
          spots_remaining?: number
          updated_at?: string
        }
        Update: {
          id?: string
          spots_remaining?: number
          updated_at?: string
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
      identity_trap_results: {
        Row: {
          created_at: string
          id: string
          primary_trap: string
          quiz_answers: Json
          secondary_trap: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          primary_trap: string
          quiz_answers?: Json
          secondary_trap?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          primary_trap?: string
          quiz_answers?: Json
          secondary_trap?: string | null
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
      lesson_completions: {
        Row: {
          action_step_complete: boolean
          completed_at: string | null
          created_at: string
          id: string
          journal_response: string | null
          lesson_number: number
          lesson_title: string
          track_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action_step_complete?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          journal_response?: string | null
          lesson_number: number
          lesson_title: string
          track_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action_step_complete?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          journal_response?: string | null
          lesson_number?: number
          lesson_title?: string
          track_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      nervous_system_checkins: {
        Row: {
          created_at: string
          id: string
          journal_entry: string | null
          primary_state: string
          reset_completed: boolean
          scores_json: Json
          secondary_state: string | null
          triggered_by: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          journal_entry?: string | null
          primary_state: string
          reset_completed?: boolean
          scores_json?: Json
          secondary_state?: string | null
          triggered_by?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          journal_entry?: string | null
          primary_state?: string
          reset_completed?: boolean
          scores_json?: Json
          secondary_state?: string | null
          triggered_by?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          checkin_reminder_enabled: boolean
          checkin_reminder_time: string
          created_at: string
          daily_affirmation_enabled: boolean
          daily_affirmation_time: string
          id: string
          milestone_celebrations_enabled: boolean
          quiet_phase_alerts_enabled: boolean
          streak_protection_enabled: boolean
          updated_at: string
          user_id: string
          weekly_coaching_enabled: boolean
        }
        Insert: {
          checkin_reminder_enabled?: boolean
          checkin_reminder_time?: string
          created_at?: string
          daily_affirmation_enabled?: boolean
          daily_affirmation_time?: string
          id?: string
          milestone_celebrations_enabled?: boolean
          quiet_phase_alerts_enabled?: boolean
          streak_protection_enabled?: boolean
          updated_at?: string
          user_id: string
          weekly_coaching_enabled?: boolean
        }
        Update: {
          checkin_reminder_enabled?: boolean
          checkin_reminder_time?: string
          created_at?: string
          daily_affirmation_enabled?: boolean
          daily_affirmation_time?: string
          id?: string
          milestone_celebrations_enabled?: boolean
          quiet_phase_alerts_enabled?: boolean
          streak_protection_enabled?: boolean
          updated_at?: string
          user_id?: string
          weekly_coaching_enabled?: boolean
        }
        Relationships: []
      }
      notifications_schedule: {
        Row: {
          created_at: string
          day_number: number
          id: string
          message_body: string
          message_title: string
          scheduled_time: string
          sent: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          day_number: number
          id?: string
          message_body: string
          message_title: string
          scheduled_time: string
          sent?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          day_number?: number
          id?: string
          message_body?: string
          message_title?: string
          scheduled_time?: string
          sent?: boolean
          user_id?: string
        }
        Relationships: []
      }
      onboarding_responses: {
        Row: {
          abundance_evidence: string | null
          blocked_area: string | null
          completed_at: string | null
          created_at: string
          emotional_state: string[] | null
          future_self_answer: string | null
          id: string
          limiting_belief: string | null
          new_belief: string | null
          primary_focus: string | null
          recommended_tools: string[] | null
          secondary_focus: string | null
          user_id: string
          worth_score: number | null
        }
        Insert: {
          abundance_evidence?: string | null
          blocked_area?: string | null
          completed_at?: string | null
          created_at?: string
          emotional_state?: string[] | null
          future_self_answer?: string | null
          id?: string
          limiting_belief?: string | null
          new_belief?: string | null
          primary_focus?: string | null
          recommended_tools?: string[] | null
          secondary_focus?: string | null
          user_id: string
          worth_score?: number | null
        }
        Update: {
          abundance_evidence?: string | null
          blocked_area?: string | null
          completed_at?: string | null
          created_at?: string
          emotional_state?: string[] | null
          future_self_answer?: string | null
          id?: string
          limiting_belief?: string | null
          new_belief?: string | null
          primary_focus?: string | null
          recommended_tools?: string[] | null
          secondary_focus?: string | null
          user_id?: string
          worth_score?: number | null
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
      pattern_interrupts: {
        Row: {
          action_taken: string
          created_at: string
          id: string
          trap_name: string
          user_id: string
        }
        Insert: {
          action_taken: string
          created_at?: string
          id?: string
          trap_name: string
          user_id: string
        }
        Update: {
          action_taken?: string
          created_at?: string
          id?: string
          trap_name?: string
          user_id?: string
        }
        Relationships: []
      }
      pattern_progress: {
        Row: {
          actions_before_certainty: number
          honest_nos: number
          id: string
          last_updated: string
          recodes_completed: number
          self_trust_streak: number
          total_interrupts: number
          user_id: string
        }
        Insert: {
          actions_before_certainty?: number
          honest_nos?: number
          id?: string
          last_updated?: string
          recodes_completed?: number
          self_trust_streak?: number
          total_interrupts?: number
          user_id: string
        }
        Update: {
          actions_before_certainty?: number
          honest_nos?: number
          id?: string
          last_updated?: string
          recodes_completed?: number
          self_trust_streak?: number
          total_interrupts?: number
          user_id?: string
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
          day3_card_shown: boolean
          first_moment_complete: boolean
          first_moment_response: string | null
          founder_banner_dismissed_count: number
          full_name: string | null
          human_design_type: string | null
          id: string
          journey_current_day: number | null
          journey_start_date: string | null
          last_login: string | null
          lorie_welcome_shown: boolean
          notification_time: string | null
          notifications_enabled: boolean
          onboarding_complete: boolean | null
          onboarding_reason: string | null
          phone: string | null
          primary_wound: string | null
          profile_photo_url: string | null
          recognition_deficit_count: number | null
          reset_goal: string | null
          reset_plan_generated: boolean
          shown_day7_modal: boolean
          stripe_customer_id: string | null
          stuck_duration: string | null
          subscription_tier: string | null
          total_points: number | null
          trial_reflection_saved: boolean
          trial_start_date: string | null
          trial_tool_1: string | null
          trial_tool_2: string | null
          tried_before: Json | null
          updated_at: string
          user_id: string
          user_source: string | null
          welcome_banner_dismissed: boolean
          worth_score_after: number | null
          worth_score_before: number | null
          worth_score_day1: number | null
          worth_score_day24: number | null
        }
        Insert: {
          body_type?: string | null
          body_type_completed_at?: string | null
          created_at?: string
          current_streak?: number | null
          day3_card_shown?: boolean
          first_moment_complete?: boolean
          first_moment_response?: string | null
          founder_banner_dismissed_count?: number
          full_name?: string | null
          human_design_type?: string | null
          id?: string
          journey_current_day?: number | null
          journey_start_date?: string | null
          last_login?: string | null
          lorie_welcome_shown?: boolean
          notification_time?: string | null
          notifications_enabled?: boolean
          onboarding_complete?: boolean | null
          onboarding_reason?: string | null
          phone?: string | null
          primary_wound?: string | null
          profile_photo_url?: string | null
          recognition_deficit_count?: number | null
          reset_goal?: string | null
          reset_plan_generated?: boolean
          shown_day7_modal?: boolean
          stripe_customer_id?: string | null
          stuck_duration?: string | null
          subscription_tier?: string | null
          total_points?: number | null
          trial_reflection_saved?: boolean
          trial_start_date?: string | null
          trial_tool_1?: string | null
          trial_tool_2?: string | null
          tried_before?: Json | null
          updated_at?: string
          user_id: string
          user_source?: string | null
          welcome_banner_dismissed?: boolean
          worth_score_after?: number | null
          worth_score_before?: number | null
          worth_score_day1?: number | null
          worth_score_day24?: number | null
        }
        Update: {
          body_type?: string | null
          body_type_completed_at?: string | null
          created_at?: string
          current_streak?: number | null
          day3_card_shown?: boolean
          first_moment_complete?: boolean
          first_moment_response?: string | null
          founder_banner_dismissed_count?: number
          full_name?: string | null
          human_design_type?: string | null
          id?: string
          journey_current_day?: number | null
          journey_start_date?: string | null
          last_login?: string | null
          lorie_welcome_shown?: boolean
          notification_time?: string | null
          notifications_enabled?: boolean
          onboarding_complete?: boolean | null
          onboarding_reason?: string | null
          phone?: string | null
          primary_wound?: string | null
          profile_photo_url?: string | null
          recognition_deficit_count?: number | null
          reset_goal?: string | null
          reset_plan_generated?: boolean
          shown_day7_modal?: boolean
          stripe_customer_id?: string | null
          stuck_duration?: string | null
          subscription_tier?: string | null
          total_points?: number | null
          trial_reflection_saved?: boolean
          trial_start_date?: string | null
          trial_tool_1?: string | null
          trial_tool_2?: string | null
          tried_before?: Json | null
          updated_at?: string
          user_id?: string
          user_source?: string | null
          welcome_banner_dismissed?: boolean
          worth_score_after?: number | null
          worth_score_before?: number | null
          worth_score_day1?: number | null
          worth_score_day24?: number | null
        }
        Relationships: []
      }
      recognition_deficit_items: {
        Row: {
          checked: boolean
          id: string
          item_text: string
          updated_at: string
          user_id: string
        }
        Insert: {
          checked?: boolean
          id?: string
          item_text: string
          updated_at?: string
          user_id: string
        }
        Update: {
          checked?: boolean
          id?: string
          item_text?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      spread_templates: {
        Row: {
          created_at: string
          deck_name: string
          description: string | null
          icon: string | null
          id: string
          layout_type: string
          number_of_cards: number
          points: number
          position_meanings: Json
          question_prompt: string
          spread_name: string
          tier_required: number
        }
        Insert: {
          created_at?: string
          deck_name: string
          description?: string | null
          icon?: string | null
          id?: string
          layout_type?: string
          number_of_cards: number
          points?: number
          position_meanings?: Json
          question_prompt: string
          spread_name: string
          tier_required?: number
        }
        Update: {
          created_at?: string
          deck_name?: string
          description?: string | null
          icon?: string | null
          id?: string
          layout_type?: string
          number_of_cards?: number
          points?: number
          position_meanings?: Json
          question_prompt?: string
          spread_name?: string
          tier_required?: number
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          billing_interval: string | null
          cancel_at_period_end: boolean | null
          created_at: string
          current_period_end: string | null
          founding_member: boolean | null
          id: string
          lifetime_locked_price: boolean | null
          plan_name: string | null
          status: string
          stripe_customer_id: string | null
          stripe_price_id: string | null
          stripe_product_id: string | null
          stripe_subscription_id: string | null
          tier: string
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_interval?: string | null
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          founding_member?: boolean | null
          id?: string
          lifetime_locked_price?: boolean | null
          plan_name?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          stripe_subscription_id?: string | null
          tier?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_interval?: string | null
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          founding_member?: boolean | null
          id?: string
          lifetime_locked_price?: boolean | null
          plan_name?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          stripe_subscription_id?: string | null
          tier?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      support_flow_outcomes: {
        Row: {
          created_at: string
          entry_state: string
          id: string
          outcome: string | null
          tool_used: string
          user_id: string
        }
        Insert: {
          created_at?: string
          entry_state: string
          id?: string
          outcome?: string | null
          tool_used: string
          user_id: string
        }
        Update: {
          created_at?: string
          entry_state?: string
          id?: string
          outcome?: string | null
          tool_used?: string
          user_id?: string
        }
        Relationships: []
      }
      thirty_day_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          day_number: number
          evening_response: string | null
          id: string
          marked_complete: boolean
          morning_response: string | null
          phase: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          day_number: number
          evening_response?: string | null
          id?: string
          marked_complete?: boolean
          morning_response?: string | null
          phase: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          day_number?: number
          evening_response?: string | null
          id?: string
          marked_complete?: boolean
          morning_response?: string | null
          phase?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_checkins: {
        Row: {
          created_at: string
          daily_state: string
          id: string
          routed_to_module: string
          user_id: string
        }
        Insert: {
          created_at?: string
          daily_state: string
          id?: string
          routed_to_module: string
          user_id: string
        }
        Update: {
          created_at?: string
          daily_state?: string
          id?: string
          routed_to_module?: string
          user_id?: string
        }
        Relationships: []
      }
      user_usage: {
        Row: {
          date: string
          id: string
          session_count: number
          user_id: string
        }
        Insert: {
          date?: string
          id?: string
          session_count?: number
          user_id: string
        }
        Update: {
          date?: string
          id?: string
          session_count?: number
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_user_usage: { Args: never; Returns: number }
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
