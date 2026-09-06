import type { ProjectPresentation } from "../utils/projectPresentation";

/** #222 approved five-page trial plus #223 reviewed eight-page rollout; content stays canon-owned. */
export const projectArticleTrial = {
	c24: {
		sections: {
			summary: "i-project-summary",
			product: "ii-the-product-that-shipped",
			failures: "iii-the-anatomy-of-failure",
			thermal: "1-thermal-crisis-the-banana-defect",
			"supply-chain": "2-supply-chain-crisis-the-top-panel-no-bid-shock",
			architecture: "3-architecture-crisis-the-emithermal-rake",
			serviceability: "4-serviceability-crisis-the-headphone-jack-fire-drill",
			integration: "5-integration-crisis-the-geometric-firewall",
			regulatory: "6-regulatory-crisis-the-stranded-psu",
			components: "7-component--geometry-battles",
			governance: "iv-governance--rhythm",
			impact: "v-quantified-impact",
			context: "vi-market-context--legacy",
			sources: "vii-source-trail",
		},
		media: {
			"c24-render-01": {
				galleryId: "01_origin_story",
				src: "/assets/r2/c24/bubbles/01_origin_story/c24-render-01.png",
			},
			"c24-prototype-01": {
				galleryId: "01_origin_story",
				src: "/assets/r2/c24/bubbles/01_origin_story/c24-prototype-01-xl.webp",
			},
			"c24-render-02": {
				galleryId: "01_origin_story",
				src: "/assets/r2/c24/bubbles/01_origin_story/c24-render-02.png",
			},
			"c24-prototype-02": {
				galleryId: "01_origin_story",
				src: "/assets/r2/c24/bubbles/01_origin_story/c24-prototype-02-xl.webp",
			},
			"step-01-defect-gap": {
				galleryId: "02_side_cap_crisis",
				src: "/assets/r2/c24/bubbles/02_side_cap_crisis/step-01-defect-gap.jpg",
			},
			"step-03-method-a-fix": {
				galleryId: "02_side_cap_crisis",
				src: "/assets/r2/c24/bubbles/02_side_cap_crisis/step-03-method-a-fix.png",
			},
			"step-04-validation-report": {
				galleryId: "02_side_cap_crisis",
				src: "/assets/r2/c24/bubbles/02_side_cap_crisis/step-04-validation-report.png",
			},
			"metal-bends": {
				galleryId: "03_manufacturing_wins",
				src: "/assets/r2/c24/bubbles/03_manufacturing_wins/metal-bends.png",
			},
			"metal-bends_2": {
				galleryId: "03_manufacturing_wins",
				src: "/assets/r2/c24/bubbles/03_manufacturing_wins/metal-bends_2.png",
			},
			"eco-12993": {
				galleryId: "05_paper_trail",
				src: "/assets/r2/c24/05-paper-trail/eco-12993-xl.webp",
			},
			"DCD_9150-55200-00_REV_12_Page_1": {
				galleryId: "03_manufacturing_wins",
				src: "/assets/r2/c24/bubbles/03_manufacturing_wins/DCD_9150-55200-00_REV_12_Page_1.png",
			},
			"DCD_9150-55200-00_REV_12_Page_1_REV-block": {
				galleryId: "05_paper_trail",
				src: "/assets/r2/c24/bubbles/05_paper_trail/DCD_9150-55200-00_REV_12_Page_1_REV-block.png",
			},
			"c24-prototype-03": {
				galleryId: "01_origin_story",
				src: "/assets/r2/c24/bubbles/01_origin_story/c24-prototype-03-xl.webp",
			},
			bournsem14page3: {
				galleryId: "04_structural_components",
				src: "/assets/r2/c24/bubbles/04_structural_components/bournsem14page3.png",
			},
			"9440-55174-00": {
				galleryId: "04_structural_components",
				src: "/assets/r2/c24/bubbles/04_structural_components/9440-55174-00.png",
			},
			ECO_12262_Page_1: {
				galleryId: "05_paper_trail",
				src: "/assets/r2/c24/bubbles/05_paper_trail/ECO_12262_Page_1.png",
			},
			"dims-before-after-paint": {
				galleryId: "02_side_cap_crisis",
				src: "/assets/r2/c24/02-side-cap-crisis/dims-before-after-paint-xl.webp",
			},
			"c24-context-01": {
				galleryId: "06_press_resources",
				src: "/assets/r2/c24/bubbles/06_press_resources/c24-context-01.jpg",
			},
			"c24-render-07": {
				galleryId: "06_press_resources",
				src: "/assets/r2/c24/bubbles/06_press_resources/c24-render-07.png",
			},
			ECO_12263_Page_1: {
				galleryId: "05_paper_trail",
				src: "/assets/r2/c24/bubbles/05_paper_trail/ECO_12263_Page_1.png",
			},
			ECO_12263_Page_2: {
				galleryId: "05_paper_trail",
				src: "/assets/r2/c24/bubbles/05_paper_trail/ECO_12263_Page_2.png",
			},
		},
		scenes: [
			{
				key: "summary",
				parent: "summary",
				eyebrow: "Orientation",
				title: "Project Summary",
				left: {
					kind: "metrics",
					keys: ["financial", "process", "governance"],
				},
				media: ["c24-render-01", "c24-prototype-01"],
				mediaLabel: "Form, mandate, and starting point",
			},
			{
				key: "product",
				parent: "product",
				eyebrow: "Product",
				title: "The Product That Shipped",
				left: {
					kind: "product",
				},
				media: ["c24-render-02", "c24-prototype-02"],
				mediaLabel: "The shipped system and its physical vocabulary",
			},
			{
				key: "failures",
				parent: "failures",
				eyebrow: "Failure Map",
				title: "The Anatomy of Failure",
				left: {
					kind: "scar-index",
				},
				media: ["step-01-defect-gap", "step-03-method-a-fix"],
				mediaLabel: "From defect to controlled intervention",
			},
			{
				key: "thermal",
				parent: "failures",
				eyebrow: "Scar 01",
				title: "Thermal Crisis",
				left: {
					kind: "scar",
					section: "thermal",
				},
				media: ["step-01-defect-gap", "step-04-validation-report"],
				mediaLabel: "Warp evidence and validation record",
			},
			{
				key: "supply-chain",
				parent: "failures",
				eyebrow: "Scar 02",
				title: "Supply-Chain Crisis",
				left: {
					kind: "scar",
					section: "supply-chain",
				},
				media: ["metal-bends", "metal-bends_2"],
				mediaLabel: "Fabrication evidence from the recovery path",
			},
			{
				key: "architecture",
				parent: "failures",
				eyebrow: "Scar 03",
				title: "Architecture Crisis",
				left: {
					kind: "scar",
					section: "architecture",
				},
				media: ["c24-render-01", "c24-render-02"],
				mediaLabel: "System form after the architecture reset",
			},
			{
				key: "serviceability",
				parent: "failures",
				eyebrow: "Scar 04",
				title: "Serviceability Crisis",
				left: {
					kind: "scar",
					section: "serviceability",
				},
				media: ["eco-12993"],
				mediaLabel: "The change record behind the field repair",
			},
			{
				key: "integration",
				parent: "failures",
				eyebrow: "Scar 05",
				title: "Integration Crisis",
				left: {
					kind: "scar",
					section: "integration",
				},
				media: ["DCD_9150-55200-00_REV_12_Page_1", "DCD_9150-55200-00_REV_12_Page_1_REV-block"],
				mediaLabel: "The DCD as geometric contract",
			},
			{
				key: "regulatory",
				parent: "failures",
				eyebrow: "Scar 06",
				title: "Regulatory Crisis",
				left: {
					kind: "scar",
					section: "regulatory",
				},
				media: ["c24-render-02", "c24-prototype-03"],
				mediaLabel: "Product context; certification imagery remains an archive gap",
			},
			{
				key: "components",
				parent: "failures",
				eyebrow: "Scar 07",
				title: "Component & Geometry Battles",
				left: {
					kind: "scar",
					section: "components",
				},
				media: ["bournsem14page3", "9440-55174-00"],
				mediaLabel: "Commodity components, custom geometry",
			},
			{
				key: "governance",
				parent: "governance",
				eyebrow: "Control System",
				title: "Governance & Rhythm",
				left: {
					kind: "metrics",
					keys: ["governance"],
				},
				media: ["DCD_9150-55200-00_REV_12_Page_1_REV-block", "ECO_12262_Page_1"],
				mediaLabel: "Release discipline made visible",
				portalStudy: true,
			},
			{
				key: "impact",
				parent: "impact",
				eyebrow: "Outcomes",
				title: "Quantified Impact",
				left: {
					kind: "metrics",
					keys: ["financial", "process", "governance"],
				},
				media: ["dims-before-after-paint", "step-04-validation-report"],
				mediaLabel: "A measured correction, not a cosmetic anecdote",
			},
			{
				key: "context",
				parent: "context",
				eyebrow: "Afterlife",
				title: "Market Context & Legacy",
				left: {
					kind: "context",
				},
				media: ["c24-context-01", "c24-render-07"],
				mediaLabel: "The product in its market context",
			},
			{
				key: "sources",
				parent: "sources",
				eyebrow: "Receipts",
				title: "Source Trail",
				left: {
					kind: "sources",
				},
				media: ["ECO_12263_Page_1", "ECO_12263_Page_2"],
				mediaLabel: "Primary records behind the narrative",
			},
		],
		featured: [
			{
				hero: true,
				section: "product",
				label: "The system",
				detail: "43 inches of controls, reduced to one integrated architecture.",
				layout: "system",
			},
			{
				media: "step-03-method-a-fix",
				section: "thermal",
				label: "The intervention",
				detail: "A process fixture turns gravity from failure mode into corrective force.",
				layout: "intervention",
			},
			{
				media: "DCD_9150-55200-00_REV_12_Page_1_REV-block",
				section: "integration",
				label: "The control record",
				detail: "Revision discipline becomes the geometric contract for nineteen boards.",
				layout: "record",
			},
		],
		breakout: {
			eyebrow: "Breakout composition · system → intervention → record",
			description:
				"The article establishes the argument. This field opens the archive: product form, physical failure, and the drawings that controlled the recovery at their own scale.",
		},
	},
	"d-command": {
		sections: {
			summary: "project-summary",
			failures: "the-anatomy-of-failure",
			thermal: "vegas-mode-thermal-stress",
			quality: "fader-pan-yield-and-green-light-bleed",
			enclosure: "plastic-enclosure-and-emi-closure",
			compliance: "ac-withdraw-compliance",
			governance: "governance-and-evidence",
			impact: "quantified-impact",
			sources: "source-trail",
		},
		media: {
			"summary-1": {
				galleryId: "01_intro",
				src: "/assets/d-command/bubbles/01_intro/Control room 3.JPG",
			},
			"summary-2": {
				galleryId: "01_intro",
				src: "/assets/d-command/bubbles/01_intro/D-CommandLarge.jpg",
			},
			"enclosure-1": {
				galleryId: "02_architecture",
				src: "/assets/d-command/bubbles/02_architecture/D-Command_fader_top.jpg",
			},
			"enclosure-2": {
				galleryId: "02_architecture",
				src: "/assets/d-command/bubbles/02_architecture/danko_fader_withlabels.png",
			},
			"compliance-1": {
				galleryId: "03_regulatory",
				src: "/assets/d-command/bubbles/03_regulatory/DSC03110.JPG",
			},
			"compliance-2": {
				galleryId: "03_regulatory",
				src: "/assets/d-command/bubbles/03_regulatory/DSC03112.JPG",
			},
			"quality-1": {
				galleryId: "04_quality",
				src: "/assets/d-command/bubbles/04_quality/DSC03122.JPG",
			},
			"quality-2": {
				galleryId: "04_quality",
				src: "/assets/d-command/bubbles/04_quality/DSC03123.JPG",
			},
		},
		scenes: [
			{
				key: "summary",
				eyebrow: "Orientation",
				left: {
					kind: "metrics",
					keys: ["financial", "process", "governance"],
				},
				media: ["summary-1", "summary-2"],
				mediaLabel: "Intro",
			},
			{
				key: "failures",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: [],
			},
			{
				key: "thermal",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: [],
			},
			{
				key: "quality",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: ["quality-1", "quality-2"],
				mediaLabel: "Quality",
			},
			{
				key: "enclosure",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: ["enclosure-1", "enclosure-2"],
				mediaLabel: "Architecture",
			},
			{
				key: "compliance",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: ["compliance-1", "compliance-2"],
				mediaLabel: "Regulatory",
			},
			{
				key: "governance",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: [],
			},
			{
				key: "impact",
				eyebrow: "Project context",
				left: {
					kind: "metrics",
					keys: ["financial", "process", "governance"],
				},
				media: [],
			},
			{
				key: "sources",
				eyebrow: "Sources",
				left: {
					kind: "sources",
				},
				media: [],
			},
		],
	},
	sundance: {
		sections: {
			summary: "project-summary",
			rail: "the-rail-was-the-project",
			tooling: "tooling-exposed-the-commitment",
			mechanism: "from-contact-risk-to-a-defined-mechanism",
			boundaries: "evidence-boundaries",
			impact: "quantified-impact",
			sources: "source-trail",
		},
		media: {},
		scenes: [
			{
				key: "summary",
				eyebrow: "Orientation",
				left: {
					kind: "metrics",
					keys: ["financial", "process", "governance"],
				},
				media: [],
			},
			{
				key: "rail",
				eyebrow: "Project context",
				left: {
					kind: "scar",
					section: "rail",
				},
				media: [],
			},
			{
				key: "tooling",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: [],
			},
			{
				key: "mechanism",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: [],
			},
			{
				key: "boundaries",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: [],
			},
			{
				key: "impact",
				eyebrow: "Project context",
				left: {
					kind: "metrics",
					keys: ["financial", "process", "governance"],
				},
				media: [],
			},
			{
				key: "sources",
				eyebrow: "Sources",
				left: {
					kind: "sources",
				},
				media: [],
			},
		],
	},
	"room-director": {
		sections: {
			summary: "project-summary",
			specification: "the-specification-described-a-surface-not-just-a-box",
			evt1: "one-protocol-many-failure-modes",
			evt2: "the-second-packet-did-not-earn-a-victory-lap",
			chemical: "chemical-resistance-was-a-different-result",
			boundaries: "evidence-boundaries",
			impact: "quantified-impact",
			sources: "source-trail",
		},
		media: {},
		scenes: [
			{
				key: "summary",
				eyebrow: "Orientation",
				left: {
					kind: "metrics",
					keys: ["financial", "process", "governance"],
				},
				media: [],
			},
			{
				key: "specification",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: [],
			},
			{
				key: "evt1",
				eyebrow: "Project context",
				left: {
					kind: "scar",
					section: "evt1",
				},
				media: [],
			},
			{
				key: "evt2",
				eyebrow: "Project context",
				left: {
					kind: "scar",
					section: "evt2",
				},
				media: [],
			},
			{
				key: "chemical",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: [],
			},
			{
				key: "boundaries",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: [],
			},
			{
				key: "impact",
				eyebrow: "Project context",
				left: {
					kind: "metrics",
					keys: ["financial", "process", "governance"],
				},
				media: [],
			},
			{
				key: "sources",
				eyebrow: "Sources",
				left: {
					kind: "sources",
				},
				media: [],
			},
		],
	},
	"webtv-elmer": {
		sections: {
			summary: "project-summary",
			reuse: "reuse-was-a-constraint-not-a-shortcut",
			interfaces: "the-mechanical-worksheet-became-the-interface-map",
			geometry: "the-artifacts-verify-authored-geometry",
			boundaries: "identity-and-evidence-boundaries",
			impact: "quantified-impact",
			sources: "source-trail",
		},
		media: {},
		scenes: [
			{
				key: "summary",
				eyebrow: "Orientation",
				left: {
					kind: "metrics",
					keys: ["financial", "process", "governance"],
				},
				media: [],
			},
			{
				key: "reuse",
				eyebrow: "Project context",
				left: {
					kind: "scar",
					section: "reuse",
				},
				media: [],
			},
			{
				key: "interfaces",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: [],
			},
			{
				key: "geometry",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: [],
			},
			{
				key: "boundaries",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: [],
			},
			{
				key: "impact",
				eyebrow: "Project context",
				left: {
					kind: "metrics",
					keys: ["financial", "process", "governance"],
				},
				media: [],
			},
			{
				key: "sources",
				eyebrow: "Sources",
				left: {
					kind: "sources",
				},
				media: [],
			},
		],
	},
	sc48: {
		sections: {
			summary: "project-summary",
			failures: "the-anatomy-of-failure",
			thermal: "thermal-crisis-the-75c-kill-event",
			structure: "structural-crisis-the-no-extrusion-mandate",
			computer: "embedded-computer-integration",
			tooling: "cosmetic-shell-and-tooling",
			governance: "governance-and-evidence",
			impact: "quantified-impact",
			sources: "source-trail",
		},
		media: {
			"computer-frame": {
				galleryId: "01_brain_transplant",
				src: "/assets/sc48/01-brain-transplant/9420-58318-00.jpg",
			},
			"side-cover": {
				galleryId: "02_cosmetic_shell",
				src: "/assets/sc48/02-cosmetic-shell/9440-58842-00.jpg",
			},
			"front-bolster": {
				galleryId: "02_cosmetic_shell",
				src: "/assets/sc48/02-cosmetic-shell/9440-58843-00.jpg",
			},
			"fan-duct": {
				galleryId: "03_meltdown_mitigation",
				src: "/assets/sc48/03-meltdown-mitigation/9440-58856-00.jpg",
			},
		},
		galleryCaptionsFromDeck: ["01_brain_transplant", "02_cosmetic_shell", "03_meltdown_mitigation"],
		scenes: [
			{
				key: "summary",
				eyebrow: "Orientation",
				left: {
					kind: "metrics",
					keys: ["financial", "process", "governance"],
				},
				media: [],
			},
			{
				key: "failures",
				eyebrow: "Project context",
				left: {
					kind: "scar-index",
				},
				media: [],
			},
			{
				key: "thermal",
				parent: "failures",
				eyebrow: "Project context",
				left: {
					kind: "scar",
					section: "thermal",
				},
				media: ["fan-duct"],
			},
			{
				key: "structure",
				parent: "failures",
				eyebrow: "Project context",
				left: {
					kind: "scar",
					section: "structure",
				},
				media: [],
			},
			{
				key: "computer",
				parent: "failures",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: ["computer-frame"],
			},
			{
				key: "tooling",
				parent: "failures",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: ["side-cover", "front-bolster"],
			},
			{
				key: "governance",
				eyebrow: "Project context",
				left: {
					kind: "metrics",
					keys: ["governance"],
				},
				media: [],
			},
			{
				key: "impact",
				eyebrow: "Project context",
				left: {
					kind: "metrics",
					keys: ["financial", "process", "governance"],
				},
				media: [],
			},
			{
				key: "sources",
				eyebrow: "Sources",
				left: {
					kind: "sources",
				},
				media: [],
			},
		],
	},
	"d-control": {
		sections: {
			summary: "project-summary",
			failures: "the-anatomy-of-failure",
			"fader-pan": "fader-pan-crisis-more-than-half-rejected",
			stand: "stand-fit-holes-bosses-and-side-plates",
			assembly: "five-module-tolerance-and-assembly",
			pcb: "prototype-pcb-crisis-v-2-containment",
			campaign: "the-25-week-campaign",
			governance: "governance-and-evidence",
			impact: "quantified-impact",
			sources: "source-trail",
		},
		media: {
			"system-view": {
				galleryId: "01_intro",
				src: "/assets/d-control/bubbles/01_intro/full_big.jpg",
			},
			"stand-fit-front": {
				galleryId: "04_stand_fit_check",
				src: "/assets/d-control/bubbles/04_stand_fit_check/Picture 037.jpg",
			},
			"stand-fit-detail": {
				galleryId: "04_stand_fit_check",
				src: "/assets/d-control/bubbles/04_stand_fit_check/Picture 038.jpg",
			},
			"panel-gap": {
				galleryId: "03_gap_check",
				src: "/assets/d-control/bubbles/03_gap_check/gap differences.jpg",
			},
			"molded-interface": {
				galleryId: "03_gap_check",
				src: "/assets/d-control/bubbles/03_gap_check/moulding error.jpg",
			},
			"installed-system": {
				galleryId: "05_installations",
				src: "/assets/d-control/bubbles/05_installations/D_Control_Music.jpg",
			},
		},
		scenes: [
			{
				key: "summary",
				eyebrow: "Orientation",
				left: {
					kind: "metrics",
					keys: ["financial", "process", "governance"],
				},
				media: ["system-view"],
			},
			{
				key: "failures",
				eyebrow: "Project context",
				left: {
					kind: "scar-index",
				},
				media: [],
			},
			{
				key: "fader-pan",
				parent: "failures",
				eyebrow: "Project context",
				left: {
					kind: "scar",
					section: "fader-pan",
				},
				media: [],
			},
			{
				key: "stand",
				parent: "failures",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: ["stand-fit-front", "stand-fit-detail"],
			},
			{
				key: "assembly",
				parent: "failures",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: ["panel-gap", "molded-interface"],
			},
			{
				key: "pcb",
				parent: "failures",
				eyebrow: "Project context",
				left: {
					kind: "scar",
					section: "pcb",
				},
				media: [],
			},
			{
				key: "campaign",
				parent: "failures",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: [],
			},
			{
				key: "governance",
				eyebrow: "Project context",
				left: {
					kind: "metrics",
					keys: ["governance"],
				},
				media: [],
			},
			{
				key: "impact",
				eyebrow: "Project context",
				left: {
					kind: "metrics",
					keys: ["financial", "process", "governance"],
				},
				media: ["installed-system"],
			},
			{
				key: "sources",
				eyebrow: "Sources",
				left: {
					kind: "sources",
				},
				media: [],
			},
		],
	},
	bazooka: {
		sections: {
			summary: "project-summary",
			failures: "the-anatomy-of-failure",
			removal: "removal-crisis-fourteen-for-fourteen",
			requirements: "requirement-lineage-650-w-to-850-w",
			emi: "compliance-crisis-emi-pretest",
			finish: "finish-and-tolerance-record",
			production: "production-schedule-not-production-result",
			governance: "governance-and-evidence",
			impact: "quantified-impact",
			sources: "source-trail",
		},
		media: {
			"click-setup": {
				galleryId: "03_base_click_testing_1",
				src: "/assets/bazooka/03-base-click-testing-1/IMG_20170419_135338-lg.webp",
			},
			"pull-setup": {
				galleryId: "03_base_pull_testing_1",
				src: "/assets/bazooka/03-base-pull-testing-1/IMG_20170420_172124-lg.webp",
			},
			"pull-handling": {
				galleryId: "03_base_pull_testing_1",
				src: "/assets/bazooka/03-base-pull-testing-1/IMG_20170420_172208-lg.webp",
			},
			"button-front": {
				galleryId: "03_base_test_btn_1",
				src: "/assets/bazooka/03-base-test-btn-1/IMG_20170830_103733-xl.webp",
			},
			"button-detail": {
				galleryId: "03_base_test_btn_1",
				src: "/assets/bazooka/03-base-test-btn-1/IMG_20170830_103738-xl.webp",
			},
			"later-evaluation": {
				galleryId: "03_base_test_btn_2",
				src: "/assets/bazooka/03-base-test-btn-2/IMG_20170904_151956-xl.webp",
			},
		},
		scenes: [
			{
				key: "summary",
				eyebrow: "Orientation",
				left: {
					kind: "metrics",
					keys: ["financial", "process", "governance"],
				},
				media: ["click-setup"],
			},
			{
				key: "failures",
				eyebrow: "Project context",
				left: {
					kind: "scar-index",
				},
				media: [],
			},
			{
				key: "removal",
				parent: "failures",
				eyebrow: "Project context",
				left: {
					kind: "scar",
					section: "removal",
				},
				media: ["pull-setup", "pull-handling"],
			},
			{
				key: "requirements",
				parent: "failures",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: ["button-front", "button-detail"],
			},
			{
				key: "emi",
				parent: "failures",
				eyebrow: "Project context",
				left: {
					kind: "scar",
					section: "emi",
				},
				media: [],
			},
			{
				key: "finish",
				parent: "failures",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: [],
			},
			{
				key: "production",
				parent: "failures",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: ["later-evaluation"],
			},
			{
				key: "governance",
				eyebrow: "Project context",
				left: {
					kind: "metrics",
					keys: ["governance"],
				},
				media: [],
			},
			{
				key: "impact",
				eyebrow: "Project context",
				left: {
					kind: "metrics",
					keys: ["financial", "process", "governance"],
				},
				media: [],
			},
			{
				key: "sources",
				eyebrow: "Sources",
				left: {
					kind: "sources",
				},
				media: [],
			},
		],
	},
	"webtv-galaxy": {
		sections: {
			summary: "project-summary",
			thermal: "thermal-model",
			cpu: "cpu-assembly-and-emi-direction",
			chassis: "chassis-and-manufacturability",
			governance: "governance-and-evidence",
			boundaries: "program-outcome-and-xbox-boundary",
			impact: "quantified-evidence",
			sources: "source-trail",
		},
		media: {
			"planned-form": {
				galleryId: "01_early_id",
				src: "/assets/webtv-galaxy/bubbles/01_early_id/galaxy3.jpg",
			},
			"thermal-model": {
				galleryId: "03_thermal",
				src: "/assets/webtv-galaxy/bubbles/03_thermal/model-iso.jpg",
			},
			"temperature-model": {
				galleryId: "03_thermal",
				src: "/assets/webtv-galaxy/bubbles/03_thermal/tempxz.jpg",
			},
			"cpu-assembly": {
				galleryId: "03_cpu",
				src: "/assets/webtv-galaxy/bubbles/03_cpu/Assembly 1.png",
			},
			"cpu-package": {
				galleryId: "03_cpu",
				src: "/assets/webtv-galaxy/bubbles/03_cpu/galaxy_CPU.png",
			},
			"base-deviations": {
				galleryId: "03_metal",
				src: "/assets/webtv-galaxy/bubbles/03_metal/Base_Proto_Deviations.jpg",
			},
			"forming-detail": {
				galleryId: "03_metal",
				src: "/assets/webtv-galaxy/bubbles/03_metal/DIMPLE_FORM.png",
			},
		},
		scenes: [
			{
				key: "summary",
				eyebrow: "Orientation",
				left: {
					kind: "metrics",
					keys: ["financial", "process", "governance"],
				},
				media: ["planned-form"],
			},
			{
				key: "thermal",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: ["thermal-model", "temperature-model"],
			},
			{
				key: "cpu",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: ["cpu-assembly", "cpu-package"],
			},
			{
				key: "chassis",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: ["base-deviations", "forming-detail"],
			},
			{
				key: "governance",
				eyebrow: "Project context",
				left: {
					kind: "metrics",
					keys: ["governance"],
				},
				media: [],
			},
			{
				key: "boundaries",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: [],
			},
			{
				key: "impact",
				eyebrow: "Project context",
				left: {
					kind: "metrics",
					keys: ["financial", "process", "governance"],
				},
				media: [],
			},
			{
				key: "sources",
				eyebrow: "Sources",
				left: {
					kind: "sources",
				},
				media: [],
			},
		],
	},
	"webtv-cortez": {
		models: ["3d_model"],
		sections: {
			summary: "project-summary",
			surfaces: "surface-development",
			keys: "key-layout-and-tooling-estimate",
			schedule: "schedule-and-billing",
			governance: "governance-and-evidence",
			boundaries: "outcome-and-project-boundary",
			impact: "quantified-evidence",
			sources: "source-trail",
		},
		media: {
			"functional-model": {
				galleryId: "03_functional_model",
				src: "/assets/webtv-cortez/bubbles/03_functional_model/cortez3.jpg",
			},
			"rear-surface": {
				galleryId: "01_early_id",
				src: "/assets/webtv-cortez/bubbles/01_early_id/back.jpg",
			},
			"front-surface": {
				galleryId: "01_early_id",
				src: "/assets/webtv-cortez/bubbles/01_early_id/front.jpg",
			},
			keycap: {
				galleryId: "04_keycaps",
				src: "/assets/webtv-cortez/bubbles/04_keycaps/cap1x1.png",
			},
			"key-legend": {
				galleryId: "04_keycaps",
				src: "/assets/webtv-cortez/bubbles/04_keycaps/keylegend.png",
			},
		},
		scenes: [
			{
				key: "summary",
				eyebrow: "Orientation",
				left: {
					kind: "metrics",
					keys: ["financial", "process", "governance"],
				},
				media: ["functional-model"],
			},
			{
				key: "surfaces",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: ["rear-surface", "front-surface"],
			},
			{
				key: "keys",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: ["keycap", "key-legend"],
			},
			{
				key: "schedule",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: [],
			},
			{
				key: "governance",
				eyebrow: "Project context",
				left: {
					kind: "metrics",
					keys: ["governance"],
				},
				media: [],
			},
			{
				key: "boundaries",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: [],
			},
			{
				key: "impact",
				eyebrow: "Project context",
				left: {
					kind: "metrics",
					keys: ["financial", "process", "governance"],
				},
				media: [],
			},
			{
				key: "sources",
				eyebrow: "Sources",
				left: {
					kind: "sources",
				},
				media: [],
			},
		],
	},
	backsplash: {
		sections: {
			summary: "project-summary",
			enclosure: "enclosure-and-interface-specification",
			display: "display-mechanical-control",
			build: "control-and-build-context",
			environment: "environmental-and-cooling-boundary",
			boundaries: "system-result-boundary",
			governance: "governance-and-custody",
			impact: "quantified-evidence",
			sources: "source-trail",
		},
		media: {
			"build-context": {
				galleryId: "01_misc",
				src: "/assets/backsplash/bubbles/01_misc/IMG_0237_60.png",
			},
			"internal-hardware": {
				galleryId: "01_misc",
				src: "/assets/backsplash/bubbles/01_misc/PXL_20211028_190650248_60.png",
			},
		},
		scenes: [
			{
				key: "summary",
				eyebrow: "Orientation",
				left: {
					kind: "metrics",
					keys: ["financial", "process", "governance"],
				},
				media: [],
			},
			{
				key: "enclosure",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: [],
			},
			{
				key: "display",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: [],
			},
			{
				key: "build",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: ["build-context", "internal-hardware"],
			},
			{
				key: "environment",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: [],
			},
			{
				key: "boundaries",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: [],
			},
			{
				key: "governance",
				eyebrow: "Project context",
				left: {
					kind: "metrics",
					keys: ["governance"],
				},
				media: [],
			},
			{
				key: "impact",
				eyebrow: "Project context",
				left: {
					kind: "metrics",
					keys: ["financial", "process", "governance"],
				},
				media: [],
			},
			{
				key: "sources",
				eyebrow: "Sources",
				left: {
					kind: "sources",
				},
				media: [],
			},
		],
	},
	"ksystem-120": {
		sections: {
			summary: "project-summary",
			identity: "product-and-archive-identity",
			integration: "mechanical-integration",
			glow: "glow-evidence-boundary",
			manufacturing: "first-article-and-manufacturing-state",
			boundaries: "compliance-and-outcome-boundary",
			partition: "cross-program-partition",
			impact: "quantified-evidence",
			sources: "source-trail",
		},
		media: {
			"chassis-fit": {
				galleryId: "01_hammered_lid",
				src: "/assets/ksystem-120/bubbles/01_hammered_lid/DSC05318.jpg",
			},
			"assembly-detail": {
				galleryId: "01_hammered_lid",
				src: "/assets/ksystem-120/bubbles/01_hammered_lid/DSC05377.jpg",
			},
		},
		scenes: [
			{
				key: "summary",
				eyebrow: "Orientation",
				left: {
					kind: "metrics",
					keys: ["financial", "process", "governance"],
				},
				media: [],
			},
			{
				key: "identity",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: [],
			},
			{
				key: "integration",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: ["chassis-fit", "assembly-detail"],
			},
			{
				key: "glow",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: [],
			},
			{
				key: "manufacturing",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: [],
			},
			{
				key: "boundaries",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: [],
			},
			{
				key: "partition",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: [],
			},
			{
				key: "impact",
				eyebrow: "Project context",
				left: {
					kind: "metrics",
					keys: ["financial", "process", "governance"],
				},
				media: [],
			},
			{
				key: "sources",
				eyebrow: "Sources",
				left: {
					kind: "sources",
				},
				media: [],
			},
		],
	},
	"wall-plates": {
		sections: {
			summary: "project-summary",
			interfaces: "the-visible-surface-hid-three-interfaces",
			perimeter: "perimeter-clearance-was-positive-with-limits",
			engagement: "clearance-is-not-engagement",
			retention: "the-inner-interface-was-a-second-system",
			boundaries: "authorship-and-evidence-boundaries",
			impact: "quantified-impact",
			sources: "source-trail",
		},
		media: {},
		scenes: [
			{
				key: "summary",
				eyebrow: "Orientation",
				left: {
					kind: "metrics",
					keys: ["financial", "process", "governance"],
				},
				media: [],
			},
			{
				key: "interfaces",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: [],
			},
			{
				key: "perimeter",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: [],
			},
			{
				key: "engagement",
				eyebrow: "Project context",
				left: {
					kind: "scar",
					section: "engagement",
				},
				media: [],
			},
			{
				key: "retention",
				eyebrow: "Project context",
				left: {
					kind: "scar",
					section: "retention",
				},
				media: [],
			},
			{
				key: "boundaries",
				eyebrow: "Project context",
				left: {
					kind: "none",
				},
				media: [],
			},
			{
				key: "impact",
				eyebrow: "Project context",
				left: {
					kind: "metrics",
					keys: ["financial", "process", "governance"],
				},
				media: [],
			},
			{
				key: "sources",
				eyebrow: "Sources",
				left: {
					kind: "sources",
				},
				media: [],
			},
		],
	},
} satisfies Record<string, ProjectPresentation>;

export const trialSlugs = Object.keys(projectArticleTrial);
// Projection of the operator-ratified identities in canon's deep_dive_roster.json.
// Keep legacy routes intact; the ribbon navigates to distinct canonical projects.
export const careerIdentityAliases: Readonly<Record<string, string>> = {
	zeus: "webtv-elmer",
	switches: "extension-switches",
};
export function trialPresentation(slug: string): ProjectPresentation | undefined {
	return Object.hasOwn(projectArticleTrial, slug)
		? projectArticleTrial[slug as keyof typeof projectArticleTrial]
		: undefined;
}
