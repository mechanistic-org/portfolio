import type { ProjectPresentation } from "../utils/projectPresentation";

/** #222 approved five-page trial plus #223 reviewed eight-page rollout; content stays canon-owned. */
export const projectArticleTrial = {
	c24: {
		sections: {
			summary: "i-project-summary",
			product: "ii-the-product-that-shipped",
			failures: "iii-design-and-production",
			thermal: "1-paint-curing-and-side-cap-fit",
			"supply-chain": "2-recovering-top-panel-fabrication",
			architecture: "3-a-quiet-low-profile-console",
			serviceability: "4-a-field-replaceable-headphone-jack",
			integration: "5-board-to-mechanical-interfaces",
			regulatory: "6-power-supply-certification",
			components: "7-controls-and-molded-part-geometry",
			governance: "iv-production-acceptance-and-release",
			impact: "v-results",
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
			"forensic-1-1": {
				galleryId: "04_structural_components",
				src: "/assets/r2/c24/bubbles/04_structural_components/forensic-1-1.jpg",
			},
			ECO_12262_Page_1: {
				galleryId: "05_paper_trail",
				src: "/assets/r2/c24/bubbles/05_paper_trail/ECO_12262_Page_1.png",
			},
			"dims-before-after-paint": {
				galleryId: "02_side_cap_crisis",
				src: "/assets/r2/c24/bubbles/02_side_cap_crisis/step-04-validation-report.png",
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
		models: ["3d_model"],
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
				eyebrow: "Engineering Decisions",
				title: "Design and Production",
				left: {
					kind: "scar-index",
				},
				media: ["step-01-defect-gap", "step-03-method-a-fix"],
				mediaLabel: "From defect to controlled intervention",
			},
			{
				key: "thermal",
				parent: "failures",
				eyebrow: "Decision 01",
				title: "Paint Curing and Side-Cap Fit",
				left: {
					kind: "scar",
					section: "thermal",
				},
				media: ["step-01-defect-gap", "step-04-validation-report"],
				mediaLabel: "Warp photograph and paint-process inspection table",
			},
			{
				key: "supply-chain",
				parent: "failures",
				eyebrow: "Decision 02",
				title: "Top-Panel Fabrication",
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
				eyebrow: "Decision 03",
				title: "Quiet, Low-Profile Architecture",
				left: {
					kind: "scar",
					section: "architecture",
				},
				media: ["c24-render-01", "c24-render-02"],
				mediaLabel: "The low-profile system and external-supply architecture",
			},
			{
				key: "serviceability",
				parent: "failures",
				eyebrow: "Decision 04",
				title: "Field-Replaceable Headphone Jack",
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
				eyebrow: "Decision 05",
				title: "Board-to-Mechanical Interfaces",
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
				eyebrow: "Decision 06",
				title: "Power-Supply Certification",
				left: {
					kind: "scar",
					section: "regulatory",
				},
				media: ["c24-render-02", "c24-prototype-03"],
				mediaLabel: "The console and its mechanical enclosure",
			},
			{
				key: "components",
				parent: "failures",
				eyebrow: "Decision 07",
				title: "Controls and Molded-Part Geometry",
				left: {
					kind: "scar",
					section: "components",
				},
				media: ["bournsem14page3", "forensic-1-1"],
				mediaLabel: "Commodity components, custom geometry",
			},
			{
				key: "governance",
				parent: "governance",
				eyebrow: "Control System",
				title: "Production Acceptance and Release",
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
				title: "Results",
				left: {
					kind: "metrics",
					keys: ["financial", "process", "governance"],
				},
				media: ["step-04-validation-report"],
				mediaLabel: "The original paint-process measurements",
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
				detail: "Twenty-four faders and the audio front end in one low-profile console.",
				layout: "system",
			},
			{
				media: "step-03-method-a-fix",
				section: "thermal",
				label: "The intervention",
				detail: "Vertical support reduced side-cap deformation during paint curing.",
				layout: "intervention",
			},
			{
				media: "DCD_9150-55200-00_REV_12_Page_1_REV-block",
				section: "integration",
				label: "The control record",
				detail: "Twelve drawing revisions control the MicPre8 board interfaces.",
				layout: "record",
			},
		],
		breakout: {
			eyebrow: "Breakout composition · system → intervention → record",
			description:
				"Prototype assemblies, supplier process photographs and released drawings show how the console took shape.",
		},
	},
	"d-command": {
		sections: {
			architecture: "a-compact-main-unit-with-room-to-expand",
			reuse: "reuse-changed-the-machining-and-the-interfaces",
			coating: "a-conductive-skin-that-still-let-the-buttons-move",
			thermal: "testing-the-fanless-arrangement",
			drawings: "drawings-were-an-integration-responsibility",
			handoff: "compliance-and-the-production-handoff",
			sources: "source-trail",
		},
		media: {
			product: { galleryId: "product", src: "/assets/d-command/bubbles/01_intro/D-CommandLarge.jpg" },
			layout: { galleryId: "layout", src: "/assets/d-command/bubbles/02_architecture/danko_main_withlabels.png" },
			assembly: { galleryId: "assembly", src: "/assets/d-command/full-pass-248/main-unit-open.webp" },
			masking: { galleryId: "masking", src: "/assets/d-command/full-pass-248/main-panel-masking.webp" },
		},
		scenes: [
			{ key: "architecture", eyebrow: "System", left: { kind: "context" }, media: ["product", "assembly"] },
			{ key: "reuse", eyebrow: "Interfaces", left: { kind: "none" }, media: ["layout"] },
			{ key: "coating", eyebrow: "Conductive plastic", left: { kind: "scar", section: "coating" }, media: ["masking"] },
			{ key: "thermal", eyebrow: "Airflow", left: { kind: "none" }, media: ["assembly"] },
			{ key: "drawings", eyebrow: "Release definition", left: { kind: "context" }, media: ["assembly"] },
			{ key: "handoff", eyebrow: "Production transfer", left: { kind: "metrics", keys: ["governance"] }, media: ["product"] },
			{ key: "sources", eyebrow: "Evidence", left: { kind: "sources" }, media: [] },
		],
		featured: [],
		breakout: { eyebrow: "D-Command architecture and interfaces", description: "The product configuration, early layout, main-unit assembly and retained masking detail. Captions identify each design stage and the limits of what the image establishes." },
	},
	sundance: {
		sections: {
			front: "a-front-that-had-to-open",
			isolation: "isolation-changed-the-drive-constraint",
			retention: "retention-and-connection-shared-a-tolerance-loop",
			fit: "toolability-and-assembled-fit",
			prototype: "making-the-prototype-build-assemble",
			outcome: "from-detailed-design-into-production",
			sources: "source-notes",
		},
		media: {
			"service-layout": { galleryId: "service-layout", src: "/assets/sundance/full-pass-245/front-service-schematic.svg" },
			"front-retention": { galleryId: "interface-analysis", src: "/assets/sundance/full-pass-245/front-retention.png" },
			"connector-section": { galleryId: "interface-analysis", src: "/assets/sundance/full-pass-245/connector-section.png" },
		},
		scenes: [
			{ key: "front", eyebrow: "System and service", left: { kind: "product" }, media: ["service-layout"], mediaLabel: "Requirements schematic" },
			{ key: "isolation", eyebrow: "Contact and constraint", left: { kind: "scar", section: "isolation" }, media: [] },
			{ key: "retention", eyebrow: "January review configuration", left: { kind: "none" }, media: ["front-retention", "connector-section"], mediaLabel: "Original analysis diagrams" },
			{ key: "fit", eyebrow: "Supplier fit", left: { kind: "none" }, media: [] },
			{ key: "prototype", eyebrow: "Build configuration", left: { kind: "none" }, media: [] },
			{ key: "outcome", eyebrow: "Production disposition", left: { kind: "metrics", keys: ["process", "governance"] }, media: [] },
			{ key: "sources", eyebrow: "Source context", left: { kind: "sources" }, media: [] },
		],
		breakout: { eyebrow: "Product context and interface analysis", description: "The selected product-family photograph, a requirements schematic and two original workbook diagrams, with their distinct roles and attribution retained." },
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
			architecture: "one-enclosure-a-high-reuse-architecture",
			thermal: "cooling-had-more-than-one-acceptance-condition",
			interfaces: "the-control-surface-was-a-mechanical-interface",
			plastics: "controls-plastics-and-access-developed-together",
			cost: "structure-and-the-cost-of-making-it",
			outcome: "what-the-work-delivered",
			sources: "source-notes",
		},
		media: {
			plan: { galleryId: "architecture", src: "/assets/sc48/full-pass-246/high-reuse-plan.webp" },
			duct: { galleryId: "airflow", src: "/assets/sc48/03-meltdown-mitigation/9440-58856-00.jpg" },
			keepout: { galleryId: "keepout", src: "/assets/sc48/full-pass-246/control-surface-keepout.webp" },
			dcd: { galleryId: "dcd", src: "/assets/sc48/full-pass-246/main-left-interface.webp" },
			frame: { galleryId: "frame", src: "/assets/sc48/01-brain-transplant/9420-58318-00.jpg" },
			cover: { galleryId: "plastics", src: "/assets/sc48/02-cosmetic-shell/9440-58842-00.jpg" },
			bolster: { galleryId: "plastics", src: "/assets/sc48/02-cosmetic-shell/9440-58843-00.jpg" },
		},
		scenes: [
			{ key: "architecture", eyebrow: "Early packaging plan", left: { kind: "context" }, media: ["plan"] },
			{ key: "thermal", eyebrow: "Configuration trials", left: { kind: "scar", section: "thermal" }, media: ["duct"] },
			{ key: "interfaces", eyebrow: "Mechanical and electrical interfaces", left: { kind: "metrics", keys: ["governance"] }, media: ["keepout", "dcd", "frame"] },
			{ key: "plastics", eyebrow: "Controls and outer geometry", left: { kind: "none" }, media: ["cover", "bolster"] },
			{ key: "cost", eyebrow: "Manufacturing definition", left: { kind: "metrics", keys: ["financial"] }, media: ["frame"] },
			{ key: "outcome", eyebrow: "Documented contribution", left: { kind: "none" }, media: [] },
			{ key: "sources", eyebrow: "Source context", left: { kind: "sources" }, media: [] },
		],
		featured: [],
		breakout: { eyebrow: "SC48 design and integration", description: "The early architecture, airflow duct, clearance overlay, board interface and selected component renders. Captions distinguish planning, revisions and part identity." },
	},
	"d-control": {
        sections: { architecture: "one-console-several-configurations", stand: "the-stand-began-with-feature-tradeoffs", assembly: "geometry-had-to-survive-assembly", recovery: "recovering-the-manufacturing-process", pcb: "prototype-board-containment", sustaining: "sustaining-work-after-launch", record: "what-the-record-establishes", sources: "source-trail" },
        media: {
            early: { galleryId: "early", src: "/assets/d-control/bubbles/02_early_id/PCll_Rendering.jpg" },
            stand: { galleryId: "stand", src: "/assets/d-control/full-pass-247/stand-and-module.webp" },
            main: { galleryId: "main", src: "/assets/d-control/full-pass-247/main-unit-assembly.webp" },
            gaps: { galleryId: "gaps", src: "/assets/d-control/bubbles/03_gap_check/gap differences.jpg" },
            molding: { galleryId: "molding", src: "/assets/d-control/bubbles/03_gap_check/moulding error.jpg" },
            fit: { galleryId: "fit", src: "/assets/d-control/bubbles/04_stand_fit_check/Picture 037.jpg" },
            installed: { galleryId: "installed", src: "/assets/d-control/bubbles/05_installations/D_Control_Music.jpg" },
        },
        scenes: [
            { key: "architecture", eyebrow: "System", left: { kind: "context" }, media: ["main"] },
            { key: "stand", eyebrow: "Design choices", left: { kind: "none" }, media: ["stand", "early"] },
            { key: "assembly", eyebrow: "Alignment", left: { kind: "none" }, media: ["gaps", "fit"] },
            { key: "recovery", eyebrow: "Manufacturing", left: { kind: "scar", section: "recovery" }, media: [] },
            { key: "pcb", parent: "recovery", eyebrow: "Containment", left: { kind: "scar", section: "pcb" }, media: [] },
            { key: "sustaining", eyebrow: "After launch", left: { kind: "none" }, media: ["molding", "fit"] },
            { key: "record", eyebrow: "Documented work", left: { kind: "context" }, media: ["installed"] },
            { key: "sources", eyebrow: "Evidence", left: { kind: "sources" }, media: [] },
        ],
        featured: [],
        breakout: { eyebrow: "D-Control design and production", description: "Early composition, assembly drawings, fit inspection and an installed system. Each image is captioned for the condition or design stage it documents." },
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
			product: "a-complete-system-in-a-compact-enclosure",
			builds: "making-physical-builds-useful",
			fit: "closing-the-base-to-cover-fit",
			glow: "the-glow-was-a-mechanical-and-optical-interface",
			factory: "defining-the-factorys-acceptance-criteria",
			outcome: "product-outcome",
			sources: "source-notes",
		},
		media: {
			"product-open": {
				galleryId: "mechanical-evidence",
				src: "/assets/ksystem-120/full-pass-244/product-open.webp",
			},
			"base-cover-stack": {
				galleryId: "mechanical-evidence",
				src: "/assets/ksystem-120/full-pass-244/base-cover-stack.webp",
			},
			"glow-comparison": {
				galleryId: "mechanical-evidence",
				src: "/assets/ksystem-120/full-pass-244/glow-comparison.webp",
			},
			"glow-section": {
				galleryId: "mechanical-evidence",
				src: "/assets/ksystem-120/full-pass-244/glow-section.webp",
			},
			"masked-panel": {
				galleryId: "shop-process",
				src: "/assets/ksystem-120/bubbles/01_hammered_lid/DSC05318.jpg",
			},
			"panel-fixture": {
				galleryId: "shop-process",
				src: "/assets/ksystem-120/bubbles/01_hammered_lid/DSC05404.jpg",
			},
		},
		scenes: [
			{
				key: "product",
				eyebrow: "System architecture",
				left: {
					kind: "context",
				},
				media: ["product-open"],
			},
			{
				key: "builds",
				eyebrow: "Build and service interfaces",
				left: {
					kind: "none",
				},
				media: ["product-open"],
			},
			{
				key: "fit",
				eyebrow: "Tolerance decisions",
				left: {
					kind: "none",
				},
				media: ["base-cover-stack"],
			},
			{
				key: "glow",
				eyebrow: "Optical packaging",
				left: {
					kind: "none",
				},
				media: ["glow-comparison", "glow-section"],
			},
			{
				key: "factory",
				eyebrow: "Inspection and process",
				left: {
					kind: "metrics",
					keys: ["process"],
				},
				media: ["masked-panel", "panel-fixture"],
			},
			{
				key: "outcome",
				eyebrow: "Commercial product",
				left: {
					kind: "context",
				},
				media: ["product-open"],
			},
			{
				key: "sources",
				eyebrow: "Source record",
				left: {
					kind: "sources",
				},
				media: [],
			},
		],
		breakout: {
			eyebrow: "Orpheus engineering record",
			description:
				"The product, interface studies and selected shop views. Captions distinguish design review, visual comparison and manufacturing context.",
		},
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
