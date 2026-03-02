export interface BodyTypeOption {
  text: string;
  type: 'igniter' | 'builder' | 'nurturer' | 'transformer';
}

export interface BodyTypeQuestion {
  id: number;
  question: string;
  options: BodyTypeOption[];
}

export interface BodyTypeProfile {
  id: 'igniter' | 'builder' | 'nurturer' | 'transformer';
  name: string;
  emoji: string;
  tagline: string;
  coreTraits: string;
  strengths: string;
  challenges: string;
  physicalTendencies: string;
  tensionAreas: string;
}

export const bodyTypeQuestions: BodyTypeQuestion[] = [
  {
    id: 1,
    question: "Your natural energy level throughout the day is:",
    options: [
      { text: "Consistently high — I run on full and crash hard", type: "igniter" },
      { text: "Steady and even — I have good endurance but not peaks", type: "builder" },
      { text: "Variable — depends entirely on who I'm around", type: "nurturer" },
      { text: "Cyclical — high creative bursts then deep rest periods", type: "transformer" },
    ],
  },
  {
    id: 2,
    question: "Under stress, your body most commonly:",
    options: [
      { text: "Tightens in shoulders, jaw, or gut — tension and headaches", type: "igniter" },
      { text: "Gains weight especially in belly — feels heavy and stuck", type: "builder" },
      { text: "Gets sick or exhausted — immune system takes the hit", type: "nurturer" },
      { text: "Breaks out or has hormonal shifts — body speaks loudly", type: "transformer" },
    ],
  },
  {
    id: 3,
    question: "Your relationship with rest is:",
    options: [
      { text: "I resist it — rest feels like laziness", type: "igniter" },
      { text: "I love it but feel guilty about it", type: "builder" },
      { text: "I desperately need it but rarely get enough", type: "nurturer" },
      { text: "I go through phases of needing a lot then needing none", type: "transformer" },
    ],
  },
  {
    id: 4,
    question: "Your metabolism feels:",
    options: [
      { text: "Fast — I burn through food and energy quickly", type: "igniter" },
      { text: "Slow — I look at food and gain weight", type: "builder" },
      { text: "Inconsistent — changes with my stress and emotions", type: "nurturer" },
      { text: "Cyclical — works differently at different times of month", type: "transformer" },
    ],
  },
  {
    id: 5,
    question: "Emotionally, you tend to:",
    options: [
      { text: "Feel everything intensely and move through it fast", type: "igniter" },
      { text: "Hold onto feelings and process slowly and deeply", type: "builder" },
      { text: "Absorb everyone else's emotions as your own", type: "nurturer" },
      { text: "Experience emotional waves — highs and lows in cycles", type: "transformer" },
    ],
  },
  {
    id: 6,
    question: "Your biggest physical complaint is:",
    options: [
      { text: "Inflammation, tension headaches, or burnout", type: "igniter" },
      { text: "Weight around the middle, sluggishness, or bloating", type: "builder" },
      { text: "Fatigue, thyroid issues, or immune sensitivity", type: "nurturer" },
      { text: "Hormonal shifts, reproductive issues, or sacral pain", type: "transformer" },
    ],
  },
  {
    id: 7,
    question: "Your relationship with food is:",
    options: [
      { text: "Functional — fuel for performance", type: "igniter" },
      { text: "Emotional — comfort and connection", type: "builder" },
      { text: "Variable — tied directly to stress and emotions", type: "nurturer" },
      { text: "Cyclical — cravings change with hormones and seasons", type: "transformer" },
    ],
  },
  {
    id: 8,
    question: "You feel most alive when:",
    options: [
      { text: "Achieving and moving toward a goal", type: "igniter" },
      { text: "Creating stability and caring for others", type: "builder" },
      { text: "Deeply connecting and being of service", type: "nurturer" },
      { text: "Creating and transforming — making something new", type: "transformer" },
    ],
  },
  {
    id: 9,
    question: "Movement that feels best for you is:",
    options: [
      { text: "Intense — running, lifting, competitive", type: "igniter" },
      { text: "Steady — walking, hiking, gentle strength", type: "builder" },
      { text: "Gentle — yoga, stretching, dancing", type: "nurturer" },
      { text: "Varied — different things at different times", type: "transformer" },
    ],
  },
  {
    id: 10,
    question: "Your body holds tension most in:",
    options: [
      { text: "Shoulders, jaw, neck, and gut", type: "igniter" },
      { text: "Hips, thighs, belly, and lower back", type: "builder" },
      { text: "Chest, throat, and heart center", type: "nurturer" },
      { text: "Womb, sacral area, and lower belly", type: "transformer" },
    ],
  },
];

