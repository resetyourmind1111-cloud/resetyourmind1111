export interface ThermostatType {
  name: string;
  scoreMin: number;
  scoreMax: number;
  percentageMin: number;
  percentageMax: number;
  temperature: string;
  emoji: string;
  tagline: string;
  description: string;
  whatThisMeans: string;
  whatYouNeed: string[];
  nextSteps: string[];
  color: string;
}

export const thermostatTypes: ThermostatType[] = [
  {
    name: "The Settler",
    scoreMin: 25,
    scoreMax: 45,
    percentageMin: 20,
    percentageMax: 36,
    temperature: "55-65°",
    emoji: "🥶",
    tagline: "I'll take the crumbs because I don't believe I deserve the feast",
    description: "Your worth thermostat is currently set very low. You've been conditioned to accept crumbs when you deserve celebration. You likely struggle with chronic underearning, toxic relationships, poor boundaries, and settling for far less than you're worth.",
    whatThisMeans: "You've internalized messages that you're not enough, not worthy, or don't deserve good things. This isn't your fault—it's conditioning. But it IS something you can change.",
    whatYouNeed: [
      "Deep emotional surgery",
      "Complete thermostat recalibration",
      "Recognition deficit healing",
      "Daily worth affirmations",
    ],
    nextSteps: [
      "Start with the Permission Granted deck daily",
      "Complete the 30-page workbook",
      "Listen to Mind meditations every day",
      "Consider VIP coaching for breakthrough support",
    ],
    color: "from-blue-400 to-blue-600",
  },
  {
    name: "The Seeker",
    scoreMin: 46,
    scoreMax: 65,
    percentageMin: 37,
    percentageMax: 52,
    temperature: "65-68°",
    emoji: "🔍",
    tagline: "I'm searching for my worth but keep looking outside myself",
    description: "Your worth thermostat is set below what you deserve, but you're aware something needs to change. You're searching for validation outside yourself and struggle to fully claim your worth.",
    whatThisMeans: "You know you deserve more, but you're not sure how to get it. You might be caught in cycles of trying to prove yourself or seeking approval from others.",
    whatYouNeed: [
      "Recognition deficit healing",
      "Deep Love Question framework",
      "Boundary-setting skills",
      "Self-validation practices",
    ],
    nextSteps: [
      "Use the Permission Granted deck for daily guidance",
      "Practice the Deep Love Question with every decision",
      "Complete workbook pages on boundaries",
      "Join the community for support",
    ],
    color: "from-cyan-400 to-cyan-600",
  },
  {
    name: "The Boundary Builder",
    scoreMin: 66,
    scoreMax: 85,
    percentageMin: 53,
    percentageMax: 68,
    temperature: "68-70°",
    emoji: "🏗️",
    tagline: "I'm learning to set boundaries but still struggle with guilt",
    description: "Your worth thermostat is improving! You're learning to set boundaries and honor your needs, but you still struggle with guilt and inconsistency. You know your worth intellectually but embodying it fully is still a work in progress.",
    whatThisMeans: "You're on the right path. You're becoming aware of your patterns and starting to make changes. The work now is about consistency and releasing guilt.",
    whatYouNeed: [
      "Reinforcement of boundary-setting",
      "Tools to eliminate guilt",
      "Community support",
      "Celebration practice",
    ],
    nextSteps: [
      "Use both oracle decks for deeper insights",
      "Focus on Soul meditations",
      "Complete the weekly permission practices",
      "Celebrate every boundary you maintain",
    ],
    color: "from-emerald-400 to-emerald-600",
  },
  {
    name: "The Rising Queen",
    scoreMin: 86,
    scoreMax: 105,
    percentageMin: 69,
    percentageMax: 84,
    temperature: "70-72°",
    emoji: "👑",
    tagline: "I know my worth and I'm stepping into my power",
    description: "Your worth thermostat is set to celebration! You know your worth, set strong boundaries, and attract relationships and opportunities that honor you. You still have moments of doubt, but they're becoming less frequent.",
    whatThisMeans: "You're living in alignment with your worth most of the time. The work now is about expanding beyond your current ceiling and stepping into even greater possibilities.",
    whatYouNeed: [
      "Expansion beyond current ceiling",
      "Next-level tools",
      "Community of high-worth individuals",
      "Leadership opportunities",
    ],
    nextSteps: [
      "Focus on Abundance deck for expansion",
      "Complete advanced workbook sections",
      "Consider VIP tier for next-level growth",
      "Start sharing your transformation with others",
    ],
    color: "from-violet-400 to-violet-600",
  },
  {
    name: "The Unapologetic",
    scoreMin: 106,
    scoreMax: 125,
    percentageMin: 85,
    percentageMax: 100,
    temperature: "72°+",
    emoji: "🔥",
    tagline: "I demand celebration and accept nothing less than I deserve",
    description: "Your worth thermostat is set to FULL celebration! You demand what you deserve and accept nothing less. You know your worth, honor your boundaries, and create a life that reflects your value.",
    whatThisMeans: "You're living as your highest self. You understand that your worth is non-negotiable and you attract experiences that reflect this knowing.",
    whatYouNeed: [
      "Opportunities to teach and share",
      "Leadership platform",
      "Mastermind community",
      "Ways to expand your impact",
    ],
    nextSteps: [
      "Consider becoming a certified facilitator",
      "Lead by example in the community",
      "Share your journey to inspire others",
      "Continue your daily practices to maintain your high thermostat",
    ],
    color: "from-amber-400 to-orange-500",
  },
];

export function getThermostatType(score: number): ThermostatType {
  const type = thermostatTypes.find(
    (t) => score >= t.scoreMin && score <= t.scoreMax
  );
  return type || thermostatTypes[0];
}

export function calculateCategoryScores(
  answers: Record<number, number>
): Record<string, number> {
  const categoryRanges: Record<string, [number, number]> = {
    love: [1, 5],
    money: [6, 10],
    career: [11, 15],
    boundaries: [16, 20],
    action: [21, 25],
  };

  const scores: Record<string, number> = {};

  for (const [category, [start, end]] of Object.entries(categoryRanges)) {
    let total = 0;
    for (let i = start; i <= end; i++) {
      total += answers[i] || 0;
    }
    scores[category] = total;
  }

  return scores;
}

export function calculateTotalScore(answers: Record<number, number>): number {
  return Object.values(answers).reduce((sum, score) => sum + score, 0);
}

export function calculatePercentage(totalScore: number): number {
  return Math.round((totalScore / 125) * 100);
}
