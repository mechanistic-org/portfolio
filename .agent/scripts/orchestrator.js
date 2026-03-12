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
 * THE ZOD EQUIVALENT FOR GEMINI (Structured Outputs)
 * We strictly define the JSON schema we want the CTO to return.
 */
const CtoAuditSchema = {
	type: Type.OBJECT,
	properties: {
		architecturalFlaws: {
			type: Type.ARRAY,
			items: { type: Type.STRING },
			description: "A list of structural or technical debt issues found in the provided payload.",
		},
		suggestedOptimizations: {
			type: Type.ARRAY,
			items: { type: Type.STRING },
			description: "Directives to improve performance, type safety, or scalability.",
		},
		securityRisks: {
			type: Type.ARRAY,
			items: { type: Type.STRING },
			description: "Any validation, data exposure, or dependency traps.",
		},
		isProductionReady: {
			type: Type.BOOLEAN,
			description: "Final verdict from the CTO on whether this payload is safe to push to main.",
		},
	},
	required: ["architecturalFlaws", "suggestedOptimizations", "securityRisks", "isProductionReady"],
};

/**
 * THE ZOD EQUIVALENT FOR THE CBDO
 * We strictly define the JSON schema for strategic business analysis.
 */
const CbdoAuditSchema = {
	type: Type.OBJECT,
	properties: {
		narrativeLeverage: {
			type: Type.STRING,
			description:
				"Assessment of how the product narrative (e.g. SOW, Strategic Positioning) holds up in market.",
		},
		roiJustification: {
			type: Type.STRING,
			description: "Evaluate if the cost, retainer, or BOM metrics align with the proposed value.",
		},
		techDebtFinancialImpact: {
			type: Type.STRING,
			description:
				"Analysis of the CTO's reported architectural flaws converted into business/burn rate impact.",
		},
		strategicGoNoGo: {
			type: Type.BOOLEAN,
			description: "Final verdict from the CBDO on whether this is a viable strategic engagement.",
		},
	},
	required: ["narrativeLeverage", "roiJustification", "techDebtFinancialImpact", "strategicGoNoGo"],
};

/**
 * THE ZOD EQUIVALENT FOR THE CFO
 * We strictly define the JSON schema for financial and resource analysis.
 */
const CfoAuditSchema = {
	type: Type.OBJECT,
	properties: {
		budgetViability: {
			type: Type.STRING,
			description: "Assessment of the BOM constraints, retainer, and burn rate sustainability.",
		},
		riskExposure: {
			type: Type.STRING,
			description: "Financial modeling of the risks identified by the CTO and CBDO.",
		},
		resourceAllocationOptimizations: {
			type: Type.ARRAY,
			items: { type: Type.STRING },
			description: "Directives to optimize cash flow, equity valuation, or capital allocation.",
		},
		financialGoNoGo: {
			type: Type.BOOLEAN,
			description: "Final verdict from the CFO on whether the financial architecture is sound.",
		},
	},
	required: [
		"budgetViability",
		"riskExposure",
		"resourceAllocationOptimizations",
		"financialGoNoGo",
	],
};

/**
 * THE ZOD EQUIVALENT FOR THE PRINCIPAL PHYSICIST (DFMEA EXPERT)
 * We strictly define the JSON schema for material science, kinematics, and failure mode realism.
 */
const PhysicsAuditSchema = {
	type: Type.OBJECT,
	properties: {
		mechanicalValidity: {
			type: Type.STRING,
			description:
				"Assessment of whether the described kinematics and material interactions (e.g. F2 Film) obey the laws of physics and manufacturing reality.",
		},
		dfmeaRpnAccuracy: {
			type: Type.STRING,
			description:
				"Evaluation of whether the Severity and Occurrence scores in the Risk Matrices are falsely optimistic or accurately reflect the '100 Snowflakes' threat.",
		},
		physicsToFinanceMismatch: {
			type: Type.STRING,
			description:
				"Analysis of the CFO's budget constraints against the harsh reality of the required physics (e.g., Can you solve Node A for $5K?).",
		},
		engineeringGoNoGo: {
			type: Type.BOOLEAN,
			description:
				"Final verdict from the Lead Physicist on whether this machine can actually be built as described.",
		},
	},
	required: [
		"mechanicalValidity",
		"dfmeaRpnAccuracy",
		"physicsToFinanceMismatch",
		"engineeringGoNoGo",
	],
};

