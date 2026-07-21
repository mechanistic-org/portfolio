export interface ResumeRole {
	company: string;
	title: string;
	location: string;
	dates: string;
	blurb: string; // The "Context" hook
	bullets: string[]; // The "Impact" bullets
}

// Promoted to master 2026-06-12 from the OpenAI Robotics application build (operator-approved).
// Carries corrected employment dates (per 2021 reference resume), Savant acquirer, and the
// disavowed Locoroll bullet removed. Provenance:
// global_agent/registry/applications/2026-06-12_openai-robotics-mechanical-design-engineer/
export const resumeMaster = {
	header: {
		name: "ERIK NORRIS",
		title: "Staff Mechanical Engineer | Robotics · Prototype → Production",
		tagline:
			"Structure the chaos · Index the decisions · Ship the hardware",
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
			"I treat physical engineering with the forensic rigor of a software codebase. The difference between a rescued program and a failed one is rarely the capability of the engineer - it is almost always the fidelity of the record.\n\nI lead mechanical design for actuated systems that survive contact with the real world: a cobotic food-assembly platform coordinating 70+ actuators at ±2% portion precision and 350 meals/hour; a disc-changer mechanism whose 100% field-failure mode I traced through 3,000,000+ logged cycle events to a friction-coefficient drift; a head-mounted display whose spring-steel headband I carried through clamp-force characterization and lifecycle validation into mass production. I take subsystems from whiteboard through DVT into high-volume production, and I go to the factory floor - Suzhou, Guadalajara - when the yield data demands it.\n\nForty-plus commercial products, no git reset. The same forensic methodology I apply to a tolerance stack or a thermal yield crisis, I now apply to intelligent systems: I build and operate a local AI-agent infrastructure, engineering constraint structures for software the way I fence failure modes in hardware.",
	},
	competencies: {
		engineering: [
			"Robotic Mechanism & Actuator Design",
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
			company: "MECHANISTIC",
			title: "Principal Mechanical Architect",
			location: "Silicon Valley",
			dates: "2022 - Present",
			blurb: "Consultancy: systems architecture, crisis recovery, and AI-augmented engineering operations.",
			bullets: [
				"Conduct pre-production forensic audits for hardware startups - stress-testing thermal management, tolerance stack-up, and supply-chain fragility before tooling commitment.",
				"Built and operate **EN-OS**, a locally-hosted AI-agent infrastructure for research, root-cause synthesis, and decision documentation - the constraint methodology is identical to physical-systems engineering: fence the failure modes before assembly.",
			],
		},
		{
			company: "HYPHEN",
			title: "Staff Mechanical Engineer → Principal Systems Architect",
			location: "San Jose, CA",
			dates: "2021 - 2022",
			blurb: "Lead mechanical architect, Augmented Makeline - cobotic food-assembly robotics deployed with enterprise partners. Co-inventor, US20240164588A1. Recalled under contract three times since.",
			bullets: [
				"Architected the gravimetric dispenser library (**Types A-F**) with de-agglomeration logic for adversarial ingredients (shredded proteins, sticky rice) - portion variance cut from industry-standard ±15% to **±2%**, food waste down **98%**, at **350 meals/hour** sustained and **99.9% order accuracy**.",
				"Integrated **70+ actuators** with the controls stack (Beckhoff C6030 IPC, TwinCAT 3 / EtherCAT) at millisecond precision; TwinSAFE zone passivation cut safety wiring by ~50%.",
				"Resolved axial helix migration in the dispenser gear train - CTE mismatch between Acetal gears and Aluminum enclosures - with sleeve alignment guides and low-clearance retaining rings.",
				"Engineered **hot-swap blade architecture (MTTR under 5 minutes)** and a 15-minute tool-less sanitation breakdown (push-to-unlock hoppers) for NSF compliance in the IP69K washdown environment.",
			],
		},
		{
			company: "MECHANISTIC",
			title: "Senior Mechanical Designer",
			location: "Redwood City, CA",
			dates: "2018 - 2021",
			blurb: "Product-development consultancy: micromobility, connected devices, lighting.",
			bullets: [
				"Engineered a ruggedized IoT module for **Lyft's Bay Wheels eBike** fleet - system architecture through detailed part design for outdoor deployment - plus an eCargo-bike platform, concept through detail design.",
			],
		},
		{
			company: "NOON HOME",
			title: "Head of Mechanical Engineering",
			location: "Cupertino, CA",
			dates: "2017 - 2018",
			blurb: "Multi-SKU smart-home lighting ecosystem - four hardware platforms, concept through EVT/DVT. UL 1472 / UL 20 / MIL-STD-1472G. Acquired by Savant Systems.",
			bullets: [
				"Resolved dual EVT1 failure modes on the flagship Director switch: OLED delamination at 45°C from CTE mismatch (flex-mount PSA bracket) and a rotary interface below the 150g tactile threshold (pre-loaded spring detent restoring the **250g signature click**; passed 85°C storage qualification).",
				"Built **WC/RSS tolerance stack-up models** guaranteeing mechanical retention and 0.1mm gap reveal across mass EVT2 builds of a screwless multi-gang wall-plate chassis.",
				"Recovered **100% EVT2 yield** on the extension switch by isolating a 0.1mm CAD geometry mismatch; pivoted PSA to structural adhesive and drove steel-tooling modifications.",
			],
		},
		{
			company: "AVEGANT",
			title: "Senior Mechanical Engineer - NPI / DFM / MP",
			location: "Belmont, CA",
			dates: "2015 - 2017",
			blurb: "Avegant Glyph - award-winning VRD head-mounted display, late-EVT through mass production. Best of CES 2016.",
			bullets: [
				"Resolved headband clamping-force and fatigue failure: measured spring-rate curves across **wire-diameter and liner-durometer variants**, qualified a second spring vendor, and validated the fix through **headband lifecycle testing** into mass production.",
				"Reversed optical-engine yield collapse from **35.4% to 77.9% RTY** in a 10-week sprint - cleanroom protocol plus O4/O7 DMD inspection stations.",
				"On-site at Intretech (Suzhou): diagnosed magnesium chassis warpage and deployed Go/No-Go fixtures - casting yield from under 60% to over 95%; drove **T1-T6 tooling revisions** resolving telescoping ear-can cable kinking (40% failure at 250 cycles).",
				"Delivered magnesium castings, injection-molded plastics, soft goods, and packaging on a **234-day Tool Start → MP** schedule.",
			],
		},
		{
			company: "KALEIDESCAPE",
			title: "Senior Mechanical Design Engineer",
			location: "Sunnyvale, CA",
			dates: "2008 - 2015",
			blurb: "Sole ME for six generations of premium home-cinema hardware - NPI through sustaining across a Taiwan / Mexico / Canada supply chain.",
			bullets: [
				"Eliminated a **100% field-failure population** in the M700 disc changer: analyzed **3,000,000+ cycle events** to isolate friction-coefficient drift in the pinch roller; redesigned with dual radial spring balance bars; recovered questioned carousel inventory via revised inspection criteria - **zero scrap**.",
				"Cleared an M500 **stop-ship** (resistors shearing off the PCB under handling load) by tracing sheet-metal flexure into the PCBA load path and designing a retrofit structural tray - no inventory scrapped.",
				"Directed manufacturing transfer to Sanmina Guadalajara; eliminated a 15% rework rate caused by a **0.005 in fan-tray tolerance stack-up** by re-dimensioning the sheet metal.",
			],
		},
		{
			company: "DIGIDESIGN (AVID)",
			title: "Lead Mechanical Engineer",
			location: "Daly City, CA",
			dates: "2003 - 2008",
			blurb: "Flagship audio control surfaces - C|24, D-Command, SC48, ICON, 003; 12+ products shipped.",
			bullets: [
				"Integrated **19 distinct PCBs** (C|24) and 17 (SC48) under Data Control Drawings governing outlines, keep-outs, and connector placement - **100% mechanical fit on initial physical builds**.",
				"Resolved SC48 CPU thermal shutdown with a **16-configuration DOE matrix** (chassis volume × fan size × voltage) defining the Safe Operating Area - internal rise stabilized at 22.6°C with 13.8°C of headroom.",
			],
		},
		{
			company: "EARLIER WORK",
			title: "Consumer · Medical · Workstation Hardware",
			location: "Bay Area, CA",
			dates: "1986 - 2003",
			blurb: "WebTV / Microsoft (Xbox, UltimateTV; Galaxy set-top: 150W in consumer plastics via a 28.3 CFM wind-tunnel chassis) · frogdesign (KaVo dental systems, Newscorp satellite, Vadem Clio convertible PDA) · SGI (workstation thermal-acoustic analysis) · EP Technologies (Class III cardiac-ablation catheter production - where the forensic methodology started).",
			bullets: [],
		},
	],
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
};
