/**
 * C24 continuity-rail prototype.
 *
 * This is intentionally presentation-owned R1 configuration. It points at
 * existing generated article anchors and canon-projected asset IDs; it does
 * not introduce a content contract or write back into the generated MDX.
 */
export type C24MetricKey = "financial" | "process" | "governance";

export interface C24MediaSelection {
	galleryId: string;
	imageAlts: string[];
}

export interface C24RailScene {
	id: string;
	parentId: string;
	eyebrow: string;
	title: string;
	left:
		| { kind: "metrics"; keys: C24MetricKey[] }
		| { kind: "product" }
		| { kind: "scar-index" }
		| { kind: "scar"; anchor?: string; unanchored?: true }
		| { kind: "context" }
		| { kind: "sources" };
	media: C24MediaSelection[];
	mediaLabel: string;
}

export const c24RailScenes: C24RailScene[] = [
	{
		id: "i-project-summary",
		parentId: "i-project-summary",
		eyebrow: "Orientation",
		title: "Project Summary",
		left: { kind: "metrics", keys: ["financial", "process", "governance"] },
		media: [
			{
				galleryId: "01_origin_story",
				imageAlts: ["c24-render-01", "c24-prototype-01"],
			},
		],
		mediaLabel: "Form, mandate, and starting point",
	},
	{
		id: "ii-the-product-that-shipped",
		parentId: "ii-the-product-that-shipped",
		eyebrow: "Product",
		title: "The Product That Shipped",
		left: { kind: "product" },
		media: [
			{
				galleryId: "01_origin_story",
				imageAlts: ["c24-render-02", "c24-prototype-02"],
			},
		],
		mediaLabel: "The shipped system and its physical vocabulary",
	},
	{
		id: "iii-the-anatomy-of-failure",
		parentId: "iii-the-anatomy-of-failure",
		eyebrow: "Failure Map",
		title: "The Anatomy of Failure",
		left: { kind: "scar-index" },
		media: [
			{
				galleryId: "02_side_cap_crisis",
				imageAlts: ["step-01-defect-gap", "step-03-method-a-fix"],
			},
		],
		mediaLabel: "From defect to controlled intervention",
	},
	{
		id: "1-thermal-crisis-the-banana-defect",
		parentId: "iii-the-anatomy-of-failure",
		eyebrow: "Scar 01",
		title: "Thermal Crisis",
		left: { kind: "scar", anchor: "1-thermal-crisis-the-banana-defect" },
		media: [
			{
				galleryId: "02_side_cap_crisis",
				imageAlts: ["step-01-defect-gap", "step-04-validation-report"],
			},
		],
		mediaLabel: "Warp evidence and validation record",
	},
	{
		id: "2-supply-chain-crisis-the-top-panel-no-bid-shock",
		parentId: "iii-the-anatomy-of-failure",
		eyebrow: "Scar 02",
		title: "Supply-Chain Crisis",
		left: { kind: "scar", anchor: "2-supply-chain-crisis-the-top-panel-no-bid-shock" },
		media: [
			{
				galleryId: "03_manufacturing_wins",
				imageAlts: ["metal-bends", "metal-bends_2"],
			},
		],
		mediaLabel: "Fabrication evidence from the recovery path",
	},
	{
		id: "3-architecture-crisis-the-emithermal-rake",
		parentId: "iii-the-anatomy-of-failure",
		eyebrow: "Scar 03",
		title: "Architecture Crisis",
		left: { kind: "scar", anchor: "3-architecture-crisis-the-emithermal-rake" },
		media: [
			{
				galleryId: "01_origin_story",
				imageAlts: ["c24-render-01", "c24-render-02"],
			},
		],
		mediaLabel: "System form after the architecture reset",
	},
	{
		id: "4-serviceability-crisis-the-headphone-jack-fire-drill",
		parentId: "iii-the-anatomy-of-failure",
		eyebrow: "Scar 04",
		title: "Serviceability Crisis",
		left: { kind: "scar", anchor: "4-serviceability-crisis-the-headphone-jack-fire-drill" },
		media: [{ galleryId: "05_paper_trail", imageAlts: ["eco-12993"] }],
		mediaLabel: "The change record behind the field repair",
	},
	{
		id: "5-integration-crisis-the-geometric-firewall",
		parentId: "iii-the-anatomy-of-failure",
		eyebrow: "Scar 05",
		title: "Integration Crisis",
		left: { kind: "scar", anchor: "5-integration-crisis-the-geometric-firewall" },
		media: [
			{
				galleryId: "03_manufacturing_wins",
				imageAlts: ["DCD_9150-55200-00_REV_12_Page_1"],
			},
			{
				galleryId: "05_paper_trail",
				imageAlts: ["DCD_9150-55200-00_REV_12_Page_1_REV-block"],
			},
		],
		mediaLabel: "The DCD as geometric contract",
	},
	{
		id: "6-regulatory-crisis-the-stranded-psu",
		parentId: "iii-the-anatomy-of-failure",
		eyebrow: "Scar 06",
		title: "Regulatory Crisis",
		left: { kind: "scar", anchor: "6-regulatory-crisis-the-stranded-psu" },
		media: [
			{
				galleryId: "01_origin_story",
				imageAlts: ["c24-render-02", "c24-prototype-03"],
			},
		],
		mediaLabel: "Product context; certification imagery remains an archive gap",
	},
	{
		id: "7-component--geometry-battles",
		parentId: "iii-the-anatomy-of-failure",
		eyebrow: "Scar 07",
		title: "Component & Geometry Battles",
		left: { kind: "scar", anchor: "7-component--geometry-battles" },
		media: [
			{
				galleryId: "04_structural_components",
				imageAlts: ["bournsem14page3", "9440-55174-00"],
			},
		],
		mediaLabel: "Commodity components, custom geometry",
	},
	{
		id: "iv-governance--rhythm",
		parentId: "iv-governance--rhythm",
		eyebrow: "Control System",
		title: "Governance & Rhythm",
		left: { kind: "metrics", keys: ["governance"] },
		media: [
			{
				galleryId: "05_paper_trail",
				imageAlts: ["DCD_9150-55200-00_REV_12_Page_1_REV-block", "ECO_12262_Page_1"],
			},
		],
		mediaLabel: "Release discipline made visible",
	},
	{
		id: "v-quantified-impact",
		parentId: "v-quantified-impact",
		eyebrow: "Outcomes",
		title: "Quantified Impact",
		left: { kind: "metrics", keys: ["financial", "process", "governance"] },
		media: [
			{
				galleryId: "02_side_cap_crisis",
				imageAlts: ["dims-before-after-paint", "step-04-validation-report"],
			},
		],
		mediaLabel: "A measured correction, not a cosmetic anecdote",
	},
	{
		id: "vi-market-context--legacy",
		parentId: "vi-market-context--legacy",
		eyebrow: "Afterlife",
		title: "Market Context & Legacy",
		left: { kind: "context" },
		media: [
			{
				galleryId: "06_press_resources",
				imageAlts: ["c24-context-01", "c24-render-07"],
			},
		],
		mediaLabel: "The product in its market context",
	},
	{
		id: "vii-source-trail",
		parentId: "vii-source-trail",
		eyebrow: "Receipts",
		title: "Source Trail",
		left: { kind: "sources" },
		media: [
			{
				galleryId: "05_paper_trail",
				imageAlts: ["ECO_12263_Page_1", "ECO_12263_Page_2"],
			},
		],
		mediaLabel: "Primary records behind the narrative",
	},
];
