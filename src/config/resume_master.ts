export interface ResumeRole {
	company: string;
	title: string;
	location: string;
	dates: string;
	blurb: string; // The "Context" hook
	bullets: string[]; // The "Impact" bullets
}

export const resumeMaster = {
	header: {
		name: "ERIK NORRIS",
		title: "Principal Mechanical Architect | Product / Robotics / Automation",
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
		// MODE E: The Abstract (Universal Bio)
		executive:
			"I treat physical engineering with the forensic rigor of a software codebase. The difference between a rescued program and a failed one is rarely the capability of the engineer - it is almost always the fidelity of the record.\n\nFrom integrating a modular food dispensing system in the IP69K washdown environment of the Makeline, to tuning the 250g tactile snap of the Noon Smart Switch, I have transitioned programs from catastrophic failure to global compliance. I engineered the dual-source bridge strategy that saved the C24 Console from supply chain collapse, and reversed a 100% mechanical retention failure on the Bazooka Base Station.\n\nFrom the 28.3 CFM forced-air wind tunnels of the WebTV Galaxy to the silent thermal dissipation of the Kaleidescape Cinema One: forty-plus commercial products, no git reset. The same forensic methodology I apply to a thermal yield crisis, I now apply to intelligent systems architecture.",
	},
	competencies: {
		engineering: [
			"Forensic System Architecture",
			"Root Cause Analysis (RCA)",
			"Advanced Surface Class-A",
			"Precision Sheet Metal Topology",
			"Haptic & Kinematic Tuning",
			"Thermal-Acoustic Optimization",
			"Plastic Injection Molding",
		],
		manufacturing: [
			"Sovereign Assembly Strategies",
			"Yield Recovery (0% to 100%)",
			"Dual-Source Supply Chain",
			"DFx for Automated Assembly",
			"Die Casting & CNC Machining",
			"Rapid Tooling Qualification",
		],
		tools: [
			"Onshape, Creo, Solidworks",
			"PLM Architecture (Agile/Arena)",
			"Thermal Simulation (CFD)",
			"Regulatory Compliance (UL 1472 / FCC)",
			"Tolerance Analysis",
			"Class III Medical Standards",
			"High-Velocity Airflow Systems",
		],
	},
	experience: [
		{
			company: "MECHANISTIC",
			title: "Principal Mechanical Architect",
			location: "Silicon Valley",
			dates: "2022 - Present",
			blurb: "Consultancy specializing in Sovereign Architecture & Crisis Recovery.",
			bullets: [
				"Conduct pre-production forensic audits for Tier-1 hardware startups - stress-testing thermal management, tolerance stack-up, and supply chain fragility before tooling commitment.",
				"Apply **Sovereign Assembly** principles to convert ID-constrained concepts into manufacturable, high-yield architectures without diluting original design intent.",
			],
		},
		{
			company: "HYPHEN",
			title: "Mechanical Engineer",
			location: "San Jose, CA",
			dates: "2021 - 2022",
			blurb: "Lead architect for the 'Factory-in-a-Box' IP69K food robotics platform.",
			bullets: [
				"Diagnosed Non-Newtonian food ingredient failures (carnitas, rice - agglomeration and ricochet) defying standard industrial dosing logic; built Dispenser Taxonomy (Types A-F) with 70+ actuators and dynamic auto-tuning to decouple portion precision from fluid viscosity.",
				"Reduced portion variance from the industry-standard ±15% to **±2%**, cutting food waste by 98% while sustaining 350-meal/hour throughput.",
				"Resolved thermal expansion mismatch between Acetal internal gears and Aluminum enclosures by integrating Sleeve Alignment Guides for concentricity and Low-Clearance Retaining Rings to prevent axial helix migration.",
				"Achieved **99.9% order accuracy** with a modular hot-swap architecture enabling MTTR under 5 minutes during peak service.",
			],
		},
		{
			company: "NOON HOME (LOCOROLL)",
			title: "Head of Mechanical Engineering ('The Architect')",
			location: "Cupertino, CA",
			dates: "2016 - 2018",
			blurb: "High-end smart home automation startup acquired by Alarm.com.",
			bullets: [
				"Led concurrent dual-stack programs: modular **Layered Lighting** ecosystem (Noon) and high-volume stealth consumables system (Locoroll).",
				"Eliminated EVT1 paper jam failures (under 60% reliability at first build) in Locoroll by architecting the **Floating Gimbal** feed mechanism (LCR-Mech-Rev3), decoupling paper roll inertia from the cutter head to allow self-alignment during high-speed dispensing - achieving **99.8% dispense reliability** across 50k-cycle life testing.",
				"Resolved dual failure modes in the Noon Director switch - OLED delamination at 45°C from CTE mismatch and rotary interface below 150g tactile threshold - via a Flex-Mount PSA bracket for CTE absorption and pre-loaded spring detent redesign, securing the **250g Signature Click** for the $500 price point and passing 85°C storage qualification.",
			],
		},
		{
			company: "KALEIDESCAPE",
			title: "Senior Mechanical Design Engineer",
			location: "Sunnyvale, CA",
			dates: "2013 - 2015",
			blurb: "Audiophile-grade movie servers and players.",
			bullets: [
				"Operated as Sole Mechanical Engineer for full product lifecycle - NPI through sustaining - across a global supply chain spanning Taiwan, Mexico, and Canada.",
				"Eliminated 100% of M700 disc changer field failures by analyzing **3,000,000+ cycle events** to isolate friction coefficient drop, then redesigning the pinch roller assembly with dual radial spring balance bars; recovered questioned carousel inventory via new inspection criteria.",
				"Negotiated **$24/unit savings** on chassis costs by transitioning from soft tooling to staged hard tooling in China.",
			],
		},
		{
			company: "AVID TECHNOLOGY (DIGIDESIGN)",
			title: "Lead Mechanical Engineer",
			location: "Daly City, CA",
			dates: "2006 - 2012",
			blurb: "Professional Audio Consoles: D-Control, D-Command, SC48.",
			bullets: [
				"Managed Danko and Lux console programs under strict cost-down reuse mandates, carrying full mechanical documentation responsibility solo across both programs.",
				"Resolved Fader Unit thermal failure (41°C internal temp under Vegas Mode stress testing) by enforcing cabling routing to unblock airflow - achieving **80% FCS confidence** despite a 50% initial vendor rejection rate.",
				"Protected assembly yield on first Fader Pan batch (50% sheet metal warping) by instituting **100% manual incoming inspection** and negotiating a $5,000 expedite fee waiver with PPI Plastics; released 24+ unique parts of mechanical documentation solo under a 2-week deadline.",
			],
		},
		{
			company: "WEBTV / MICROSOFT",
			title: "Product Designer",
			location: "Mountain View, CA",
			dates: "1999 - 2002",
			blurb: "Hardware division for UltimateTV and Xbox.",
			bullets: [
				"Executed high-velocity mechanical design for satellite gateways and peripherals in the UltimateTV and Xbox hardware division.",
				"Delivered functional prototypes for executive review in **under 4 weeks** after E-M Solutions vendor shutdown by personally coordinating off-cycle quick-turn fabrication.",
			],
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
		"Avegant Glyph: Best of CES 2016 (Lead Mechanical Architect)",
		"Kaleidescape Cinema One: CEPro Product of the Year",
		"Motorola MP3 Player: CES Honoree (Mechanical Design & Surfacing)",
	],
};
