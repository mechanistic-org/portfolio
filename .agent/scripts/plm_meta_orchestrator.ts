const { GoogleGenAI, Type } = require("@google/genai");
const fs = require("fs");
const path = require("path");

// Manually parse the .env file
const envPath = path.resolve("D:/GitHub/eriknorris/.env");
let extractedKey = "";
try {
	const envContent = fs.readFileSync(envPath, "utf-8");
	const match = envContent.match(/GEMINI_API_KEY=(.+)/);
	if (match) {
		extractedKey = match[1].trim().replace(/['"]/g, "");
	}
} catch (e) {
	console.log("[!] Could not read absolute .env path.");
}

const apiKey = extractedKey || process.env.GEMINI_API_KEY;
if (!apiKey) {
	console.error("FATAL: GEMINI_API_KEY environment variable is not set.");
	process.exit(1);
}

// Initialize the Official Gemini SDK
const ai = new GoogleGenAI({ apiKey });

/**
 * 1. CTO: Standardizing the JSON Schema & Astro Architecture
 */
const CtoAuditSchema = {
	type: Type.OBJECT,
	properties: {
		architectureExtraction: {
			type: Type.STRING,
			description: "How to instantly template the Astro + JSON Vaults + React components as a universal framework for new clients.",
		},
		dataDecouplingStrategy: {
			type: Type.STRING,
			description: "How the strict decoupling of Vault P, F, and L forces objective truth in future projects.",
		},
		plmViability: {
			type: Type.BOOLEAN,
			description: "Can this codebase entirely replace Jira/Notion as a Project Lifecycle Management system?",
		},
	},
	required: ["architectureExtraction", "dataDecouplingStrategy", "plmViability"],
};

/**
 * 2. CBDO: The Quoting Engine & Biz Dev Leverage
 */
const CbdoAuditSchema = {
	type: Type.OBJECT,
	properties: {
		theGeneralistTrap: {
			type: Type.STRING,
			description: "Formalizing the 'Generalist Trap' narrative as a sales mechanism for all future aerospace/hardware clients.",
		},
		retainerMethodology: {
			type: Type.STRING,
			description: "How to use this dashboard structure to sell the 'Physics API' Evergreen Retainer instantly instead of billable hours.",
		},
		bizDevGoNoGo: {
			type: Type.BOOLEAN,
			description: "Is this methodology ready to be pitched to enterprise CTOs?",
		},
	},
	required: ["theGeneralistTrap", "retainerMethodology", "bizDevGoNoGo"],
};

/**
 * 3. CFO: The Financial Strain Calculator
 */
const CfoAuditSchema = {
	type: Type.OBJECT,
	properties: {
		liabilityCalculus: {
			type: Type.STRING,
			description: "Formalizing the 'Escalating Kinematic Liability Curve' so it can mathematically paralyze an executive into buying safety.",
		},
		quotingSpeed: {
			type: Type.STRING,
			description: "How the modular Vault-F allows for 48-hour zero-to-dashboard financial quotes.",
		},
		financialGoNoGo: {
			type: Type.BOOLEAN,
		},
	},
	required: ["liabilityCalculus", "quotingSpeed", "financialGoNoGo"],
};

/**
 * 4. Principal Physicist: The Crash-Test Methodology
 */
const PhysicsAuditSchema = {
	type: Type.OBJECT,
	properties: {
		constraintMethodology: {
			type: Type.STRING,
			description: "How to use the JSON DFMEA arrays to instantly break a client's PRD during discovery.",
		},
		dependencyTrap: {
			type: Type.STRING,
			description: "Extracting the 'Validation Dependency Trap' as a formalized auditing protocol for all future clients.",
		},
		physicsGoNoGo: {
			type: Type.BOOLEAN,
		},
	},
	required: ["constraintMethodology", "dependencyTrap", "physicsGoNoGo"],
};

/**
 * 5. COO: Supply Chain & Operational Scale
 */
const CooAuditSchema = {
	type: Type.OBJECT,
	properties: {
		operationalScale: {
			type: Type.STRING,
			description: "How this dashboard enforces standard operating procedures across distributed engineering teams.",
		},
		yieldRiskPackaging: {
			type: Type.STRING,
			description: "How to use the Failure Mode components to communicate Tier-1 Chinese factory risks to western execs.",
		},
		operationsGoNoGo: {
			type: Type.BOOLEAN,
		},
	},
	required: ["operationalScale", "yieldRiskPackaging", "operationsGoNoGo"],
};

/**
 * 6. Legal Counsel: The Contractual Shell
 */
const LegalAuditSchema = {
	type: Type.OBJECT,
	properties: {
		theDrawbridgePivot: {
			type: Type.STRING,
			description: "Standardizing the legal protocol for flat-out refusing a client's request ($5K BOM) and converting it into paid discovery.",
		},
		indemnificationStrategy: {
			type: Type.STRING,
			description: "How Vault-L mathematically protects the agency from catastrophic hardware failures.",
		},
		legalGoNoGo: {
			type: Type.BOOLEAN,
		},
	},
	required: ["theDrawbridgePivot", "indemnificationStrategy", "legalGoNoGo"],
};

/**
 * 7. Principal Architect: The Master Playbook
 */
const PrincipalArchitectSchema = {
	type: Type.OBJECT,
	properties: {
		theMechanisticPlaybook: {
			type: Type.STRING,
			description: "A comprehensive synthesis of the previous audits defining 'The Mechanistic Engine' as a repeatable product.",
		},
		sevenDaySprintProtocol: {
			type: Type.ARRAY,
			items: { type: Type.STRING },
			description: "The exact 7-day checklist to spin up this entire ecosystem for a new prospect.",
		},
		playbookGoNoGo: {
			type: Type.BOOLEAN,
		},
	},
	required: ["theMechanisticPlaybook", "sevenDaySprintProtocol", "playbookGoNoGo"],
};

/**
 * 8. HCI Visionary: The Visual OS
 */
const HciVisionarySchema = {
	type: Type.OBJECT,
	properties: {
		theHostileUiProtocol: {
			type: Type.STRING,
			description: "Standardizing the Monochromatic/SCADA aesthetic. Why removing fluff forces executive compliance.",
		},
		telemetryStandard: {
			type: Type.STRING,
			description: "How to present the 'Origin Story' flight recorder as the ultimate sales asset.",
		},
		uiGoNoGo: {
			type: Type.BOOLEAN,
		},
	},
	required: ["theHostileUiProtocol", "telemetryStandard", "uiGoNoGo"],
};

/**
 * THE META-ORCHESTRATOR
 */
async function runMetaOrchestration(targetWorkspacePath: string, targetFiles: string[]) {
	console.log(`\n[+] Summoning the Virtual C-Suite for the META-AUDIT...`);
	console.log(`[+] Objective: Productize the Mechanistic Dashboard Architecture.`);
	console.log(`[+] Ingesting Dashboard Architecture...`);

	try {
		let payload = "";
		for (const file of targetFiles) {
			const fullPath = path.join(targetWorkspacePath, file.trim());
			if (fs.existsSync(fullPath)) {
				const content = fs.readFileSync(fullPath, "utf-8");
				payload += `\n--- CONTENT FROM: ${file} ---\n${content}\n`;
			} else {
                 console.log(`[!] Missing File: ${fullPath}`);
            }
		}

		console.log(`[+] Executing CTO Productization...`);
		const ctoResponse = await ai.models.generateContent({
			model: "gemini-2.5-pro",
			contents: [{ role: "user", parts: [{ text: `Audit our dashboard architecture and extract the exact standard operating procedure to use this codebase as a universal quoting engine and PLM:\n\n${payload}` }] }],
			config: { systemInstruction: "You are the CTO. Formalize the Astro/JSON Architecture into a repeatable product strategy.", responseMimeType: "application/json", responseSchema: CtoAuditSchema, temperature: 0.2 },
		});
		const ctoResult = JSON.parse(ctoResponse.text || "{}");
        console.log("[+] CTO Complete.");

		console.log(`[+] Executing CBDO Productization...`);
		const cbdoResponse = await ai.models.generateContent({
			model: "gemini-2.5-pro",
			contents: [{ role: "user", parts: [{ text: `Here is the codebase payload:\n\n${payload}\n\nCTO Extraction:\n${JSON.stringify(ctoResult, null, 2)}\n\nExtract the Biz Dev strategy.` }] }],
			config: { systemInstruction: "You are the CBDO. Extract how this dashboard aggressively sells Evergreen Retainers.", responseMimeType: "application/json", responseSchema: CbdoAuditSchema, temperature: 0.3 },
		});
		const cbdoResult = JSON.parse(cbdoResponse.text || "{}");
        console.log("[+] CBDO Complete.");

		console.log(`[+] Executing CFO Productization...`);
		const cfoResponse = await ai.models.generateContent({
			model: "gemini-2.5-pro",
			contents: [{ role: "user", parts: [{ text: `Here is the codebase payload:\n\n${payload}\n\nCTO Extraction:\n${JSON.stringify(ctoResult, null, 2)}\n\nExtract the Financial Calculator strategy.` }] }],
			config: { systemInstruction: "You are the CFO. Extract the logic for using the Liability Curve to paralyze executives.", responseMimeType: "application/json", responseSchema: CfoAuditSchema, temperature: 0.2 },
		});
		const cfoResult = JSON.parse(cfoResponse.text || "{}");
        console.log("[+] CFO Complete.");

		console.log(`[+] Executing Physicist Productization...`);
		const physicsResponse = await ai.models.generateContent({
			model: "gemini-2.5-pro",
			contents: [{ role: "user", parts: [{ text: `Here is the codebase payload:\n\n${payload}\n\nCTO Extraction:\n${JSON.stringify(ctoResult, null, 2)}\n\nExtract the Physics Crash-Test methodology.` }] }],
			config: { systemInstruction: "You are the Principal Physicist. Extract the playbook for mathematically breaking a client's PRD.", responseMimeType: "application/json", responseSchema: PhysicsAuditSchema, temperature: 0.2 },
		});
		const physicsResult = JSON.parse(physicsResponse.text || "{}");
        console.log("[+] Physicist Complete.");
        
		console.log(`[+] Executing COO Productization...`);
		const cooResponse = await ai.models.generateContent({
			model: "gemini-2.5-pro",
			contents: [{ role: "user", parts: [{ text: `Here is the codebase payload:\n\n${payload}\n\nCTO Extraction:\n${JSON.stringify(ctoResult, null, 2)}\n\nExtract the Operational Scale methodology.` }] }],
			config: { systemInstruction: "You are the COO. Extract the playbook for using DFMEA grids to communicate global supply chain risk.", responseMimeType: "application/json", responseSchema: CooAuditSchema, temperature: 0.2 },
		});
		const cooResult = JSON.parse(cooResponse.text || "{}");
        console.log("[+] COO Complete.");
        
		console.log(`[+] Executing Legal Productization...`);
		const legalResponse = await ai.models.generateContent({
			model: "gemini-2.5-pro",
			contents: [{ role: "user", parts: [{ text: `Here is the codebase payload:\n\n${payload}\n\nCTO Extraction:\n${JSON.stringify(ctoResult, null, 2)}\n\nExtract the Contractual Shield methodology.` }] }],
			config: { systemInstruction: "You are the Virtual Legal Counsel. Standardize the 'Drawbridge Pivot' as a repeatable legal strategy.", responseMimeType: "application/json", responseSchema: LegalAuditSchema, temperature: 0.2 },
		});
		const legalResult = JSON.parse(legalResponse.text || "{}");
        console.log("[+] Legal Complete.");

		console.log(`[+] Executing Master Architect Synthesis...`);
		const architectResponse = await ai.models.generateContent({
			model: "gemini-2.5-pro",
			contents: [{ role: "user", parts: [{ text: `Here is the full 6-VP Meta-Audit of our architecture:\n\nCTO:\n${JSON.stringify(ctoResult, null, 2)}\n\nCBDO:\n${JSON.stringify(cbdoResult, null, 2)}\n\nCFO:\n${JSON.stringify(cfoResult, null, 2)}\n\nPhysicist:\n${JSON.stringify(physicsResult, null, 2)}\n\nCOO:\n${JSON.stringify(cooResult, null, 2)}\n\nLegal:\n${JSON.stringify(legalResult, null, 2)}\n\nSynthesize the Master Playbook.` }] }],
			config: { systemInstruction: "You are the Principal Architect. Consolidate these extractions into 'The Mechanistic Playbook'.", responseMimeType: "application/json", responseSchema: PrincipalArchitectSchema, temperature: 0.3 },
		});
		const architectResult = JSON.parse(architectResponse.text || "{}");
        console.log("[+] Architect Complete.");

		console.log(`[+] Executing HCI Productization...`);
		const hciResponse = await ai.models.generateContent({
			model: "gemini-2.5-pro",
			contents: [{ role: "user", parts: [{ text: `Here is the Master Playbook:\n\n${JSON.stringify(architectResult, null, 2)}\n\nExtract the Hostile UI guidelines.` }] }],
			config: { systemInstruction: "You are the HCI Visionary. Formalize the SCADA/Monochromatic UI aesthetic rules.", responseMimeType: "application/json", responseSchema: HciVisionarySchema, temperature: 0.3 },
		});
		const hciResult = JSON.parse(hciResponse.text || "{}");
        console.log("[+] HCI Complete.");

		// Export the Parametric Synthesis
		console.log(`\n[+] Exporting Plm Meta Synthesis...`);

		const metaSynthesis = {
			meta: {
				generatedAt: new Date().toISOString(),
				version: "v1_plm_playbook",
				target: "Mechanistic Quoting Engine Productization",
			},
			agents: [
				{ role: "CTO", title: "Architecture Blueprint", data: ctoResult },
				{ role: "CBDO", title: "Biz Dev Playbook", data: cbdoResult },
				{ role: "CFO", title: "Financial Calculator", data: cfoResult },
				{ role: "Physicist", title: "DFMEA Crash-Test", data: physicsResult },
                { role: "COO", title: "Operations Comm", data: cooResult },
				{ role: "Legal", title: "Contractual Strategy", data: legalResult },
				{ role: "Architect", title: "Master Playbook", data: architectResult },
				{ role: "HCI", title: "The Visual OS", data: hciResult },
			],
		};

		const outPath = path.join(targetWorkspacePath, "src/dfmea_core/data/plm_meta_synthesis.json");
		fs.writeFileSync(outPath, JSON.stringify(metaSynthesis, null, 2), "utf-8");
		console.log(`[+] SUCCESS. Plm Meta-Synthesis Secured at ${outPath}`);

	} catch (err: any) {
		console.error(`[-] Misfire in Orchestration: ${err.message}`);
	}
}

// Ensure the command runs dynamically against the mechanistic core
const targetWorkspace = "D:/GitHub/mechanistic";
const targetFilesList = [
    "src/dfmea_core/data/origin_story.md", 
    "src/dfmea_core/data/vault_p_physics_v28.json",
    "src/dfmea_core/data/vault_f_finance_v28.json",
    "src/dfmea_core/data/vault_l_legal_v28.json",
    "src/components/dfmea/execute/MechanisticAndonViz.tsx"
];

(async () => {
    console.log("Starting Meta-Audit...");
	await runMetaOrchestration(targetWorkspace, targetFilesList);
})();
