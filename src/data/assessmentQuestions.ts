export interface AssessmentOption {
  text: string;
  points: number;
}

export interface AssessmentQuestion {
  id: number;
  category: 'love' | 'money' | 'career' | 'boundaries' | 'action';
  categoryLabel: string;
  question: string;
  options: AssessmentOption[];
}

export const assessmentQuestions: AssessmentQuestion[] = [
  // CATEGORY 1: LOVE & RELATIONSHIPS (Q1-5)
  {
    id: 1,
    category: 'love',
    categoryLabel: 'Love & Relationships',
    question: "When someone shows genuine interest in you, your first instinct is usually:",
    options: [
      { text: "To question what they really want or if there's a catch", points: 1 },
      { text: "To feel flattered but assume it won't last", points: 2 },
      { text: "To feel excited but nervous about being \"too much\"", points: 3 },
      { text: "To feel open and curious about the connection", points: 4 },
      { text: "To receive their interest as natural and deserved", points: 5 },
    ],
  },
  {
    id: 2,
    category: 'love',
    categoryLabel: 'Love & Relationships',
    question: "In relationships, you tend to:",
    options: [
      { text: "Give much more than you receive and feel drained", points: 1 },
      { text: "Keep your guard up and rarely let people see the real you", points: 2 },
      { text: "Alternate between being super giving and then pulling back", points: 3 },
      { text: "Give and receive in natural flow with healthy boundaries", points: 4 },
      { text: "Effortlessly maintain reciprocal, secure connections", points: 5 },
    ],
  },
  {
    id: 3,
    category: 'love',
    categoryLabel: 'Love & Relationships',
    question: "When conflict arises with someone you care about:",
    options: [
      { text: "You immediately assume you did something wrong", points: 1 },
      { text: "You shut down or withdraw to avoid confrontation", points: 2 },
      { text: "You try to fix everything and make everyone happy", points: 3 },
      { text: "You stay centered and communicate your needs clearly", points: 4 },
      { text: "You navigate conflict with confidence and emotional safety", points: 5 },
    ],
  },
  {
    id: 4,
    category: 'love',
    categoryLabel: 'Love & Relationships',
    question: "Your past relationships have mostly taught you:",
    options: [
      { text: "That love always comes with pain and disappointment", points: 1 },
      { text: "That you have to be perfect to be loved", points: 2 },
      { text: "That you attract unavailable or wounded people", points: 3 },
      { text: "That healthy love is possible and you deserve it", points: 4 },
      { text: "That you naturally attract secure, loving partnerships", points: 5 },
    ],
  },
  {
    id: 5,
    category: 'love',
    categoryLabel: 'Love & Relationships',
    question: "When someone treats you poorly:",
    options: [
      { text: "You make excuses for them and blame yourself", points: 1 },
      { text: "You tolerate it longer than you should", points: 2 },
      { text: "You feel angry but struggle to set clear boundaries", points: 3 },
      { text: "You address it directly or remove yourself from the situation", points: 4 },
      { text: "You maintain your worth and expect respectful treatment always", points: 5 },
    ],
  },

  // CATEGORY 2: MONEY & ABUNDANCE (Q6-10)
  {
    id: 6,
    category: 'money',
    categoryLabel: 'Money & Abundance',
    question: "When you think about money, you usually feel:",
    options: [
      { text: "Anxious, stressed, or defeated", points: 1 },
      { text: "Guilty or ashamed about wanting more", points: 2 },
      { text: "Frustrated that others have it easier than you", points: 3 },
      { text: "Neutral and capable of managing it well", points: 4 },
      { text: "Abundant and confident in your ability to attract it", points: 5 },
    ],
  },
  {
    id: 7,
    category: 'money',
    categoryLabel: 'Money & Abundance',
    question: "When it comes to charging for your work or asking for a raise:",
    options: [
      { text: "You undercharge or avoid asking altogether", points: 1 },
      { text: "You feel guilty charging what you're actually worth", points: 2 },
      { text: "You charge something but always feel nervous about it", points: 3 },
      { text: "You charge your worth and feel mostly comfortable", points: 4 },
      { text: "You confidently charge premium rates and people gladly pay", points: 5 },
    ],
  },
  {
    id: 8,
    category: 'money',
    categoryLabel: 'Money & Abundance',
    question: "Your spending habits reflect:",
    options: [
      { text: "Scarcity - hoarding or deprivation", points: 1 },
      { text: "Chaos - overspending then restricting", points: 2 },
      { text: "People-pleasing - spending on others, not yourself", points: 3 },
      { text: "Balance - enjoying money while saving responsibly", points: 4 },
      { text: "Abundance - flowing easily with generosity and joy", points: 5 },
    ],
  },
  {
    id: 9,
    category: 'money',
    categoryLabel: 'Money & Abundance',
    question: "When unexpected money comes in (bonus, gift, windfall):",
    options: [
      { text: "You worry about when it will run out", points: 1 },
      { text: "You feel you don't deserve it or it's a fluke", points: 2 },
      { text: "You immediately give it away or spend it on others", points: 3 },
      { text: "You receive it gratefully and use it wisely", points: 4 },
      { text: "You celebrate it as natural and expect more to come", points: 5 },
    ],
  },
  {
    id: 10,
    category: 'money',
    categoryLabel: 'Money & Abundance',
    question: "Financial opportunities (investments, promotions, ventures):",
    options: [
      { text: "Feel scary and you usually avoid them", points: 1 },
      { text: "Feel tempting but you talk yourself out of them", points: 2 },
      { text: "Feel exciting but you need others' approval first", points: 3 },
      { text: "Feel manageable and you evaluate them clearly", points: 4 },
      { text: "Feel magnetic and you trust your intuition fully", points: 5 },
    ],
  },

  // CATEGORY 3: CAREER & PURPOSE (Q11-15)
  {
    id: 11,
    category: 'career',
    categoryLabel: 'Career & Purpose',
    question: "In your career or calling, you:",
    options: [
      { text: "Feel stuck, invisible, or undervalued", points: 1 },
      { text: "Work hard but feel like no one notices", points: 2 },
      { text: "Have skills but struggle to show up confidently", points: 3 },
      { text: "Feel aligned and are building momentum", points: 4 },
      { text: "Feel magnetic, visible, and in your power", points: 5 },
    ],
  },
  {
    id: 12,
    category: 'career',
    categoryLabel: 'Career & Purpose',
    question: "When it's time to promote yourself or your work:",
    options: [
      { text: "You hide and hope someone discovers you", points: 1 },
      { text: "You feel uncomfortable and avoid self-promotion", points: 2 },
      { text: "You do it but minimize your achievements", points: 3 },
      { text: "You share your wins with healthy confidence", points: 4 },
      { text: "You celebrate your genius without apology", points: 5 },
    ],
  },
  {
    id: 13,
    category: 'career',
    categoryLabel: 'Career & Purpose',
    question: "Your relationship with visibility is:",
    options: [
      { text: "Terrifying - you actively avoid being seen", points: 1 },
      { text: "Uncomfortable - you shrink to stay safe", points: 2 },
      { text: "Conflicted - you want it but fear judgment", points: 3 },
      { text: "Growing - you're learning to be seen authentically", points: 4 },
      { text: "Natural - you shine without dimming for others", points: 5 },
    ],
  },
  {
    id: 14,
    category: 'career',
    categoryLabel: 'Career & Purpose',
    question: "When you share your gifts or talents:",
    options: [
      { text: "You downplay them or give them away for free", points: 1 },
      { text: "You wait for permission or validation first", points: 2 },
      { text: "You share but apologize or deflect praise", points: 3 },
      { text: "You share with confidence and receive appreciation", points: 4 },
      { text: "You share powerfully knowing your impact matters", points: 5 },
    ],
  },
  {
    id: 15,
    category: 'career',
    categoryLabel: 'Career & Purpose',
    question: "Your sense of purpose feels:",
    options: [
      { text: "Lost, unclear, or overwhelming", points: 1 },
      { text: "Present but buried under obligations", points: 2 },
      { text: "Emerging but you doubt if it's \"enough\"", points: 3 },
      { text: "Clear and you're taking aligned action", points: 4 },
      { text: "Magnetic and naturally unfolding with ease", points: 5 },
    ],
  },

  // CATEGORY 4: SELF-CARE & BOUNDARIES (Q16-20)
  {
    id: 16,
    category: 'boundaries',
    categoryLabel: 'Self-Care & Boundaries',
    question: "When you need rest or time for yourself:",
    options: [
      { text: "You feel guilty and push through exhaustion", points: 1 },
      { text: "You wait until you're burned out or sick", points: 2 },
      { text: "You take it but feel selfish doing so", points: 3 },
      { text: "You honor your needs without excessive guilt", points: 4 },
      { text: "You prioritize self-care as non-negotiable", points: 5 },
    ],
  },
  {
    id: 17,
    category: 'boundaries',
    categoryLabel: 'Self-Care & Boundaries',
    question: "Your boundaries with others are:",
    options: [
      { text: "Nonexistent - you say yes to everything", points: 1 },
      { text: "Weak - you set them but don't enforce them", points: 2 },
      { text: "Shaky - you enforce some but cave under pressure", points: 3 },
      { text: "Strong - you communicate and maintain them", points: 4 },
      { text: "Unshakable - you protect your energy fiercely", points: 5 },
    ],
  },
  {
    id: 18,
    category: 'boundaries',
    categoryLabel: 'Self-Care & Boundaries',
    question: "When someone asks for your time or energy:",
    options: [
      { text: "You immediately say yes even if it drains you", points: 1 },
      { text: "You want to say no but feel too guilty", points: 2 },
      { text: "You say yes then resent them later", points: 3 },
      { text: "You check in with yourself before responding", points: 4 },
      { text: "You honor your truth without guilt or explanation", points: 5 },
    ],
  },
  {
    id: 19,
    category: 'boundaries',
    categoryLabel: 'Self-Care & Boundaries',
    question: "How you treat your body reflects:",
    options: [
      { text: "Neglect - ignoring signals and needs", points: 1 },
      { text: "Punishment - harsh self-criticism", points: 2 },
      { text: "Inconsistency - caring for it only sometimes", points: 3 },
      { text: "Respect - honoring what it needs", points: 4 },
      { text: "Reverence - treating it as sacred", points: 5 },
    ],
  },
  {
    id: 20,
    category: 'boundaries',
    categoryLabel: 'Self-Care & Boundaries',
    question: "Your self-talk sounds like:",
    options: [
      { text: "Harsh criticism and constant judgment", points: 1 },
      { text: "Disappointment and frustration with yourself", points: 2 },
      { text: "Conditional - kind only when you \"earn\" it", points: 3 },
      { text: "Encouraging - like a supportive friend", points: 4 },
      { text: "Loving - like someone who adores you completely", points: 5 },
    ],
  },

  // CATEGORY 5: ACTION & MANIFESTATION (Q21-25)
  {
    id: 21,
    category: 'action',
    categoryLabel: 'Action & Manifestation',
    question: "When you set goals, you typically:",
    options: [
      { text: "Don't set them because you expect to fail", points: 1 },
      { text: "Set them but abandon them when it gets hard", points: 2 },
      { text: "Set them but need constant external motivation", points: 3 },
      { text: "Set them and take consistent action toward them", points: 4 },
      { text: "Set them and watch them manifest with flow", points: 5 },
    ],
  },
  {
    id: 22,
    category: 'action',
    categoryLabel: 'Action & Manifestation',
    question: "Your relationship with taking action is:",
    options: [
      { text: "Paralyzed by fear or procrastination", points: 1 },
      { text: "Waiting for the \"perfect\" moment that never comes", points: 2 },
      { text: "Taking action but second-guessing every step", points: 3 },
      { text: "Moving forward with clarity and confidence", points: 4 },
      { text: "Taking bold, aligned action that creates results", points: 5 },
    ],
  },
  {
    id: 23,
    category: 'action',
    categoryLabel: 'Action & Manifestation',
    question: "When opportunities arise:",
    options: [
      { text: "You assume there's a catch or it's too good to be true", points: 1 },
      { text: "You feel unworthy and let others take them instead", points: 2 },
      { text: "You consider them but talk yourself out of most", points: 3 },
      { text: "You evaluate them clearly and choose what aligns", points: 4 },
      { text: "You trust that perfect opportunities flow to you easily", points: 5 },
    ],
  },
  {
    id: 24,
    category: 'action',
    categoryLabel: 'Action & Manifestation',
    question: "Your energy around your goals is:",
    options: [
      { text: "Defeated before you start", points: 1 },
      { text: "Hopeful but realistic about limitations", points: 2 },
      { text: "Motivated but inconsistent in action", points: 3 },
      { text: "Determined and taking consistent steps", points: 4 },
      { text: "Magnetic and naturally manifesting outcomes", points: 5 },
    ],
  },
  {
    id: 25,
    category: 'action',
    categoryLabel: 'Action & Manifestation',
    question: "Overall, you believe:",
    options: [
      { text: "Life is hard and good things don't happen to people like me", points: 1 },
      { text: "I have to work twice as hard as others to get half as much", points: 2 },
      { text: "I deserve good things but they require sacrifice and struggle", points: 3 },
      { text: "I am worthy of love, success, and abundance", points: 4 },
      { text: "I am a powerful creator who effortlessly attracts my desires", points: 5 },
    ],
  },
];

export const categoryColors: Record<string, string> = {
  love: 'bg-pink-500',
  money: 'bg-accent',
  career: 'bg-primary',
  boundaries: 'bg-emerald-500',
  action: 'bg-orange-500',
};
