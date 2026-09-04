export type CareerPeriod =
	| { precision: "year"; start: string; end: string | null }
	| { precision: "unknown"; start: null; end: null };
export interface CareerRole {
	id: string;
	company: string;
	canonicalTitle: string;
	location?: string;
	period: CareerPeriod;
	channels: { resumeTitle: string | null; linkedinTitle: string; linkedinCompany: string };
	evidence: { source: string; review: string; note: string };
}
export interface ResumePresentation {
	id: string;
	roleIds: string[];
	group?: { company: string; title: string; location: string; period: CareerPeriod };
	blurb: string;
	bullets: string[];
}

// Factual authority. See docs/agents/resume-authority.md for evidence and review boundaries.
export const resumeMaster = {
	header: {
		name: "Erik Norris",
		title: "Mechanical Engineering Lead | Complex Physical Systems · Prototype → Production",
		tagline: "Structure the chaos · Index the decisions · Ship the hardware",
		contact: {
			location: "Redwood City, CA",
			email: "erik@eriknorris.com",
			linkedin: "linkedin.com/in/eriknorris",
			github: "github.com/eriknorris",
			portfolio: "eriknorris.com",
			resume: "resume.eriknorris.com",
			phone: "650.302.5029",
		},
	},
	summary: {
		executive:
			"I lead hands-on mechanical and systems engineering for complex physical products, from ambiguous architecture through DVT, manufacturing transfer, and field recovery. The difference between a rescued program and a failed one is rarely the capability of the engineer - it is usually the fidelity of the record.\n\nThe proof is in the programs: a cobotic food-assembly platform coordinating 70+ actuators at ±2% portion precision and 350 meals per hour; an M700 disc-vault recovery grounded in 3,000,000+ field-cycle events; and the Avegant Glyph carried through headband validation, optical-yield recovery, and mass production. I set the technical method, lead cross-functional decisions, and stay close enough to the hardware to see where the plan diverges from reality.\n\nMore than 40 commercial products, no git reset. I now apply the same forensic method to intelligent systems by building and operating local-first AI-agent infrastructure with explicit evidence, permissions, and human approval boundaries.",
	},
	competencies: {
		engineering: [
			"Tolerance / Alignment / Load Paths",
			"Wear & Failure-Mode Analysis (RCA)",
			"GD&T · Stack-Ups (WC / RSS)",
			"DOE Test-Method Design",
			"FEA-Correlated Validation (ANSYS)",
			"Haptic & Kinematic Tuning",
		],
		manufacturing: [
			"DFM / DFA for Automated Assembly",
			"High-Volume NPI (Tool Start → MP)",
			"Injection Molding · Die Casting · Sheet Metal",
			"Accelerated Life / Destruction Testing",
			"Yield Recovery & CAPA",
			"CM Management (Suzhou · Guadalajara · Taipei)",
		],
		tools: [
			"Onshape, Creo, Solidworks",
			"PLM Architecture (Agile / Arena / Windchill)",
			"Thermal Simulation (CFD)",
			"UL 1472 / UL 20 / FCC",
			"MIL-STD-1472G",
			"Class III Medical Standards",
			"Class-A Surfacing",
		],
	},
	experience: [
		{
			id: "mechanistic-2022",
			roleIds: ["mechanistic-2022"],
			blurb:
				"Consultancy: systems architecture, crisis recovery, and AI-augmented engineering operations.",
			bullets: [
				"Conduct pre-production forensic audits for hardware startups - stress-testing thermal management, tolerance stack-up, and supply-chain fragility before tooling commitment.",
				"Built and operate **EN-OS**, a locally-hosted AI-agent infrastructure for research, root-cause synthesis, and decision documentation - the constraint methodology is identical to physical-systems engineering: fence the failure modes before assembly.",
			],
		},
		{
			id: "hyphen-2021",
			roleIds: ["hyphen-2021"],
			blurb:
				"Lead mechanical architect, Augmented Makeline - cobotic food-assembly robotics developed for enterprise restaurant deployment. Co-inventor, US20240164588A1.",
			bullets: [
				"Architected the gravimetric dispenser library (**Types A-F**) with de-agglomeration logic for adversarial ingredients (shredded proteins, sticky rice) - portion variance cut from ±15% to **±2%**, food waste down **98%**, at **350 meals/hour** sustained and **99%+ order accuracy**.",
				"Integrated **70+ actuators** with the controls stack (Beckhoff C6030 IPC, TwinCAT 3 / EtherCAT) at millisecond precision; TwinSAFE zone passivation cut safety wiring by ~50%.",
				"Engineered a **15-minute tool-less sanitation breakdown** with push-to-unlock food-contact components sized for commercial dishwashing.",
			],
		},
		{
			id: "mechanistic-2018",
			roleIds: ["mechanistic-2018"],
			blurb: "Product-development consultancy: micromobility, connected devices, lighting.",
			bullets: [
				"Engineered a ruggedized IoT module for **Lyft's Bay Wheels eBike** fleet - system architecture through detailed part design for outdoor deployment - plus an eCargo-bike platform, concept through detail design.",
			],
		},
		{
			id: "noon-2017",
			roleIds: ["noon-2017"],
			blurb:
				"Multi-SKU smart-home lighting ecosystem - four hardware platforms, concept through EVT/DVT. UL 1472 / UL 20 / MIL-STD-1472G. Acquired by Savant Systems.",
			bullets: [
				"Led hands-on mechanical architecture and reliability across the four-platform lighting ecosystem while preserving cross-functional ownership boundaries.",
				"Recovered the Elvis extension switch from seven-of-seven floating-cap failures to **100% EVT2 yield** by isolating a **0.1 mm** molded-versus-CAD offset, correcting the geometry, and replacing fixed-thickness PSA with structural adhesive.",
				"Ran staged Room Director reliability campaigns that kept unresolved 1.3 m drop failures separate from a passed household-chemical exposure campaign.",
			],
		},
		{
			id: "avegant-2015",
			roleIds: ["avegant-2015"],
			blurb:
				"Avegant Glyph - award-winning VRD head-mounted display, late-EVT through mass production. Best of CES 2016.",
			bullets: [
				"Carried the headband through measured spring-rate characterization across **wire-diameter and liner-durometer variants**, qualified a second spring vendor, and validated the structure through **headband lifecycle testing** into mass production.",
				"Reversed optical-engine yield collapse from **35.4% to 77.9% RTY** in a 10-week sprint - cleanroom protocol plus O4/O7 DMD inspection stations.",
				"Drove **T1-T6 tooling and cable-routing revisions** after the telescoping mechanism regressed to a 40% seizure rate at 250 cycles.",
				"Carried magnesium castings, injection-molded plastics, soft goods, packaging, FAI, and tooling recovery through the extended production ramp.",
			],
		},
		{
			id: "kaleidescape-2008",
			roleIds: ["kaleidescape-2008"],
			blurb:
				"Mechanical design, NPI, supplier coordination, and sustaining across a family of premium home-cinema hardware.",
			bullets: [
				"Analyzed **3,000,000+ M700 field-cycle events** to isolate dirty-roller friction loss compounded by carousel warp; redesigned the drive around force-dominant balance bars and eliminated dirty-roller slippage in validation.",
				"Recovered **100% of questioned M700 carousel inventory** through measured inspection limits and a sister-rib tooling correction instead of scrapping it.",
				"On KSYSTEM-120, coordinated mechanical integration, authored the mechanical FAI procedure, and originated bounded part-level inspection records toward pilot and ramp readiness.",
			],
		},
		{
			id: "digidesign-2003",
			roleIds: ["digidesign-2003"],
			blurb:
				"Flagship audio control surfaces - C|24, D-Command, SC48, ICON, 003; 12+ products shipped.",
			bullets: [
				"Authored Data Control Drawings governing outlines, keep-outs, and connector placement across **19 C|24 PCB assemblies**, producing **100% mechanical fit on the first physical build**; the SC48 record preserves a separate 17-document PCB design-control packet.",
				"Resolved an SC48 thermal shutdown through **17 logged chassis-and-fan configurations**; in comparable 4U test rows, moving three 80 mm fans from 8.5V to 12V reduced the left R69 rise by **9.9°C** and the absolute reading by **11.6°C**.",
			],
		},
		{
			id: "earlier-work",
			roleIds: [
				"mechanistic-1998",
				"frogdesign-1997",
				"mechanistic-1993",
				"sgi",
				"ep-technologies-1986",
			],
			group: {
				company: "EARLIER WORK",
				title: "Consumer · Medical · Workstation Hardware",
				location: "Bay Area, CA",
				period: {
					precision: "year",
					start: "1986",
					end: "2003",
				},
			},
			blurb:
				"WebTV / Microsoft (Xbox, UltimateTV; Galaxy set-top: 150W in consumer plastics via a 28.3 CFM wind-tunnel chassis) · frogdesign (KaVo dental systems, Newscorp satellite, Vadem Clio convertible PDA) · SGI (workstation thermal-acoustic analysis) · EP Technologies (Class III cardiac-ablation catheter production - where the forensic methodology started).",
			bullets: [],
		},
	] as ResumePresentation[],
	education: [
		{
			school: "De Anza College",
			degree: "Associate’s Degree, Automotive Engine Performance",
			details: "Focus on Mechanical Systems & Diagnostics.",
		},
	],
	recognition: [
		"Patent US20240164588A1: Modular System for Food Assembly (co-inventor)",
		"Avegant Glyph: Best of CES 2016 (Senior Mechanical Engineer, NPI → MP)",
		"SC48 Venue Mix Rack: TEC Award, Sound Reinforcement Console Technology",
		"Kaleidescape Cinema One: CEPro Product of the Year",
		"Motorola MP3 Player: CES 2002 Design Honoree",
	],
	pdf: {
		url: "https://assets.eriknorris.com/resume/Erik_Norris_Resume_Current.pdf",
		filename: "Erik_Norris_Resume_Current.pdf",
	},
	career: [
		{
			id: "mechanistic-2022",
			company: "MECHANISTIC",
			canonicalTitle: "Principal Mechanical Architect",
			location: "Silicon Valley",
			period: {
				precision: "year",
				start: "2022",
				end: null,
			},
			channels: {
				resumeTitle: "Principal Mechanical Architect",
				linkedinTitle: "Principal | Systems Architecture + AI Augmentation",
				linkedinCompany: "MECHANISTIC",
			},
			evidence: {
				source:
					"https://github.com/mechanistic-org/portfolio/commit/1b2cd2f6eaba20544cef087d5e031f1e2dba8bac",
				review:
					"https://github.com/mechanistic-org/global_agent/issues/152#issuecomment-5546214741",
				note: "Accepted channel labels retained verbatim; display mappings are not a new seniority or employment claim.",
			},
		},
		{
			id: "hyphen-2021",
			company: "HYPHEN",
			canonicalTitle: "Staff Mechanical Engineer → Principal Systems Architect",
			location: "San Jose, CA",
			period: {
				precision: "year",
				start: "2021",
				end: "2022",
			},
			channels: {
				resumeTitle: "Staff Mechanical Engineer → Principal Systems Architect",
				linkedinTitle: "Principal Systems Architect / Senior Mechanical Engineer",
				linkedinCompany: "HYPHEN",
			},
			evidence: {
				source:
					"https://github.com/mechanistic-org/portfolio/commit/1b2cd2f6eaba20544cef087d5e031f1e2dba8bac",
				review:
					"https://github.com/mechanistic-org/global_agent/issues/152#issuecomment-5546214741",
				note: "Accepted channel labels retained verbatim; display mappings are not a new seniority or employment claim.",
			},
		},
		{
			id: "mechanistic-2018",
			company: "MECHANISTIC",
			canonicalTitle: "Senior Mechanical Designer",
			location: "Redwood City, CA",
			period: {
				precision: "year",
				start: "2018",
				end: "2021",
			},
			channels: {
				resumeTitle: "Senior Mechanical Designer",
				linkedinTitle: "Senior Mechanical Designer | 2018 – 2021",
				linkedinCompany: "MECHANISTIC",
			},
			evidence: {
				source:
					"https://github.com/mechanistic-org/portfolio/commit/1b2cd2f6eaba20544cef087d5e031f1e2dba8bac",
				review:
					"https://github.com/mechanistic-org/global_agent/issues/152#issuecomment-5546214741",
				note: "Accepted channel labels retained verbatim; display mappings are not a new seniority or employment claim.",
			},
		},
		{
			id: "noon-2017",
			company: "NOON HOME",
			canonicalTitle: "Head of Mechanical Engineering",
			location: "Cupertino, CA",
			period: {
				precision: "year",
				start: "2017",
				end: "2018",
			},
			channels: {
				resumeTitle: "Head of Mechanical Engineering",
				linkedinTitle: "Principal Mechanical Architect / Head of Mechanical Engineering",
				linkedinCompany: "NOON HOME",
			},
			evidence: {
				source:
					"https://github.com/mechanistic-org/portfolio/commit/1b2cd2f6eaba20544cef087d5e031f1e2dba8bac",
				review:
					"https://github.com/mechanistic-org/global_agent/issues/152#issuecomment-5546214741",
				note: "Accepted channel labels retained verbatim; display mappings are not a new seniority or employment claim.",
			},
		},
		{
			id: "avegant-2015",
			company: "AVEGANT",
			canonicalTitle: "Senior Mechanical Engineer - NPI / DFM / MP",
			location: "Belmont, CA",
			period: {
				precision: "year",
				start: "2015",
				end: "2017",
			},
			channels: {
				resumeTitle: "Senior Mechanical Engineer - NPI / DFM / MP",
				linkedinTitle: "Senior Mechanical Engineer | NPI / DFM / Mass Production",
				linkedinCompany: "AVEGANT",
			},
			evidence: {
				source:
					"https://github.com/mechanistic-org/portfolio/commit/1b2cd2f6eaba20544cef087d5e031f1e2dba8bac",
				review:
					"https://github.com/mechanistic-org/global_agent/issues/152#issuecomment-5546214741",
				note: "Accepted channel labels retained verbatim; display mappings are not a new seniority or employment claim.",
			},
		},
		{
			id: "kaleidescape-2008",
			company: "KALEIDESCAPE",
			canonicalTitle: "Senior Mechanical Design Engineer",
			location: "Sunnyvale, CA",
			period: {
				precision: "year",
				start: "2008",
				end: "2015",
			},
			channels: {
				resumeTitle: "Senior Mechanical Design Engineer",
				linkedinTitle: "Senior Mechanical Design Engineer",
				linkedinCompany: "KALEIDESCAPE",
			},
			evidence: {
				source:
					"https://github.com/mechanistic-org/portfolio/commit/1b2cd2f6eaba20544cef087d5e031f1e2dba8bac",
				review:
					"https://github.com/mechanistic-org/global_agent/issues/152#issuecomment-5546214741",
				note: "Accepted channel labels retained verbatim; display mappings are not a new seniority or employment claim.",
			},
		},
		{
			id: "digidesign-2003",
			company: "DIGIDESIGN (AVID)",
			canonicalTitle: "Lead Mechanical Engineer",
			location: "Daly City, CA",
			period: {
				precision: "year",
				start: "2003",
				end: "2008",
			},
			channels: {
				resumeTitle: "Lead Mechanical Engineer",
				linkedinTitle: "Lead Mechanical Engineer | The Console Era",
				linkedinCompany: "DIGIDESIGN (AVID)",
			},
			evidence: {
				source:
					"https://github.com/mechanistic-org/portfolio/commit/1b2cd2f6eaba20544cef087d5e031f1e2dba8bac",
				review:
					"https://github.com/mechanistic-org/global_agent/issues/152#issuecomment-5546214741",
				note: "Accepted channel labels retained verbatim; display mappings are not a new seniority or employment claim.",
			},
		},
		{
			id: "mechanistic-1998",
			company: "MECHANISTIC",
			canonicalTitle: "Senior Mechanical Designer",
			period: {
				precision: "year",
				start: "1998",
				end: "2003",
			},
			channels: {
				resumeTitle: null,
				linkedinTitle: "Senior Mechanical Designer | 1998 – 2003",
				linkedinCompany: "MECHANISTIC",
			},
			evidence: {
				source:
					"https://github.com/mechanistic-org/portfolio/commit/1b2cd2f6eaba20544cef087d5e031f1e2dba8bac",
				review:
					"https://github.com/mechanistic-org/global_agent/issues/152#issuecomment-5546214741",
				note: "Accepted channel labels retained verbatim; display mappings are not a new seniority or employment claim.",
			},
		},
		{
			id: "frogdesign-1997",
			company: "FROGDESIGN",
			canonicalTitle: "Mechanical Designer",
			period: {
				precision: "year",
				start: "1997",
				end: "1999",
			},
			channels: {
				resumeTitle: null,
				linkedinTitle: "Mechanical Designer | 1997 – 1999",
				linkedinCompany: "FROGDESIGN",
			},
			evidence: {
				source:
					"https://github.com/mechanistic-org/portfolio/commit/1b2cd2f6eaba20544cef087d5e031f1e2dba8bac",
				review:
					"https://github.com/mechanistic-org/global_agent/issues/152#issuecomment-5546214741",
				note: "Accepted channel labels retained verbatim; display mappings are not a new seniority or employment claim.",
			},
		},
		{
			id: "mechanistic-1993",
			company: "MECHANISTIC",
			canonicalTitle: "Mechanical Designer",
			period: {
				precision: "year",
				start: "1993",
				end: "1997",
			},
			channels: {
				resumeTitle: null,
				linkedinTitle: "Mechanical Designer | 1993 – 1997",
				linkedinCompany: "MECHANISTIC",
			},
			evidence: {
				source:
					"https://github.com/mechanistic-org/portfolio/commit/1b2cd2f6eaba20544cef087d5e031f1e2dba8bac",
				review:
					"https://github.com/mechanistic-org/global_agent/issues/152#issuecomment-5546214741",
				note: "Accepted channel labels retained verbatim; display mappings are not a new seniority or employment claim.",
			},
		},
		{
			id: "sgi",
			company: "SILICON GRAPHICS (SGI)",
			canonicalTitle: "Mechanical Designer / Technician IV",
			period: {
				precision: "unknown",
				start: null,
				end: null,
			},
			channels: {
				resumeTitle: null,
				linkedinTitle: "Mechanical Designer / Technician IV",
				linkedinCompany: "SILICON GRAPHICS (SGI)",
			},
			evidence: {
				source:
					"https://github.com/mechanistic-org/portfolio/commit/1b2cd2f6eaba20544cef087d5e031f1e2dba8bac",
				review:
					"https://github.com/mechanistic-org/global_agent/issues/152#issuecomment-5546214741",
				note: "Accepted LinkedIn entry supplies no employment dates; do not infer dates from legacy work_history.json.",
			},
		},
		{
			id: "ep-technologies-1986",
			company: "EP Technologies",
			canonicalTitle: "Production Supervisor",
			period: {
				precision: "year",
				start: "1986",
				end: "1989",
			},
			channels: {
				resumeTitle: null,
				linkedinTitle: "Foundational Roles",
				linkedinCompany: "EARLY CAREER",
			},
			evidence: {
				source:
					"https://github.com/mechanistic-org/portfolio/commit/1b2cd2f6eaba20544cef087d5e031f1e2dba8bac",
				review:
					"https://github.com/mechanistic-org/global_agent/issues/152#issuecomment-5546214741",
				note: "Accepted channel labels retained verbatim; display mappings are not a new seniority or employment claim.",
			},
		},
	] as CareerRole[],
};