export const bodyTypeProfiles: Record<string, BodyTypeProfile> = {
  igniter: {
    id: "igniter",
    name: "The Igniter",
    emoji: "🔥",
    tagline: "High energy, fast metabolism, driven leader",
    coreTraits: "High energy, fast metabolism, competitive, driven, prone to inflammation, burnout, and adrenal fatigue. Runs hot physically and emotionally. Tends toward anxiety and overthinking.",
    strengths: "Natural leader, high achiever, gets things done. Your fire lights up every room you walk into.",
    challenges: "Pushes too hard, ignores rest signals, cortisol spikes. You need to learn that slowing down is not weakness.",
    physicalTendencies: "Athletic build, gains muscle easily, struggles to slow down, prone to headaches and tension.",
    tensionAreas: "Shoulders, jaw, and gut",
  },
  builder: {
    id: "builder",
    name: "The Builder",
    emoji: "🌿",
    tagline: "Steady, grounded, nurturing endurance",
    coreTraits: "Steady, grounded, nurturing, reliable. Tends toward slower metabolism and weight retention especially around the middle. Holds onto things emotionally and physically. Deeply loyal.",
    strengths: "Endurance, consistency, deep capacity for love. You are the rock that others lean on.",
    challenges: "Resistance to change, sluggishness, emotional eating. Movement and warm foods are your medicine.",
    physicalTendencies: "Curvier build, gains weight easily especially hormonally, benefits from consistent movement and warm foods.",
    tensionAreas: "Hips, thighs, and belly",
  },
  nurturer: {
    id: "nurturer",
    name: "The Nurturer",
    emoji: "🌙",
    tagline: "Empathic, intuitive, deeply feeling",
    coreTraits: "Empathic, emotionally sensitive, deeply feeling. Absorbs others' energy, prone to adrenal depletion and hormone imbalance. Puts everyone else first. Needs more recovery time than most.",
    strengths: "Intuitive, compassionate, deeply connected to others. Your sensitivity is your superpower.",
    challenges: "Depletes easily, poor boundaries around energy, prone to thyroid issues and immune sensitivity.",
    physicalTendencies: "Sensitive digestion, fluctuating energy, needs gentle movement and nervous system support.",
    tensionAreas: "Chest, throat, and heart center",
  },
  transformer: {
    id: "transformer",
    name: "The Transformer",
    emoji: "🦋",
    tagline: "Intense, cyclical, visionary creator",
    coreTraits: "Intense, cyclical, deeply intuitive, built for transformation. Experiences life in waves — high periods of creativity and low periods of deep rest. Hormonally complex.",
    strengths: "Visionary, creative, deeply healing to others. You were built for reinvention and rebirth.",
    challenges: "Inconsistency, extremes, difficulty with routine. Cyclical living is your key to thriving.",
    physicalTendencies: "Responds strongly to lunar cycles and seasons, benefits from cyclical eating and movement, prone to reproductive and sacral imbalances.",
    tensionAreas: "Womb, sacral area, and lower belly",
  },
};

export function calculateBodyType(answers: Record<number, string>): string {
  const counts: Record<string, number> = { igniter: 0, builder: 0, nurturer: 0, transformer: 0 };
  Object.values(answers).forEach((type) => {
    counts[type] = (counts[type] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}
