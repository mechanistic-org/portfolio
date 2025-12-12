
export type HydeLobe = "Anchor" | "Main" | "Transition" | "Deep";

export interface HydeTrait {
    name: string;
    rank: number;
    lobe: HydeLobe;
    description?: string;
}

// AI-Classified Traits based on the "Ouroboros" Mental Model
// Anchor: Core Essence
// Main: Fundamental Personality (The "Ribbon")
// Transition: Hard Skills & Tools (The "Bridge")
// Deep: Leadership & Philosophy (The "Heavy Elements")

export const hydeTraits: HydeTrait[] = [
    // --- Anchor (The Hydrogens) ---
    { rank: 1, name: "Creativity", lobe: "Anchor" },

    // --- Main Ribbon (Fundamental Personality) ---
    { rank: 2, name: "Curiosity", lobe: "Main" },
    { rank: 4, name: "Adaptability", lobe: "Main" },
    { rank: 6, name: "Playfulness", lobe: "Main" },
    { rank: 8, name: "Empathy", lobe: "Main" },
    { rank: 10, name: "Intuition", lobe: "Main" },
    { rank: 16, name: "Sensitivity", lobe: "Main" },
    { rank: 24, name: "Optimism", lobe: "Main" },
    { rank: 28, name: "Originality", lobe: "Main" },
    { rank: 31, name: "Joyfulness", lobe: "Main" },
    { rank: 32, name: "Aesthetic-Appreciation", lobe: "Main" },
    { rank: 34, name: "Vulnerability", lobe: "Main" },
    { rank: 49, name: "Expressiveness", lobe: "Main" },
    { rank: 54, name: "Openness-to-Experience", lobe: "Main" },
    { rank: 69, name: "Enthusiasm", lobe: "Main" },
    { rank: 70, name: "Liveliness", lobe: "Main" },
    { rank: 86, name: "Imagination", lobe: "Main" },
    { rank: 106, name: "Happiness", lobe: "Main" },
    { rank: 111, name: "Adventurousness", lobe: "Main" },
    { rank: 112, name: "Excitement-Seeking", lobe: "Main" },

    // --- Transition Loop (Hard Skills, Drive, Work Style) ---
    { rank: 5, name: "Problem-Solving", lobe: "Transition" },
    { rank: 7, name: "Initiative", lobe: "Transition" },
    { rank: 9, name: "Activity-Level", lobe: "Transition" },
    { rank: 11, name: "Efficiency", lobe: "Transition" },
    { rank: 12, name: "Resourcefulness", lobe: "Transition" },
    { rank: 13, name: "Comprehension", lobe: "Transition" },
    { rank: 14, name: "Organization-of-Ideas", lobe: "Transition" },
    { rank: 15, name: "Drive", lobe: "Transition" },
    { rank: 19, name: "Rationality", lobe: "Transition" },
    { rank: 20, name: "Ingenuity", lobe: "Transition" },
    { rank: 37, name: "Practicality", lobe: "Transition" },
    { rank: 39, name: "Technical", lobe: "Transition" },
    { rank: 40, name: "Analytical", lobe: "Transition" },
    { rank: 47, name: "Self-Sufficiency", lobe: "Transition" },
    { rank: 51, name: "Diligence", lobe: "Transition" },
    { rank: 55, name: "Organization", lobe: "Transition" },
    { rank: 57, name: "Self-discipline", lobe: "Transition" },
    { rank: 59, name: "Competence", lobe: "Transition" },
    { rank: 71, name: "Quickness", lobe: "Transition" },
    { rank: 87, name: "Complexity", lobe: "Transition" },
    { rank: 88, name: "Perseverance", lobe: "Transition" },
    { rank: 90, name: "Proactivity", lobe: "Transition" },
    { rank: 100, name: "Orderliness", lobe: "Transition" },
    { rank: 101, name: "Planfulness", lobe: "Transition" },

    // --- Deep Loop (Social, Leadership, Ethics, Values) ---
    { rank: 3, name: "Trust", lobe: "Deep" },
    { rank: 17, name: "Assertiveness", lobe: "Deep" },
    { rank: 21, name: "Perspective", lobe: "Deep" },
    { rank: 23, name: "Cooperation", lobe: "Deep" },
    { rank: 26, name: "Self-control", lobe: "Deep" },
    { rank: 29, name: "Independence", lobe: "Deep" },
    { rank: 30, name: "Spirituality", lobe: "Deep" },
    { rank: 36, name: "Perceptiveness", lobe: "Deep" },
    { rank: 41, name: "Agreeableness", lobe: "Deep" },
    { rank: 42, name: "Kindness", lobe: "Deep" },
    { rank: 48, name: "Conscientiousness", lobe: "Deep" },
    { rank: 52, name: "Compassion", lobe: "Deep" },
    { rank: 53, name: "Temperance", lobe: "Deep" },
    { rank: 56, name: "Patience", lobe: "Deep" },
    { rank: 61, name: "Tolerance", lobe: "Deep" },
    { rank: 62, name: "Courage", lobe: "Deep" },
    { rank: 63, name: "Altruism", lobe: "Deep" },
    { rank: 64, name: "Leadership", lobe: "Deep" },
    { rank: 95, name: "Loyalty", lobe: "Deep" },
    { rank: 96, name: "Humility", lobe: "Deep" },
    { rank: 97, name: "Equity", lobe: "Deep" },
    { rank: 104, name: "Understanding", lobe: "Deep" },
    { rank: 105, name: "Charisma", lobe: "Deep" },
    { rank: 114, name: "Gratitude", lobe: "Deep" },
    { rank: 115, name: "Responsibility", lobe: "Deep" },
    { rank: 116, name: "Honesty", lobe: "Deep" },

    // Remaining items (Negative/Neutral) mapped to Deep or Main as appropriate
    { rank: 25, name: "Rigidity", lobe: "Deep" },
    { rank: 27, name: "Neuroticism", lobe: "Main" },
    { rank: 43, name: "Social-Withdrawal", lobe: "Main" },
    { rank: 75, name: "Anxiety", lobe: "Main" },
    { rank: 108, name: "Perfectionism", lobe: "Transition" },
    { rank: 117, name: "Anger", lobe: "Main" },
];
