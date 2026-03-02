export interface Lesson {
  number: number;
  title: string;
  coreTeaching: string;
  journalPrompt: string;
  actionStep: string;
  videoLabel: string;
}

export interface Track {
  name: string;
  icon: string;
  tagline: string;
  colorClass: string;
  accentVar: string;
  lessons: Lesson[];
}

export const emotionalSurgeryTracks: Track[] = [
  {
    name: "Wealth",
    icon: "🟡",
    tagline: "Your relationship with money is a mirror of your relationship with yourself.",
    colorClass: "text-primary",
    accentVar: "hsl(var(--primary))",
    lessons: [
      {
        number: 1, title: "Your Money Story",
        coreTeaching: "Every financial decision you make is driven by a story you were told — or a story you told yourself — about what you deserve. Most women with low worth thermostats have inherited a scarcity story that has nothing to do with their actual capacity for wealth. The first step to financial recalibration is identifying the story that's been running your money life.",
        journalPrompt: "Write your earliest memory involving money. What emotion was present? What did it teach you about wealth, security, and what you deserved? How is that memory still influencing your financial decisions today?",
        actionStep: "Open the Money Story Audit tool and complete the full audit. Save your new money story.",
        videoLabel: "Your Money Story — Lorie Wu",
      },
      {
        number: 2, title: "Scarcity vs. Abundance Frequency",
        coreTeaching: "Scarcity is not a financial condition. It is a frequency — a vibrational state that repels wealth even when money is present. Women with low worth thermostats often experience scarcity feelings even when their bank account is full, and abundance feelings only when external circumstances validate it. Real abundance is an internal state first. When you shift your internal frequency, your external reality must follow.",
        journalPrompt: "On a scale of 1–10, what is your current abundance frequency? What evidence are you using to measure it? What would it feel like to be a 10 — regardless of your current bank balance?",
        actionStep: "Open the Abundance Evidence Log. Log every piece of financial abundance evidence from the last 30 days — no matter how small.",
        videoLabel: "Scarcity vs. Abundance Frequency — Lorie Wu",
      },
      {
        number: 3, title: "Charging Your Worth",
        coreTeaching: "Undercharging is not humility. It is a worth wound wearing a costume. Every time you undercharge, over-deliver without compensation, or accept less than the market value of your gifts, you are sending your nervous system a signal: I am not worth full price. This lesson is about identifying where you are financially shrinking — and giving yourself permission to charge the full price of your brilliance.",
        journalPrompt: "Where are you undercharging right now — in business, career, or in how you allow people to spend your time? What is the fear behind charging more? What would change if you raised your price by 25%?",
        actionStep: "Write your new rate, salary requirement, or value declaration. Say it out loud. Then open the Affirmation Builder and create three affirmations around charging your worth.",
        videoLabel: "Charging Your Worth — Lorie Wu",
      },
      {
        number: 4, title: "Receiving Abundance Without Sabotage",
        coreTeaching: "Most women know how to attract abundance. What they struggle with is allowing it to stay. Self-sabotage — overspending after a windfall, pushing away opportunities when they get too good, unconsciously recreating scarcity — is the worth thermostat resetting to familiar. This lesson teaches you to recognize the moment your thermostat tries to sabotage your abundance and how to stay in the receiving mode.",
        journalPrompt: "Describe a time when something good — money, opportunity, love — came into your life and you sabotaged it or let it go. What was the fear underneath the sabotage? What would staying in receiving mode have required?",
        actionStep: "Open the Limiting Belief Rewriter. Identify and rewrite the core belief that drives your abundance sabotage.",
        videoLabel: "Receiving Without Sabotage — Lorie Wu",
      },
      {
        number: 5, title: "Building Your Wealth Identity",
        coreTeaching: "Identity drives behavior. You will never consistently build wealth as someone who believes she doesn't deserve it. Before you can change your financial reality, you must change your financial identity — the deep story you carry about who gets to be wealthy and whether that includes you. A wealth identity is not arrogance. It is alignment.",
        journalPrompt: "Describe the wealthy woman you are becoming. How does she think about money? How does she spend, save, invest, and receive? What does she believe about herself that you are still working on believing about yourself?",
        actionStep: "Write your Wealth Identity Statement — a 3–5 sentence declaration of who you are becoming financially. Save it. Read it every morning this week.",
        videoLabel: "Building Your Wealth Identity — Lorie Wu",
      },
    ],
  },
  {
    name: "Love",
    icon: "🌸",
    tagline: "You don't have a choosing problem. You have a recognition problem.",
    colorClass: "text-[hsl(var(--brand-pink))]",
    accentVar: "hsl(var(--brand-pink))",
    lessons: [
      {
        number: 1, title: "Why You Attract What You Attract",
        coreTeaching: "You don't attract who you want. You attract who you believe you deserve. Your worth thermostat acts as a vibrational filter — allowing in the quality of love that matches your internal setting and quietly repelling anything above it. The relationships in your past are not evidence of bad luck. They are evidence of where your thermostat has been set.",
        journalPrompt: "Look at the pattern across your significant relationships. What quality keeps showing up — emotionally unavailable, controlling, inconsistent, critical? What does that pattern tell you about what you have believed you deserved?",
        actionStep: "Open the Attachment Style Analyzer. Complete the assessment. Read your style description fully and write about how it shows up in your relationships.",
        videoLabel: "Why You Attract What You Attract — Lorie Wu",
      },
      {
        number: 2, title: "Recognition Deficit in Love",
        coreTeaching: "Recognition deficit in love means you cannot identify the difference between breadcrumbs and a full meal until you are already starving. It means you explain away red flags, normalize inconsistency, and mistake intensity for intimacy.",
        journalPrompt: "What does healthy love feel like in your body — not think, feel? Describe the physical sensation of being truly loved, seen, and safe. Have you ever felt that? When?",
        actionStep: "Make two lists: Crumbs I Have Accepted in Love. Celebration I Will Now Require. Be specific for both.",
        videoLabel: "Recognition Deficit in Love — Lorie Wu",
      },
      {
        number: 3, title: "How Would Love Respond — To You",
        coreTeaching: "You have been asking \"How would love respond to others?\" But the deeper question is: How does love respond to you? How do you speak to yourself after a mistake? The most important love story you will ever have is the one between you and yourself.",
        journalPrompt: "Write down the things you say to yourself when you make a mistake, feel unattractive, fail at something, or feel alone. Then ask: would I say this to someone I love? What would love actually say to me in these moments?",
        actionStep: "For the next 7 days, every time you notice harsh self-talk, pause and ask \"How would love respond to me right now?\" Write the loving response instead.",
        videoLabel: "How Would Love Respond To You — Lorie Wu",
      },
      {
        number: 4, title: "Healing the Mother Wound",
        coreTeaching: "The first template for love you ever received came from your mother — or the person who mothered you. How she loved herself determined how she loved you, and how she loved you became the blueprint for how you expect to be loved by everyone else.",
        journalPrompt: "How did your mother treat herself? Did she prioritize her needs, or did she sacrifice herself for others? How did that model shape what you believe love requires of you? What do you wish she had taught you about your worth?",
        actionStep: "Open the Inner Child Healing Module. Select the age that feels most connected to your mother wound. Write your healing letter.",
        videoLabel: "Healing the Mother Wound — Lorie Wu",
      },
      {
        number: 5, title: "Calling in Conscious Love",
        coreTeaching: "You cannot call in a love you have never given yourself permission to have. Conscious love — secure, reciprocal, celebratory love — requires a worth thermostat that is set high enough to recognize it when it arrives and stay when it gets close.",
        journalPrompt: "Describe the relationship you are calling in with total specificity. Not his job or height — how does he make you feel? How does he show up? How do you show up as your full self with him?",
        actionStep: "Write your Love Declaration — a one-page statement of the love you are now available for and the love you are no longer available for.",
        videoLabel: "Calling in Conscious Love — Lorie Wu",
      },
    ],
  },
  {
    name: "Identity",
    icon: "💜",
    tagline: "You were never broken. Your thermostat was just set low by people who didn't know your value.",
    colorClass: "text-secondary",
    accentVar: "hsl(var(--secondary))",
    lessons: [
      {
        number: 1, title: "Who Told You That About Yourself?",
        coreTeaching: "Your identity — the story you carry about who you are, what you're worth, and what you're capable of — was written largely by other people. Parents, teachers, partners, cultural messages. Their assessment of you was never the truth about you. It was the truth about their capacity to see you. Today, we take the pen back.",
        journalPrompt: "What are the core beliefs you carry about yourself — about your intelligence, your lovability, your capability, your body, your enoughness? For each one, ask: who told me this? Was that person qualified to define my worth?",
        actionStep: "Open the Limiting Belief Rewriter. Identify your 3 most deeply held limiting identity beliefs. Rewrite all 3.",
        videoLabel: "Who Told You That About Yourself — Lorie Wu",
      },
      {
        number: 2, title: "The Woman You've Been Hiding",
        coreTeaching: "Somewhere along the way, you learned it was safer to be smaller. Quieter. Less. The full expression of who you are got tucked away to make others comfortable. This lesson is about finding the woman you tucked away — and giving her permission to come home.",
        journalPrompt: "Describe the version of you that you keep hidden. What does she want? What does she say? How does she move through the world? What are you afraid would happen if you let her out?",
        actionStep: "Do one thing today that the hidden version of you has been wanting to do. One act of reclamation.",
        videoLabel: "The Woman You've Been Hiding — Lorie Wu",
      },
      {
        number: 3, title: "Your Gifts Are Not Negotiable",
        coreTeaching: "Your gifts — the things that come naturally and effortlessly to you — are not accidents. They are not things to be modest about. They are your assignment. The world needs you at full wattage.",
        journalPrompt: "What are your gifts? Not your resume — your gifts. What lights you up? What do people always come to you for? Now ask: am I fully using these gifts? If not, what is stopping me?",
        actionStep: "Open the Values Clarity Tool. Complete the full assessment. Look at your top 5 values and write about how aligned your current life is with them.",
        videoLabel: "Your Gifts Are Not Negotiable — Lorie Wu",
      },
      {
        number: 4, title: "Reclaiming Your Story",
        coreTeaching: "The story of your life — the hard parts, the betrayals, the losses, the mistakes — is not evidence of your inadequacy. It is the material from which your greatest wisdom is made. The Emotional Surgeon is born in the wound.",
        journalPrompt: "Write the hardest chapter of your life story. Now write it again — but this time, write it as a story about your strength, your survival, and what it made possible in you.",
        actionStep: "Write your \"Origin Story\" — the 1–2 paragraph version of how your wounds became your wisdom. This is your power statement.",
        videoLabel: "Reclaiming Your Story — Lorie Wu",
      },
      {
        number: 5, title: "The Identity Declaration",
        coreTeaching: "You have done the excavation. You have faced the false stories. Now it is time to declare who you are — not who you were told you are, not who you are working on becoming, but who you are, right now. Identity declarations are not affirmations. They are anchors.",
        journalPrompt: "Write your Identity Declaration. Begin each statement with \"I AM.\" Write at least 10 statements. Make them bold, specific, and true — even if they scare you.",
        actionStep: "Record yourself reading your Identity Declaration. Save it. Listen to it whenever you feel your thermostat trying to reset back to small.",
        videoLabel: "The Identity Declaration — Lorie Wu",
      },
    ],
  },
  {
    name: "Visibility",
    icon: "🌿",
    tagline: "Hiding is not humility. It's deprivation — for you and for everyone meant to receive your gifts.",
    colorClass: "text-emerald-400",
    accentVar: "hsl(150, 50%, 50%)",
    lessons: [
      {
        number: 1, title: "Why Visibility Feels Dangerous",
        coreTeaching: "Visibility feels dangerous because, at some point in your history, it was. Being seen led to criticism, judgment, rejection, or punishment. Your nervous system learned: stay small, stay safe. But the nervous system does not update its threat assessment automatically. The visibility wound is one of the most healable.",
        journalPrompt: "What is your earliest memory of being visible — seen, performing, sharing, leading — and having it go wrong? How did that experience shape your relationship with being seen?",
        actionStep: "Open the CEO Self-Assessment. Complete all 25 questions. Look at your visibility score. Write about what that number reveals.",
        videoLabel: "Why Visibility Feels Dangerous — Lorie Wu",
      },
      {
        number: 2, title: "Visibility as Service",
        coreTeaching: "When you hide, you are not being modest. You are withholding. Every woman who was meant to be healed by your story is waiting for you. The moment you reframe being seen from \"look at me\" to \"I see you and I have something for you\" — everything changes.",
        journalPrompt: "Who is waiting for you to become visible? Who is your work for? Describe her in detail — her struggle, her hope, what she needs that only you can give.",
        actionStep: "Open the Visibility Challenge Tracker. Begin Day 1. Commit to completing the full 30-day challenge.",
        videoLabel: "Visibility as Service — Lorie Wu",
      },
      {
        number: 3, title: "Your Voice Is Not Too Much",
        coreTeaching: "You have been told — directly or indirectly — that you are too much. That message was never about your voice being wrong. It was about other people's discomfort with a woman who takes up her full space. Your voice is exactly enough.",
        journalPrompt: "Where do you filter your voice — in relationships, at work, on social media, in your family? What are you afraid will happen if you stop filtering? What has the filtering cost you?",
        actionStep: "Say something true today that you would normally keep to yourself. Write what it was and how it felt.",
        videoLabel: "Your Voice Is Not Too Much — Lorie Wu",
      },
      {
        number: 4, title: "Building a Visibility Practice",
        coreTeaching: "Visibility is not a personality trait. It is a practice. It is a daily choice to show up, be seen, and trust that the right people will receive you. You build the muscle by using it.",
        journalPrompt: "What would a sustainable visibility practice look like for you? Not the overwhelming version — the version that feels like authentic expression. What would you share? Where? How often?",
        actionStep: "Design your 30-day visibility practice. Write it out: what you will share, where, and how often. Use the Visibility Challenge Tracker to support you.",
        videoLabel: "Building a Visibility Practice — Lorie Wu",
      },
      {
        number: 5, title: "The Unapologetic Rise",
        coreTeaching: "This is your graduation. The final step is permission — full, unconditional, permanent permission to rise without apology. Not the rise that waits until you are perfect. The unapologetic rise of a woman who knows her worth, claims her space, and shows up in full.",
        journalPrompt: "Write your Visibility Declaration. \"I give myself full permission to be seen because...\" Complete that sentence with everything you now know about your gifts, your story, your worth, and the women waiting for you.",
        actionStep: "Share something publicly today — a post, a story, a message — that is fully, unapologetically you. No shrinking. No over-explaining. Just you.",
        videoLabel: "The Unapologetic Rise — Lorie Wu",
      },
    ],
  },
];
