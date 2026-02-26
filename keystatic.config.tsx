/**
 * * This is the Keystatic configuration file. It is used to define the collections and fields that will be used in the Keystatic CMS.
 *
 * ! This works in conjunction with Astro content collections. If you update one, you must update the other.
 *
 * Access keystatic interface at /admin or /keystatic
 * This works in local mode in dev, then cloud mode in prod
 * Cloud deployment is free to sign up (up to 3 users per team)
 * Docs: https://keystatic.com/docs/cloud
 * Create a Keystatic Cloud account here: https://keystatic.cloud/
 */

import {
	collection,
	config,
	fields,
	// singleton,
} from "@keystatic/core";
import {
	INDUSTRIES,
	CATEGORIES,
	EMPLOYERS,
	CLIENTS,
	ROLES,
	TOOLS,
	PRODUCTION_STATUS,
	PRODUCTION_SCALE,
	TAGS,
} from "./src/config/taxonomy";

// components for preview purposes
import ComponentBlocks from "./src/components/KeystaticComponents/ComponentBlocks";

export default config({
	// works in local mode in dev, then cloud mode in prod
	// @ts-ignore
	storage: import.meta.env.DEV === true ? { kind: "local" } : { kind: "cloud" },
	// cloud deployment is free to sign up (up to 3 users per team)
	// docs: https://keystatic.com/docs/cloud
	// create a Keystatic Cloud account here: https://keystatic.cloud/
	cloud: { project: "cosmic-themes/quantum" },
	ui: {
		brand: {
			name: "Erik Norris",
			mark: () => <img src="/assets/branding/logo.png" height={24} alt="Erik Norris Logo" />,
		},
	},
	collections: {
		/**
		 * * Other Pages collection
		 * For items like legal pages, about pages, etc.
		 * This gets used by Astro Content Collections, so if you update this, you'll need to update the Astro Content Collections schema
		 */
		otherPages: collection({
			label: "Other Pages",
			slugField: "title",
			path: "src/data/otherPages/*/",
			columns: ["title"],
			entryLayout: "content",
			format: { contentField: "content" },
			schema: {
				title: fields.slug({
					name: { label: "Title" },
					slug: {
						label: "SEO-friendly slug",
						description: "Never change the slug once a file is published!",
					},
				}),
				description: fields.text({
					label: "Description",
					validation: { isRequired: true, length: { min: 1, max: 160 } },
				}),
				draft: fields.checkbox({
					label: "Draft",
					description: "Set this page as draft to prevent it from being published.",
				}),
				content: fields.mdx({
					label: "Page Contents",
					options: {
						bold: true,
						italic: true,
						strikethrough: true,
						code: true,
						heading: [2, 3, 4, 5, 6],
						blockquote: true,
						orderedList: true,
						unorderedList: true,
						table: true,
						link: true,
						image: {
							directory: "src/data/otherPages/",
							publicPath: "../",
						},
						divider: true,
						codeBlock: true,
					},
					components: {
						Newsletter: ComponentBlocks.Newsletter,
						Admonition: ComponentBlocks.Admonition,
					},
				}),
			},
		}),

		/**
		 * * Projects Collection
		 * The Core Data for the Portfolio.
		 * Mapped to 'src/content.config.ts' schema.
		 */
		projects: collection({
			label: "Projects",
			slugField: "title",
			path: "src/content/projects/*/", // Folders in src/content/projects/
			columns: ["title", "industry", "category", "employer", "production"],
			entryLayout: "content",
			format: { contentField: "content" },
			schema: {
				// --------------------------------------------------------------------------
				// 1. Core Identity
				// --------------------------------------------------------------------------
				title: fields.slug({
					name: { label: "Title" },
					slug: {
						label: "SEO-friendly slug",
						description: "Never change the slug once a file is published!",
					},
				}),
				draft: fields.checkbox({
					label: "Draft",
					description: "Set this project as draft to prevent it from being published.",
				}),
				listed: fields.checkbox({
					label: "Show in Project Index (Listed)",
					description:
						"Uncheck to hide this project from the main grid (it will still be accessible via URL).",
					defaultValue: true,
				}),

				// --------------------------------------------------------------------------
				// Trimain Strategy (The Manifold)
				// --------------------------------------------------------------------------
				targets: fields.multiselect({
					label: "Target Sites (The Manifold)",
					options: [
						{ label: "The Suit (eriknorris.com)", value: "main" },
						{ label: "The Lab (mechanistic.com)", value: "mech" },
						{ label: "The Garage (moreplay.com)", value: "play" },
					],
					defaultValue: ["main"],
					description: "Where should this project appear?",
				}),
				primary_home: fields.select({
					label: "Primary Home (Canonical)",
					options: [
						{ label: "The Suit (eriknorris.com)", value: "main" },
						{ label: "The Lab (mechanistic.com)", value: "mech" },
						{ label: "The Garage (moreplay.com)", value: "play" },
					],
					defaultValue: "main",
					description: 'Which site is the "Owner" of this content? (Sets rel=canonical)',
				}),
				asset_bucket: fields.select({
					label: "Asset Bucket (Sovereignty)",
					options: [
						{ label: "The Suit (assets.eriknorris.com)", value: "main" },
						{ label: "The Lab (assets.mechanistic.com)", value: "mech" },
						{ label: "The Garage (assets.moreplay.com)", value: "play" },
					],
					defaultValue: "main",
					description:
						"PHYSICAL location of assets. Uploading here implies the file lives in the chosen bucket.",
				}),
				heroImage: fields.text({
					label: "Hero Image Path",
					description: "Path to R2 asset (e.g. /assets/r2/project/hero.png)",
				}),
				description: fields.text({
					label: "Description",
					multiline: true,
					description: "Short summary for cards and headers.",
				}),

				// --------------------------------------------------------------------------
				// 2. Context & Classification
				// --------------------------------------------------------------------------
				industry: fields.select({
					label: "Industry",
					options: INDUSTRIES.map((i) => ({ label: i.label, value: i.value })),
					defaultValue: INDUSTRIES[0].value,
				}),
				category: fields.select({
					label: "Category",
					options: CATEGORIES.map((c) => ({ label: c.label, value: c.value })),
					defaultValue: CATEGORIES[0].value,
				}),
				theme: fields.text({ label: "Theme" }),
				presentation_mode: fields.select({
					label: "Presentation Mode",
					description: "Controls the visual styling in the Multiverse Graph",
					defaultValue: "standard",
					options: [
						{ label: "Standard (Default)", value: "standard" },
						{ label: "Deep Dive (Blue Ring)", value: "deep_dive" },
						{ label: "Flagship (Pulse Effect)", value: "flagship" },
						{ label: "Notebook (Forensic)", value: "notebook" },
					],
				}),

				// --------------------------------------------------------------------------
				// 3. Timeline & Status
				// --------------------------------------------------------------------------
				date: fields.date({ label: "Start Date" }),
				endDate: fields.date({ label: "End Date" }),
				duration: fields.text({ label: "Duration (Text)" }),
				production: fields.select({
					label: "Production Status",
					options: PRODUCTION_STATUS.map((s) => ({ label: s.label, value: s.value })),
					defaultValue: PRODUCTION_STATUS[0].value,
				}),
				productionScale: fields.select({
					label: "Production Scale",
					options: PRODUCTION_SCALE.map((s) => ({ label: s.label, value: s.value })),
					defaultValue: PRODUCTION_SCALE[0].value,
				}),

				// --------------------------------------------------------------------------
				// 4. Role & Employment
				// --------------------------------------------------------------------------
				employer: fields.select({
					label: "Employer",
					options: EMPLOYERS.map((e) => ({ label: e.label, value: e.value })),
					defaultValue: EMPLOYERS[0].value,
				}),
				job_title: fields.text({ label: "Job Title" }),
				role: fields.select({
					label: "Role",
					options: ROLES.map((r) => ({ label: r.label, value: r.value })),
					defaultValue: ROLES[0].value,
				}), // Kept for schema parity
				teamSize: fields.text({ label: "Team Size" }),
				client: fields.array(
					fields.select({
						label: "Client",
						options: CLIENTS.map((c) => ({ label: c.label, value: c.value })),
						defaultValue: CLIENTS[0].value,
					}),
					{
						label: "Clients",
						itemLabel: (props) => props.value,
					},
				),
				cast: fields.array(
					fields.object({
						name: fields.text({ label: "Name" }),
						role: fields.text({ label: "Role" }),
						org: fields.text({ label: "Organization" }),
					}),
					{
						label: "Cast / Team",
						itemLabel: (props) => props.fields.name.value || "Member",
					},
				),

				// --------------------------------------------------------------------------
				// 5. Skills & Tools
				// --------------------------------------------------------------------------
				tags: fields.array(
					fields.select({
						label: "Tag",
						options: TAGS.map((t) => ({ label: t, value: t })),
						defaultValue: TAGS[0],
					}),
					{
						label: "Tags (Controlled)",
						itemLabel: (props) => props.value,
					},
				),
				tools: fields.array(
					fields.select({
						label: "Tool",
						options: TOOLS.map((t) => ({ label: t.label, value: t.value })),
						defaultValue: TOOLS[0].value,
					}),
					{ label: "Tools", itemLabel: (props) => props.value },
				),
				toolIcons: fields.array(fields.text({ label: "Icon Code" }), {
					label: "Tool Icons (Dev)",
					itemLabel: (props) => props.value,
				}),
				skillData: fields.array(
					fields.object({
						name: fields.text({ label: "Name" }),
						value: fields.number({ label: "Value" }),
					}),
					{
						label: "Skill Data (Radar)",
						itemLabel: (props) => props.fields.name.value || "Skill",
					},
				),
				additionalSkills: fields.array(fields.text({ label: "Skill" }), {
					label: "Additional Skills",
					itemLabel: (props) => props.value,
				}),

				// --------------------------------------------------------------------------
				// 6. Forensic Intelligence (Crucial Data)
				// --------------------------------------------------------------------------
				// --------------------------------------------------------------------------
				// 6. Forensic Intelligence (Crucial Data)
				// --------------------------------------------------------------------------
				forensic_summary: fields.object(
					{
						trigger: fields.text({ label: "Trigger (Crisis)", multiline: true }),
						intervention: fields.text({ label: "Intervention (Action)", multiline: true }),
						result: fields.text({ label: "Result (Outcome)", multiline: true }),
					},
					{ label: "Forensic Summary (STAR)" },
				),

				bom: fields.array(
					fields.object({
						label: fields.text({ label: "Part Name" }),
						value: fields.text({ label: "Material/Spec" }),
					}),
					{
						label: "Bill of Materials (BOM)",
						itemLabel: (props) => props.fields.label.value || "Part",
					},
				),
				metrics: fields.object({
					// Top-level Quotes
					quotes: fields.array(fields.text({ label: "Quote" }), { label: "Quotes" }),

					// Financials
					financial: fields.object({
						toolingBudget: fields.number({ label: "Tooling Budget" }),
						toolingActual: fields.number({ label: "Tooling Actual" }),
						costOfGoodsSold: fields.array(fields.text({ label: "Item" }), { label: "COGS" }),
						margins: fields.array(fields.text({ label: "Item" }), { label: "Margins" }),
						quotes: fields.array(fields.text({ label: "Quote" }), { label: "Quotes" }),
						royaltySaved: fields.text({ label: "Royalty Saved" }),
						riskBuy: fields.text({ label: "Risk Buy" }),
						toolingWaived: fields.number({ label: "Tooling Waived" }),
						value: fields.text({ label: "Value" }),
						label: fields.text({ label: "Label" }),
					}),

					// Process
					process: fields.object({
						engineeringChangeOrders: fields.array(fields.text({ label: "ECO" }), { label: "ECOs" }),
						yield: fields.array(fields.text({ label: "Yield Item" }), { label: "Yield" }), // Changed to Array
						yieldCrisis: fields.text({ label: "Yield Crisis" }),
						yieldRecovery: fields.text({ label: "Yield Recovery" }),
						label: fields.text({ label: "Label" }),
						value: fields.text({ label: "Value" }),
					}),

					// Production (Added for Cinema One)
					production: fields.object({
						label: fields.text({ label: "Label" }),
						value: fields.text({ label: "Value" }),
					}),

					// Quality (Added for Cinema One)
					quality: fields.object({
						label: fields.text({ label: "Label" }),
						value: fields.text({ label: "Value" }),
					}),

					// Governance
					governance: fields.object({
						ecos: fields.array(fields.text({ label: "ECO" }), { label: "ECOs" }),
						dcos: fields.number({ label: "DCOs" }),
						dcdCount: fields.number({ label: "DCD Count" }),
					}),

					// Interventions
					interventions: fields.object({
						count: fields.number({ label: "Count" }),
						label: fields.text({ label: "Label" }),
						value: fields.number({ label: "Value" }), // Changed to Number to match '5'
					}),

					// Profitability
					profitability: fields.object({
						value: fields.text({ label: "Value" }),
						label: fields.text({ label: "Label" }),
					}),

					// COGS
					cogs: fields.object({
						value: fields.text({ label: "Value" }),
						label: fields.text({ label: "Label" }),
					}),

					// Time to Market
					time_to_market: fields.object({
						value: fields.text({ label: "Value" }),
						label: fields.text({ label: "Label" }),
					}),

					// War Stories (Rich)
					scars: fields.array(
						fields.object({
							label: fields.text({ label: "Label" }),
							value: fields.text({ label: "Value" }),
							description: fields.text({ label: "Description", multiline: true }),
						}),
						{
							label: "War Stories",
							itemLabel: (props) => props.fields.label.value || "Story",
						},
					),
				}),

				// V2.1: Scars (Renamed from war_stories)
				scars: fields.array(
					fields.object({
						label: fields.text({ label: "Label" }),
						value: fields.text({ label: "Value" }),
						description: fields.text({ label: "Description", multiline: true }),
					}),
					{
						label: "Scars (War Stories V2.1)",
						itemLabel: (props) => props.fields.label.value || "Scar",
					},
				),

				forensic_metrics: fields.object(
					{
						financial: fields.text({ label: "Financial (Summary)", multiline: true }),
						process: fields.text({ label: "Process (Summary)", multiline: true }),
						governance: fields.text({ label: "Governance (Summary)", multiline: true }),
						technical: fields.text({ label: "Technical (Summary)", multiline: true }),
						quotes: fields.array(fields.text({ label: "Quote", multiline: true }), {
							label: "Quotes",
							itemLabel: (props) => props.value || "Quote",
						}),
					},
					{ label: "Metrics / KPI" },
				),

				// Legacy Top-Level Quotes (found in webtv-galaxy)
				quotes: fields.array(fields.text({ label: "Quote", multiline: true }), {
					label: "Quotes (Legacy Top-Level)",
					itemLabel: (props) => props.value || "Quote",
				}),

				// V2.1: Isomorphics (Trust Signals)
				isomorphics: fields.array(
					fields.object({
						label: fields.text({ label: "Label" }),
						hardware_point: fields.text({ label: "Hardware Point (Physical)", multiline: true }),
						software_point: fields.text({ label: "Software Point (Logical)", multiline: true }),
						principle: fields.text({ label: "Principle (Synthesis)", multiline: true }),
					}),
					{
						label: "Isomorphics (Trust Signals)",
						itemLabel: (props) => props.fields.label.value || "Signal",
					},
				),

				// V2.1: Events (Seismograph)
				events: fields.array(
					fields.object({
						date: fields.date({ label: "Date" }),
						score: fields.integer({ label: "Score (Entropy)" }),
						snippet: fields.text({ label: "Snippet", multiline: true }),
						type: fields.text({ label: "Type" }),
						source_ref: fields.text({ label: "Source Ref" }),
					}),
					{
						label: "Events (Seismograph)",
						itemLabel: (props) => props.fields.snippet.value || "Event",
					},
				),

				impact: fields.text({ label: "Impact Statement" }),

				// V2.1: Reports (Direct Injection)
				reports: fields.array(
					fields.object({
						label: fields.text({ label: "Label" }),
						value: fields.text({ label: "Value" }),
						url: fields.url({ label: "URL" }),
					}),
					{
						label: "Reports",
						itemLabel: (props) => props.fields.label.value || "Report",
					},
				),

				// V2.1: Timeline (Events)
				timeline: fields.array(
					fields.object({
						date: fields.date({ label: "Date" }),
						title: fields.text({ label: "Title" }),
						description: fields.text({ label: "Description", multiline: true }),
					}),
					{
						label: "Timeline (Events)",
						itemLabel: (props) => props.fields.title.value || "Event",
					},
				),

				// V2.1: Complexity Vector (Physical Design)
				complexity_vector: fields.object(
					{
						part_count_growth: fields.array(
							fields.object({
								phase: fields.text({ label: "Phase" }),
								count: fields.integer({ label: "Count" }),
								date: fields.text({ label: "Date (YYYY-MM)" }),
								note: fields.text({ label: "Note", multiline: true }),
							}),
							{ label: "Part Count Growth", itemLabel: (props) => props.fields.phase.value },
						),
						process_density: fields.array(
							fields.object({
								part_name: fields.text({ label: "Part Name" }),
								part_number: fields.text({ label: "Part Number" }),
								material: fields.text({ label: "Material" }),
								steps: fields.array(fields.text({ label: "Step" }), { label: "Steps" }),
								complexity_score: fields.integer({ label: "Score (1-10)" }),
								failure_mode: fields.text({ label: "Failure Mode", multiline: true }),
								notes: fields.text({ label: "Notes", multiline: true }),
							}),
							{ label: "Process Density", itemLabel: (props) => props.fields.part_name.value },
						),
						tooling_chain: fields.array(
							fields.object({
								tool_name: fields.text({ label: "Tool Name" }),
								type: fields.text({ label: "Type" }),
								vendor: fields.text({ label: "Vendor" }),
								lead_time_weeks: fields.number({ label: "Lead Time (Weeks)" }),
								cost_impact: fields.text({ label: "Cost Impact" }),
								status: fields.text({ label: "Status" }),
								risk: fields.text({ label: "Risk", multiline: true }),
								notes: fields.text({ label: "Notes", multiline: true }),
							}),
							{ label: "Tooling Chain", itemLabel: (props) => props.fields.tool_name.value },
						),
						supply_chain_nodes: fields.array(
							fields.object({
								location: fields.text({ label: "Location" }),
								role: fields.text({ label: "Role" }),
								vendor: fields.text({ label: "Vendor" }),
								notes: fields.text({ label: "Notes", multiline: true }),
							}),
							{ label: "Supply Chain Nodes", itemLabel: (props) => props.fields.location.value },
						),
						legacy_metrics: fields.array(
							fields.object({
								label: fields.text({ label: "Label" }),
								value: fields.text({ label: "Value" }),
							}),
							{ label: "Legacy Metrics", itemLabel: (props) => props.fields.label.value },
						),
					},
					{ label: "Complexity Vector" },
				),

				// --------------------------------------------------------------------------
				// 7. Stats & Graphs
				// --------------------------------------------------------------------------
				stats: fields.object({
					plastic: fields.number({ label: "Plastic" }),
					metal: fields.number({ label: "Metal" }),
					pcb: fields.number({ label: "PCB" }),
				}),
				phase_stats: fields.object({
					Strategy: fields.number({ label: "Strategy" }),
					Design: fields.number({ label: "Design" }),
					Engineering: fields.number({ label: "Engineering" }),
					Production: fields.number({ label: "Production" }),
				}),
				phases: fields.object({
					label: fields.text({ label: "Label" }),
				}),
				skillGraph: fields.text({ label: "Skill Graph (JSON)" }),
				partGraph: fields.text({ label: "Part Graph (JSON)" }),

				// --------------------------------------------------------------------------
				// 8. Media & Links
				// --------------------------------------------------------------------------
				gallery: fields.array(
					fields.object({
						src: fields.image({
							label: "Source Path (R2)",
							directory: "public/assets/r2",
							publicPath: "/assets/r2/",
						}),
						width: fields.number({ label: "Width" }),
						height: fields.number({ label: "Height" }),
						aspectRatio: fields.number({ label: "Aspect Ratio" }),
					}),
					{
						label: "Gallery Images",
						itemLabel: (props) => {
							const val = props.fields.src.value;
							if (typeof val === "string") return val;
							return val?.filename || "Image";
						},
					},
				),
				documents: fields.array(
					fields.object({
						label: fields.text({ label: "Label" }),
						url: fields.text({ label: "Path" }),
					}),
					{
						label: "Documents",
						itemLabel: (props) => props.fields.label.value,
					},
				),

				visuals_to_find: fields.array(fields.text({ label: "Visual" }), {
					label: "Visuals to Find (Legacy)",
					itemLabel: (props) => props.value || "Visual",
				}),
				links: fields.array(
					fields.object({
						name: fields.text({ label: "Name" }),
						url: fields.url({ label: "URL" }),
					}),
					{
						label: "Links",
						itemLabel: (props) => props.fields.name.value,
					},
				),
				audio_url: fields.text({
					label: "Audio Briefing URL",
					description: "Path to R2 audio asset.",
				}),
				notebook_url: fields.url({
					label: "NotebookLM URL",
					description: "Link to the private Detail Pod (Restricted Access).",
				}),
				transcript: fields.text({
					label: "Audio Transcript",
					multiline: true,
					description: "Transcript of the audio briefing (optional).",
				}),

				// --------------------------------------------------------------------------
				// 9. Cyberspace Engine (Scrollytelling)
				// --------------------------------------------------------------------------
				cyberspace: fields.object({
					enable: fields.checkbox({ label: "Enable Scrollytelling" }),
					layout: fields.text({ label: "Layout" }),
					stickies: fields.array(
						fields.object({
							id: fields.text({ label: "ID" }),
							title: fields.text({ label: "Title" }),
							type: fields.select({
								label: "Cine-Module Type",
								description: "The render engine for this scene.",
								options: [
									{ label: "Standard (Hybrid)", value: "standard" },
									{ label: "Filmstrip (Gallery)", value: "filmstrip" },
									{ label: "Scrub Sequence (Exploded)", value: "sequence" },
									{ label: "Parallax Deck (Ohm)", value: "parallax" },
									// Legacy / Specifics
									{ label: "Gallery (Standard)", value: "gallery" },
									{ label: "Media (Standard)", value: "media" },
									{ label: "Model (Standard)", value: "model" },
									{ label: "Swarm (Standard)", value: "swarm" },
									{ label: "Thermal (Standard)", value: "thermal" },
									{ label: "Conspiracy (Standard)", value: "conspiracy" },
									{ label: "Comparator (Standard)", value: "comparator" },
									{ label: "Void (Standard)", value: "void" },
								],
								defaultValue: "standard",
							}),
							align: fields.select({
								label: "Alignment",
								options: [
									{ label: "Center", value: "center" },
									{ label: "Left", value: "left" },
									{ label: "Right", value: "right" },
								],
								defaultValue: "center",
							}),
							text: fields.text({ label: "Text", multiline: true }),
							featuredIndices: fields.array(fields.number({ label: "Index" }), {
								label: "Featured Indices",
								itemLabel: (props) => props.value?.toString() || "0",
							}),

							// Slide Deck
							deck: fields.array(
								fields.object({
									title: fields.text({ label: "Title" }),
									subtitle: fields.text({ label: "Subtitle" }),
									body: fields.text({ label: "Body", multiline: true }),
								}),
								{
									label: "Deck",
									itemLabel: (props) => props.fields.title.value || "Slide",
								},
							),
							legacy_deck: fields.array(
								fields.object({
									title: fields.text({ label: "Title" }),
									subtitle: fields.text({ label: "Subtitle" }),
									body: fields.text({ label: "Body", multiline: true }),
								}),
								{
									label: "Legacy Deck",
									itemLabel: (props) => props.fields.title.value || "Slide",
								},
							),

							// Data Payload
							data: fields.object({
								layout: fields.text({ label: "Layout" }),
								columns: fields.number({ label: "Columns" }),
								scattered: fields.checkbox({ label: "Scattered" }),
								src: fields.image({
									label: "Src",
									directory: "public/assets/r2",
									publicPath: "/assets/r2/",
								}),
								featuredIndices: fields.array(fields.number({ label: "Index" }), {
									label: "Featured Indices",
									itemLabel: (props) => props.value?.toString() || "0",
								}),
								images: fields.array(
									fields.object({
										src: fields.image({
											label: "Src",
											directory: "public/assets/r2",
											publicPath: "/assets/r2/",
										}),
										title: fields.text({ label: "Title" }),
										description: fields.text({ label: "Description" }),
										href: fields.text({ label: "Link" }),
										width: fields.number({ label: "Width" }),
										height: fields.number({ label: "Height" }),
										aspectRatio: fields.number({ label: "Aspect Ratio" }),
										alt: fields.text({ label: "Alt" }),
									}),
									{
										label: "Images",
										itemLabel: (props) => {
											const val = props.fields.src.value;
											if (typeof val === "string") return val;
											return val?.filename || "Image";
										},
									},
								),
								modelSrc: fields.text({ label: "Model Src" }),
								poster: fields.text({ label: "Poster" }),
								cameraOrbit: fields.text({ label: "Camera Orbit" }),
								fieldOfView: fields.text({ label: "Field of View" }),
								// Nested Legacy Data
								data: fields.object({
									title: fields.text({ label: "Title" }),
									source: fields.text({ label: "Source" }),
								}),
							}),
						}),
						{
							label: "Stickies",
							itemLabel: (props) => props.fields.id.value || "Sticky",
						},
					),
					// Narrative
					narrative: fields.array(
						fields.object({
							step: fields.text({ label: "Step ID" }),
							title: fields.text({ label: "Title" }),
							subtitle: fields.text({ label: "Subtitle" }),
							body: fields.text({ label: "Body", multiline: true }),
						}),
						{
							label: "Legacy Narrative",
							itemLabel: (props) => props.fields.step.value || "Step",
						},
					),
				}),

				// --------------------------------------------------------------------------
				// 10. Technical & Legacy
				// --------------------------------------------------------------------------
				toolchain: fields.array(fields.text({ label: "Item" }), {
					label: "Forensic Toolchain",
					itemLabel: (props) => props.value,
					description: "Injected by Forensic Pipeline.",
				}),
				slug: fields.text({
					label: "Slug (Explicit Field)",
					description: "Legacy override. Usually managed by title.",
				}),

				// --------------------------------------------------------------------------
				// 11. Long-Form Content
				// --------------------------------------------------------------------------
				content: fields.mdx({
					label: "Case Study Content",
					options: {
						bold: true,
						italic: true,
						strikethrough: true,
						code: true,
						heading: [2, 3, 4, 5, 6],
						blockquote: true,
						orderedList: true,
						unorderedList: true,
						table: true,
						link: true,
						image: {
							directory: "src/content/projects/",
							publicPath: "../",
						},
						divider: true,
						codeBlock: true,
					},
					components: {
						Admonition: ComponentBlocks.Admonition,
						ModelViewer: ComponentBlocks.ModelViewer,
						YouTube: ComponentBlocks.YouTube,
						Chip: ComponentBlocks.Chip,
						Wire: ComponentBlocks.Wire,
						ScrambleText: ComponentBlocks.ScrambleText,
					},
				}),

				// --------------------------------------------------------------------------
				// 12. HXO Architecture
				// --------------------------------------------------------------------------
				hydration_status: fields.select({
					label: "Hydration Status",
					options: [
						{ label: "Full (Complete)", value: "full" },
						{ label: "Partial (Draft)", value: "partial" },
						{ label: "Executive (Summary)", value: "executive" },
					],
					defaultValue: "partial",
				}),
				tier: fields.integer({
					label: "Tier",
					description: "1=Flagship, 2=Core, 3=Archive",
					defaultValue: 3,
					validation: { min: 1, max: 3 },
				}),
				hxo_ready: fields.checkbox({
					label: "HXO Ready",
					description: "Is this project ready for the Holographic Experience Engine?",
					defaultValue: false,
				}),
			},
		}),

		/**
		 * * PROMPTS Engine Collection
		 * The Sovereign PDM for AI Director's Notes & Hack Packs.
		 * Taxonomy: Intake ➡ Compression ➡ Power ➡ Exhaust
		 */
		prompts: collection({
			label: "Prompts",
			slugField: "title",
			path: "src/content/prompts/*/",
			columns: ["title", "category", "role"],
			entryLayout: "content",
			format: { contentField: "content" },
			schema: {
				title: fields.slug({ name: { label: "Title" } }),
				description: fields.text({
					label: "Description",
					description: "Short summary of the prompt's purpose.",
				}),
				category: fields.select({
					label: "Engine Cycle Phase",
					description: "The 4-Stroke Taxonomy (Suck, Squeeze, Bang, Blow)",
					options: [
						{ label: "1. INTAKE (Mining/Extraction)", value: "intake" },
						{ label: "2. COMPRESSION (Refining/Bolus)", value: "compression" },
						{ label: "3. POWER (Generative/Creative)", value: "power" },
						{ label: "4. EXHAUST (Governance/Audit)", value: "exhaust" },
					],
					defaultValue: "intake",
				}),
				role: fields.text({
					label: "Persona / Role",
					description: "Who is the AI pretending to be? (e.g., 'Senior Engineer')",
				}),
				hack_pack_source: fields.text({
					label: "Hack Pack Source",
					description: "Filename of the control document (e.g. AUDIO_PROTOCOL.md)",
				}),
				input_type: fields.text({
					label: "Input Type",
					description: "What do you feed this prompt? (e.g., Resume, PDF, Email)",
				}),
				output_format: fields.text({
					label: "Output Format",
					description: "What comes out? (e.g., JSON, Markdown, Audio)",
				}),
				system_instructions: fields.text({
					label: "System Instructions",
					multiline: true,
					description: "High-level meta-instructions (The 'Guardrails').",
				}),
				content: fields.mdx({
					label: "Prompt Content",
					options: {
						bold: true,
						italic: true,
						code: true,
						codeBlock: true,
						heading: [1, 2, 3, 4],
						link: true,
					},
				}),
			},
		}),
	},
});
