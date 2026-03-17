export interface ThermostatType {
  name: string;
  scoreMin: number;
  scoreMax: number;
  percentageMin: number;
  percentageMax: number;
  temperature: string;
  temperatureLabel: string;
  emoji: string;
  tagline: string;
  description: string;
  whatThisMeans: string[];
  goodNews: string;
  whatYouNeed: string[];
  nextSteps: { text: string; link: string }[];
  color: string;
}

export const thermostatTypes: ThermostatType[] = [
  {
    name: "The Settler",
    scoreMin: 25,
    scoreMax: 45,
    percentageMin: 20,
    percentageMax: 36,
    temperature: "55–65°",
    temperatureLabel: "Set to Crumbs",
    emoji: "🥶",
    tagline: "I'll take the crumbs because I don't believe I deserve the feast",
    description: "Your worth thermostat is currently set very low. You have been conditioned to accept crumbs when you deserve celebration. You likely struggle with chronic underearning, toxic relationships, poor boundaries, and settling for far less than you are worth in all areas of life.",
    whatThisMeans: [
      "You question whether good things are meant for you",
      "You make excuses for people who treat you poorly",
      "You give more than you receive and feel drained",
      "You downplay your gifts and hide your light",
      "You choose safety over growth and familiarity over fulfillment",
    ],
    goodNews: "Recognition is the first step. Now that you know your thermostat is set to crumbs you can begin the recalibration process. Your worth is not determined by your current circumstances — it is your birthright.",
    whatYouNeed: [
      "Deep emotional surgery to heal recognition deficit",
      "Complete thermostat recalibration across all life areas",
      "Tools to recognize and interrupt crumbs patterns",
      "Support to rebuild your worth from the foundation up",
    ],
    nextSteps: [
      { text: "Begin with Core Permission Granted meditation (20 min)", link: "/meditations" },
      { text: "Accept your first Permission Slip from the Self-Worth category", link: "/permission-slips" },
      { text: "Start Lesson 1 in the Wealth Track", link: "/healing-tools" },
      { text: "Open the Inner Child Healing Module in Healing Tools", link: "/healing-tools" },
    ],
    color: "from-blue-400 to-blue-600",
  },
  {
    name: "The Seeker",
    scoreMin: 46,
    scoreMax: 65,
    percentageMin: 37,
    percentageMax: 52,
    temperature: "65–68°",
    temperatureLabel: "Set to Not Quite Enough",
    emoji: "🔍",
    tagline: "I'm searching for my worth but keep looking outside myself",
    description: "Your worth thermostat is set below what you deserve but you are aware something needs to change. You are searching for validation outside yourself and struggle to fully claim your worth. You know you deserve better but you do not quite believe it yet.",
    whatThisMeans: [
      "You attract people and opportunities that almost meet your needs",
      "You start strong but struggle to maintain boundaries",
      "You second-guess your intuition and seek others' approval",
      "You have flashes of confidence followed by self-doubt",
      "You are tired of settling but do not know how to stop",
    ],
    goodNews: "You are in the perfect position for transformation. You are aware enough to know something is off but not so stuck that you cannot shift. Your thermostat just needs recalibration and you are ready for it.",
    whatYouNeed: [
      "Recognition deficit healing to stop looking outside yourself",
      "Boundary setting skills that actually stick",
      "Tools to rebuild self-trust",
      "Support to maintain your new worth setting",
    ],
    nextSteps: [
      { text: "Start the Permission to Receive meditation (20 min)", link: "/meditations" },
      { text: "Browse Permission Slips in the Love and Relationships category", link: "/permission-slips" },
      { text: "Open the Boundary Builder in Healing Tools", link: "/healing-tools" },
      { text: "Begin Lesson 2 in the Love Track: The Abandonment Pattern", link: "/healing-tools" },
    ],
    color: "from-cyan-400 to-cyan-600",
  },
  {
    name: "The Boundary Builder",
    scoreMin: 66,
    scoreMax: 85,
    percentageMin: 53,
    percentageMax: 68,
    temperature: "68–70°",
    temperatureLabel: "Set to Getting Warmer",
    emoji: "🏗️",
    tagline: "I'm learning to set boundaries but still struggle with guilt",
    description: "Your worth thermostat is improving. You are learning to set boundaries and honor your needs but you still struggle with guilt and inconsistency. You know your worth intellectually but embodying it fully is still a work in progress.",
    whatThisMeans: [
      "You set boundaries but sometimes cave under pressure",
      "You celebrate your wins but still minimize your gifts",
      "You invest in yourself but feel guilty doing it",
      "You are growing but the old patterns still sneak in",
      "You want to go all the way but something is holding you back",
    ],
    goodNews: "You are doing the work. You have already raised your thermostat significantly. Now you just need to fine-tune it, solidify your new patterns, and eliminate the remaining guilt and self-doubt.",
    whatYouNeed: [
      "Reinforcement of your boundary-setting skills",
      "Tools to eliminate guilt around self-care and self-investment",
      "Support to maintain your new thermostat setting",
      "Community of people operating at celebration level",
    ],
    nextSteps: [
      { text: "Start Permission to Choose Yourself meditation (20 min)", link: "/meditations" },
      { text: "Complete the Money Story Audit in Healing Tools", link: "/healing-tools" },
      { text: "Explore the Shadow Work Library", link: "/healing-tools" },
      { text: "Begin the 30-Day Experience for full transformation", link: "/healing-tools" },
    ],
    color: "from-emerald-400 to-emerald-600",
  },
  {
    name: "The Rising Queen / King",
    scoreMin: 86,
    scoreMax: 105,
    percentageMin: 69,
    percentageMax: 84,
    temperature: "70–72°",
    temperatureLabel: "Set to Celebration",
    emoji: "👑",
    tagline: "I know my worth and I'm stepping into my power",
    description: "Your worth thermostat is set to celebration. You know your worth, set strong boundaries, and attract relationships and opportunities that honor you. You still have moments of doubt but they are becoming less frequent. You are rising into your full power.",
    whatThisMeans: [
      "You recognize your worth and expect others to honor it",
      "You set boundaries without excessive guilt",
      "You invest in yourself and your growth",
      "You attract quality people and opportunities",
      "You are becoming the woman you were always meant to be",
    ],
    goodNews: "You are operating at a high level. Your work now is to maintain this setting, expand your capacity for receiving, and step fully into your leadership and visibility.",
    whatYouNeed: [
      "Support to expand beyond your current thermostat ceiling",
      "Tools to handle next-level challenges that come with growth",
      "Community of other high-worth individuals",
      "Advanced manifestation and quantum leap strategies",
    ],
    nextSteps: [
      { text: "Start Quantum Leap Abundance meditation (22 min)", link: "/meditations" },
      { text: "Open the Visibility Challenge Tracker in Healing Tools", link: "/healing-tools" },
      { text: "Complete the CEO Self-Assessment", link: "/healing-tools" },
      { text: "Begin the 30-Day Experience", link: "/healing-tools" },
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
    temperatureLabel: "Set to Full Celebration",
    emoji: "🔥",
    tagline: "I demand celebration and accept nothing less than I deserve",
    description: "Your worth thermostat is set to FULL celebration. You demand what you deserve and accept nothing less. You know your worth, honor your boundaries, and create a life that reflects your value. You are operating at the highest level.",
    whatThisMeans: [
      "You effortlessly attract relationships and opportunities that honor you",
      "You set boundaries without guilt or apology",
      "You celebrate your wins and acknowledge your brilliance",
      "You trust your intuition completely",
      "You are a magnet for abundance love and success",
    ],
    goodNews: "You have done the work. Your thermostat is calibrated to celebration. Now your work is to maintain this setting, expand your impact, and help others raise their thermostats.",
    whatYouNeed: [
      "Community of other high-level individuals",
      "Advanced strategies for manifestation and quantum leaps",
      "Opportunities to teach and share your transformation",
      "Support in expanding your leadership and visibility",
    ],
    nextSteps: [
      { text: "Start Generational Wealth Activation meditation (22 min)", link: "/meditations" },
      { text: "Explore all Oracle Spreads starting with the Master Spread", link: "/oracle" },
      { text: "Complete the 30-Day Experience and Digital Workbook", link: "/healing-tools" },
      { text: "Share your referral link and invite someone into the reset", link: "/my-account" },
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
