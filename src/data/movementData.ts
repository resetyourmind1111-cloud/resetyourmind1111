export interface Exercise {
  name: string;
  duration: string;
  intensity: "low" | "moderate" | "high";
  description: string;
  benefits: string[];
}

export interface DayPlan {
  day: string;
  focus: string;
  exercises: Exercise[];
  restDay?: boolean;
}

export interface MovementPlan {
  overview: string;
  philosophy: string;
  weeklyGoal: string;
  warmUp: string[];
  coolDown: string[];
  weeklySchedule: DayPlan[];
}

export const movementPlans: Record<string, MovementPlan> = {
  igniter: {
    overview: "High-energy movement that channels your fire without burning out. Your body craves intensity but needs strategic recovery to stay powerful.",
    philosophy: "Move explosively, recover intentionally. Your igniter energy thrives on challenge — but burnout is your shadow. Balance power with rest.",
    weeklyGoal: "4–5 active days with 2 recovery days built in",
    warmUp: ["Dynamic arm circles (30 sec)", "High knees (30 sec)", "Lateral lunges (30 sec)", "Torso rotations (30 sec)"],
    coolDown: ["Standing quad stretch (30 sec each)", "Forward fold (45 sec)", "Child's pose (60 sec)", "Deep diaphragmatic breathing (2 min)"],
    weeklySchedule: [
      {
        day: "Monday",
        focus: "Power & Strength",
        exercises: [
          { name: "Kettlebell Swings", duration: "12 min", intensity: "high", description: "Full-body explosive movement. 30 sec on, 15 sec rest.", benefits: ["Core activation", "Posterior chain strength", "Cardiovascular power"] },
          { name: "Push-Up Variations", duration: "8 min", intensity: "high", description: "Standard, diamond, and wide grip. 10 reps each, 3 rounds.", benefits: ["Upper body strength", "Core stability", "Shoulder health"] },
          { name: "Box Jumps or Step-Ups", duration: "10 min", intensity: "high", description: "Explosive jumps or controlled step-ups. 8 reps, 4 sets.", benefits: ["Explosive power", "Leg strength", "Balance"] },
        ],
      },
      {
        day: "Tuesday",
        focus: "Active Recovery — Yoga Flow",
        exercises: [
          { name: "Sun Salutation Flow", duration: "15 min", intensity: "low", description: "Slow, intentional sun salutations focusing on breath-movement connection.", benefits: ["Flexibility", "Breath regulation", "Nervous system reset"] },
          { name: "Hip Opener Sequence", duration: "10 min", intensity: "low", description: "Pigeon pose, lizard pose, and frog pose — hold each 90 seconds.", benefits: ["Hip flexibility", "Stored tension release", "Lower back relief"] },
          { name: "Guided Savasana", duration: "5 min", intensity: "low", description: "Lie flat, close eyes, progressive muscle relaxation.", benefits: ["Cortisol reduction", "Mental clarity", "Full-body reset"] },
        ],
      },
      {
        day: "Wednesday",
        focus: "HIIT Sprint Intervals",
        exercises: [
          { name: "Sprint Intervals", duration: "15 min", intensity: "high", description: "30-second all-out sprint, 60-second walk. Repeat 10 rounds.", benefits: ["Fat burning", "Metabolic boost", "Cardiovascular endurance"] },
          { name: "Burpee Complex", duration: "8 min", intensity: "high", description: "Burpee + tuck jump. 8 reps, 4 sets with 45-sec rest.", benefits: ["Full-body conditioning", "Explosive power", "Mental toughness"] },
          { name: "Mountain Climbers", duration: "6 min", intensity: "moderate", description: "30 sec fast, 15 sec rest. 8 rounds.", benefits: ["Core strength", "Agility", "Shoulder endurance"] },
        ],
      },
      {
        day: "Thursday",
        focus: "Rest & Restore",
        restDay: true,
        exercises: [
          { name: "Gentle Walk in Nature", duration: "20–30 min", intensity: "low", description: "Slow walk, no music — ground your energy. Barefoot if possible.", benefits: ["Grounding", "Cortisol regulation", "Mental clarity"] },
          { name: "Foam Rolling", duration: "10 min", intensity: "low", description: "Full-body foam roll focusing on quads, IT band, and upper back.", benefits: ["Muscle recovery", "Fascia release", "Reduced soreness"] },
        ],
      },
      {
        day: "Friday",
        focus: "Functional Strength Circuit",
        exercises: [
          { name: "Dumbbell Thrusters", duration: "10 min", intensity: "high", description: "Squat to press. 10 reps, 4 sets with 45-sec rest.", benefits: ["Full-body strength", "Power generation", "Metabolic conditioning"] },
          { name: "Renegade Rows", duration: "8 min", intensity: "moderate", description: "Plank position rows. 8 per side, 3 sets.", benefits: ["Back strength", "Core stability", "Anti-rotation"] },
          { name: "Jump Rope Finisher", duration: "5 min", intensity: "high", description: "1 min on, 30 sec off. Finish strong.", benefits: ["Coordination", "Calf strength", "Endurance"] },
        ],
      },
      {
        day: "Saturday",
        focus: "Play & Adventure",
        exercises: [
          { name: "Sport of Choice", duration: "45–60 min", intensity: "moderate", description: "Basketball, tennis, swimming, hiking, rock climbing — move for joy, not obligation.", benefits: ["Dopamine boost", "Social connection", "Unstructured movement"] },
        ],
      },
      {
        day: "Sunday",
        focus: "Full Rest",
        restDay: true,
        exercises: [
          { name: "Restorative Stretching", duration: "15 min", intensity: "low", description: "Gentle full-body stretches. Focus on areas of tightness.", benefits: ["Recovery", "Flexibility", "Mindfulness"] },
          { name: "Breathwork Practice", duration: "10 min", intensity: "low", description: "4-7-8 breathing or box breathing for nervous system regulation.", benefits: ["Parasympathetic activation", "Stress relief", "Better sleep"] },
        ],
      },
    ],
  },
  builder: {
    overview: "Steady, grounding movement that builds strength slowly and sustainably. Your body loves consistency and routine — honor that rhythm.",
    philosophy: "Slow and steady wins YOUR race. Builders thrive on progressive overload and predictable routines. Avoid trendy, chaotic workouts — your body responds to trust.",
    weeklyGoal: "5 moderate activity days with structured progression",
    warmUp: ["Neck rolls (30 sec)", "Arm swings (30 sec)", "Bodyweight squats (30 sec)", "Cat-cow stretches (30 sec)"],
    coolDown: ["Seated hamstring stretch (45 sec each)", "Spinal twist (45 sec each)", "Butterfly stretch (60 sec)", "Box breathing (2 min)"],
    weeklySchedule: [
      {
        day: "Monday",
        focus: "Foundation Strength — Lower Body",
        exercises: [
          { name: "Goblet Squats", duration: "12 min", intensity: "moderate", description: "Controlled squat with dumbbell at chest. 12 reps, 4 sets.", benefits: ["Quad and glute strength", "Core engagement", "Joint stability"] },
          { name: "Romanian Deadlifts", duration: "10 min", intensity: "moderate", description: "Hinge at hips with dumbbells. 10 reps, 3 sets. Slow eccentric.", benefits: ["Hamstring strength", "Posterior chain", "Balance"] },
          { name: "Wall Sit Hold", duration: "6 min", intensity: "moderate", description: "Hold wall sit for 45 sec, rest 30 sec. 4 rounds.", benefits: ["Isometric strength", "Mental endurance", "Quad activation"] },
        ],
      },
      {
        day: "Tuesday",
        focus: "Steady-State Cardio",
        exercises: [
          { name: "Brisk Walking or Light Jogging", duration: "30 min", intensity: "moderate", description: "Maintain a pace where you can hold a conversation but feel slightly breathless.", benefits: ["Heart health", "Endurance base", "Mood regulation"] },
          { name: "Walking Lunges", duration: "8 min", intensity: "moderate", description: "20 steps, rest 30 sec. 3 sets. Focus on form over speed.", benefits: ["Leg strength", "Balance", "Hip flexibility"] },
        ],
      },
      {
        day: "Wednesday",
        focus: "Upper Body & Core",
        exercises: [
          { name: "Dumbbell Chest Press", duration: "10 min", intensity: "moderate", description: "Lying press. 10 reps, 4 sets with controlled tempo.", benefits: ["Chest strength", "Tricep activation", "Upper body power"] },
          { name: "Bent-Over Rows", duration: "10 min", intensity: "moderate", description: "Hinge forward, row to chest. 10 reps each arm, 3 sets.", benefits: ["Back strength", "Posture improvement", "Grip strength"] },
          { name: "Plank Holds", duration: "8 min", intensity: "moderate", description: "Hold 45 sec, rest 20 sec. Forearm and side planks alternating.", benefits: ["Core stability", "Back support", "Full-body engagement"] },
        ],
      },
      {
        day: "Thursday",
        focus: "Gentle Movement & Mobility",
        exercises: [
          { name: "Tai Chi or Qi Gong Flow", duration: "20 min", intensity: "low", description: "Slow, flowing movements. Follow a guided video or class.", benefits: ["Balance", "Energy flow", "Joint health"] },
          { name: "Deep Stretching Sequence", duration: "15 min", intensity: "low", description: "Full-body stretch routine holding each pose for 60–90 seconds.", benefits: ["Flexibility", "Tension release", "Recovery"] },
        ],
      },
      {
        day: "Friday",
        focus: "Full-Body Strength Circuit",
        exercises: [
          { name: "Deadlift to Press", duration: "10 min", intensity: "moderate", description: "Hinge, lift, press overhead. 8 reps, 4 sets.", benefits: ["Full-body integration", "Power", "Coordination"] },
          { name: "Step-Ups with Weight", duration: "8 min", intensity: "moderate", description: "12 per leg, 3 sets. Use a bench or sturdy step.", benefits: ["Unilateral strength", "Balance", "Glute activation"] },
          { name: "Farmer's Carry", duration: "6 min", intensity: "moderate", description: "Heavy weights, walk 40 meters. 4 sets.", benefits: ["Grip strength", "Core stability", "Mental resilience"] },
        ],
      },
      {
        day: "Saturday",
        focus: "Nature & Grounding",
        exercises: [
          { name: "Hiking or Trail Walk", duration: "45–60 min", intensity: "low", description: "Get outside. Uneven terrain is perfect for your grounding energy.", benefits: ["Connection to nature", "Leg endurance", "Vitamin D"] },
        ],
      },
      {
        day: "Sunday",
        focus: "Rest & Reflection",
        restDay: true,
        exercises: [
          { name: "Gentle Yoga or Stretching", duration: "20 min", intensity: "low", description: "Slow, restorative poses. Focus on areas that feel tight.", benefits: ["Recovery", "Mindfulness", "Flexibility maintenance"] },
        ],
      },
    ],
  },
  nurturer: {
    overview: "Gentle, heart-centered movement that nourishes rather than depletes. Your empathic body absorbs energy everywhere — movement should release, not add more.",
    philosophy: "Your body is a sponge for energy. Choose movement that wrings out stress, not piles it on. Nurturers shine with low-to-moderate intensity and deeply restorative practices.",
    weeklyGoal: "4–5 gentle-to-moderate activity days with plenty of rest",
    warmUp: ["Gentle shoulder rolls (30 sec)", "Side bends (30 sec)", "Ankle circles (30 sec)", "Deep belly breaths (60 sec)"],
    coolDown: ["Legs up the wall (2 min)", "Supine twist (45 sec each)", "Gentle neck stretches (30 sec each)", "Heart-centered breathing (2 min)"],
    weeklySchedule: [
      {
        day: "Monday",
        focus: "Gentle Strength & Tone",
        exercises: [
          { name: "Barre-Inspired Leg Work", duration: "15 min", intensity: "moderate", description: "Small, controlled movements: pliés, leg lifts, pulses at the barre or chair.", benefits: ["Lean muscle tone", "Joint-friendly", "Graceful strength"] },
          { name: "Light Dumbbell Arms", duration: "10 min", intensity: "low", description: "3–5 lb weights. Bicep curls, lateral raises, tricep kickbacks. 12 reps, 3 sets.", benefits: ["Upper body tone", "Bone density", "Confidence"] },
          { name: "Core Pilates Series", duration: "10 min", intensity: "moderate", description: "The hundred, single leg stretch, roll-ups. Controlled breath throughout.", benefits: ["Deep core strength", "Spinal health", "Body awareness"] },
        ],
      },
      {
        day: "Tuesday",
        focus: "Water Element — Swimming or Aquatic",
        exercises: [
          { name: "Swimming or Water Walking", duration: "30 min", intensity: "low", description: "Gentle laps or water walking. The water element is deeply healing for nurturers.", benefits: ["Zero-impact movement", "Emotional release", "Full-body toning"] },
          { name: "Aquatic Stretching", duration: "10 min", intensity: "low", description: "In-pool stretches using water resistance. Move slowly and breathe deeply.", benefits: ["Joint decompression", "Flexibility", "Nervous system calm"] },
        ],
      },
      {
        day: "Wednesday",
        focus: "Heart-Opening Yoga",
        exercises: [
          { name: "Heart Chakra Yoga Flow", duration: "25 min", intensity: "low", description: "Camel pose, cobra, bridge, and fish pose. Hold each for 5 breaths.", benefits: ["Chest opening", "Emotional release", "Self-compassion"] },
          { name: "Guided Loving-Kindness Meditation", duration: "10 min", intensity: "low", description: "Seated meditation sending love to self, loved ones, and the world.", benefits: ["Emotional healing", "Compassion cultivation", "Stress relief"] },
        ],
      },
      {
        day: "Thursday",
        focus: "Full Rest & Self-Care",
        restDay: true,
        exercises: [
          { name: "Epsom Salt Bath", duration: "20 min", intensity: "low", description: "Warm bath with 2 cups epsom salt and lavender essential oil.", benefits: ["Magnesium absorption", "Muscle relaxation", "Energy clearing"] },
          { name: "Body Scan Meditation", duration: "10 min", intensity: "low", description: "Lie down, scan from head to toe, release tension in each area.", benefits: ["Body awareness", "Stress release", "Deep relaxation"] },
        ],
      },
      {
        day: "Friday",
        focus: "Dance & Expression",
        exercises: [
          { name: "Free-Form Dance", duration: "20 min", intensity: "moderate", description: "Put on music that moves you. Dance without choreography — let your body lead.", benefits: ["Emotional expression", "Joy cultivation", "Cardiovascular health"] },
          { name: "Ecstatic Movement Cool-Down", duration: "10 min", intensity: "low", description: "Slow the music, move gently, transition to stillness.", benefits: ["Grounding after expression", "Nervous system regulation", "Integration"] },
        ],
      },
      {
        day: "Saturday",
        focus: "Nature Connection Walk",
        exercises: [
          { name: "Mindful Nature Walk", duration: "30–45 min", intensity: "low", description: "Walk slowly through a park or garden. Notice colors, sounds, textures. No phone.", benefits: ["Sensory grounding", "Vitamin D", "Energy clearing"] },
          { name: "Earthing / Grounding", duration: "10 min", intensity: "low", description: "Stand or walk barefoot on grass or earth. Feel the connection.", benefits: ["Electromagnetic grounding", "Inflammation reduction", "Presence"] },
        ],
      },
      {
        day: "Sunday",
        focus: "Restorative & Nourishing",
        restDay: true,
        exercises: [
          { name: "Restorative Yoga with Props", duration: "25 min", intensity: "low", description: "Supported child's pose, bolster backbend, legs up wall. Use pillows and blankets.", benefits: ["Deep restoration", "Parasympathetic activation", "Emotional reset"] },
        ],
      },
    ],
  },
  transformer: {
    overview: "Cyclical, intuitive movement that honors your ever-changing energy. You thrive when movement adapts TO you — not the other way around.",
    philosophy: "You are not the same person every day — so why would your workout be? Transformers need variety, creative expression, and permission to change the plan mid-flow.",
    weeklyGoal: "4–6 days varying by energy level — listen to your body daily",
    warmUp: ["Intuitive body shaking (30 sec)", "Hip circles (30 sec)", "Spinal waves (30 sec)", "Breath of fire (30 sec)"],
    coolDown: ["Butterfly stretch (45 sec)", "Supine spinal twist (45 sec each)", "Happy baby pose (60 sec)", "Humming breath (2 min)"],
    weeklySchedule: [
      {
        day: "Monday",
        focus: "Power Yoga & Strength",
        exercises: [
          { name: "Vinyasa Power Flow", duration: "25 min", intensity: "moderate", description: "Warrior sequences, chaturanga push-ups, and balance poses. Flow with breath.", benefits: ["Strength + flexibility", "Mind-body connection", "Heat building"] },
          { name: "Arm Balances Practice", duration: "10 min", intensity: "high", description: "Crow pose, side crow, flying pigeon — or modified versions. Playful exploration.", benefits: ["Upper body strength", "Confidence", "Playfulness"] },
        ],
      },
      {
        day: "Tuesday",
        focus: "Rhythmic Cardio",
        exercises: [
          { name: "Dance Cardio or Zumba", duration: "30 min", intensity: "moderate", description: "High-energy dance class or follow-along video. Let rhythm guide you.", benefits: ["Cardiovascular fitness", "Coordination", "Joy and self-expression"] },
          { name: "Jump Rope Play", duration: "8 min", intensity: "high", description: "Singles, doubles, criss-cross. 45 sec on, 15 sec off.", benefits: ["Agility", "Bone density", "Quick-twitch muscle activation"] },
        ],
      },
      {
        day: "Wednesday",
        focus: "Creative Flow & Flexibility",
        exercises: [
          { name: "Aerial Yoga or Silk Work", duration: "20 min", intensity: "moderate", description: "If available, try aerial yoga. Otherwise: inversions and deep stretching.", benefits: ["Spinal decompression", "Creative expression", "Core strength"] },
          { name: "Intuitive Stretching", duration: "15 min", intensity: "low", description: "No structure. Move your body in whatever way feels needed. Follow impulses.", benefits: ["Body listening", "Tension release", "Self-trust"] },
        ],
      },
      {
        day: "Thursday",
        focus: "Rest or Gentle Movement",
        restDay: true,
        exercises: [
          { name: "Yin Yoga", duration: "25 min", intensity: "low", description: "Hold deep stretches for 3–5 minutes each. Dragon, sphinx, saddle.", benefits: ["Fascia release", "Meridian stimulation", "Deep calm"] },
          { name: "Journaling + Body Scan", duration: "10 min", intensity: "low", description: "Write about how your body feels today. What does it need? Honor that.", benefits: ["Self-awareness", "Mind-body integration", "Intuition building"] },
        ],
      },
      {
        day: "Friday",
        focus: "HIIT Meets Art",
        exercises: [
          { name: "Kickboxing Intervals", duration: "20 min", intensity: "high", description: "Jab-cross-hook-uppercut combos. 40 sec work, 20 sec rest. 5 rounds.", benefits: ["Emotional release", "Full-body power", "Stress relief"] },
          { name: "Shadow Boxing Flow", duration: "10 min", intensity: "moderate", description: "Slow, controlled shadow boxing with breath. Move like water.", benefits: ["Coordination", "Mindfulness", "Upper body endurance"] },
        ],
      },
      {
        day: "Saturday",
        focus: "Adventure & Exploration",
        exercises: [
          { name: "Try Something New", duration: "45–60 min", intensity: "moderate", description: "Rock climbing, paddleboard, martial arts class, pole fitness — your transformer spirit craves novelty.", benefits: ["Neural pathway creation", "Excitement", "Full-body challenge"] },
        ],
      },
      {
        day: "Sunday",
        focus: "Integration & Rebirth",
        restDay: true,
        exercises: [
          { name: "Moon Salutations", duration: "15 min", intensity: "low", description: "Slow, lunar-inspired yoga flow. Honor the cyclical nature of your energy.", benefits: ["Feminine energy activation", "Gentle strength", "Cycle honoring"] },
          { name: "Sound Bath or Humming", duration: "10 min", intensity: "low", description: "Listen to a sound bath recording or hum at different pitches. Feel vibrations.", benefits: ["Vibrational healing", "Nervous system reset", "Spiritual connection"] },
        ],
      },
    ],
  },
};