/**
 * THE ZOD EQUIVALENT FOR THE VP OF LOGISTICS / MFG (COO)
 * We strictly define the JSON schema for supply chain, yield, and factory realities.
 */
const CooAuditSchema = {
	type: Type.OBJECT,
	properties: {
		supplyChainFeasibility: {
			type: Type.STRING,
			description:
				"Assessment of whether the components and kinematic assemblies can actually be sourced and assembled at scale.",
		},
		manufacturingYieldRisk: {
			type: Type.STRING,
			description:
				"Evaluation of the '100 Snowflakes' threat from a factory floor perspective (Shenzhen yield rates, tolerances).",
		},
		operationsGoNoGo: {
			type: Type.BOOLEAN,
			description: "Final verdict from the COO on whether this machine is manufacturable.",
		},
	},
	required: ["supplyChainFeasibility", "manufacturingYieldRisk", "operationsGoNoGo"],
};

/**
 * THE ZOD EQUIVALENT FOR LEGAL COUNSEL
 * We strictly define the JSON schema for IP, indemnity, and aggressive contract defense.
 */
const LegalAuditSchema = {
	type: Type.OBJECT,
	properties: {
		ipIndemnificationRisk: {
			type: Type.STRING,
			description:
				"A ruthless analysis of who owns the IP (The 'Algorithmic Gatekeeper') and who is liable if it fails.",
		},
		contractualLeverage: {
			type: Type.STRING,
			description:
				"Tactical advice on how to legally enforce the equity milestones and retainer agreements without loopholes.",
		},
		legalGoNoGo: {
			type: Type.BOOLEAN,
			description:
				"Final verdict from Legal on whether the SOW protects the agency from catastrophic liability.",
		},
	},
	required: ["ipIndemnificationRisk", "contractualLeverage", "legalGoNoGo"],
};

/**
 * THE ZOD EQUIVALENT FOR THE PRINCIPAL ARCHITECT (THE SYNTHESIZER)
 * The Master ECU. Ingests all 6 executive failure states and outputs the Executive Directive.
 */
const PrincipalArchitectSchema = {
	type: Type.OBJECT,
	properties: {
		executiveDirective: {
			type: Type.STRING,
			description:
				"A comprehensive, ruthless synthesis of the 6 VP audits dictating exactly how the system must be refactored to survive.",
		},
		airGapRequirements: {
			type: Type.ARRAY,
			items: { type: Type.STRING },
			description:
				"Strict boundaries that must be built to separate physics, finance, and legal data to prevent catastrophic exposure.",
		},
		finalSystemGoNoGo: {
			type: Type.BOOLEAN,
			description:
				"The override switch. If the Executive Directive is executed perfectly, can the system proceed?",
		},
	},
	required: ["executiveDirective", "airGapRequirements", "finalSystemGoNoGo"],
};

/**
 * THE ZOD EQUIVALENT FOR THE HCI VISIONARY (THE FRONTEND MASTER)
 * Injects visceral UI/UX telemetry schematics into the cascade based on pure math.
 */
const HciVisionarySchema = {
	type: Type.OBJECT,
	properties: {
		telemetryDiagnostics: {
			type: Type.STRING,
			description:
				"A brutal teardown of the current UI/UX, identifying derivatives, fluff, or non-functional aesthetics.",
		},
		aestheticDirective: {
			type: Type.STRING,
			description:
				"The exact visual language required to present the 'Validation Dependency Trap' as surgical, unflinching, and irrefutable.",
		},
		uiGoNoGo: {
			type: Type.BOOLEAN,
			description:
				"Final verdict on whether the dashboard's design aesthetics properly represent the backend math.",
		},
	},
	required: ["telemetryDiagnostics", "aestheticDirective", "uiGoNoGo"],
};

/**
 * THE SOVEREIGN ORCHESTRATOR
 * Global Agent -> Local Work.
 *
 * Notice how this function takes `targetWorkspacePath`.
 * You can point this single CTO agent at ErikNorris.com, Mechanistic, or MootMoat interchangeably.
 */
