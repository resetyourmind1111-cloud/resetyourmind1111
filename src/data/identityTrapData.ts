export interface TrapQuestion {
  question: string;
  options: { label: string; value: string }[];
}

export const TRAP_QUESTIONS: TrapQuestion[] = [
  {
    question: "When you have a big decision to make, you usually…",
    options: [
      { label: "Research until you feel completely ready", value: "A" },
      { label: "Ask everyone what they think before deciding", value: "B" },
      { label: "Worry about whether you can afford it", value: "C" },
      { label: "Start strong then second-guess yourself halfway through", value: "D" },
      { label: "Understand what to do but struggle to actually do it", value: "E" },
    ],
  },
  {
    question: "The thought that most often keeps you stuck is…",
    options: [
      { label: '"What if I make the wrong choice?"', value: "A" },
      { label: '"What will people think?"', value: "B" },
      { label: '"What if there isn\'t enough?"', value: "C" },
      { label: '"Why can\'t I just stay consistent?"', value: "D" },
      { label: '"I already know this — why isn\'t it changing?"', value: "E" },
    ],
  },
  {
    question: "When you think about going after something big, your body feels…",
    options: [
      { label: "Tense and flooded with questions", value: "A" },
      { label: "Anxious about letting someone down", value: "B" },
      { label: "Tight, bracing, or contracted", value: "C" },
      { label: "Excited at first, then heavy", value: "D" },
      { label: "Frustrated — like you're spinning in place", value: "E" },
    ],
  },
  {
    question: "The pattern you most often repeat is…",
    options: [
      { label: "Overthinking instead of acting", value: "A" },
      { label: "Saying yes when you mean no", value: "B" },
      { label: "Pulling back when things are going well", value: "C" },
      { label: "Starting over instead of continuing", value: "D" },
      { label: "Learning more instead of doing more", value: "E" },
    ],
  },
  {
    question: "When something goes wrong, your first instinct is to…",
    options: [
      { label: "Analyze what you missed", value: "A" },
      { label: "Apologize or smooth it over", value: "B" },
      { label: "Brace for more loss", value: "C" },
      { label: "Give up and restart later", value: "D" },
      { label: "Understand why but stay stuck anyway", value: "E" },
    ],
  },
  {
    question: "Your relationship with consistency is…",
    options: [
      { label: "Hard — I need more information before I commit", value: "A" },
      { label: "Hard — I adjust based on what others need", value: "B" },
      { label: "Hard — fear makes me hold back", value: "C" },
      { label: "Hard — I go all-in then crash", value: "D" },
      { label: "Hard — I know what to do but don't do it", value: "E" },
    ],
  },
  {
    question: "The version of you that's hiding most often feels…",
    options: [
      { label: "Paralyzed by too many options", value: "A" },
      { label: "Tired of performing for others", value: "B" },
      { label: "Afraid to want more", value: "C" },
      { label: "Ashamed of starting over again", value: "D" },
      { label: "Frustrated by the gap between knowing and living it", value: "E" },
    ],
  },
  {
    question: "If someone asked what's really stopping you, your honest answer would be…",
    options: [
      { label: '"I don\'t feel ready yet"', value: "A" },
      { label: '"I don\'t want to disappoint anyone"', value: "B" },
      { label: '"It doesn\'t feel safe to have more"', value: "C" },
      { label: '"I don\'t trust myself to keep going"', value: "D" },
      { label: '"I can\'t seem to turn what I know into how I live"', value: "E" },
    ],
  },
  {
    question: "When you have momentum, you tend to…",
    options: [
      { label: "Slow down to make sure you're going the right direction", value: "A" },
      { label: "Check in with others before continuing", value: "B" },
      { label: "Worry it won't last", value: "C" },
      { label: "Push hard then burn out and stop", value: "D" },
      { label: "Feel good but still not act differently", value: "E" },
    ],
  },
  {
    question: "The most honest sentence about where you are right now is…",
    options: [
      { label: '"I\'m ready when I have more clarity."', value: "A" },
      { label: '"I\'ll do it once I know no one will be upset."', value: "B" },
      { label: '"I want more but part of me is afraid to have it."', value: "C" },
      { label: '"I\'ve started this before. I don\'t know why I keep stopping."', value: "D" },
      { label: '"I understand everything. I just can\'t seem to live it yet."', value: "E" },
    ],
  },
];

