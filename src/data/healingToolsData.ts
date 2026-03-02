export interface HealingTool {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
}

export const healingTools: HealingTool[] = [
  { id: "limiting-belief-rewriter", name: "Limiting Belief Rewriter", icon: "🔄", description: "Identify and rewrite the beliefs keeping you stuck", category: "Mindset" },
  { id: "emotional-trigger-tracker", name: "Emotional Trigger Tracker", icon: "🎯", description: "Map your triggers to heal the wounds beneath them", category: "Emotional" },
  { id: "inner-child-healing", name: "Inner Child Healing Module", icon: "🧸", description: "Heal the younger version of you still carrying old wounds", category: "Healing" },
  { id: "shadow-work-library", name: "Shadow Work Library", icon: "🌑", description: "Integrate the parts of yourself you have been hiding", category: "Shadow" },
  { id: "money-story-audit", name: "Money Story Audit", icon: "💰", description: "Uncover the money story running your financial life", category: "Abundance" },
  { id: "abundance-evidence-log", name: "Abundance Evidence Log", icon: "✨", description: "Train your brain to see abundance everywhere", category: "Abundance" },
  { id: "income-frequency-tracker", name: "Income Frequency Tracker", icon: "📈", description: "Track every dollar that flows to you and celebrate it", category: "Abundance" },
  { id: "manifestation-tracker", name: "Manifestation Tracker", icon: "🌟", description: "Track your intentions from desire to reality", category: "Manifestation" },
  { id: "boundary-builder", name: "Boundary Builder", icon: "🛡️", description: "Build real boundaries and learn to hold them", category: "Boundaries" },
  { id: "attachment-style-analyzer", name: "Attachment Style Analyzer", icon: "💞", description: "Understand how you attach and why", category: "Relationships" },
  { id: "moon-phase-tracker", name: "Moon Phase Tracker & Ritual Guide", icon: "🌙", description: "Align your intentions and healing with lunar energy", category: "Spiritual" },
  { id: "angel-number-journal", name: "Angel Number Journal", icon: "1111", description: "Track and decode the numbers showing up in your life", category: "Spiritual" },
  { id: "somatic-breathing", name: "Somatic Breathing Exercises", icon: "🌬️", description: "Use breath as medicine to regulate your nervous system", category: "Somatic" },
  { id: "body-map-journal", name: "Body Map Journal", icon: "🧘", description: "Decode what your body is telling you", category: "Somatic" },
  { id: "affirmation-builder", name: "Affirmation Builder & Daily Alarm", icon: "💌", description: "Create personal affirmations and receive them daily", category: "Mindset" },
  { id: "visibility-challenge", name: "Visibility Challenge Tracker", icon: "👁️", description: "Build your visibility muscle with 30 daily challenges", category: "Growth" },
  { id: "ceo-self-assessment", name: "CEO Self-Assessment", icon: "👑", description: "Evaluate how you are showing up as CEO of your life", category: "Leadership" },
  { id: "values-clarity-tool", name: "Values Clarity Tool", icon: "💎", description: "Identify your core values and align your life to them", category: "Purpose" },
];
