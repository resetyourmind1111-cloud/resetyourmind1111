export interface AviniProduct {
  id: string;
  name: string;
  tagline: string;
  description: string;
  benefits: string[];
  recommendedFor: ('igniter' | 'builder' | 'nurturer' | 'transformer')[];
  category: 'core' | 'energy' | 'gut' | 'beauty' | 'immune' | 'hormones';
  icon: string;
}

export const aviniProducts: AviniProduct[] = [
  {
    id: "cell-defender",
    name: "Cell Defender",
    tagline: "Cellular detox & heavy metal removal",
    description: "Clinoptilolite zeolite formula that binds and removes heavy metals, toxins, and environmental pollutants at the cellular level. Supports your body's natural detoxification pathways.",
    benefits: ["Heavy metal detox", "Cellular cleansing", "Immune support", "Gut lining repair"],
    recommendedFor: ["igniter", "builder", "nurturer", "transformer"],
    category: "core",
    icon: "🛡️",
  },
  {
    id: "super-amino-23",
    name: "Super Amino 23",
    tagline: "99% absorbed pre-digested amino acids",
    description: "Delivers 99% utilization of essential amino acids with virtually zero waste. Supports lean muscle, recovery, energy production, and hormone balance without taxing the digestive system.",
    benefits: ["Muscle recovery", "Energy production", "Hormone support", "Zero bloating"],
    recommendedFor: ["igniter", "builder", "transformer"],
    category: "energy",
    icon: "💪",
  },
  {
    id: "pro-biotics",
    name: "ProBiotics 10/50",
    tagline: "50 billion CFU gut restoration",
    description: "10-strain probiotic with 50 billion CFU per serving. Restores gut microbiome balance, supports digestion, nutrient absorption, and immune function from the inside out.",
    benefits: ["Gut restoration", "Immune boost", "Nutrient absorption", "Bloating relief"],
    recommendedFor: ["builder", "nurturer", "transformer"],
    category: "gut",
    icon: "🌿",
  },
  {
    id: "digest-ease",
    name: "Digest Ease",
    tagline: "Full-spectrum digestive enzyme support",
    description: "Comprehensive enzyme blend that breaks down proteins, fats, carbs, and fiber for complete nutrient absorption. Eliminates bloating, gas, and post-meal discomfort.",
    benefits: ["Complete digestion", "Bloating relief", "Nutrient absorption", "Food sensitivity support"],
    recommendedFor: ["builder", "nurturer"],
    category: "gut",
    icon: "🍃",
  },
  {
    id: "super-greens",
    name: "Super Greens",
    tagline: "Alkalizing whole-food nutrition",
    description: "Organic superfood blend with spirulina, chlorella, wheatgrass, and adaptogenic herbs. Alkalizes the body, boosts energy, and fills nutritional gaps in one scoop.",
    benefits: ["Alkalizing", "Energy boost", "Nutritional gaps", "Anti-inflammatory"],
    recommendedFor: ["igniter", "builder", "nurturer", "transformer"],
    category: "core",
    icon: "🥬",
  },
  {
    id: "omega-3",
    name: "Omega 3+",
    tagline: "High-potency anti-inflammatory support",
    description: "Ultra-pure fish oil with optimal EPA/DHA ratios for brain health, joint comfort, heart health, and inflammation reduction. Molecularly distilled for maximum purity.",
    benefits: ["Brain health", "Joint comfort", "Heart health", "Inflammation reduction"],
    recommendedFor: ["igniter", "nurturer", "transformer"],
    category: "immune",
    icon: "🐟",
  },
  {
    id: "vitamin-d3-k2",
    name: "Vitamin D3 + K2",
    tagline: "Immune & bone strength synergy",
    description: "Synergistic combination of D3 and K2 for optimal calcium absorption, bone density, immune resilience, and mood support. Essential for those with limited sun exposure.",
    benefits: ["Bone strength", "Immune resilience", "Mood support", "Calcium absorption"],
    recommendedFor: ["nurturer", "builder", "transformer"],
    category: "immune",
    icon: "☀️",
  },
  {
    id: "collagen-glow",
    name: "Collagen Glow",
    tagline: "Skin, hair & joint rejuvenation",
    description: "Multi-type collagen peptides with hyaluronic acid and vitamin C for radiant skin, stronger hair, flexible joints, and gut lining support. Beauty from the inside out.",
    benefits: ["Skin elasticity", "Hair strength", "Joint flexibility", "Gut lining repair"],
    recommendedFor: ["nurturer", "transformer", "builder"],
    category: "beauty",
    icon: "✨",
  },
  {
    id: "adrenal-support",
    name: "Adrenal Support",
    tagline: "Stress resilience & cortisol balance",
    description: "Adaptogenic blend of ashwagandha, rhodiola, and holy basil designed to regulate cortisol, restore adrenal function, and rebuild stress resilience naturally.",
    benefits: ["Cortisol regulation", "Stress resilience", "Energy restoration", "Sleep quality"],
    recommendedFor: ["igniter", "nurturer"],
    category: "hormones",
    icon: "⚡",
  },
  {
    id: "hormone-harmony",
    name: "Hormone Harmony",
    tagline: "Cyclical hormone balance & PMS relief",
    description: "Botanical blend supporting estrogen metabolism, progesterone balance, and thyroid function. Designed for women navigating PMS, perimenopause, or hormonal shifts.",
    benefits: ["Estrogen balance", "PMS relief", "Thyroid support", "Mood stability"],
    recommendedFor: ["transformer", "nurturer"],
    category: "hormones",
    icon: "🦋",
  },
  {
    id: "magnesium-complex",
    name: "Magnesium Complex",
    tagline: "Deep relaxation & nervous system calm",
    description: "Triple-form magnesium (glycinate, threonate, taurate) for muscle relaxation, nervous system support, better sleep, and reduced anxiety. The mineral most women are deficient in.",
    benefits: ["Muscle relaxation", "Better sleep", "Anxiety relief", "Nervous system calm"],
    recommendedFor: ["igniter", "nurturer", "transformer"],
    category: "hormones",
    icon: "🌙",
  },
  {
    id: "turmeric-plus",
    name: "Turmeric Plus",
    tagline: "Powerful anti-inflammatory & pain relief",
    description: "Bioavailable curcumin with black pepper extract for maximum absorption. Targets systemic inflammation, joint pain, and supports brain and heart health.",
    benefits: ["Inflammation relief", "Joint comfort", "Brain health", "Pain management"],
    recommendedFor: ["igniter", "builder"],
    category: "immune",
    icon: "🔥",
  },
];

export const categoryLabels: Record<string, { label: string; color: string }> = {
  core: { label: "Core Essentials", color: "bg-primary/10 text-primary" },
  energy: { label: "Energy & Recovery", color: "bg-orange-500/10 text-orange-600" },
  gut: { label: "Gut Health", color: "bg-emerald-500/10 text-emerald-600" },
  beauty: { label: "Beauty & Glow", color: "bg-pink-500/10 text-pink-600" },
  immune: { label: "Immune & Anti-Inflammatory", color: "bg-blue-500/10 text-blue-600" },
  hormones: { label: "Hormones & Nervous System", color: "bg-purple-500/10 text-purple-600" },
};

export const bodyTypeLabels: Record<string, { name: string; emoji: string }> = {
  igniter: { name: "Igniter", emoji: "🔥" },
  builder: { name: "Builder", emoji: "🌿" },
  nurturer: { name: "Nurturer", emoji: "🌙" },
  transformer: { name: "Transformer", emoji: "🦋" },
};
