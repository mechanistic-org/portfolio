
export interface PeriodicElement {
    number: number;
    symbol: string;
    name: string;
    category: "Thinking" | "Feeling" | "Doing" | "Software" | "Hardware" | "Management" | "Unknown";
    atomicMass: string;
    summary?: string;
}

export const periodicTraits: PeriodicElement[] = [
    { number: 1, symbol: "Cr", name: "Creativity", category: "Thinking", atomicMass: "1.008" },
    { number: 2, symbol: "Cu", name: "Curiosity", category: "Thinking", atomicMass: "4.002" },
    { number: 3, symbol: "Tr", name: "Trust", category: "Feeling", atomicMass: "6.94" },
    { number: 4, symbol: "Ad", name: "Adaptability", category: "Doing", atomicMass: "9.012" },
    { number: 5, symbol: "Ps", name: "Problem Solving", category: "Thinking", atomicMass: "10.81" },
    { number: 6, symbol: "Pl", name: "Playfulness", category: "Feeling", atomicMass: "12.01" },
    { number: 7, symbol: "In", name: "Initiative", category: "Doing", atomicMass: "14.00" },
    { number: 8, symbol: "Em", name: "Empathy", category: "Feeling", atomicMass: "15.99" },
    { number: 9, symbol: "Ac", name: "Activity Level", category: "Doing", atomicMass: "18.99" },
    { number: 10, symbol: "Iu", name: "Intuition", category: "Thinking", atomicMass: "20.18" },
    { number: 11, symbol: "Ef", name: "Efficiency", category: "Doing", atomicMass: "22.99" },
    { number: 12, symbol: "Rs", name: "Resourcefulness", category: "Thinking", atomicMass: "24.30" },
    { number: 13, symbol: "Co", name: "Comprehension", category: "Thinking", atomicMass: "26.98" },
    { number: 14, symbol: "Or", name: "Organization", category: "Doing", atomicMass: "28.08" },
    { number: 15, symbol: "Dr", name: "Drive", category: "Doing", atomicMass: "30.97" },
    { number: 16, symbol: "Se", name: "Sensitivity", category: "Feeling", atomicMass: "32.06" },
    { number: 17, symbol: "As", name: "Assertiveness", category: "Doing", atomicMass: "35.45" },
    { number: 18, symbol: "Iq", name: "Inquisitiveness", category: "Thinking", atomicMass: "39.94" },
];

export const periodicTools: PeriodicElement[] = [
    { number: 1, symbol: "Sw", name: "SolidWorks", category: "Software", atomicMass: "CAD" },
    { number: 2, symbol: "On", name: "Onshape", category: "Software", atomicMass: "CAD" },
    { number: 3, symbol: "Cr", name: "Creo", category: "Software", atomicMass: "CAD" },
    { number: 4, symbol: "Ad", name: "Adobe Suite", category: "Software", atomicMass: "Creative" },
    { number: 5, symbol: "Fi", name: "Figma", category: "Software", atomicMass: "UX" },
    { number: 6, symbol: "Py", name: "Python", category: "Software", atomicMass: "Code" },
    { number: 7, symbol: "Js", name: "JavaScript", category: "Software", atomicMass: "Code" },
    { number: 8, symbol: "Ts", name: "TypeScript", category: "Software", atomicMass: "Code" },
    { number: 9, symbol: "Rc", name: "React", category: "Software", atomicMass: "Code" },
    { number: 10, symbol: "As", name: "Astro", category: "Software", atomicMass: "Code" },
    { number: 11, symbol: "Wc", name: "Windchill", category: "Management", atomicMass: "PLM" },
    { number: 12, symbol: "Ar", name: "Arena", category: "Management", atomicMass: "PLM" },
    { number: 13, symbol: "Jm", name: "Jira", category: "Management", atomicMass: "Agile" },
    { number: 14, symbol: "Ex", name: "Excel", category: "Software", atomicMass: "Data" },
    { number: 15, symbol: "Pt", name: "Prototyping", category: "Hardware", atomicMass: "Make" },
    { number: 16, symbol: "Im", name: "Injection Molding", category: "Hardware", atomicMass: "Mfg" },
    { number: 17, symbol: "Sm", name: "Sheet Metal", category: "Hardware", atomicMass: "Mfg" },
    { number: 18, symbol: "Da", name: "Data Analysis", category: "Thinking", atomicMass: "Stats" },
];
