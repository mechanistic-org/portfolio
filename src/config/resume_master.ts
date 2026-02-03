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
		title: "Principal Mechanical Architect | Forensic Specialist",
		// Updated Tagline per user request (LinkedIn Hybrid)
		tagline:
			"Sr. Staff ME | Designer | Forensic Architect | High-Fidelity Hardware & Program Rescue",
		contact: {
			location: "Redwood City, CA",
			email: "erik@eriknorris.com",
			linkedin: "linkedin.com/in/eriknorris",
			portfolio: "eriknorris.com",
			resume: "resume.eriknorris.com",
			// phone: "Removed for Privacy", // Kept commented out, handled in template
		},
	},
	summary: {
		// Mode B: Forensic Architect Summary (Polished)
		executive:
			"Engineering lead specializing in the recovery of high-complexity hardware programs through rigorous forensic analysis and surgical structural intervention. Proven record of stabilizing thermally hostile, high-density architectures (A/V Consoles, Home Gateways, Servers) while maintaining ruthless COGS discipline and Class A cosmetic standards. Expert at bridging the gap between Industrial Design intent and offshore manufacturing reality during 'Death March' schedules. Personally engineered and released over 113 unique mechanical parts into production, successfully transitioning legacy product lines to high-volume offshore manufacturing.",
	},
	competencies: {
		engineering: [
			"Pro/ENGINEER (Wildfire/Creo)",
			"Advanced Surface Development",
			"Sheet Metal Origami (Complex Folding)",
			"Plastic Injection Molding (Structural Foam & Thin-wall)",
		],
		manufacturing: [
			"Forensic Log Analysis",
			"ECO/ECN Codification",
			"Yield Management",
			"Vendor Liaison (VTech, Jetcrown, Mass Precision)",
			"DFM/DFA",
		],
		tools: [
			"CFD Simulation Analysis",
			"DOE Thermal Matrix Testing",
			"High-Velocity Airflow Architecture",
			"Heat Sink Optimization",
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
				"**Crisis Management:** Detected 'Flow Mark' defects in 1,200 parts (Cinema One). Exercised **Line-Down** authority to reject inventory and establish 'Apple-tier' cosmetic standards.",
				"**Cost Reduction:** Redesigned the 'Macduff' chassis lid, consolidating three parts into one. Reduced assembly time by **15 minutes** and eliminated fastener count by 30%.",
				"**System Integration:** Integrated slot-loading optical drives (Blu-ray) with custom vibration isolation dampers to prevent skip/read errors.",
			],
		},
		{
			company: "DIGIDESIGN (AVID) - SC48",
			title: "Lead Mechanical Engineer | Project Lux",
			location: "Daly City, CA",
			dates: "2007 - 2008",
			blurb: "Architect an 'Embedded Live Sound' console under a ruthless <$15k COGS mandate.",
			bullets: [
				"**The Hard Ore:** Eliminated a 100% show-stopping thermal failure by identifying the **75°C CPU shutdown threshold** via forensic log analysis (SC48_lux_thermal-testing.pdf); engineered a custom **4U side-intake ducting system** (P/N 9420-58856-00) that stabilized internal temperature rise to **22.6°C**.",
				"**The Rhythm:** Managed high-velocity 'War Room' coordination between Industrial Design (ID) aesthetic constraints and Electrical Engineering (EE) thermal loads, utilizing a **16+ configuration test matrix** to validate the cooling architecture before tooling.",
				"**The Integer:** Slashed mechanical material costs to **20% of total COGS** by replacing expensive aluminum extrusions with the **'4U Rake Back I-Beam'** (P/N 9420-58317-00), a custom folded steel spine that maintained touring-grade rigidity.",
			],
		},
		{
			company: "DIGIDESIGN (AVID) - C|24",
			title: "Lead Mechanical Engineer | Project Curtis",
			location: "Daly City, CA",
			dates: "2006 - 2007",
			blurb:
				"Execute a RoHS/Refresh of legacy hardware to eliminate a $200 royalty while maintaining a $9,995 MSRP.",
			bullets: [
				"**The Hard Ore:** Recovered Pilot yield on cosmetic plastics from **2.50mm warp to <0.50mm** via custom fixture engineering ('Method A'). Codified the vertical gravity-cure process in **ECO 12740** to utilize the glass-transition phase for straightness.",
				"**The Rhythm:** Executed a dual-source bridge strategy by engaging Mass Precision (Silicon Valley) for emergency manual fabrication to bypass a critical **'No-Bid' supply chain gap** from the primary overseas vendor.",
				"**The Integer:** Slashed COGS to achieve **51.8% Gross Margin** by eliminating legacy royalty structures and integrating 19 PCBs and 15 chassis parts into a compliant, RoHS-refreshed architecture.",
			],
		},
		{
			company: "KALEIDESCAPE (ORPHEUS) - KSYSTEM-120",
			title: "Senior Mechanical Design Engineer",
			location: "Sunnyvale, CA",
			dates: "2008 - 2015",
			blurb:
				"Manufacturing ramp of high-density A/V servers bridging legacy systems and low-cost players.",
			bullets: [
				"**The Hard Ore:** Defeated the **'Thumb of God' flex crisis** (PCB crash loop) by directing surgical modifications to the electronics tray, including 'peninsula' relief slots (ECO 789/817) to prevent chassis walls from shearing resistors during assembly.",
				'**The Rhythm:** Remediated a **0.005" tolerance stack-up error** in the fan tray assembly that prevented proper lid closure, averting a production yield crisis.',
				"**The Integer:** Directed manufacturing transfer to Sanmina Guadalajara, resolving 3 critical stop-ship interference issues and negotiating CPU thermal solution unit price from **$9.63 down to $9.25**.",
			],
		},
		{
			company: "DIGIDESIGN (AVID) - D-COMMAND",
			title: "Lead Mechanical Engineer | Project Danko",
			location: "Daly City, CA",
			dates: "2004 - 2005",
			blurb:
				"Engineer a mid-format control surface utilizing flagship architecture under extreme schedule compression.",
			bullets: [
				"**The Hard Ore:** Eliminated **5mm structural offsets** in chassis mating and a 'hammer-to-fit' assembly mode via **ECO 8000**, implementing universal mounting slots on rear brackets to force alignment across drifting extrusion profiles.",
				"**The Rhythm:** Managed the entire mechanical documentation release solo, delivering **109 unique drawings** (Assemblies, Extrusions, Sheetmetal, Plastics) for the D-Command release under a 2-week deadline.",
				"**The Integer:** Secured **-2.2dB EMI headroom margin** through rapid cable routing optimization and improved gasket sealing on RJ45 ports after initial scans exceeded Class A limits.",
			],
		},
		{
			company: "DIGIDESIGN (AVID) - D-CONTROL",
			title: "Lead Mechanical Engineer | Project Buckley",
			location: "Daly City, CA",
			dates: "2003 - 2004",
			blurb:
				"Deliver the mechanical chassis and stand architecture for the 'ICON' flagship console.",
			bullets: [
				"**The Hard Ore:** Rescued the production line from a **4-week 'Line Down' stoppage** by re-engineering structural foam side caps to resolve a **50% yield failure rate** (ECO 6310).",
				'**The Rhythm:** Modified geometric tolerances (increasing boss diameters from 0.37" to 0.25") to eliminate assembly stress cracking and accommodate molding variances.',
				"**The Integer:** Stabilized escalating COGS by consolidating extrusion profiles to a **single unified design** across 7 modular stand configurations.",
			],
		},
		{
			company: "WEBTV (MICROSOFT) - GALAXY",
			title: "Principal Mechanical Architect",
			location: "Mountain View, CA",
			dates: "2001 - 2003",
			blurb:
				"Architect a Home Network Gateway integrating a high-heat AMD K7 CPU into a consumer form factor.",
			bullets: [
				"**The Hard Ore:** Engineered a thermal architecture dissipating **150 Watts** within a 300mm footprint at 45°C ambient; specified a 28.3 CFM airflow tunnel and 50x60x30mm extruded heatsink.",
				"**The Rhythm:** Resolved 100% of critical chassis warpage defects by redesigning stamping features from 'drawn standoffs' to **'Hook 29' details** with integrated strengthening ribs.",
				"**The Integer:** Managed a **$14,200/month solo engineering burn rate**, simultaneously driving Galaxy, Mercury, and Xbox deliverables through a centralized FTP hub.",
			],
		},
		{
			company: "WEBTV (MICROSOFT) - CORTEZ",
			title: "Product Designer",
			location: "Mountain View, CA",
			dates: "2000 - 2001",
			blurb: "Mechanical design and complex surfacing for a reference wireless keyboard.",
			bullets: [
				"**The Hard Ore:** Rectified a **0.05mm accumulated tolerance error** between Industrial Design (19mm pitch) and vendor tooling (19.05mm) that threatened to misalign the bezel.",
				"**The Rhythm:** Executed a 43-hour sprint to engineering a **3-15 degree variable IR transmission angle** and organic surface lofting into the primary housing geometry.",
				"**The Integer:** Managed disparate vendor data streams (Panasonic/Silitek) to unify the mechanical database while reducing model weight to meet the **0.6kg target**.",
			],
		},
		{
			company: "WEBTV (MICROSOFT) - ELMER",
			title: "Lead Mechanical Engineer",
			location: "Mountain View, CA",
			dates: "1999 - 2000",
			blurb: "Rapidly deliver 'roadworthy' demonstration enclosures for the WCS and CES 2001.",
			bullets: [
				"**The Hard Ore:** Optimized convective airflow by redesigning chassis perforation patterns and implementing **'ThermaPad' gap fillers** to maintain 'dead nuts' flatness for CPU heat spreader contact.",
				"**The Rhythm:** Enforced a strict **4-40 UNC hardware standardization** across the assembly, purging metric equivalents to prevent assembly line failure during a compressed 9-day fabrication cycle.",
				"**The Integer:** Orchestrated delivery of 5 server enclosures and 12 node units by managing parallel workstreams between sheet metal (E-M Solutions) and model shops (Sputnik).",
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
