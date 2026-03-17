export interface AviniProduct {
  id: string;
  name: string;
  tagline: string;
  description: string;
  benefits: string[];
  recommendedFor: ('igniter' | 'builder' | 'nurturer' | 'transformer')[];
  category: 'core' | 'energy' | 'gut' | 'immune' | 'heart' | 'mind';
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
    id: "plus-motion",
    name: "Plus Motion",
    tagline: "Joint comfort & mobility support",
    description: "Advanced joint support formula for flexibility, comfort, and mobility. Helps reduce stiffness and supports an active lifestyle.",
    benefits: ["Joint comfort", "Flexibility", "Mobility support", "Stiffness relief"],
    recommendedFor: ["igniter", "builder", "transformer"],
    category: "core",
    icon: "🦴",
  },
  {
    id: "trimscience",
    name: "TrimScience",
    tagline: "Healthy weight management support",
    description: "Science-backed formula supporting healthy metabolism, appetite balance, and body composition. Designed to complement a healthy lifestyle.",
    benefits: ["Metabolism support", "Appetite balance", "Body composition", "Energy boost"],
    recommendedFor: ["builder", "nurturer", "transformer"],
    category: "core",
    icon: "⚖️",
  },
  {
    id: "plus-balance",
    name: "Plus Balance",
    tagline: "Blood sugar & metabolic balance",
    description: "Supports healthy blood sugar levels already within normal range and promotes balanced metabolic function for sustained energy throughout the day.",
    benefits: ["Blood sugar support", "Metabolic balance", "Sustained energy", "Craving reduction"],
    recommendedFor: ["builder", "nurturer", "transformer"],
    category: "core",
    icon: "🔄",
  },
  {
    id: "zmunity-mushrooms",
    name: "Zmunity Mushrooms",
    tagline: "Immune defense & adaptogenic support",
    description: "Powerful blend of medicinal mushrooms including reishi, lion's mane, and chaga for immune resilience, stress adaptation, and cognitive clarity.",
    benefits: ["Immune defense", "Stress adaptation", "Cognitive clarity", "Antioxidant support"],
    recommendedFor: ["igniter", "nurturer", "transformer"],
    category: "immune",
    icon: "🍄",
  },
  {
    id: "plus-relief",
    name: "Plus Relief",
    tagline: "Natural pain & inflammation support",
    description: "Natural formula targeting discomfort and inflammation. Supports the body's natural response to pain for comfort and ease.",
    benefits: ["Pain relief", "Inflammation support", "Comfort", "Recovery"],
    recommendedFor: ["igniter", "builder"],
    category: "core",
    icon: "💆",
  },
  {
    id: "plus-mind-and-vision",
    name: "Plus Mind and Vision",
    tagline: "Cognitive clarity & eye health",
    description: "Dual-action formula supporting brain function, mental clarity, focus, and healthy vision. Nourishes both mind and eyes with targeted nutrients.",
    benefits: ["Mental clarity", "Focus", "Eye health", "Cognitive support"],
    recommendedFor: ["igniter", "nurturer", "transformer"],
    category: "mind",
    icon: "🧠",
  },
  {
    id: "nano-silver",
    name: "Nano Silver",
    tagline: "Immune support & natural defense",
    description: "Advanced nano-particle silver solution for powerful immune support. Helps maintain your body's natural defenses against environmental challenges.",
    benefits: ["Immune support", "Natural defense", "Bioavailable", "Daily protection"],
    recommendedFor: ["igniter", "builder", "nurturer", "transformer"],
    category: "immune",
    icon: "🔬",
  },
  {
    id: "plus-hydration",
    name: "Plus Hydration",
    tagline: "Deep cellular hydration",
    description: "Electrolyte and mineral blend for optimal cellular hydration. Goes beyond surface-level hydration to nourish cells and support energy and recovery.",
    benefits: ["Cellular hydration", "Electrolyte balance", "Energy support", "Recovery"],
    recommendedFor: ["igniter", "builder", "nurturer", "transformer"],
    category: "energy",
    icon: "💧",
  },
  {
    id: "plus-energy",
    name: "Plus Energy",
    tagline: "Clean, sustained energy boost",
    description: "Natural energy formula providing clean, sustained vitality without jitters or crashes. Supports mitochondrial function and all-day focus.",
    benefits: ["Clean energy", "No jitters", "Mental focus", "Sustained vitality"],
    recommendedFor: ["igniter", "builder", "transformer"],
    category: "energy",
    icon: "⚡",
  },
  {
    id: "plus-fiber",
    name: "Plus Fiber",
    tagline: "Digestive health & gut support",
    description: "Premium fiber blend supporting healthy digestion, regularity, and gut microbiome balance. Gentle yet effective daily digestive support.",
    benefits: ["Digestive health", "Regularity", "Gut balance", "Gentle cleansing"],
    recommendedFor: ["builder", "nurturer", "transformer"],
    category: "gut",
    icon: "🌿",
  },
  {
    id: "plus-cardio-care",
    name: "Plus Cardio Care",
    tagline: "Heart health & cardiovascular support",
    description: "Comprehensive cardiovascular support formula for heart health, healthy circulation, and blood pressure already within normal range.",
    benefits: ["Heart health", "Circulation support", "Blood pressure support", "Cardiovascular wellness"],
    recommendedFor: ["igniter", "builder", "nurturer"],
    category: "heart",
    icon: "❤️",
  },
];

export const categoryLabels: Record<string, { label: string; color: string }> = {
  core: { label: "Core Essentials", color: "bg-primary/10 text-primary" },
  energy: { label: "Energy & Hydration", color: "bg-orange-500/10 text-orange-600" },
  gut: { label: "Gut Health", color: "bg-emerald-500/10 text-emerald-600" },
  immune: { label: "Immune Support", color: "bg-blue-500/10 text-blue-600" },
  heart: { label: "Heart Health", color: "bg-rose-500/10 text-rose-600" },
  mind: { label: "Mind & Vision", color: "bg-purple-500/10 text-purple-600" },
};

export const bodyTypeLabels: Record<string, { name: string; emoji: string }> = {
  igniter: { name: "Igniter", emoji: "🔥" },
  builder: { name: "Builder", emoji: "🌿" },
  nurturer: { name: "Nurturer", emoji: "🌙" },
  transformer: { name: "Transformer", emoji: "🦋" },
};
