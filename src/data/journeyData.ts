export interface JourneyDay {
  day: number;
  week: number;
  title: string;
  teaching: string;
  actionType: 'journal' | 'tool' | 'mixed';
  actionLabel: string;
  journalPrompt?: string;
  toolRoute?: string;
}

export interface JourneyWeek {
  week: number;
  theme: string;
  tagline: string;
  accentColor: string; // tailwind-compatible
  accentHex: string;
  days: JourneyDay[];
}

export const journeyWeeks: JourneyWeek[] = [
  {
    week: 1,
    theme: "Recognition",
    tagline: "See yourself clearly.",
    accentColor: "text-[#4A7FA5]",
    accentHex: "#4A7FA5",
    days: [
      { day: 1, week: 1, title: "See Where You Are", teaching: "You cannot change what you refuse to see. Recognition is not judgment — it's the beginning of freedom.", actionType: "tool", actionLabel: "Take Worth Thermostat™", toolRoute: "/assessment" },
      { day: 2, week: 1, title: "Name the Pattern", teaching: "Every pattern has a root. Today we find it.", actionType: "journal", actionLabel: "Journal Prompt", journalPrompt: "What behavior do I keep repeating that doesn't serve me?" },
      { day: 3, week: 1, title: "Trace the Trigger", teaching: "Triggers are teachers in disguise. They point to where the healing needs to go.", actionType: "tool", actionLabel: "Explore My Triggers", toolRoute: "/healing-tools/emotional-trigger-tracker" },
      { day: 4, week: 1, title: "Meet Your Conditioning", teaching: "You were taught how to see yourself. That teaching can be unlearned.", actionType: "journal", actionLabel: "Journal Prompt", journalPrompt: "What did you learn about your worth growing up? Who taught you that?" },
      { day: 5, week: 1, title: "The Cost of Settling", teaching: "Settling is not safety. It's slow erosion.", actionType: "journal", actionLabel: "Journal Prompt", journalPrompt: "Where am I settling right now — and what is it costing me?" },
      { day: 6, week: 1, title: "Quiet Phase Check-In", teaching: "Sometimes the most important thing is to sit in what you've uncovered.", actionType: "tool", actionLabel: "Open The Quiet Phase™", toolRoute: "/emotional-surgery?module=2" },
      { day: 7, week: 1, title: "Week 1 Reflection", teaching: "You have spent 7 days seeing yourself. That is rare. That is brave.", actionType: "journal", actionLabel: "Journal Prompt", journalPrompt: "What is the most important thing I recognized this week?" },
    ],
  },
  {
    week: 2,
    theme: "Recalibration",
    tagline: "Reset your standard.",
    accentColor: "text-[#C9A84C]",
    accentHex: "#C9A84C",
    days: [
      { day: 8, week: 2, title: "Rewrite One Belief", teaching: "The belief is the block. Remove the belief, remove the ceiling.", actionType: "tool", actionLabel: "Open Limiting Belief Rewriter", toolRoute: "/healing-tools/limiting-belief-rewriter" },
      { day: 9, week: 2, title: "Set a New Standard", teaching: "Your standards are not rules. They are declarations of worth.", actionType: "journal", actionLabel: "Journal Prompt", journalPrompt: "What is one standard I am raising starting today?" },
      { day: 10, week: 2, title: "Money Story Reset", teaching: "Your income ceiling is a belief, not a fact.", actionType: "tool", actionLabel: "Open Money Story Audit", toolRoute: "/healing-tools/money-story-audit" },
      { day: 11, week: 2, title: "Identity Shift", teaching: "You are not becoming someone new. You are returning to who you always were.", actionType: "tool", actionLabel: "Open Identity Builder", toolRoute: "/healing-tools/affirmation-builder" },
      { day: 12, week: 2, title: "Forgiveness as Surgery", teaching: "Forgiveness is not for them. It is the surgical removal of their weight from your body.", actionType: "tool", actionLabel: "Open Forgiveness Exercise", toolRoute: "/healing-tools/inner-child-healing" },
      { day: 13, week: 2, title: "Boundary Declaration", teaching: "A boundary is not a wall. It is a blueprint for how you deserve to be treated.", actionType: "tool", actionLabel: "Open Boundary Builder", toolRoute: "/healing-tools/boundary-builder" },
      { day: 14, week: 2, title: "Week 2 Reflection", teaching: "In 7 days you have rewritten beliefs, raised standards, and begun to release. That is recalibration.", actionType: "journal", actionLabel: "Journal Prompt", journalPrompt: "What standard did I raise this week? What did I release?" },
    ],
  },
  {
    week: 3,
    theme: "Practice",
    tagline: "Do the work consistently.",
    accentColor: "text-[#3D1A6E]",
    accentHex: "#3D1A6E",
    days: [
      { day: 15, week: 3, title: "Daily Nervous System Reset", teaching: "Regulation is not a luxury. It is the foundation of transformation.", actionType: "tool", actionLabel: "Open Nervous System Reset", toolRoute: "/healing-tools/nervous-system-diagnostic" },
      { day: 16, week: 3, title: "How Would Love Respond?", teaching: "When you don't know what to do — ask this question.", actionType: "tool", actionLabel: "Open Digital Workbook", toolRoute: "/workbook?screen=3", journalPrompt: "Think of a situation you're facing right now. How would love respond?" },
      { day: 17, week: 3, title: "Abundance Evidence", teaching: "Your brain looks for what you train it to find. Train it to find abundance.", actionType: "tool", actionLabel: "Open Abundance Evidence Log", toolRoute: "/healing-tools/abundance-evidence-log" },
      { day: 18, week: 3, title: "Decision Alignment", teaching: "Every decision either expands your worth or contracts it.", actionType: "journal", actionLabel: "Journal Prompt", journalPrompt: "What decision am I facing right now? Which choice expands my worth?" },
      { day: 19, week: 3, title: "Oracle Pull", teaching: "Your subconscious already knows. Let it speak.", actionType: "tool", actionLabel: "Open Oracle Cards", toolRoute: "/oracle" },
      { day: 20, week: 3, title: "Celebration Practice", teaching: "Most people wait for the big win. Start celebrating the small ones.", actionType: "journal", actionLabel: "Journal Prompt", journalPrompt: "List 3 wins from this week, no matter how small." },
      { day: 21, week: 3, title: "Week 3 Reflection", teaching: "Practice is not perfection. Practice is showing up anyway.", actionType: "journal", actionLabel: "Journal Prompt", journalPrompt: "What did I do consistently this week that my old self wouldn't have done?" },
    ],
  },
  {
    week: 4,
    theme: "Integration",
    tagline: "Become it.",
    accentColor: "text-[#E8C97A]",
    accentHex: "#E8C97A",
    days: [
      { day: 22, week: 4, title: "Who Are You Now?", teaching: "You are not the same person who started Day 1. Name who you've become.", actionType: "journal", actionLabel: "Journal Prompt", journalPrompt: "Describe the version of you who completed 3 weeks of this work." },
      { day: 23, week: 4, title: "Manifestation Review", teaching: "What did you call in? What arrived? What is still on its way?", actionType: "tool", actionLabel: "Open Manifestation Tracker", toolRoute: "/healing-tools/manifestation-tracker" },
      { day: 24, week: 4, title: "Worth Thermostat Retake", teaching: "Growth needs to be measured. Let's see how far you've come.", actionType: "tool", actionLabel: "Retake Worth Thermostat™", toolRoute: "/assessment" },
      { day: 25, week: 4, title: "Before & After", teaching: "The gap between Day 1 and today is the evidence of your reset.", actionType: "tool", actionLabel: "Open Digital Workbook", toolRoute: "/workbook?screen=4", journalPrompt: "What has changed since Day 1? How do you feel different?" },
      { day: 26, week: 4, title: "Shadow Integration", teaching: "The parts of you that you've been afraid to look at are the parts that hold the most power.", actionType: "journal", actionLabel: "Journal Prompt", journalPrompt: "What part of myself am I still hiding? What would it mean to stop hiding it?" },
      { day: 27, week: 4, title: "Permission Granted", teaching: "You no longer need anyone's permission. You are the permission.", actionType: "mixed", actionLabel: "Pull Permission Slip", toolRoute: "/permission-slips", journalPrompt: "What am I giving myself permission to become?" },
      { day: 28, week: 4, title: "Embody It", teaching: "Transformation is not what you think. It's what you do consistently.", actionType: "journal", actionLabel: "Journal Prompt", journalPrompt: "What are my 3 non-negotiable daily actions going forward?" },
      { day: 29, week: 4, title: "Write Your New Story", teaching: "The old story is over. Write the new one.", actionType: "journal", actionLabel: "Journal Prompt", journalPrompt: "Who am I now? What do I believe about myself? What is my new standard?" },
      { day: 30, week: 4, title: "You Did It", teaching: "30 days. You showed up. You did the work. This is who you are now.", actionType: "tool", actionLabel: "See Completion", toolRoute: "" },
    ],
  },
];

export const allJourneyDays: JourneyDay[] = journeyWeeks.flatMap(w => w.days);

export function getWeekForDay(day: number): JourneyWeek {
  if (day <= 7) return journeyWeeks[0];
  if (day <= 14) return journeyWeeks[1];
  if (day <= 21) return journeyWeeks[2];
  return journeyWeeks[3];
}
