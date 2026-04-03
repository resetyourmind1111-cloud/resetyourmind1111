export interface ModuleActivity {
  type: "route" | "journal" | "audio";
  label: string;
  icon: string;
  route?: string;
  intro?: string;
  prompt?: string;
  tags?: string[];
  audioUrl?: string;
}

export interface ModuleContent {
  slug: string;
  phase: number;
  title: string;
  subheader: string;
  body: string;
  activities: ModuleActivity[];
  dailyJournal: {
    prompt: string;
    tags: string[];
  };
  cta?: {
    label: string;
    route: string;
  };
  completionMessage?: string;
}

export const moduleScreens: Record<string, ModuleContent> = {
  recognition: {
    slug: "recognition",
    phase: 1,
    title: "Recognition",
    subheader: "You can't change what you won't see.",
    body: "This is where awareness begins. Not judgment. Not fixing. Just seeing clearly.",
    activities: [
      {
        type: "route",
        label: "Take Worth Thermostat™",
        icon: "🌡️",
        route: "/assessment",
      },
      {
        type: "journal",
        label: "Identify My Patterns",
        icon: "🔄",
        prompt: "Where am I repeating cycles that no longer serve me?",
        tags: ["recognition", "patterns"],
      },
      {
        type: "journal",
        label: "Explore My Triggers",
        icon: "⚡",
        prompt: "What situations, people, or moments pull me out of alignment?",
        tags: ["recognition", "triggers"],
      },
    ],
    dailyJournal: {
      prompt: "Where am I settling for less than I deserve?",
      tags: ["recognition", "daily"],
    },
    cta: {
      label: "Continue to Release →",
      route: "/module/release",
    },
  },

  release: {
    slug: "release",
    phase: 2,
    title: "Release",
    subheader: "Let go of what is no longer true.",
    body: "You are not your past patterns. You are the one who gets to release them.",
    activities: [
      {
        type: "route",
        label: "Rewrite a Limiting Belief",
        icon: "✍️",
        route: "/healing-tools/limiting-belief-rewriter",
      },
      {
        type: "journal",
        label: "Forgiveness Exercise",
        icon: "🕊️",
        intro: "Forgiveness is not for them. It's the surgical removal of their weight from your body.",
        prompt: "Who or what am I ready to release my grip on today?",
        tags: ["release", "forgiveness"],
      },
      {
        type: "audio",
        label: "Guided Release Meditation",
        icon: "🎧",
        audioUrl: "",
      },
    ],
    dailyJournal: {
      prompt: "What am I ready to let go of today?",
      tags: ["release", "daily"],
    },
    cta: {
      label: "Continue to The Quiet Phase™ →",
      route: "/module/quiet-phase",
    },
  },

  recalibration: {
    slug: "recalibration",
    phase: 4,
    title: "Recalibration",
    subheader: "Reset your internal standard.",
    body: "Now that space has been created… You get to choose who you become next.",
    activities: [
      {
        type: "route",
        label: "Recalibrate Worth Thermostat™",
        icon: "🌡️",
        route: "/assessment",
      },
      {
        type: "journal",
        label: "Identity Builder",
        icon: "👑",
        intro: "You are not becoming someone new. You are returning to who you always were before the world told you otherwise.",
        prompt:
          "Describe the version of you who already has everything you desire. How do they think? How do they move? What do they refuse to tolerate?",
        tags: ["recalibration", "identity"],
      },
      {
        type: "journal",
        label: "Decision Matrix",
        icon: "🎯",
        intro: "Every decision either expands your worth or contracts it.",
        prompt:
          "What decision am I avoiding right now, and what would my highest self choose?",
        tags: ["recalibration", "decisions"],
      },
    ],
    dailyJournal: {
      prompt: "Who do I need to become to live the life I desire?",
      tags: ["recalibration", "daily"],
    },
    cta: {
      label: "Continue to Embodiment →",
      route: "/module/embodiment",
    },
  },

  embodiment: {
    slug: "embodiment",
    phase: 5,
    title: "Embodiment",
    subheader: "Become it. Live it. Prove it.",
    body: "Transformation isn't what you think. It's what you do consistently.",
    activities: [
      {
        type: "route",
        label: "Start 30-Day Experience",
        icon: "🗓️",
        route: "/30-day-experience",
      },
      {
        type: "journal",
        label: "Daily Action Tracker",
        icon: "✅",
        prompt: "What is one aligned action I completed today?",
        tags: ["embodiment", "action"],
      },
      {
        type: "journal",
        label: "Celebration Log",
        icon: "🎉",
        prompt: "What am I celebrating today?",
        tags: ["embodiment", "celebration"],
      },
    ],
    dailyJournal: {
      prompt: "What action aligns with my highest self today?",
      tags: ["embodiment", "daily"],
    },
    completionMessage:
      "✨ You have moved through all 5 phases. This is not the end. This is who you are now.",
  },
};
