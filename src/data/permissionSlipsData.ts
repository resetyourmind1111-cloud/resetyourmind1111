export interface PermissionSlip {
  id: string;
  text: string;
  category: string;
}

export const permissionSlipCategories = [
  "Boundaries & No",
  "Rest & Self-Care",
  "Wanting & Desiring",
  "Change & Growth",
  "Trust & Knowing",
  "Being & Worthiness",
  "Voice & Expression",
  "Feelings & Emotions",
  "Beginnings & Risks",
  "Receiving & Having",
  "Healing the Mother Wound",
  "Breaking Generational Patterns",
  "Love & Relationships",
  "Softening & Surrender",
  "Abundance & Money",
  "Identity & Purpose",
  "Nervous System & Safety",
  "Confidence & Empowerment",
  "Healing Childhood You",
  "Emotional Release",
  "Divine Timing",
  "Self-Forgiveness",
  "Transitions",
  "Body Love",
  "Visibility & Leadership",
] as const;

const slipsByCategory: Record<string, string[]> = {
  "Boundaries & No": [
    "Permission to say NO without explaining why.",
    "Permission to protect your peace, even if someone gets disappointed.",
    "Permission to choose distance instead of drama.",
    "Permission to walk away from what drains you.",
    "Permission to stop over-giving when it costs your well-being.",
  ],
  "Rest & Self-Care": [
    "Permission to rest without earning it first.",
    "Permission to pause, breathe, and take up space in your own life.",
    "Permission to take a day off simply because your soul needs it.",
    "Permission to slow down and still be worthy.",
    "Permission to put your needs at the top of the list today.",
  ],
  "Wanting & Desiring": [
    "Permission to want MORE without apologizing.",
    "Permission to desire things that make no sense to anyone but you.",
    "Permission to dream bigger than your circumstances.",
    "Permission to choose the life you want, not the life you were handed.",
    "Permission to go after what lights you up.",
  ],
  "Change & Growth": [
    "Permission to grow beyond your past.",
    "Permission to step into the next version of you.",
    "Permission to outgrow relationships, roles, and old identities.",
    "Permission to change your mind as you evolve.",
    "Permission to no longer accept what you once tolerated.",
  ],
  "Trust & Knowing": [
    "Permission to trust yourself, even when others doubt you.",
    "Permission to follow your intuition without needing proof.",
    "Permission to choose the path that FEELS right, not looks right.",
    "Permission to listen to your inner knowing over outside noise.",
    "Permission to believe that you already have the answers.",
  ],
  "Being & Worthiness": [
    "Permission to be loved exactly as you are.",
    "Permission to be chosen without begging or performing.",
    "Permission to take up emotional, physical, and spiritual space.",
    "Permission to receive compassion instead of criticism.",
    "Permission to know you are enough right now.",
  ],
  "Voice & Expression": [
    "Permission to speak your truth, even if your voice shakes.",
    "Permission to express your needs without guilt.",
    "Permission to stop silencing yourself to keep the peace.",
    "Permission to ask for what you really want.",
    "Permission to share your story without shame.",
  ],
  "Feelings & Emotions": [
    "Permission to feel everything without judgment.",
    "Permission to cry without apologizing for it.",
    "Permission to release emotions that aren't yours to carry.",
    "Permission to honor your feelings instead of hiding them.",
    "Permission to let yourself be supported when things get heavy.",
  ],
  "Beginnings & Risks": [
    "Permission to start before you're ready.",
    "Permission to take risks that stretch you.",
    "Permission to be a beginner again.",
    "Permission to begin a new chapter without explaining the old one.",
    "Permission to leap, trusting the path will rise to meet you.",
  ],
  "Receiving & Having": [
    "Permission to receive without shrinking.",
    "Permission to accept help without guilt.",
    "Permission to keep good things without sabotaging them.",
    "Permission to allow joy in without waiting for the other shoe to drop.",
    "Permission to HAVE the life you desire, not just wish for it.",
  ],
  "Healing the Mother Wound": [
    "Permission to stop carrying the love your mother couldn't give.",
    "Permission to mother yourself the way you always needed.",
    "Permission to release the belief that you had to earn affection.",
    "Permission to heal even if she never apologizes.",
    "Permission to break the cycle of silence, guilt, and shrinking.",
  ],
  "Breaking Generational Patterns": [
    "Permission to become the one who ends the cycle.",
    "Permission to stop repeating the roles you were given, not chosen.",
    "Permission to choose healing over inherited pain.",
    "Permission to set boundaries your ancestors never could.",
    "Permission to create a new legacy of love and safety.",
  ],
  "Love & Relationships": [
    "Permission to be loved gently, deeply, and consistently.",
    "Permission to leave love that hurts, confuses, or drains you.",
    "Permission to ask for emotional safety in your relationships.",
    "Permission to receive healthy love without distrust.",
    "Permission to choose partnership that chooses you back.",
  ],
  "Softening & Surrender": [
    "Permission to soften without fearing you'll be taken advantage of.",
    "Permission to receive instead of always doing.",
    "Permission to choose ease over struggle.",
    "Permission to let things unfold without forcing them.",
    "Permission to rest in your feminine without apologizing.",
  ],
  "Abundance & Money": [
    "Permission to earn more than anyone expected of you.",
    "Permission to receive money without guilt, fear, or shrinking.",
    "Permission to stop undercharging, overdelivering, and undervaluing.",
    "Permission to believe wealth is safe for you.",
    "Permission to have abundance without waiting for it to disappear.",
  ],
  "Identity & Purpose": [
    "Permission to become who you were always meant to be.",
    "Permission to step into a life that reflects your truth.",
    "Permission to change identities without asking permission.",
    "Permission to explore desires you buried to survive.",
    "Permission to follow your purpose even if no one understands it.",
  ],
  "Nervous System & Safety": [
    "Permission to feel safe in your body again.",
    "Permission to pause when you get overwhelmed.",
    "Permission to take a breath before responding.",
    "Permission to soothe instead of push through.",
    "Permission to create a life that doesn't activate your survival mode.",
  ],
  "Confidence & Empowerment": [
    "Permission to take up space unapologetically.",
    "Permission to believe in yourself without waiting for validation.",
    "Permission to show up boldly, even when it scares you.",
    "Permission to stop dimming your light.",
    "Permission to be the woman who goes after what she wants.",
  ],
  "Healing Childhood You": [
    "Permission to protect the child in you who never felt protected.",
    "Permission to give yourself the support you deserved years ago.",
    "Permission to release shame that wasn't yours.",
    "Permission to comfort the little you who learned to stay small.",
    "Permission to outgrow the pain that shaped your past.",
  ],
  "Emotional Release": [
    "Permission to let go of emotions that are suffocating you.",
    "Permission to release guilt that never belonged to you.",
    "Permission to stop holding in what your body is begging to let out.",
    "Permission to feel anger without judging yourself.",
    "Permission to detox from anything that disrupts your peace.",
  ],
  "Divine Timing": [
    "Permission to trust the timing of your life.",
    "Permission to believe you're being guided even when uncertain.",
    "Permission to surrender what you can't control.",
    "Permission to expect miracles without proof.",
    "Permission to trust that what's meant for you will never miss you.",
  ],
  "Self-Forgiveness": [
    "Permission to forgive yourself for surviving the only way you knew how.",
    "Permission to be gentle with the woman who's trying her best.",
    "Permission to release regret that keeps you stuck.",
    "Permission to let go of perfectionism and choose grace.",
    "Permission to start again without punishing yourself.",
  ],
  "Transitions": [
    "Permission to let go of what's no longer aligned.",
    "Permission to rebuild your life on your own terms.",
    "Permission to grieve the future you thought you'd have.",
    "Permission to walk away from the version of you that settled.",
    "Permission to rise from endings stronger, clearer, freer.",
  ],
  "Body Love": [
    "Permission to love your body the way she loves you — unconditionally.",
    "Permission to take up physical space without shrinking.",
    "Permission to treat your body with kindness, not criticism.",
    "Permission to see your body as home, not a project.",
    "Permission to feel beautiful without anyone's approval.",
  ],
  "Visibility & Leadership": [
    "Permission to be fully seen without apologizing.",
    "Permission to lead even if you're still healing.",
    "Permission to stop hiding what makes you powerful.",
    "Permission to speak your message boldly.",
    "Permission to allow your brilliance to be witnessed.",
  ],
};

let idCounter = 0;
export const allPermissionSlips: PermissionSlip[] = permissionSlipCategories.flatMap((category) =>
  (slipsByCategory[category] || []).map((text) => ({
    id: `slip-${++idCounter}`,
    text,
    category,
  }))
);

export function getDailySlip(): PermissionSlip {
  const today = new Date();
  const dayIndex =
    (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) %
    allPermissionSlips.length;
  return allPermissionSlips[dayIndex];
}
