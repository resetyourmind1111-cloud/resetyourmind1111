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
  {
    category: "Love & Relationships",
    text: "In relationships, you tend to:",
    options: ["Give much more than you receive and feel drained", "Keep your guard up and rarely let people see the real you", "Alternate between being super giving and then pulling back", "Give and receive in natural flow with healthy boundaries", "Effortlessly maintain reciprocal, secure connections"],
  },
  {
    category: "Love & Relationships",
    text: "When conflict arises in a relationship, you typically:",
    options: ["You immediately assume you did something wrong", "You shut down or withdraw to avoid confrontation", "You try to fix everything and make everyone happy", "You stay centered and communicate your needs clearly", "You navigate conflict with confidence and emotional safety"],
  },
  {
    category: "Love & Relationships",
    text: "Your past relationships have mostly taught you:",
    options: ["That love always comes with pain and disappointment", "That you have to be perfect to be loved", "That you attract unavailable or wounded people", "That healthy love is possible and you deserve it", "That you naturally attract secure, loving partnerships"],
  },
  {
    category: "Love & Relationships",
    text: "When someone treats you poorly:",
    options: ["You make excuses for them and blame yourself", "You tolerate it longer than you should", "You feel angry but struggle to set clear boundaries", "You address it directly or remove yourself from the situation", "You maintain your worth and expect respectful treatment always"],
  },
  {
    category: "Money & Abundance",
    text: "When you think about money, you usually feel:",
    options: ["Anxious, stressed, or defeated", "Guilty or ashamed about wanting more", "Frustrated that others have it easier than you", "Neutral and capable of managing it well", "Abundant and confident in your ability to attract it"],
  },
  {
    category: "Money & Abundance",
    text: "When it comes to charging for your work or services:",
    options: ["You undercharge or avoid asking altogether", "You feel guilty charging what you're actually worth", "You charge something but always feel nervous about it", "You charge your worth and feel mostly comfortable", "You confidently charge premium rates and people gladly pay"],
  },
  {
    category: "Money & Abundance",
    text: "Your spending habits reflect:",
    options: ["Scarcity - hoarding or deprivation", "Chaos - overspending then restricting", "People-pleasing - spending on others, not yourself", "Balance - enjoying money while saving responsibly", "Abundance - flowing easily with generosity and joy"],
  },
  {
    category: "Money & Abundance",
    text: "When unexpected money comes in (bonus, gift, windfall):",
    options: ["You worry about when it will run out", "You feel you don't deserve it or it's a fluke", "You immediately give it away or spend it on others", "You receive it gratefully and use it wisely", "You celebrate it as natural and expect more to come"],
  },
  {
    category: "Money & Abundance",
    text: "Financial opportunities (investments, promotions, ventures):",
    options: ["Feel scary and you usually avoid them", "Feel tempting but you talk yourself out of them", "Feel exciting but you need others' approval first", "Feel manageable and you evaluate them clearly", "Feel magnetic and you trust your intuition fully"],
  },
  {
    category: "Career & Purpose",
    text: "In your career or calling, you:",
    options: ["Feel stuck, invisible, or undervalued", "Work hard but feel like no one notices", "Have skills but struggle to show up confidently", "Feel aligned and are building momentum", "Feel magnetic, visible, and in your power"],
  },
  {
    category: "Career & Purpose",
    text: "When it's time to promote yourself or your work:",
    options: ["You hide and hope someone discovers you", "You feel uncomfortable and avoid self-promotion", "You do it but minimize your achievements", "You share your wins with healthy confidence", "You celebrate your genius without apology"],
  },
  {
    category: "Career & Purpose",
    text: "Your relationship with visibility is:",
    options: ["Terrifying - you actively avoid being seen", "Uncomfortable - you shrink to stay safe", "Conflicted - you want it but fear judgment", "Growing - you're learning to be seen authentically", "Natural - you shine without dimming for others"],
  },
  {
    category: "Career & Purpose",
    text: "When you share your gifts or talents:",
    options: ["You downplay them or give them away for free", "You wait for permission or validation first", "You share but apologize or deflect praise", "You share with confidence and receive appreciation", "You share powerfully knowing your impact matters"],
  },
  {
    category: "Career & Purpose",
    text: "Your sense of purpose feels:",
    options: ["Lost, unclear, or overwhelming", "Present but buried under obligations", "Emerging but you doubt if it's \"enough\"", "Clear and you're taking aligned action", "Magnetic and naturally unfolding with ease"],
  },
  {
    category: "Self-Care & Boundaries",
    text: "When you need rest or time for yourself:",
    options: ["You feel guilty and push through exhaustion", "You wait until you're burned out or sick", "You take it but feel selfish doing so", "You honor your needs without excessive guilt", "You prioritize self-care as non-negotiable"],
  },
  {
    category: "Self-Care & Boundaries",
    text: "Your boundaries with others are:",
    options: ["Nonexistent - you say yes to everything", "Weak - you set them but don't enforce them", "Shaky - you enforce some but cave under pressure", "Strong - you communicate and maintain them", "Unshakable - you protect your energy fiercely"],
  },
  {
    category: "Self-Care & Boundaries",
    text: "When someone asks for your time or energy:",
    options: ["You immediately say yes even if it drains you", "You want to say no but feel too guilty", "You say yes then resent them later", "You check in with yourself before responding", "You honor your truth without guilt or explanation"],
  },
  {
    category: "Self-Care & Boundaries",
    text: "How you treat your body reflects:",
    options: ["Neglect - ignoring signals and needs", "Punishment - harsh self-criticism", "Inconsistency - caring for it only sometimes", "Respect - honoring what it needs", "Reverence - treating it as sacred"],
  },
  {
    category: "Self-Care & Boundaries",
    text: "Your self-talk sounds like:",
    options: ["Harsh criticism and constant judgment", "Disappointment and frustration with yourself", "Conditional - kind only when you \"earn\" it", "Encouraging - like a supportive friend", "Loving - like someone who adores you completely"],
  },
  {
    category: "Action & Self-Trust",
    text: "When you set goals, you typically:",
    options: ["Don't set them because you expect to fail", "Set them but abandon them when it gets hard", "Set them but need constant external motivation", "Set them and take consistent action toward them", "Set them and watch them manifest with flow"],
  },
  {
    category: "Action & Self-Trust",
    text: "Your relationship with taking action is:",
    options: ["Paralyzed by fear or procrastination", "Waiting for the \"perfect\" moment that never comes", "Taking action but second-guessing every step", "Moving forward with clarity and confidence", "Taking bold, aligned action that creates results"],
  },
  {
    category: "Action & Self-Trust",
    text: "When opportunities arise:",
    options: ["You assume there's a catch or it's too good to be true", "You feel unworthy and let others take them instead", "You consider them but talk yourself out of most", "You evaluate them clearly and choose what aligns", "You trust that perfect opportunities flow to you easily"],
  },
  {
    category: "Action & Self-Trust",
    text: "Your energy around your goals is:",
    options: ["Defeated before you start", "Hopeful but realistic about limitations", "Motivated but inconsistent in action", "Determined and taking consistent steps", "Magnetic and naturally manifesting outcomes"],
  },
  {
    category: "Action & Self-Trust",
    text: "Overall, you believe:",
    options: ["Life is hard and good things don't happen to people like me", "I have to work twice as hard as others to get half as much", "I deserve good things but they require sacrifice and struggle", "I am worthy of love, success, and abundance", "I am a powerful creator who effortlessly attracts my desires"],
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