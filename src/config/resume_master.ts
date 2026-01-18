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
		title: "Sr. Staff Mechanical Engineer / Designer | Forensic Architect",
		tagline: "Autodidact | Technical Polyglot | Concept to Mass Production | BBQs to Dental Chairs",
		contact: {
			location: "Redwood City, CA",
			// phone: "Removed for Privacy",
			email: "erik@eriknorris.com",
			linkedin: "linkedin.com/in/eriknorris",
			portfolio: "eriknorris.com",
		},
	},
	summary: {
		// Mode B: Forensic Architect Summary
		executive:
			"I architect the hardware interface for the physical world—from the heat of a Fissler BBQ to the surgical precision of a KaVo Dental Chair. My career is defined by a relentless drive to translate 'Concept' into 'Mass Production' across every conceivable domain. I have helped validate the most beautiful PC ever made (SGI Indigo), engineered the Gold Standard for pro audio consoles (Avid D-Control), and optimized the OG gaming platform (Xbox). Whether it's managing the 150-watt thermal load of a retinal headset, ensuring IP69K washdown compliance for food robotics, or guiding a Class III cardiac catheter through the FDA—the physics change, but the mission remains the same: Zero Yield Loss. Zero Cosmetic Defects. Total Functional Integrity.",
	},
	competencies: {
		engineering: [
			"Forensic Engineering",
			"Mechanical Architecture",
			"Complex Surface Modeling (Pro/E, Creo)",
			"Mechanism Design",
			"Thermal Management (Active/Passive)",
		],
		manufacturing: [
			"New Product Introduction (NPI)",
			"Design for Manufacturing (DFM)",
			"Root Cause Analysis & Yield Improvement",
			"Injection Molding (Class A)",
			"Die Casting & Thixomolding",
			"Sheet Metal (Progressive)",
		],
		tools: [
			"PTC Creo / Pro/ENGINEER",
			"PLM (Windchill Admin)",
			"Onshape / SolidWorks",
			"GD&T / Tolerance Analysis",
		],
		regulatory: [
			"Technical Program Management",
			"Supplier Qualification & Strategy",
			"Regulatory Compliance (UL/FCC/CE)",
			"Class III Medical Device Standards",
		],
		ai: [
			"Sovereign AI Systems Architecture",
			"Retrieval-Augmented Generation (RAG)",
			"Structured Data Synthesis",
			"Advanced Prompt Engineering",
			"Digital Forensics",
		],
	},
	experience: [
		{
			company: "HYPHEN",
			title: "Mechanical Engineer",
			location: "San Jose, CA",
			dates: "2021 - 2022",
			blurb: "Lead engineer for the 'Factory-in-a-Box' food robotics platform.",
			bullets: [
				"Integrated 350+ electromechanical actuators into a constrained chassis.",
				"Achieved **IP69K compliance** for wash-down environments, designing custom sealing solutions for doors, cable pass-throughs, and sensor arrays.",
				"Reduced **Mean Time To Repair (MTTR)** from hours to minutes by architecting a hot-swappable module strategy that decoupled dispensers from the main chassis.",
			],
		},
		{
			company: "NOON HOME",
			title: "Senior Mechanical Engineer",
			location: "Cupertino, CA",
			dates: "2017 - 2018",
			blurb: "Lead mechanical architect for the 'Haptic Switch' smart lighting controller.",
			bullets: [
				"Designed a floating flexure system to isolate the OLED display stack from mounting forces, resulting in **zero cosmetic yield loss** at assembly.",
				"Collaborated with ID to achieve 'dead-front' aesthetics using precision tint-matching and seamless glass integration.",
			],
		},
		{
			company: "AVEGANT",
			title: "Senior Mechanical Engineer",
			location: "Belmont, CA",
			dates: "2015 - 2017",
			blurb: "Mechanical Lead for mixed-reality retinal imaging headsets.",
			bullets: [
				"**Thermal Engineering:** Utilized the magnesium headband as a passive heat sink to dissipate 150W equivalent heat load, resolving a critical 'Hot Head' user complaint.",
				"**Mechanism Design:** Engineered a high-precision IPD adjustment mechanism, ensuring optical alignment stability under drop-test conditions.",
			],
		},
		{
			company: "KALEIDESCAPE",
			title: "Senior Mechanical Design Engineer",
			location: "Sunnyvale, CA",
			dates: "2008 - 2015",
			blurb:
				"Sole Mechanical Engineer responsible for the M500, M300, and Cinema One product lines.",
			bullets: [
				"**Crisis Management:** Detected 'Flow Mark' defects in 1,200 parts (Cinema One). Exercised **Line-Down** authority to reject inventory and force a root-cause gating change, establishing 'Apple-tier' cosmetic standards.",
				"**Cost Reduction:** Redesigned the 'Macduff' chassis lid, consolidating three parts into one. Reduced assembly time by **15 minutes** and eliminated fastener count by 30%.",
				"**System Integration:** Integrated slot-loading optical drives (Blu-ray) with custom vibration isolation dampers to prevent skip/read errors during operation.",
			],
		},
		{
			company: "DIGIDESIGN (AVID TECHNOLOGY)",
			title: "Lead Mechanical Engineer / Industrial Designer",
			location: "Daly City, CA",
			dates: "2003 - 2008",
			blurb: "Led flagship console architecture (D-Control, C|24, SC48).",
			bullets: [
				"**SC48 'Lux' Console:** Solved a critical 75°C CPU thermal shutdown during DVT by redesigning the chassis height from 3U to 4U and optimizing internal airflow paths. Eliminated custom aluminum extrusions, reducing chassis cost by **20%**.",
				"**C|24 Governance:** Enforced strict **Data Control Drawing (DCD)** protocols for the integration of 19 PCBs, achieving 100% mechanical fit on the first pilot build.",
				"**C|24 Manufacturing:** Designed a 'Vertical Hanging' fixture for painting ABS sidecaps, solving a 2mm warp/shrinkage issue that was causing assembly failure.",
			],
		},
		{
			company: "WEBTV / MICROSOFT",
			title: "Mechanical Engineering Consultant",
			location: "Mountain View, CA",
			dates: "1999 - 2003",
			blurb: "High-level surfacing and design consultancy via Mechanistic.",
			bullets: [
				"**Project Cortez (Wireless Keyboard):** Delivered complex, organic Pro/E surfaces for the infrared keyboard in **6 weeks**. Resolved a critical 0.05mm key pitch mismatch between ID intent and Silitek’s tooling.",
				"**Project Elmer/Zeus (Servers):** Engineered rapid-prototype server enclosures for CES. Managed a hybrid build (soft-tool metal + CNC plastic) to deliver 5 functional units in **4 weeks**.",
				"**Xbox Division:** Transitioned engineering assets from UltimateTV to Xbox, designing EMI liners and HDD carriers for early development kits.",
			],
		},
		{
			company: "MECHANISTIC",
			title: "Principal / Freelance Product Designer",
			location: "Bay Area",
			dates: "1999 - 2003",
			blurb: "Provided expert CAD surfacing and mechanical engineering services.",
			bullets: [
				"Provided expert CAD surfacing and mechanical engineering services for clients including Apple, Motorola, and SGI.",
				"Designed complex organic surfaces for consumer peripherals using Pro/ENGINEER.",
			],
		},
		{
			company: "FROGDESIGN",
			title: "Mechanical Designer",
			location: "Sunnyvale, CA",
			dates: "1997 - 1998",
			blurb: "Bridged the gap between high-concept Industrial Design and mass production.",
			bullets: [
				"Design Fidelity: Maintained subtle surface, gap, and finish requirements while ensuring manufacturability for clients like KaVo (Dental Systems) and Newscorp (Satellite Receivers).",
			],
		},
		{
			company: "EARLY CAREER",
			title: "Foundational Roles",
			location: "Silicon Valley",
			dates: "1986 - 1996",
			blurb: "Roles establishing the foundation of high-performance product design.",
			bullets: [
				"**Mechanistic (1993–1996):** Designed SwitchBlade inline speed skates and Sunbeam Toast Logic appliances.",
				"**Silicon Graphics (SGI) (1989–1993):** Performed thermal/acoustic analysis for Indigo and Indy workstations; managed prototype supply chains.",
				"**EP Technologies (1986–1989):** Production Supervisor for Class III medical devices (Cardiac Ablation Catheters).",
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
	patents: [
		"Avegant Glyph (Best of CES 2016)",
		"Kaleidescape Cinema One (CEPro Product of the Year)",
		"Motorola MP3 Player (CES Honoree) - Mechanical Design & Surfacing",
	],
};
