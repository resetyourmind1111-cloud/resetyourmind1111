import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export interface TrialResumeAction {
  label: string;
  href: string;
}

export interface TrialResumeStepInfo {
  eyebrow: string;
  title: string;
  body: string;
  time?: string;
  buttonText: string;
  route: string;
}

interface TrialResumeState {
  loading: boolean;
  nextAction: TrialResumeAction | null;
  step: TrialResumeStepInfo | null;
  hasAssessment: boolean;
  hasTrapResult: boolean;
  hasPatternInterrupt: boolean;
  journeyDay: number;
}

function getTrialResumeContent(
  trialDay: number,
  hasAssessment: boolean,
  hasTrapResult: boolean,
  hasPatternInterrupt: boolean,
  journeyDay: number,
): Pick<TrialResumeState, "nextAction" | "step"> {
  const dayLabel = Math.min(Math.max(trialDay + 1, 1), 7);
  const experienceDay = Math.max(journeyDay + 1, 1);

  if (!hasAssessment) {
    return {
      nextAction: { label: "Continue — Worth Thermostat →", href: "/assessment" },
      step: {
        eyebrow: `START HERE — DAY ${dayLabel}`,
        title: "Worth Thermostat™",
        body: "See exactly where your patterns are set across money, love, health, leadership, and self-worth.",
        time: "5 minutes",
        buttonText: "Start my assessment →",
        route: "/assessment",
      },
    };
  }

  if (!hasTrapResult) {
    return {
      nextAction: { label: "Continue — Discover Your Pattern →", href: "/patterns/quiz" },
      step: {
        eyebrow: "YOUR NEXT STEP",
        title: "Discover Your Identity Pattern",
        body: "Find out which pattern has been running your life — and get your first 3-minute reset.",
        time: "2 minutes",
        buttonText: "Discover my pattern →",
        route: "/patterns/quiz",
      },
    };
  }

  if (!hasPatternInterrupt) {
    return {
      nextAction: { label: "Continue — Your First Reset →", href: "/patterns" },
      step: {
        eyebrow: "YOUR NEXT STEP",
        title: "Do Your First Pattern Reset",
        body: "You know your pattern. Now interrupt it. This is where the shift starts.",
        time: "3 minutes",
        buttonText: "Start my reset →",
        route: "/patterns",
      },
    };
  }

  if (journeyDay < 3) {
    return {
      nextAction: { label: `Continue — Day ${experienceDay} Experience →`, href: "/30-day-experience" },
      step: {
        eyebrow: "KEEP GOING",
        title: `Day ${experienceDay} of the 30-Day Experience`,
        body: "Continue your daily reset journey.",
        buttonText: `Continue Day ${experienceDay} →`,
        route: "/30-day-experience",
      },
    };
  }

  return {
    nextAction: { label: `Continue — Day ${dayLabel} Check In →`, href: "/patterns/check-in" },
    step: {
      eyebrow: "TODAY'S RESET",
      title: "Daily Check-In",
      body: "What's coming up for you today? Let the app guide you to today's reset.",
      buttonText: "Check in →",
      route: "/patterns/check-in",
    },
  };
}

export function useTrialResume(isTrialActive: boolean, trialDay: number): TrialResumeState {
  const { user } = useAuth();
  const [state, setState] = useState<TrialResumeState>({
    loading: isTrialActive,
    nextAction: null,
    step: null,
    hasAssessment: false,
    hasTrapResult: false,
    hasPatternInterrupt: false,
    journeyDay: 0,
  });

  useEffect(() => {
    if (!user || !isTrialActive) {
      setState({
        loading: false,
        nextAction: null,
        step: null,
        hasAssessment: false,
        hasTrapResult: false,
        hasPatternInterrupt: false,
        journeyDay: 0,
      });
      return;
    }

    let cancelled = false;

    const fetchResumeState = async () => {
      setState((current) => ({ ...current, loading: true }));

      const [assessmentRes, trapRes, patternInterruptRes, profileRes] = await Promise.all([
        supabase.from("assessment_results").select("id").eq("user_id", user.id).limit(1),
        supabase.from("identity_trap_results").select("id").eq("user_id", user.id).limit(1),
        supabase.from("pattern_interrupts").select("id").eq("user_id", user.id).limit(1),
        supabase.from("profiles").select("journey_current_day").eq("user_id", user.id).maybeSingle(),
      ]);

      if (cancelled) return;

      const hasAssessment = (assessmentRes.data?.length ?? 0) > 0;
      const hasTrapResult = (trapRes.data?.length ?? 0) > 0;
      const hasPatternInterrupt = (patternInterruptRes.data?.length ?? 0) > 0;
      const journeyDay = (profileRes.data as any)?.journey_current_day ?? 0;
      const { nextAction, step } = getTrialResumeContent(
        trialDay,
        hasAssessment,
        hasTrapResult,
        hasPatternInterrupt,
        journeyDay,
      );

      setState({
        loading: false,
        nextAction,
        step,
        hasAssessment,
        hasTrapResult,
        hasPatternInterrupt,
        journeyDay,
      });
    };

    fetchResumeState();

    return () => {
      cancelled = true;
    };
  }, [user, isTrialActive, trialDay]);

  return state;
}