export const TRAP_NAMES: Record<string, string> = {
  A: "The Overthinker Trap",
  B: "The People Pleaser Trap",
  C: "The Scarcity Loop",
  D: "The Start-Stop Cycle",
  E: 'The "I Know But…" Trap',
};

export const TRAP_SLUGS: Record<string, string> = {
  "The Overthinker Trap": "overthinker",
  "The People Pleaser Trap": "people-pleaser",
  "The Scarcity Loop": "scarcity-loop",
  "The Start-Stop Cycle": "start-stop",
  'The "I Know But…" Trap': "i-know-but",
};

export const SLUG_TO_TRAP: Record<string, string> = {
  overthinker: "The Overthinker Trap",
  "people-pleaser": "The People Pleaser Trap",
  "scarcity-loop": "The Scarcity Loop",
  "start-stop": "The Start-Stop Cycle",
  "i-know-but": 'The "I Know But…" Trap',
};

export interface TrapModule {
  slug: string;
  name: string;
  subtitle: string;
  whatItIs: string;
  checklist: string[];
  whyBodyRepeats: string;
  costs: { category: string; description: string }[];
  protectsFrom: string;
  bodyQuestion: string;
  bodyOptions: string[];
  audioTitle: string;
  audioDuration: string;
  audioUrl: string;
  audioScript: string;
  recodeStatements: string[];
  actions: string[];
  reflectPrompt: string;
  completionText: string;
}

