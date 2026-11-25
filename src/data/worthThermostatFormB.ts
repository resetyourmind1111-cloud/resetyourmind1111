export interface WorthQuestion {
  category: string;
  text: string;
  options: [string, string, string, string, string];
}

export const QUESTION_COUNT = 25;
export const QUESTIONS: WorthQuestion[] = [
  {
    category: "Love & Relationships",
    text: "When someone shows genuine interest in you, your first instinct is usually:",
    options: [
      "To question what they really want or if there's a catch",
      "To feel flattered but assume it won't last",
      'To feel excited but nervous about being "too much"',
      "To feel open and curious about the connection",
      "To receive their interest as natural and deserved",
    ],
  },
];

export type ResultType = "The Settler" | "The Seeker" | "The Boundary Builder" | "The Rising Queen / King";
export interface WorthResult {
  temperature: string;
  setting: string;
  tagline?: string;
  description: string;
  meaning?: string[];
  goodNews?: string;
  needs: string;
  firstSteps: string[];
  slip: string;
  meditation: string;
  tool: string;
  toolDescription: string;
}

export const RESULTS: Record<ResultType, WorthResult> = {
  "The Settler": {
    temperature: "55–65°", setting: "SET TO CRUMBS",
    tagline: "I'll take the crumbs because I don't believe I deserve the feast.",
    description: "You have been conditioned to accept crumbs — settling has become home. But your worth is not determined by what you have settled for — it is determined by what you are willing to claim.",
    meaning: ["Questions whether good things are meant for you", "Makes excuses for people who treat you poorly", "Gives more than you receive, and feels drained", "Downplays your gifts and hides your light", "Chooses safety over growth"],
    goodNews: "Recognition is the first step — and worth is a birthright, not something you earn.",
    needs: "Deep emotional surgery for the recognition deficit; a complete recalibration across all life areas; tools to interrupt crumbs patterns; support to rebuild worth from the foundation.",
    firstSteps: ["Core Permission Granted meditation", "your first Permission Slip on Self-Worth", "Abundance Evidence Log", "Inner Child Letter tool"],
    slip: "Permission to know you are enough right now", meditation: "Core Permission Granted", tool: "Abundance Evidence Log",
    toolDescription: "A daily log that builds your personal evidence that good things are meant for you.",
  },
  "The Seeker": {
    temperature: "65–68°", setting: "SET TO NOT QUITE ENOUGH",
    tagline: "I'm searching for my worth but keep looking outside myself.",
    description: "Your setting is rising, but you still look outside yourself for proof of your worth — flashes of confidence followed by self-doubt.",
    needs: "To stop looking outside yourself; boundary skills that stick; rebuilt self-trust; support to maintain the new setting.",
    firstSteps: ["Learning to Receive meditation", "Permission Slips on Love & Relationships", "Boundary Builder", "Attachment Style Analyzer"],
    slip: "Permission to believe that you already have the answers", meditation: "Permission to Receive", tool: "Boundary Builder",
    toolDescription: "A guided tool for setting boundaries that hold, without the guilt spiral.",
  },
  "The Boundary Builder": {
    temperature: "68–70°", setting: "SET TO GETTING WARMER",
    tagline: "I'm learning to set boundaries but still struggle with guilt.",
    description: "Your setting is rising — the work now is maintaining boundaries under pressure and expanding your capacity to receive.",
    needs: "Boundary maintenance under pressure; room to receive without sabotaging it; support that matches your rising setting.",
    firstSteps: ["Boundaries as Love meditation", "Shadow Work Prompt", "Emotional Surgery modules", "30-Day Experience"],
    slip: "Permission to keep good things without sabotaging them", meditation: "Permission to Receive", tool: "Money Story Audit",
    toolDescription: "A guided look at the money story running your setting, and what to rewrite first.",
  },
  "The Rising Queen / King": {
    temperature: "70–72°", setting: "SET TO CELEBRATION",
    description: "Your thermostat is set to celebration — you receive as natural and deserved. The work now is expanding beyond the current ceiling.",
    needs: "Tools for next-level challenges; a community of high-worth peers; advanced strategies for your next expansion.",
    firstSteps: ["Abundance Frequency meditation", "Affirmation Builder", "Wellness Hub", "30-Day Experience"],
    slip: "Permission to allow your brilliance to be witnessed", meditation: "Quantum Leap Abundance", tool: "Affirmation Builder",
    toolDescription: "Build affirmations in your own words that match your rising setting.",
  },
};

export function scoreAnswers(answers: readonly number[]) {
  if (answers.length !== QUESTION_COUNT || answers.some(value => !Number.isInteger(value) || value < 1 || value > 5)) {
    throw new Error("Complete all 25 questions before receiving a result.");
  }
  const raw_score = answers.reduce((sum, value) => sum + value, 0);
  const percentage = Math.round(raw_score / 125 * 100);
  const result_type: ResultType = percentage < 40 ? "The Settler" : percentage < 60 ? "The Seeker" : percentage < 80 ? "The Boundary Builder" : "The Rising Queen / King";
  return { raw_score, percentage, result_type };
}