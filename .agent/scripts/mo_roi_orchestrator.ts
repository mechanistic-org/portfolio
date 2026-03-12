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

const AuditSchema = {
	type: Type.OBJECT,
	properties: {
		summary: {
			type: Type.STRING,
			description: "A harsh, direct, executive summary of your strategic findings (max 4 sentences).",
		},
		data: {
			type: Type.OBJECT,
            description: "Key supporting metrics or insights justifying your analysis.",
		},
		status: {
			type: Type.STRING,
			description: "Must be exactly 'GO' or 'NO-GO'.",
		},
	},
	required: ["summary", "data", "status"],
};

/**
 * THE META-ORCHESTRATOR
 */
async function runMetaOrchestration(externalPayloadFiles: string[]) {
	console.log(`\n[+] Summoning the Virtual C-Suite for the ROI META-AUDIT...`);
	console.log(`[+] Objective: Evaluate ROI and Enterprise Value generation of the Mechanistic Architecture against the Behemoth narrative.`);
	console.log(`[+] Ingesting Payloads...`);

	try {
		let payload = "";
		for (const file of externalPayloadFiles) {
			if (fs.existsSync(file)) {
				const content = fs.readFileSync(file, "utf-8");
				payload += `\n--- CONTENT FROM: ${path.basename(file)} ---\n${content}\n`;
			} else {
                 console.log(`[!] Missing File: ${file}`);
            }
		}

        const modelOpts = {
            model: "gemini-2.5-pro",
            config: {
                responseMimeType: "application/json",
                responseSchema: AuditSchema,
                temperature: 0.1
            }
        };

		console.log(`[+] Convening the Sequential Virtual C-Suite Round Table...`);
        let transcript = "";
        
        console.log(`[+] Executing CTO Productization...`);
		const ctoResponse = await ai.models.generateContent({
            ...modelOpts,
			contents: [{ role: "user", parts: [{ text: `Evaluate the engineering architecture's ability to protect the project from compiling tech debt and uncontrolled iteration.\n\n${payload}` }] }],
			config: { ...modelOpts.config, systemInstruction: "You are the CTO. Evaluate the Mechanistic architecture's robustness and how it enforces truth before code/metal." },
		});
		const ctoResult = JSON.parse(ctoResponse.text || "{}");
        transcript += `\n\n--- CTO EVALUATION ---\nSummary: ${ctoResult.summary}\nStatus: ${ctoResult.status}`;
        console.log("[+] CTO Complete.");

		console.log(`[+] Executing CBDO Productization...`);
		const cbdoResponse = await ai.models.generateContent({
            ...modelOpts,
			contents: [{ role: "user", parts: [{ text: `Evaluate the 'Machine Vision Telemetry' (Project Denzel) and how the telemetry establishes a massive enterprise valuation (Data Moat).\n\nRead the colleague transcripts below to contextualize your response:\n${transcript}\n\nPayload:\n${payload}` }] }],
			config: { ...modelOpts.config, systemInstruction: "You are the CBDO. Evaluate the strategy for enterprise valuation multiples and defensible data moats." },
		});
		const cbdoResult = JSON.parse(cbdoResponse.text || "{}");
        transcript += `\n\n--- CBDO EVALUATION ---\nSummary: ${cbdoResult.summary}\nStatus: ${cbdoResult.status}`;
        console.log("[+] CBDO Complete.");

		console.log(`[+] Executing CFO Productization...`);
		const cfoResponse = await ai.models.generateContent({
            ...modelOpts,
			contents: [{ role: "user", parts: [{ text: `Evaluate the 'Execution Insurance Premium' (retainer) against the $3.78M in avoided kinematic liability and $282K unmanaged agency burn.\n\nRead the colleague transcripts below to contextualize your response:\n${transcript}\n\nPayload:\n${payload}` }] }],
			config: { ...modelOpts.config, systemInstruction: "You are the CFO. Provide a ruthless financial justification evaluating the $87.5K retainer vs catastrophic cost avoidance." },
		});
		const cfoResult = JSON.parse(cfoResponse.text || "{}");
        transcript += `\n\n--- CFO EVALUATION ---\nSummary: ${cfoResult.summary}\nStatus: ${cfoResult.status}`;
        console.log("[+] CFO Complete.");

		console.log(`[+] Executing Physicist Productization...`);
		const physicsResponse = await ai.models.generateContent({
            ...modelOpts,
			contents: [{ role: "user", parts: [{ text: `Evaluate the 'Drawbridge Protocol' and Phase 1 vs Phase 2 separation regarding the physics laws of Smart Films.\n\nRead the colleague transcripts below to contextualize your response:\n${transcript}\n\nPayload:\n${payload}` }] }],
			config: { ...modelOpts.config, systemInstruction: "You are the Principal Physicist. Evaluate the material science necessity behind the Drawbridge phasing." },
		});
		const physicsResult = JSON.parse(physicsResponse.text || "{}");
        transcript += `\n\n--- PHYSICIST EVALUATION ---\nSummary: ${physicsResult.summary}\nStatus: ${physicsResult.status}`;
        console.log("[+] Physicist Complete.");
        
		console.log(`[+] Executing COO Productization...`);
		const cooResponse = await ai.models.generateContent({
            ...modelOpts,
			contents: [{ role: "user", parts: [{ text: `Evaluate how this architecture and CM Backfill specification prevents the '100 Snowflakes Trap' in supply chain scaling.\n\nRead the colleague transcripts below to contextualize your response:\n${transcript}\n\nPayload:\n${payload}` }] }],
			config: { ...modelOpts.config, systemInstruction: "You are the COO. Evaluate how the strict validation grid preserves global supply chain yield." },
		});
		const cooResult = JSON.parse(cooResponse.text || "{}");
        transcript += `\n\n--- COO EVALUATION ---\nSummary: ${cooResult.summary}\nStatus: ${cooResult.status}`;
        console.log("[+] COO Complete.");
        
		console.log(`[+] Executing Legal Productization...`);
		const legalResponse = await ai.models.generateContent({
            ...modelOpts,
			contents: [{ role: "user", parts: [{ text: `Evaluate the SOW structure, 'Drawbridge Pivot', and how they serve as an Executable Corporate Defense shield.\n\nRead the colleague transcripts below to contextualize your response:\n${transcript}\n\nPayload:\n${payload}` }] }],
			config: { ...modelOpts.config, systemInstruction: "You are the Virtual Legal Counsel. Evaluate the contractual indemnification strategy." },
		});
		const legalResult = JSON.parse(legalResponse.text || "{}");
        transcript += `\n\n--- LEGAL EVALUATION ---\nSummary: ${legalResult.summary}\nStatus: ${legalResult.status}`;
        console.log("[+] Legal Complete.");

		console.log(`[+] Executing Master Architect Synthesis...`);
		const architectResponse = await ai.models.generateContent({
            ...modelOpts,
			contents: [{ role: "user", parts: [{ text: `Synthesize the findings. Why must Mobile Outfitters execute the 'Constraint Cage' rather than the baseline PRD?\n\nRead the colleague transcripts below to contextualize your response:\n${transcript}\n\nPayload:\n${payload}` }] }],
			config: { ...modelOpts.config, systemInstruction: "You are the Principal Architect. Synthesize the reality." },
		});
		const architectResult = JSON.parse(architectResponse.text || "{}");
        transcript += `\n\n--- ARCHITECT EVALUATION ---\nSummary: ${architectResult.summary}\nStatus: ${architectResult.status}`;
        console.log("[+] Architect Complete.");

		console.log(`[+] Executing HCI Productization...`);
		const hciResponse = await ai.models.generateContent({
            ...modelOpts,
			contents: [{ role: "user", parts: [{ text: `Evaluate the UI/UX components (AndonViz, DependencyLock, TelemetryOverview) and their psychological role in forcing executive compliance with physics.\n\nRead the final round table transcripts below to contextualize your response:\n${transcript}\n\nPayload:\n${payload}` }] }],
			config: { ...modelOpts.config, systemInstruction: "You are the HCI Visionary. Evaluate how the dashboard UI enforces the hard constraints of the business reality." },
		});
		const hciResult = JSON.parse(hciResponse.text || "{}");
        console.log("[+] HCI Complete.");

		console.log(`[+] All 8 V-Suite Threads Completed.`);
        
        const agentsData = [
			{ role: "CTO", title: "CTO | System Arch", status: ctoResult.status, summary: ctoResult.summary, data: ctoResult.data },
			{ role: "CBDO", title: "CBDO | Strategy", status: cbdoResult.status, summary: cbdoResult.summary, data: cbdoResult.data },
			{ role: "CFO", title: "CFO | Budget", status: cfoResult.status, summary: cfoResult.summary, data: cfoResult.data },
			{ role: "Physicist", title: "Physicist | Therm", status: physicsResult.status, summary: physicsResult.summary, data: physicsResult.data },
            { role: "COO", title: "COO | Supply Chain", status: cooResult.status, summary: cooResult.summary, data: cooResult.data },
			{ role: "Legal", title: "Legal Counsel", status: legalResult.status, summary: legalResult.summary, data: legalResult.data },
			{ role: "Architect", title: "Principal Architect", status: architectResult.status, summary: architectResult.summary, data: architectResult.data },
			{ role: "HCI", title: "HCI Visionary | UX", status: hciResult.status, summary: hciResult.summary, data: hciResult.data }
		];

		const metaSynthesis = {
			meta: {
				generatedAt: new Date().toISOString(),
				version: "29.1.0_external",
				type: "synthesis",
				description: "8-Agent C-Suite Cascade Output (API-Generated ROI Analysis)"
			},
			agents: agentsData
		};

		const outPath = path.resolve("D:/GitHub/mechanistic/src/dfmea_core/data/vault_s_synthesis_v29.json");
		fs.writeFileSync(outPath, JSON.stringify(metaSynthesis, null, 2), "utf-8");
		console.log(`[+] SUCCESS. External ROI Synthesis Secured at ${outPath}`);

	} catch (err: any) {
		console.error(`[-] Misfire in Orchestration: ${err.message}`);
	}
}

// Absolute paths explicitly
const targetFilesList = [
    "C:/Users/erik/.gemini/antigravity/brain/fff8a5e9-705f-4d52-a20a-483c6a085350/mo_value_behemoth.md",
    "D:/GitHub/mechanistic/src/dfmea_core/data/vault_f_finance_v28.json",
    "D:/GitHub/mechanistic/src/dfmea_core/data/vault_p_physics_v28.json",
    "D:/GitHub/mechanistic/src/components/dfmea/execute/MechanisticAndonViz.tsx",
    "D:/GitHub/mechanistic/src/components/dfmea/execute/DependencyLock.tsx",
    "D:/GitHub/mechanistic/src/components/dfmea/execute/DrawbridgeRoadmap.tsx",
    "D:/GitHub/mechanistic/src/components/dfmea/execute/VisionTelemetryPreview.tsx"
];

(async () => {
	await runMetaOrchestration(targetFilesList);
})();