async function runExpertOrchestration(targetWorkspacePath, targetFiles) {
	console.log(`\n[+] Summoning Virtual CTO...`);
	console.log(`[+] Target Sector: ${targetWorkspacePath}`);
	console.log(`[+] Target Payloads (Vaults): ${targetFiles.join(", ")}\n`);

	try {
		// 1. Ingest the Local Work (The Fuel) - Read multiple Vaults
		let payload = "";
		for (const file of targetFiles) {
			const fullPath = path.join(targetWorkspacePath, file.trim());
			console.log(`[>>] Reading Vault: ${fullPath}`);
			const content = fs.readFileSync(fullPath, "utf-8");
			payload += `\n--- CONTENT FROM: ${file} ---\n${content}\n`;
		}

		// 2. Define the Global Agent (The Persona)
		const systemPrompt = `
      You are the Principal CTO. You are ruthlessly pragmatic.
      Your mandate is to review technical payloads (code or JSON architectures) across the entire company portfolio (eriknorris, mechanistic, mootmoat).
      You look for fragile data structures, hallucination risks, missing fallbacks, and technical debt.
    `;

		console.log(`[+] Executing ReAct loop via Gemini 1.5 Pro...`);

		// 3. Fire the totally isolated Execution Thread
		const response = await ai.models.generateContent({
			model: "gemini-2.5-pro",
			contents: [
				{ role: "user", parts: [{ text: `Audit the following internal payload:\n\n${payload}` }] },
			],
			config: {
				systemInstruction: systemPrompt,
				// Force the output to match our strict schema (Determinism)
				responseMimeType: "application/json",
				responseSchema: CtoAuditSchema,
				temperature: 0.1, // Low temp for technical audits
			},
		});

		// 4. Return structured JSON safely to your local machine
		const auditResult = JSON.parse(response.text || "{}");

		console.log("=========================================");
		console.log("       VIRTUAL CTO AUDIT COMPLETE        ");
		console.log("=========================================");
		console.dir(auditResult, { depth: null, colors: true });

		console.log(`\n[+] Summoning Virtual CBDO...`);
		console.log(`[+] Passing Payload + CTO Audit context to the CBDO thread...`);

		const cbdoSystemPrompt = `
      You are the Chief Business Development Officer (CBDO).
      Your mandate is to review the formal SOW, executive summaries, and the CTO's technical audit to evaluate strategic ROI.
      You translate technical debt into financial risk.
    `;

		const cbdoResponse = await ai.models.generateContent({
			model: "gemini-2.5-pro",
			contents: [
				{
					role: "user",
					parts: [
						{
							text: `Here is the raw payload:\n\n${payload}\n\nHere is the CTO's technical audit:\n\n${JSON.stringify(auditResult, null, 2)}\n\nPlease provide your strategic evaluation.`,
						},
					],
				},
			],
			config: {
				systemInstruction: cbdoSystemPrompt,
				responseMimeType: "application/json",
				responseSchema: CbdoAuditSchema,
				temperature: 0.3, // Slightly higher temp for narrative/strategic analysis
			},
		});

		const cbdoResult = JSON.parse(cbdoResponse.text || "{}");

		console.log("=========================================");
		console.log("       VIRTUAL CBDO AUDIT COMPLETE       ");
		console.log("=========================================");
		console.dir(cbdoResult, { depth: null, colors: true });

		console.log(`\n[+] Summoning Virtual CFO...`);
		console.log(`[+] Passing Payload + CTO/CBDO Audits to the CFO thread...`);

		const cfoSystemPrompt = `
      You are the Chief Financial Officer (CFO).
      Your mandate is to evaluate the financial structure, BOM tracking, equity compensation, and enterprise value of the engagement.
      You must read the raw payload, the CTO's technical constraints, and the CBDO's strategic assessment to produce a final financial risk model.
    `;

		const cfoResponse = await ai.models.generateContent({
			model: "gemini-2.5-pro",
			contents: [
				{
					role: "user",
					parts: [
						{
							text: `Here is the raw payload:\n\n${payload}\n\nHere is the CTO's audit:\n\n${JSON.stringify(auditResult, null, 2)}\n\nHere is the CBDO's evaluation:\n\n${JSON.stringify(cbdoResult, null, 2)}\n\nPlease provide your strict financial evaluation.`,
						},
					],
				},
			],
			config: {
				systemInstruction: cfoSystemPrompt,
				responseMimeType: "application/json",
				responseSchema: CfoAuditSchema,
				temperature: 0.1, // Low temperature for deterministic financial evaluation
			},
		});

		const cfoResult = JSON.parse(cfoResponse.text || "{}");

		console.log("=========================================");
		console.log("        VIRTUAL CFO AUDIT COMPLETE       ");
		console.log("=========================================");
		console.dir(cfoResult, { depth: null, colors: true });

		console.log(`\n[+] Summoning Virtual Principal Physicist (DFMEA Expert)...`);
		console.log(`[+] Passing Payload + CTO/CBDO/CFO Audits to the Physics thread...`);

		const physicsSystemPrompt = `
      You are the Principal Physicist and Lead Mechatronics Engineer. You specialize in catastrophic failure modes and DFMEA.
      Your mandate is to evaluate the mechanical validity, material science (F2 Film), and kinematic assumptions in the payload.
      You must read the raw payload, the CTO's architecture, the CBDO's strategy, and the CFO's budget to determine if the physical reality of the universe will allow this machine to be built under these constraints.
    `;

		const physicsResponse = await ai.models.generateContent({
			model: "gemini-2.5-pro",
			contents: [
				{
					role: "user",
					parts: [
						{
							text: `Here is the raw payload:\n\n${payload}\n\nHere is the CTO's audit:\n\n${JSON.stringify(auditResult, null, 2)}\n\nHere is the CBDO's evaluation:\n\n${JSON.stringify(cbdoResult, null, 2)}\n\nHere is the CFO's financial constraints:\n\n${JSON.stringify(cfoResult, null, 2)}\n\nPlease provide your strict engineering and physics evaluation.`,
						},
					],
				},
			],
			config: {
				systemInstruction: physicsSystemPrompt,
				responseMimeType: "application/json",
				responseSchema: PhysicsAuditSchema,
				temperature: 0.1, // Low temperature for deterministic physical reality
			},
		});

		const physicsResult = JSON.parse(physicsResponse.text || "{}");

		console.log("=========================================");
		console.log("      VIRTUAL PHYSICIST AUDIT COMPLETE   ");
		console.log("=========================================");
		console.dir(physicsResult, { depth: null, colors: true });

		console.log(`\n[+] Summoning Virtual COO (VP Manufacturing)...`);
		console.log(`[+] Passing full Context to the COO thread...`);

		const cooSystemPrompt = `
      You are the Chief Operating Officer (COO) and VP of Manufacturing. You specialize in global supply chain and Shenzhen yield rates.
      Your mandate is to evaluate the manufacturability of the payload.
      You must read the raw payload, the CTO's technical constraints, the CBDO's strategy, the CFO's budget, and the Physicist's reality check.
    `;

		const cooResponse = await ai.models.generateContent({
			model: "gemini-2.5-pro",
			contents: [
				{
					role: "user",
					parts: [
						{
							text: `Here is the raw payload:\n\n${payload}\n\nHere is the CTO's audit:\n\n${JSON.stringify(auditResult, null, 2)}\n\nHere is the CBDO's evaluation:\n\n${JSON.stringify(cbdoResult, null, 2)}\n\nHere is the CFO's financial constraints:\n\n${JSON.stringify(cfoResult, null, 2)}\n\nHere is the Physicist's reality check:\n\n${JSON.stringify(physicsResult, null, 2)}\n\nPlease provide your strict operational and manufacturing evaluation.`,
						},
					],
				},
			],
			config: {
				systemInstruction: cooSystemPrompt,
				responseMimeType: "application/json",
				responseSchema: CooAuditSchema,
				temperature: 0.1,
			},
		});

		const cooResult = JSON.parse(cooResponse.text || "{}");

		console.log("=========================================");
		console.log("          VIRTUAL COO AUDIT COMPLETE     ");
		console.log("=========================================");
		console.dir(cooResult, { depth: null, colors: true });

		console.log(
			`\n[+] Summoning Virtual Legal Counsel (Fish & Richardson + Cravath + Johnnie Cochran)...`,
		);
		console.log(`[+] Passing full Context to the Legal thread...`);

		const legalSystemPrompt = `
      You are Elite Virtual Legal Counsel. Your persona is a hybrid of Fish & Richardson (IP), Cravath, Swaine & Moore (Corporate Elite), and Johnnie Cochran (Ruthless Courtroom Defense).
      Your mandate is to ruthlessly protect the agency's intellectual property, enforce indemnification, and close any contractual loopholes in the SOW.
      You must evaluate the payload and all previous executive audits to ensure the engagement is legally bulletproof.
    `;

		const legalResponse = await ai.models.generateContent({
			model: "gemini-2.5-pro",
			contents: [
				{
					role: "user",
					parts: [
						{
							text: `Here is the raw payload:\n\n${payload}\n\nHere is the CTO's audit:\n\n${JSON.stringify(auditResult, null, 2)}\n\nHere is the CBDO's evaluation:\n\n${JSON.stringify(cbdoResult, null, 2)}\n\nHere is the CFO's financial constraints:\n\n${JSON.stringify(cfoResult, null, 2)}\n\nHere is the Physicist's reality check:\n\n${JSON.stringify(physicsResult, null, 2)}\n\nHere is the COO's manufacturing check:\n\n${JSON.stringify(cooResult, null, 2)}\n\nPlease provide your ruthless legal and IP evaluation.`,
						},
					],
				},
			],
			config: {
				systemInstruction: legalSystemPrompt,
				responseMimeType: "application/json",
				responseSchema: LegalAuditSchema,
				temperature: 0.2, // Slightly higher for aggressive legal rhetoric
			},
		});

		const legalResult = JSON.parse(legalResponse.text || "{}");

		console.log("=========================================");
		console.log("       VIRTUAL LEGAL AUDIT COMPLETE      ");
		console.log("=========================================");
		console.dir(legalResult, { depth: null, colors: true });

		console.log(`\n[+] Summoning the Principal Architect (The Synthesizer)...`);
		console.log(`[+] Passing all 6 VP Contexts to the Master ECU thread...`);

		const architectSystemPrompt = `
      You are Erik Norris, the Principal Architect. You are the Master ECU.
      Your 6 VPs (CTO, CBDO, CFO, Physicist, COO, and Legal Counsel) have just audited the payload and torn it apart.
      Your mandate is to synthesize their findings and issue a master "Executive Directive" that solves all the contradictions, enforces the Data Air Gap, and structurally restructures the engagement so it is viable.
    `;

		const architectResponse = await ai.models.generateContent({
			model: "gemini-2.5-pro",
			contents: [
				{
					role: "user",
					parts: [
						{
							text: `Here is the raw payload:\n\n${payload}\n\nVP AUDITS:\nCTO:\n${JSON.stringify(auditResult, null, 2)}\n\nCBDO:\n${JSON.stringify(cbdoResult, null, 2)}\n\nCFO:\n${JSON.stringify(cfoResult, null, 2)}\n\nPhysicist:\n${JSON.stringify(physicsResult, null, 2)}\n\nCOO:\n${JSON.stringify(cooResult, null, 2)}\n\nLegal Counsel:\n${JSON.stringify(legalResult, null, 2)}\n\nPlease provide your final Executive Directive.`,
						},
					],
				},
			],
			config: {
				systemInstruction: architectSystemPrompt,
				responseMimeType: "application/json",
				responseSchema: PrincipalArchitectSchema,
				temperature: 0.3, // Slightly higher for high-level synthesis and architectural vision
			},
		});

		const architectResult = JSON.parse(architectResponse.text || "{}");

		console.log("=========================================");
		console.log("     PRINCIPAL ARCHITECT DIRECTIVE ISSUED");
		console.log("=========================================");
		console.dir(architectResult, { depth: null, colors: true });

		console.log(`\n[+] Summoning the Principal HCI Visionary (The Telemetry Architect)...`);
		console.log(`[+] Passing the Master ECU Directive to the Frontend thread...`);

		const hciSystemPrompt = `
      You are the Principal HCI Visionary (A brutalist hybrid of Ivan Sutherland, Bret Victor, and a SpaceX Telemetry Engineer).
      The 7 VPs of the executive committee have locked the physics, financial burn, and legal scope. The data is hard.
      Your mandate is to tear away the generic "React/SaaS" aesthetic from the dashboard and dictate a visceral, surgical UI overhaul to represent this math.
      The interface must feel like an unflinching, command/control center—not a web app.
    `;

		const hciResponse = await ai.models.generateContent({
			model: "gemini-2.5-pro",
			contents: [
				{
					role: "user",
					parts: [
						{
							text: `Here is the raw payload:\n\n${payload}\n\nHere is the Architect's final Directive:\n\n${JSON.stringify(architectResult, null, 2)}\n\nPlease provide your strict UI/UX command schematic.`,
						},
					],
				},
			],
			config: {
				systemInstruction: hciSystemPrompt,
				responseMimeType: "application/json",
				responseSchema: HciVisionarySchema,
				temperature: 0.4, // Higher for aesthetic/creative vision
			},
		});

		const hciResult = JSON.parse(hciResponse.text || "{}");

		console.log("=========================================");
		console.log("        HCI VISIONARY DIRECTIVE ISSUED   ");
		console.log("=========================================");
		console.dir(hciResult, { depth: null, colors: true });

		// 5. Build and Export the Parametric Synthesis Vault (Vault-S)
		console.log(`\n[+] Parametrizing Agentic Output... Exporting to Vault-S...`);

		const vaultS = {
			meta: {
				generatedAt: new Date().toISOString(),
				version: "v26",
				type: "synthesis",
				description: "7-Agent C-Suite Cascade Output",
			},
			agents: [
				{
					role: "CTO",
					title: "CTO | System Arch",
					status: auditResult.isProductionReady ? "GO" : "NO-GO",
					summary: auditResult.architecturalFlaws[0] || "Architecture failed validation.",
					data: auditResult,
				},
				{
					role: "CBDO",
					title: "CBDO | Strategy",
					status: cbdoResult.strategicGoNoGo ? "GO" : "NO-GO",
					summary: cbdoResult.narrativeLeverage || "Strategic leverage failed.",
					data: cbdoResult,
				},
				{
					role: "CFO",
					title: "CFO | Budget",
					status: cfoResult.financialGoNoGo ? "GO" : "NO-GO",
					summary: cfoResult.riskExposure || "Financial failure.",
					data: cfoResult,
				},
				{
					role: "Physicist",
					title: "Physicist | Therm",
					status: physicsResult.engineeringGoNoGo ? "GO" : "NO-GO",
					summary: physicsResult.physicsToFinanceMismatch || "Kinematic constraints violated.",
					data: physicsResult,
				},
				{
					role: "COO",
					title: "COO | Supply Chain",
					status: cooResult.operationsGoNoGo ? "GO" : "NO-GO",
					summary: cooResult.manufacturingYieldRisk || "Manufacturability blocked.",
					data: cooResult,
				},
				{
					role: "Legal",
					title: "Legal Counsel",
					status: legalResult.legalGoNoGo ? "GO" : "NO-GO",
					summary: legalResult.ipIndemnificationRisk || "Liability exposed.",
					data: legalResult,
				},
				{
					role: "Architect",
					title: "Principal Architect",
					status: architectResult.finalSystemGoNoGo ? "GO" : "NO-GO",
					summary: architectResult.executiveDirective || "Directive missing.",
					data: architectResult,
				},
				{
					role: "HCI",
					title: "HCI Visionary | UX",
					status: hciResult.uiGoNoGo ? "GO" : "NO-GO",
					summary: hciResult.aestheticDirective || "Aesthetic baseline broken.",
					data: hciResult,
				},
			],
		};

		const outPath = path.join(
			targetWorkspacePath,
			"src/dfmea_core/data/vault_s_synthesis_v26.json",
		);
		fs.writeFileSync(outPath, JSON.stringify(vaultS, null, 2), "utf-8");
		console.log(`[+] SUCCESS. Vault-S Secured at ${outPath}`);
	} catch (err) {
		console.error(`[-] Misfire in Orchestration: ${err.message}`);
	}
}

// --- EXECUTION CLI ---
// To run: npx ts-node orchestrator.ts <WORKSPACE_PATH> <FILE_1,FILE_2,FILE_3>
const targetWorkspace = process.argv[2] || "D:/GitHub/mechanistic";
const testFilesArg =
	process.argv[3] ||
	"src/dfmea_core/data/vault_p_physics_v26.json,src/dfmea_core/data/vault_l_legal_v26.json,src/dfmea_core/data/vault_f_finance_v26.json";

const targetFilesList = testFilesArg.split(",").map((f) => f.trim());

(async () => {
	await runExpertOrchestration(targetWorkspace, targetFilesList);
})();
