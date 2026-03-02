export interface WellnessTip {
  id: number;
  text: string;
  category: WellnessTipCategory;
}

export const wellnessTipCategories = [
  "Hydration",
  "Mindset",
  "Movement",
  "Nutrition",
  "Rest",
  "Self-Care",
] as const;

export type WellnessTipCategory = (typeof wellnessTipCategories)[number];

export const wellnessTips: WellnessTip[] = [
  // Hydration (10)
  { id: 1, text: "Start your morning with 16oz of room-temperature water before anything else.", category: "Hydration" },
  { id: 2, text: "Add a pinch of sea salt to your water for better mineral absorption.", category: "Hydration" },
  { id: 3, text: "Drink a glass of water 30 minutes before each meal to support digestion.", category: "Hydration" },
  { id: 4, text: "Infuse your water with cucumber and mint for a refreshing detox boost.", category: "Hydration" },
  { id: 5, text: "Set a gentle alarm every 2 hours to remind yourself to hydrate.", category: "Hydration" },
  { id: 6, text: "Swap one caffeinated drink for herbal tea today.", category: "Hydration" },
  { id: 7, text: "Try warm lemon water in the evening to support your liver overnight.", category: "Hydration" },
  { id: 8, text: "Eat water-rich foods like watermelon, cucumber, and celery throughout the day.", category: "Hydration" },
  { id: 9, text: "Carry a reusable water bottle everywhere — visibility creates the habit.", category: "Hydration" },
  { id: 10, text: "Coconut water is nature's electrolyte drink — enjoy one after movement.", category: "Hydration" },

  // Mindset (10)
  { id: 11, text: "Write down 3 things you're grateful for before your feet hit the floor.", category: "Mindset" },
  { id: 12, text: "Replace 'I have to' with 'I get to' for everything today.", category: "Mindset" },
  { id: 13, text: "Spend 5 minutes in silence before checking your phone this morning.", category: "Mindset" },
  { id: 14, text: "Affirm: 'I am worthy of the life I'm building.'", category: "Mindset" },
  { id: 15, text: "Notice one negative thought today and consciously reframe it.", category: "Mindset" },
  { id: 16, text: "Visualize your ideal day for 2 minutes — feel it as if it's already real.", category: "Mindset" },
  { id: 17, text: "Celebrate one small win today, no matter how tiny it seems.", category: "Mindset" },
  { id: 18, text: "Journal for 5 minutes about what's weighing on your heart.", category: "Mindset" },
  { id: 19, text: "Set one intention for today and let it guide your decisions.", category: "Mindset" },
  { id: 20, text: "Remind yourself: progress, not perfection.", category: "Mindset" },

  // Movement (10)
  { id: 21, text: "Take a 10-minute walk outside — sunlight and movement reset your nervous system.", category: "Movement" },
  { id: 22, text: "Stretch for 5 minutes when you wake up to release overnight tension.", category: "Movement" },
  { id: 23, text: "Dance to one full song today — let your body move without judgment.", category: "Movement" },
  { id: 24, text: "Do 10 squats every time you use the restroom today.", category: "Movement" },
  { id: 25, text: "Try a 5-minute yoga flow to open your hips and release stored emotions.", category: "Movement" },
  { id: 26, text: "Take the stairs instead of the elevator every chance you get.", category: "Movement" },
  { id: 27, text: "Walk barefoot on grass for 5 minutes — grounding reduces inflammation.", category: "Movement" },
  { id: 28, text: "Set a timer to stand and move for 2 minutes every hour.", category: "Movement" },
  { id: 29, text: "End your day with gentle neck and shoulder rolls to release tension.", category: "Movement" },
  { id: 30, text: "Try shaking your body for 3 minutes — it's a powerful stress release.", category: "Movement" },

  // Nutrition (10)
  { id: 31, text: "Eat the rainbow today — aim for 5 different colored vegetables.", category: "Nutrition" },
  { id: 32, text: "Add one fermented food to your meals today for gut health.", category: "Nutrition" },
  { id: 33, text: "Chew each bite 20 times — digestion starts in the mouth.", category: "Nutrition" },
  { id: 34, text: "Swap processed snacks for a handful of nuts and seeds.", category: "Nutrition" },
  { id: 35, text: "Start your meal with greens to stabilize blood sugar.", category: "Nutrition" },
  { id: 36, text: "Cook one meal from scratch today — nourishment is an act of self-love.", category: "Nutrition" },
  { id: 37, text: "Add healthy fats like avocado or olive oil to every meal.", category: "Nutrition" },
  { id: 38, text: "Reduce added sugar today — read labels and choose whole foods.", category: "Nutrition" },
  { id: 39, text: "Eat your last meal 3 hours before bed to support restful sleep.", category: "Nutrition" },
  { id: 40, text: "Try one new vegetable this week that you've never cooked before.", category: "Nutrition" },

  // Rest (10)
  { id: 41, text: "Set a bedtime alarm 30 minutes before you want to sleep.", category: "Rest" },
  { id: 42, text: "Put your phone in another room 1 hour before bed.", category: "Rest" },
  { id: 43, text: "Try 4-7-8 breathing: inhale 4s, hold 7s, exhale 8s — repeat 3 times.", category: "Rest" },
  { id: 44, text: "Take a 20-minute power nap if your body is asking for it.", category: "Rest" },
  { id: 45, text: "Create a bedtime ritual: tea, journal, gratitude, lights out.", category: "Rest" },
  { id: 46, text: "Sleep in a cool, dark room — 65°F is optimal for deep rest.", category: "Rest" },
  { id: 47, text: "Give yourself permission to do absolutely nothing for 15 minutes today.", category: "Rest" },
  { id: 48, text: "Avoid screens for the last hour of your day — your nervous system will thank you.", category: "Rest" },
  { id: 49, text: "Listen to a guided sleep meditation or body scan tonight.", category: "Rest" },
  { id: 50, text: "Rest is not laziness — it's how your body heals and rebuilds.", category: "Rest" },

  // Self-Care (10)
  { id: 51, text: "Look in the mirror and say something kind to yourself today.", category: "Self-Care" },
  { id: 52, text: "Take a warm bath with epsom salts to soothe your muscles and mind.", category: "Self-Care" },
  { id: 53, text: "Unfollow one account on social media that doesn't make you feel good.", category: "Self-Care" },
  { id: 54, text: "Say no to one thing today that doesn't align with your energy.", category: "Self-Care" },
  { id: 55, text: "Spend 10 minutes doing something purely for pleasure — no productivity required.", category: "Self-Care" },
  { id: 56, text: "Write yourself a love letter. Yes, really.", category: "Self-Care" },
  { id: 57, text: "Dry brush your skin before showering to boost circulation and lymph flow.", category: "Self-Care" },
  { id: 58, text: "Light a candle and sit with your thoughts for 5 minutes.", category: "Self-Care" },
  { id: 59, text: "Schedule one thing this week that's just for you — and protect it.", category: "Self-Care" },
  { id: 60, text: "Remind yourself: you cannot pour from an empty cup.", category: "Self-Care" },
];