export const TRAP_MODULES: Record<string, TrapModule> = {
  overthinker: {
    slug: "overthinker",
    name: "The Overthinker Trap",
    subtitle: "You are not broken. You learned to seek safety through certainty.",
    whatItIs: "Overthinking isn't a thinking problem. It's a safety problem. Your nervous system learned that if you gather enough information, research every angle, and wait until you feel completely ready — you can avoid making the wrong move. But certainty rarely comes. And waiting for it keeps you from the life you already know you want.",
    checklist: [
      "You research long after you have enough information",
      "You rewrite decisions in your head repeatedly",
      "You ask for opinions then second-guess the answers",
      "You feel frozen when options feel equal",
      "You delay starting until conditions feel perfect",
      "You feel anxious when asked to decide quickly",
      "You replay conversations looking for what you missed",
      "You know what to do but can't seem to start",
    ],
    whyBodyRepeats: "At some point, making the wrong move felt dangerous. Maybe it led to criticism, loss, or consequences that felt overwhelming. Your nervous system logged that as a threat and built a system to prevent it — gather more, wait longer, be more certain. The problem is: that system never turns off. It keeps asking for more certainty even when you're safe.",
    costs: [
      { category: "Peace", description: "your mind rarely rests" },
      { category: "Momentum", description: "opportunities pass while you're still deciding" },
      { category: "Self-trust", description: "every delay tells your brain you can't be trusted" },
      { category: "Money", description: "the ideas you don't launch, the offers you don't make" },
      { category: "Relationships", description: "people experience you as unavailable or distant" },
      { category: "Leadership", description: "you shrink when others need you to decide" },
    ],
    protectsFrom: "It's trying to protect you from making a mistake that can't be undone, from being judged or criticized for a wrong choice, and from the shame of getting it wrong.\n\nThis pattern isn't your enemy. It just needs a new assignment.",
    bodyQuestion: "Where is overthinking living in your body right now?",
    bodyOptions: ["Head", "Chest", "Stomach", "Jaw", "Whole body"],
    audioTitle: "Clarity Through Movement",
    audioDuration: "3 min",
    audioUrl: "https://mindist.page.link/mYPi",
    audioScript: "Pause for a moment. You do not need to solve everything right now.\nNotice where overthinking is living in your body.\nTake a slow breath in. Now exhale longer than you inhaled.\nAgain. Slow inhale. Longer exhale.\nYour mind is trying to create certainty because something about action feels unsafe.\nThat does not mean you are incapable. It means your body is asking for safety.\nPlace one hand on your heart and one on your belly.\nSay silently: I am safe to take one step without having every answer.\nFeel your body in the chair. Feel your feet on the floor. Let your shoulders drop.\nNow ask yourself: What is one small action that would move me forward today?\nNot the whole plan. Just the next step.\nSay silently: Clarity comes through movement. I trust myself to begin.\nWhen you are ready, open your eyes and take that step.",
    recodeStatements: [
      "I am safe to move before I have every answer.",
      "Clarity comes through action, not before it.",
      "I trust myself to course-correct as I go.",
      "Done and imperfect is better than perfect and waiting.",
      "I am someone who begins.",
    ],
    actions: [
      "Set a 10-minute timer and make one decision before it ends",
      "Send the message you've been drafting",
      "Take one step on the project you've been researching",
      "Say the thing you've been rehearsing",
    ],
    reflectPrompt: "What was the overthinking trying to protect me from today?\nAnd what became possible when I moved anyway?",
    completionText: "Clarity doesn't always come before the step.\nSometimes it only arrives because you took it.",
  },
  "people-pleaser": {
    slug: "people-pleaser",
    name: "The People Pleaser Trap",
    subtitle: "You are not too much. You learned that love felt safer when you made yourself smaller.",
    whatItIs: "People pleasing isn't kindness. It's a survival strategy that got mistaken for a personality. At some point, keeping others comfortable felt necessary for your safety, love, or belonging. So you learned to read the room, shrink your needs, and say yes when you meant no. The cost is a life that feels like it belongs to everyone except you.",
    checklist: [
      "You say yes before checking if you actually want to",
      "You over-explain your decisions to avoid judgment",
      "You feel responsible for other people's emotions",
      "You apologize even when you haven't done anything wrong",
      "You feel resentment building but stay silent",
      "You shrink your truth to avoid conflict",
      "You feel guilty for having needs",
      "You're exhausted from performing for others",
    ],
    whyBodyRepeats: "Your nervous system learned that conflict or disapproval felt dangerous. Maybe love was conditional. Maybe honesty caused consequences. So it built a system: keep people happy and you stay safe. That system is still running — even in rooms where it's no longer needed.",
    costs: [
      { category: "Peace", description: "you carry everyone else's emotions" },
      { category: "Identity", description: "you've forgotten what you actually want" },
      { category: "Energy", description: "performing for others is exhausting" },
      { category: "Boundaries", description: "resentment builds where honesty was silenced" },
      { category: "Relationships", description: "people know the performance, not the real you" },
      { category: "Leadership", description: "you can't lead if you need everyone's approval" },
    ],
    protectsFrom: "It's trying to protect you from rejection and abandonment, from the pain of someone being disappointed in you, and from conflict that once felt unsafe or overwhelming.\n\nYou weren't wrong for learning this. You just get to choose something different now.",
    bodyQuestion: "Where is the people pleasing living in your body right now?",
    bodyOptions: ["Chest", "Throat", "Stomach", "Shoulders", "Whole body"],
    audioTitle: "Return To Yourself",
    audioDuration: "3 min",
    audioUrl: "https://mindist.page.link/Nxq3",
    audioScript: "Pause here. Before you respond, before you explain, before you make yourself smaller —\ncome back to your body.\nTake a deep breath in. And slowly exhale.\nAgain. Inhale. Exhale.\nNotice if your body feels tight, guilty, pressured, or afraid.\nThat is not proof you are wrong. It may be proof that you learned to keep peace by leaving yourself.\nPlace both feet on the floor. Relax your jaw. Soften your shoulders.\nSay silently: I am safe to tell the truth. I am safe to choose myself. My needs matter too.\nNow ask yourself: What do I actually want right now?\nLet the answer come without judging it.\nYou do not need to earn the right to be honest.\nTake one more breath. And when you are ready, choose the response that honors you.",
    recodeStatements: [
      "I am allowed to have needs.",
      "Honesty is an act of love — including with myself.",
      "I can disappoint someone and still be a good person.",
      "My truth is safe to speak.",
      "I choose myself without punishing others.",
    ],
    actions: [
      "Say no to one thing that doesn't serve you today",
      "Tell one person what you actually need",
      "Stop one apology that isn't yours to give",
      "Let someone sit with their own feeling instead of fixing it",
    ],
    reflectPrompt: "Where did I abandon myself today in order to keep the peace?\nAnd what would honoring myself have looked like instead?",
    completionText: "You chose yourself.\nThat is not selfish.\nThat is the beginning of being real.",
  },
  "scarcity-loop": {
    slug: "scarcity-loop",
    name: "The Scarcity Loop",
    subtitle: "You are not lacking. You learned that having more felt unsafe.",
    whatItIs: "Scarcity isn't just about money. It's a body state. A belief that there won't be enough — love, safety, resources, time, or opportunity. When your nervous system is in scarcity, it braces, contracts, and makes decisions from fear instead of from what you actually want. The result is a life that feels smaller than you deserve.",
    checklist: [
      "You hold back investments even when they make sense",
      "You pull back just when things are going well",
      "You feel guilt or anxiety when you spend on yourself",
      "You struggle to receive — compliments, money, support",
      "You downplay wins so you don't \"jinx\" them",
      "You make decisions from fear of loss more than desire",
      "You feel like things are always about to run out",
      "You shrink your goals to protect yourself from disappointment",
    ],
    whyBodyRepeats: "At some point, not having enough was real. Or having more brought consequences — conflict, jealousy, instability, or loss. Your body logged that as a threat and built a system to protect you: stay small, don't want too much, brace for the fall. That system is still running even in moments of safety.",
    costs: [
      { category: "Money", description: "you can't receive what you won't let yourself want" },
      { category: "Opportunity", description: "you exit before things can grow" },
      { category: "Peace", description: "your body is always bracing for loss" },
      { category: "Relationships", description: "intimacy requires openness you've been afraid of" },
      { category: "Growth", description: "staying small feels safe but it's not living" },
      { category: "Self-worth", description: "you're telling yourself you don't deserve more" },
    ],
    protectsFrom: "It's trying to protect you from the pain of losing something you allowed yourself to want, from the vulnerability of having something to lose, and from the uncertainty of expansion.\n\nThis pattern kept you safe when safety was uncertain. Now it's time to update the system.",
    bodyQuestion: "Where is scarcity living in your body right now?",
    bodyOptions: ["Chest", "Hands", "Stomach", "Throat", "Whole body"],
    audioTitle: "From Contraction To Receiving",
    audioDuration: "3 min",
    audioUrl: "https://mindist.page.link/g5f1",
    audioScript: "Pause. Notice if your body is bracing.\nNotice if your hands are tight, your breath is shallow, or your mind is racing ahead.\nTake a slow breath in. And release it gently.\nAgain. Inhale into your chest and belly. Exhale and soften.\nOpen your hands. Relax your shoulders. Lift your heart slightly.\nScarcity often feels urgent. But urgency is not always truth.\nSometimes it is the body trying to protect itself from disappointment or loss.\nSay silently: I am safe in this moment. I do not have to shrink to stay safe.\nIt is safe for me to receive more.\nNow ask yourself: What would one grounded, expansive choice look like right now?\nNot reckless. Not forced. Just open.\nTake one more breath. Let your body soften around possibility.\nWhen you are ready, choose from alignment, not fear.",
    recodeStatements: [
      "It is safe for me to receive.",
      "Having more does not put me in danger.",
      "I can want more and still be grateful.",
      "Expansion is safe. Growth is safe. More is safe.",
      "I make decisions from desire, not from fear of loss.",
    ],
    actions: [
      "Accept a compliment without deflecting it",
      "Make one decision from desire instead of fear",
      "Invest in something you've been holding back on",
      "Receive help without guilt",
    ],
    reflectPrompt: "Where did scarcity make a decision for me today?\nWhat would an expansive version of me have chosen instead?",
    completionText: "You opened when the pattern told you to close.\nThat is how the loop breaks.",
  },
  "start-stop": {
    slug: "start-stop",
    name: "The Start-Stop Cycle",
    subtitle: "You are not lazy. You learned that intensity felt like progress — until it didn't.",
    whatItIs: "The start-stop cycle isn't a discipline problem. It's a nervous system pattern. You launch with full energy, then somewhere between the beginning and the middle, it becomes too much. You disappear. You restart. You repeat. The problem isn't your commitment. It's that your system never learned how to sustain.",
    checklist: [
      "You start things with high energy and lose momentum fast",
      "You have a graveyard of unfinished projects",
      "Consistency feels harder than starting over",
      "You go all-in then burnout and stop",
      "You come back to the same goals repeatedly",
      "You feel shame about your pattern of stopping",
      "You push hard then need to completely withdraw",
      "Rest feels like failure, not recovery",
    ],
    whyBodyRepeats: "Your nervous system may have learned that intensity equals value, and rest equals falling behind. Or that sustainability was never modeled for you. Or that the only way to get things done was in bursts. The system keeps producing intensity because it never learned the slower rhythm that actually sustains.",
    costs: [
      { category: "Goals", description: "every restart costs momentum and trust" },
      { category: "Self-belief", description: "you're starting to wonder if you can finish anything" },
      { category: "Energy", description: "the crash after every push is getting heavier" },
      { category: "Identity", description: '"I always quit" is a story you\'re building' },
      { category: "Money", description: "unfinished projects and missed opportunities add up" },
      { category: "Peace", description: "the shame of the cycle keeps you from starting again" },
    ],
    protectsFrom: "It's trying to protect you from the exhaustion of unsustainable effort, from the failure of going all-in and it not working, and from the vulnerability of slow, visible progress.\n\nThe intensity was never the problem. The missing piece was permission to move slowly.",
    bodyQuestion: "Where is the start-stop pattern living in your body right now?",
    bodyOptions: ["Chest", "Stomach", "Head", "Shoulders", "Whole body"],
    audioTitle: "Sustainable Momentum",
    audioDuration: "3 min",
    audioUrl: "https://mindist.page.link/phiY",
    audioScript: "Pause. You do not need to start over. You only need to come back.\nTake a breath in. And a slow breath out.\nAgain. Inhale. Exhale longer.\nNotice if there is pressure in your body.\nPressure to catch up. Pressure to do more. Pressure to fix everything at once.\nLet that pressure drop.\nPlace one hand on your chest.\nSay silently: I do not need intensity to make progress.\nI am safe in consistency. One small completion rebuilds trust.\nNow ask yourself: What is the smallest thing I can finish today?\nLet it be simple. Let it be doable. Let it count.\nYou are not failing because you slowed down.\nYou are learning how to move in a way your body can sustain.\nTake one more breath. And return with one small completion.",
    recodeStatements: [
      "I am someone who finishes small things consistently.",
      "Rest is not failure. It is part of the process.",
      "I do not need to go all-in to make real progress.",
      "Consistency is more powerful than intensity.",
      "I trust myself to come back.",
    ],
    actions: [
      "Complete one small thing you've been avoiding",
      "Choose the smallest possible version of a task and do only that",
      "Give yourself permission to do less and finish it",
      "Rest without shame — intentionally and completely",
    ],
    reflectPrompt: "Where did I push when I needed rest? Or where did I stop when one more small step was possible?\nWhat does sustainable actually look like for me?",
    completionText: "You came back.\nThat is not small. That is everything.\nEvery time you return, you rebuild the trust that the cycle tried to break.",
  },
  "i-know-but": {
    slug: "i-know-but",
    name: 'The "I Know But…" Trap',
    subtitle: "You are not missing information. You are missing permission to embody what you already know.",
    whatItIs: "You've done the courses. Read the books. Listened to the podcasts. You understand. And somehow, nothing changes. This isn't an information problem. It's a safety problem. Somewhere between knowing and doing, your body decides it isn't safe to live differently. So you keep consuming instead of becoming.",
    checklist: [
      "You understand the concepts but don't apply them",
      "You feel frustrated by the gap between insight and behavior",
      "You know exactly what you need to do but don't do it",
      "More content, courses, or coaching feels like the answer",
      "You've \"been working on this\" for a long time",
      "You can explain transformation but haven't experienced it",
      "Action feels uncomfortable even when the direction is clear",
      "You wonder why knowing so much hasn't changed more",
    ],
    whyBodyRepeats: "The gap between knowing and doing is a nervous system gap. Living differently means your body has to experience something it hasn't experienced as safe yet. Consuming knowledge feels productive and safe. Acting on it feels exposed and uncertain. Your system chose the one that felt safer.",
    costs: [
      { category: "Growth", description: "you're looping instead of evolving" },
      { category: "Money", description: "you invest in learning what you already know" },
      { category: "Time", description: "another year of insight without transformation" },
      { category: "Self-trust", description: "the gap keeps widening between who you are and who you say you want to be" },
      { category: "Energy", description: "the frustration of knowing and not changing is exhausting" },
      { category: "Identity", description: "you're becoming someone who understands change but doesn't make it" },
    ],
    protectsFrom: "It's trying to protect you from the risk of trying and still not changing, from the vulnerability of actually being seen living differently, and from the discomfort of becoming someone new.\n\nKnowledge feels safe because it requires nothing of you yet. Embodiment requires everything.",
    bodyQuestion: 'Where is the "I Know But…" pattern living in your body right now?',
    bodyOptions: ["Head", "Chest", "Stomach", "Whole body", "Numb / disconnected"],
    audioTitle: "Embodiment Begins Now",
    audioDuration: "3 min",
    audioUrl: "https://mindist.page.link/T6ww",
    audioScript: "Pause. You already know a lot.\nRight now, this is not about learning more. This is about honoring what you already know.\nTake a breath in. And let it out slowly.\nAgain. Inhale. Exhale.\nNotice where frustration is sitting in your body.\nNotice where the gap between knowledge and action feels heavy.\nPlace a hand on your body.\nSay silently: Awareness is not the end.\nI honor what I know through action. I am safe to embody this now.\nAsk yourself: What is one thing I already know is true that I can live today?\nTrust the first answer. Do not make it complicated.\nOne action is enough. One act of integrity is enough. One embodiment is enough.\nTake one more breath. And let your wisdom become movement.",
    recodeStatements: [
      "I am someone who acts on what I know.",
      "Transformation happens in the body, not in the mind.",
      "I don't need more information. I need one honest action.",
      "My wisdom becomes real when I live it.",
      "I close the gap one step at a time.",
    ],
    actions: [
      "Stop consuming and take one action on what you already know",
      "Do the thing you've been \"almost ready\" to do",
      "Speak the truth you've been preparing to say",
      "Take the step that requires no new knowledge — just courage",
    ],
    reflectPrompt: "What do I already know that I haven't been living?\nWhat would my life look like if I honored that truth today?",
    completionText: "You didn't learn something new today.\nYou became something you already knew.\nThat is the difference between information and transformation.",
  },
};

