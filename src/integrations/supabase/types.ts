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
      accountability_buddies: {
        Row: {
          active: boolean
          id: string
          paired_at: string
          thirty_day_start: string | null
          user_id_1: string
          user_id_2: string
        }
        Insert: {
          active?: boolean
          id?: string
          paired_at?: string
          thirty_day_start?: string | null
          user_id_1: string
          user_id_2: string
        }
        Update: {
          active?: boolean
          id?: string
          paired_at?: string
          thirty_day_start?: string | null
          user_id_1?: string
          user_id_2?: string
        }
        Relationships: []
      }
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
      app_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: string
          updated_at?: string
          updated_by?: string | null
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
          retake_type: string
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
          retake_type?: string
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
          retake_type?: string
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
      circle_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "circle_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "circle_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      circle_dms: {
        Row: {
          content: string
          created_at: string
          id: string
          read: boolean
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read?: boolean
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read?: boolean
          recipient_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      circle_event_rsvps: {
        Row: {
          created_at: string
          event_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "circle_event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "circle_events"
            referencedColumns: ["id"]
          },
        ]
      }
      circle_events: {
        Row: {
          created_at: string
          description: string | null
          event_date: string
          event_type: string
          id: string
          replay_url: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date: string
          event_type?: string
          id?: string
          replay_url?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string
          event_type?: string
          id?: string
          replay_url?: string | null
          title?: string
        }
        Relationships: []
      }
      circle_members: {
        Row: {
          bio: string | null
          days_in_circle: number
          display_name: string
          hormone_profile: string | null
          human_design_type: string | null
          id: string
          joined_at: string
          primary_trap: string | null
          show_human_design: boolean
          show_in_directory: boolean
          show_primary_trap: boolean
          show_thermostat: boolean
          thermostat_type: string | null
          user_id: string
        }
        Insert: {
          bio?: string | null
          days_in_circle?: number
          display_name: string
          hormone_profile?: string | null
          human_design_type?: string | null
          id?: string
          joined_at?: string
          primary_trap?: string | null
          show_human_design?: boolean
          show_in_directory?: boolean
          show_primary_trap?: boolean
          show_thermostat?: boolean
          thermostat_type?: string | null
          user_id: string
        }
        Update: {
          bio?: string | null
          days_in_circle?: number
          display_name?: string
          hormone_profile?: string | null
          human_design_type?: string | null
          id?: string
          joined_at?: string
          primary_trap?: string | null
          show_human_design?: boolean
          show_in_directory?: boolean
          show_primary_trap?: boolean
          show_thermostat?: boolean
          thermostat_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      circle_posts: {
        Row: {
          content: string
          created_at: string
          id: string
          image_url: string | null
          is_admin_post: boolean
          is_anonymous: boolean
          is_pinned: boolean
          post_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_admin_post?: boolean
          is_anonymous?: boolean
          is_pinned?: boolean
          post_type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_admin_post?: boolean
          is_anonymous?: boolean
          is_pinned?: boolean
          post_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      circle_reactions: {
        Row: {
          created_at: string
          id: string
          post_id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          reaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "circle_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "circle_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      circle_reports: {
        Row: {
          comment_id: string | null
          created_at: string
          id: string
          post_id: string | null
          reason: string
          reporter_id: string
        }
        Insert: {
          comment_id?: string | null
          created_at?: string
          id?: string
          post_id?: string | null
          reason: string
          reporter_id: string
        }
        Update: {
          comment_id?: string | null
          created_at?: string
          id?: string
          post_id?: string | null
          reason?: string
          reporter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "circle_reports_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "circle_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "circle_reports_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "circle_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_shifts: {
        Row: {
          created_at: string
          day_number: number | null
          entry_date: string
          id: string
          prompt: string
          prompt_type: string
          response: string
          user_id: string
        }
        Insert: {
          created_at?: string
          day_number?: number | null
          entry_date?: string
          id?: string
          prompt: string
          prompt_type?: string
          response: string
          user_id: string
        }
        Update: {
          created_at?: string
          day_number?: number | null
          entry_date?: string
          id?: string
          prompt?: string
          prompt_type?: string
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
      meditation_completions: {
        Row: {
          completed_at: string
          id: string
          meditation_id: string | null
          meditation_title: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          meditation_id?: string | null
          meditation_title: string
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          meditation_id?: string | null
          meditation_title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meditation_completions_meditation_id_fkey"
            columns: ["meditation_id"]
            isOneToOne: false
            referencedRelation: "meditations"
            referencedColumns: ["id"]
          },
        ]
      }
      meditation_notify_requests: {
        Row: {
          created_at: string
          id: string
          library: string
          meditation_title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          library: string
          meditation_title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          library?: string
          meditation_title?: string
          user_id?: string
        }
        Relationships: []
      }
      meditations: {
        Row: {
          audio_url: string | null
          created_at: string
          duration_label: string | null
          id: string
          is_coming_soon: boolean
          library: string
          sort_order: number
          tier_required: string
          title: string
          updated_at: string
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          duration_label?: string | null
          id?: string
          is_coming_soon?: boolean
          library: string
          sort_order?: number
          tier_required?: string
          title: string
          updated_at?: string
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          duration_label?: string | null
          id?: string
          is_coming_soon?: boolean
          library?: string
          sort_order?: number
          tier_required?: string
          title?: string
          updated_at?: string
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
      pending_founding_members: {
        Row: {
          amount_paid: number | null
          claimed: boolean
          claimed_at: string | null
          claimed_by_user_id: string | null
          created_at: string
          email: string
          id: string
          paid_at: string
          source: string | null
          stripe_customer_id: string | null
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
        }
        Insert: {
          amount_paid?: number | null
          claimed?: boolean
          claimed_at?: string | null
          claimed_by_user_id?: string | null
          created_at?: string
          email: string
          id?: string
          paid_at?: string
          source?: string | null
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
        }
        Update: {
          amount_paid?: number | null
          claimed?: boolean
          claimed_at?: string | null
          claimed_by_user_id?: string | null
          created_at?: string
          email?: string
          id?: string
          paid_at?: string
          source?: string | null
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
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
          access_expires_at: string | null
          ai_checkin_days_shown: Json
          body_type: string | null
          body_type_completed_at: string | null
          buddy_requested: boolean
          comeback_card_shown: boolean
          created_at: string
          current_streak: number | null
          day15_email_sent_at: string | null
          day15_modal_shown: boolean
          day15_remind_later_at: string | null
          day21_email_sent_at: string | null
          day21_modal_shown: boolean
          day3_card_shown: boolean
          day5_emotional_peak_completed: boolean
          day6_bonus_oracle_used: boolean
          day6_cliffhanger_shown: boolean
          day6_gift_shown: boolean
          first_moment_complete: boolean
          first_moment_response: string | null
          first_visit_circle: boolean
          founder_banner_dismissed_count: number
          full_name: string | null
          human_design_type: string | null
          id: string
          is_admin: boolean
          journey_current_day: number | null
          journey_start_date: string | null
          last_30day_activity: string | null
          last_active_date: string | null
          last_login: string | null
          last_thermostat_date: string | null
          longest_streak: number
          longterm_cards_shown: Json
          lorie_30day_shown: boolean
          lorie_welcome_shown: boolean
          loss_frame_shown: boolean | null
          milestone_cards_shown: Json
          mirror_card_dismissed: boolean | null
          mirror_card_shown: boolean | null
          monthly_ceremonies_completed: Json
          notification_time: string | null
          notifications_enabled: boolean
          onboarding_complete: boolean | null
          onboarding_reason: string | null
          oracle_preview_pulls_used: number
          pattern_checkin_cards_shown: Json
          phone: string | null
          primary_wound: string | null
          profile_photo_url: string | null
          recognition_deficit_count: number | null
          reset_goal: string | null
          reset_plan_generated: boolean
          resets_completed_count: number
          share_milestones: boolean
          shown_day7_modal: boolean
          sound_effects_enabled: boolean
          streak_grace_used_date: string | null
          streak_milestones_shown: Json
          stripe_customer_id: string | null
          stuck_duration: string | null
          subscription_tier: string | null
          today_recommendation_used_date: string | null
          tools_opened_count: number
          total_points: number | null
          total_sessions: number
          trial_reflection_saved: boolean
          trial_start_date: string | null
          trial_tool_1: string | null
          trial_tool_2: string | null
          tried_before: Json | null
          updated_at: string
          upgrade_reminder_timestamp: string | null
          user_id: string
          user_source: string | null
          welcome_banner_dismissed: boolean
          whats_next_shown: boolean
          worth_score_after: number | null
          worth_score_before: number | null
          worth_score_day1: number | null
          worth_score_day24: number | null
        }
        Insert: {
          access_expires_at?: string | null
          ai_checkin_days_shown?: Json
          body_type?: string | null
          body_type_completed_at?: string | null
          buddy_requested?: boolean
          comeback_card_shown?: boolean
          created_at?: string
          current_streak?: number | null
          day15_email_sent_at?: string | null
          day15_modal_shown?: boolean
          day15_remind_later_at?: string | null
          day21_email_sent_at?: string | null
          day21_modal_shown?: boolean
          day3_card_shown?: boolean
          day5_emotional_peak_completed?: boolean
          day6_bonus_oracle_used?: boolean
          day6_cliffhanger_shown?: boolean
          day6_gift_shown?: boolean
          first_moment_complete?: boolean
          first_moment_response?: string | null
          first_visit_circle?: boolean
          founder_banner_dismissed_count?: number
          full_name?: string | null
          human_design_type?: string | null
          id?: string
          is_admin?: boolean
          journey_current_day?: number | null
          journey_start_date?: string | null
          last_30day_activity?: string | null
          last_active_date?: string | null
          last_login?: string | null
          last_thermostat_date?: string | null
          longest_streak?: number
          longterm_cards_shown?: Json
          lorie_30day_shown?: boolean
          lorie_welcome_shown?: boolean
          loss_frame_shown?: boolean | null
          milestone_cards_shown?: Json
          mirror_card_dismissed?: boolean | null
          mirror_card_shown?: boolean | null
          monthly_ceremonies_completed?: Json
          notification_time?: string | null
          notifications_enabled?: boolean
          onboarding_complete?: boolean | null
          onboarding_reason?: string | null
          oracle_preview_pulls_used?: number
          pattern_checkin_cards_shown?: Json
          phone?: string | null
          primary_wound?: string | null
          profile_photo_url?: string | null
          recognition_deficit_count?: number | null
          reset_goal?: string | null
          reset_plan_generated?: boolean
          resets_completed_count?: number
          share_milestones?: boolean
          shown_day7_modal?: boolean
          sound_effects_enabled?: boolean
          streak_grace_used_date?: string | null
          streak_milestones_shown?: Json
          stripe_customer_id?: string | null
          stuck_duration?: string | null
          subscription_tier?: string | null
          today_recommendation_used_date?: string | null
          tools_opened_count?: number
          total_points?: number | null
          total_sessions?: number
          trial_reflection_saved?: boolean
          trial_start_date?: string | null
          trial_tool_1?: string | null
          trial_tool_2?: string | null
          tried_before?: Json | null
          updated_at?: string
          upgrade_reminder_timestamp?: string | null
          user_id: string
          user_source?: string | null
          welcome_banner_dismissed?: boolean
          whats_next_shown?: boolean
          worth_score_after?: number | null
          worth_score_before?: number | null
          worth_score_day1?: number | null
          worth_score_day24?: number | null
        }
        Update: {
          access_expires_at?: string | null
          ai_checkin_days_shown?: Json
          body_type?: string | null
          body_type_completed_at?: string | null
          buddy_requested?: boolean
          comeback_card_shown?: boolean
          created_at?: string
          current_streak?: number | null
          day15_email_sent_at?: string | null
          day15_modal_shown?: boolean
          day15_remind_later_at?: string | null
          day21_email_sent_at?: string | null
          day21_modal_shown?: boolean
          day3_card_shown?: boolean
          day5_emotional_peak_completed?: boolean
          day6_bonus_oracle_used?: boolean
          day6_cliffhanger_shown?: boolean
          day6_gift_shown?: boolean
          first_moment_complete?: boolean
          first_moment_response?: string | null
          first_visit_circle?: boolean
          founder_banner_dismissed_count?: number
          full_name?: string | null
          human_design_type?: string | null
          id?: string
          is_admin?: boolean
          journey_current_day?: number | null
          journey_start_date?: string | null
          last_30day_activity?: string | null
          last_active_date?: string | null
          last_login?: string | null
          last_thermostat_date?: string | null
          longest_streak?: number
          longterm_cards_shown?: Json
          lorie_30day_shown?: boolean
          lorie_welcome_shown?: boolean
          loss_frame_shown?: boolean | null
          milestone_cards_shown?: Json
          mirror_card_dismissed?: boolean | null
          mirror_card_shown?: boolean | null
          monthly_ceremonies_completed?: Json
          notification_time?: string | null
          notifications_enabled?: boolean
          onboarding_complete?: boolean | null
          onboarding_reason?: string | null
          oracle_preview_pulls_used?: number
          pattern_checkin_cards_shown?: Json
          phone?: string | null
          primary_wound?: string | null
          profile_photo_url?: string | null
          recognition_deficit_count?: number | null
          reset_goal?: string | null
          reset_plan_generated?: boolean
          resets_completed_count?: number
          share_milestones?: boolean
          shown_day7_modal?: boolean
          sound_effects_enabled?: boolean
          streak_grace_used_date?: string | null
          streak_milestones_shown?: Json
          stripe_customer_id?: string | null
          stuck_duration?: string | null
          subscription_tier?: string | null
          today_recommendation_used_date?: string | null
          tools_opened_count?: number
          total_points?: number | null
          total_sessions?: number
          trial_reflection_saved?: boolean
          trial_start_date?: string | null
          trial_tool_1?: string | null
          trial_tool_2?: string | null
          tried_before?: Json | null
          updated_at?: string
          upgrade_reminder_timestamp?: string | null
          user_id?: string
          user_source?: string | null
          welcome_banner_dismissed?: boolean
          whats_next_shown?: boolean
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
      sacred_circle_posts: {
        Row: {
          content: string
          created_at: string
          display_name: string | null
          id: string
          milestone_type: string | null
          post_type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          display_name?: string | null
          id?: string
          milestone_type?: string | null
          post_type?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          display_name?: string | null
          id?: string
          milestone_type?: string | null
          post_type?: string
          user_id?: string
        }
        Relationships: []
      }
      sacred_circle_reactions: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sacred_circle_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "sacred_circle_posts"
            referencedColumns: ["id"]
          },
        ]
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
