import careerChronology from "../data/careerChronology.json" with { type: "json" };
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
	displayCompany?: string;
	id: string;
	roleIds: string[];
	group?: { company: string; title: string; location: string; period: CareerPeriod };
	blurb: string;
	bullets: string[];
}

// Approved hiring edition, 2026-11-20, Moreplay #19. Source copy remains in the private biography package.
export const resumeMaster = {
	header: {
		name: "Erik Norris",
		title: "Principal Mechanical Architect | Product Architecture & Technical Direction",
		tagline: "",
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
			"I'm an engineer. I like doing good work on hard problems: understanding the physics, testing what matters and making compromises without losing the intent. I bring practical engineering judgment to product architecture and systems integration, carrying work from concept through manufacturing.",
	},
	competencies: {
		engineering: [
			"Mechanical architecture and system integration; mechanisms; tolerance analysis and GD&T; electronics packaging; thermal analysis; experimental planning and failure analysis; DFM/DFA; tooling, supplier coordination and NPI; injection-molded plastics, castings and sheet metal.",
		],
		tools: [
			"Creo / Pro/ENGINEER, Onshape, SolidWorks; Agile, Arena and Windchill; software architecture and testing; retrieval and agent-tool integration; source records and revision management.",
		],
	},
	experience: [
		{
			id: "mechanistic-2022",
			roleIds: ["mechanistic-2022"],
			blurb:
				"Independent engineering practice focused on product architecture, mechanical design and preparation for manufacturing.",
			bullets: [
				"Developed a dispenser lid for Hyphen around pan fit, handling, stacking and cleanability. Handed off CAD, materials research and molding requirements, with remaining tooling decisions identified.",
				"Design, build and operate EN-OS, a local system that keeps engineering sources, decisions and project context usable across AI assistants. Own its architecture, software development, testing and operation.",
				"Provided thermal and mechanical design consulting to Whipsaw on a compact cooling product, developing an alternative airflow proposal and handing off CAD and technical recommendations.",
			],
			displayCompany: "Mechanistic",
		},
		{
			id: "hyphen-2021",
			roleIds: ["hyphen-2021"],
			blurb: "",
			bullets: [
				"Led mechanical design and systems architecture for the Augmented Makeline, integrating food-handling mechanisms, bowl movement, refrigeration, controls and cabinet packaging into a modular food-assembly system.",
				"Defined layouts and interfaces with electrical, controls and manufacturing colleagues, making cleaning, service access and assembly part of the architecture. Created motor- and display-board drawings specifying board envelopes, mounting locations and clearances.",
				"Co-inventor of Modular System for Food Assembly, US patent 12,213,629, granted February 2025.",
			],
			displayCompany: "Hyphen",
		},
		{
			id: "mechanistic-2018",
			roleIds: ["mechanistic-2018"],
			blurb: "",
			bullets: [
				"Engineered a ruggedized IoT module for Lyft's Bay Wheels eBike program, from system architecture through electronics packaging and detailed mechanical design for outdoor use.",
				"Developed an electric cargo-bike platform from concept and vehicle architecture into detailed parts and assemblies for prototype development.",
			],
			displayCompany: "Mechanistic",
		},
		{
			id: "noon-2017",
			roleIds: ["noon-2017"],
			blurb: "",
			bullets: [
				"Led mechanical architecture and reliability work across four connected-lighting hardware platforms through EVT and DVT, working with industrial design, electronics, suppliers and manufacturing.",
				"Used prototype tests and sample-level results on the Room Director to distinguish glass damage, coating problems, retention, rattle and functional failures, then set mechanical design priorities.",
			],
			displayCompany: "Noon Home",
		},
		{
			id: "avegant-2015",
			roleIds: ["avegant-2015"],
			blurb: "",
			bullets: [
				"Owned Glyph's whole mechanical bill of materials through tooling, validation and production ramp, including roughly 40 tools.",
				"Owned Glyph headband test planning. Compared spring and liner variants, then tested assemblies with selected components removed to understand their contribution to fit and force.",
				"Owned cable-kinking and chassis-abrasion investigations in Glyph's telescoping arms. Evaluated cable variants, routing and support changes; released mechanical corrections and carried abrasion fixes into lifecycle and drop validation.",
			],
			displayCompany: "Avegant",
		},
		{
			id: "kaleidescape-2008",
			roleIds: ["kaleidescape-2008"],
			blurb: "",
			bullets: [
				"Owned Cinema One's mechanical design and BOM through production bring-up. Used plastic skins over sheet metal to achieve the intended aluminum-like appearance within cost, manufacturing, grounding and surface-temperature constraints.",
				"Wrote the KSYSTEM-120 mechanical first-article inspection procedure, defining when to correct tooling or process, change the design, and recheck parts and assemblies.",
				"Investigated M700 disc-handling problems through field records, returned hardware and dimensional inspection, connecting mechanism behavior to part geometry, molding and assembly.",
			],
			displayCompany: "Kaleidescape",
		},
		{
			id: "digidesign-2003",
			roleIds: ["digidesign-2003"],
			blurb: "",
			bullets: [
				"Owned C|24 mechanical engineering and industrial design, defining interfaces around 19 distinct PCB assembly designs and designing the field-replaceable headphone-jack assembly that shipped.",
				"Used supplier inspection data to determine which C|24 dimensions and tolerances mattered to fit and function. Wrote an acceptance deviation allowing specified molded parts to be used without rework.",
				"Led SC48 enclosure and thermal architecture, evaluating 4U, 3U and hybrid layouts against cooling, electromagnetic behavior, packaging and cost. The team selected 4U; structural work included a folded-sheet-metal I-beam under the no-extrusion constraint.",
			],
			displayCompany: "Digidesign Avid",
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
				company: "Earlier engineering and repair work",
				title: "",
				location: "Bay Area, CA",
				period: {
					precision: "year",
					start: "1986",
					end: "2003",
				},
			},
			blurb:
				"Worked through Mechanistic and frogdesign on complex surfaces, mechanical packaging and manufacturing support. At Silicon Graphics, worked on workstation mechanical and thermal development and managed the Product Design lab. At EP Technologies, progressed from electronics assembly and troubleshooting into production supervision.\n\nRan an automotive repair shop alongside design work, bringing practical diagnosis and service experience to product engineering.",
			bullets: [],
			displayCompany: "Earlier engineering and repair work",
		},
	] as ResumePresentation[],
	education: [
		{
			school: "De Anza College",
			degree: "Completed the two-year Automotive Technology program, specializing in engine controls and drivability diagnostics.",
			details: "",
		},
	],
	recognition: [],
	pdf: {
		url: "https://assets.eriknorris.com/resume/Erik_Norris_Resume_Current.pdf",
		filename: "Erik_Norris_Resume_Current.pdf",
	},
	career: careerChronology.roles as CareerRole[],
};