export const CHECKIN_OPTIONS = [
  "Overthinking", "Fear", "Guilt", "Resentment", "Pressure",
  "Avoidance", "Self-doubt", "Stuck", "Shutdown", "People pleasing",
];

export const CHECKIN_MAPPING: Record<string, string> = {
  Overthinking: "The Overthinker Trap",
  Pressure: "The Overthinker Trap",
  Guilt: "The People Pleaser Trap",
  "People pleasing": "The People Pleaser Trap",
  Fear: "The Scarcity Loop",
  Resentment: "The Scarcity Loop",
  Stuck: "The Start-Stop Cycle",
  Avoidance: "The Start-Stop Cycle",
  "Self-doubt": 'The "I Know But…" Trap',
  Shutdown: 'The "I Know But…" Trap',
};

export const MILESTONE_MESSAGES: { threshold: number; field: string; message: string }[] = [
  { threshold: 3, field: "total_interrupts", message: "Three times you chose differently. That's your new pattern forming." },
  { threshold: 7, field: "self_trust_streak", message: "Seven days. Your nervous system is learning something new." },
  { threshold: 5, field: "actions_before_certainty", message: "Five actions before certainty. The Overthinker is losing its grip." },
  { threshold: 1, field: "honest_nos", message: "You held a boundary. Your worth thermostat just went up." },
];

export function getEncouragementText(streak: number): string {
  if (streak <= 3) return "You're just getting started. Keep going.";
  if (streak <= 7) return "You're building something real.";
  if (streak <= 14) return "The pattern is losing its grip.";
  if (streak <= 21) return "This is where most people transform.";
  return "You are becoming someone different.";
}

export function scoreTrap(answers: string[]): { primary: string; secondary: string | null } {
  const counts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  answers.forEach((a) => { if (counts[a] !== undefined) counts[a]++; });

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const primary = TRAP_NAMES[sorted[0][0]];
  const secondary = sorted[0][1] === sorted[1][1] || sorted[1][1] >= 3
    ? TRAP_NAMES[sorted[1][0]]
    : null;

  return { primary, secondary };
}
