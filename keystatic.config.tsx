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
		brand: { name: "Cosmic Themes" },
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
			columns: ["title", "industry", "date"],
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
					multiline: true,
				}),
				draft: fields.checkbox({
					label: "Draft",
					description: "Set this project as draft to prevent it from being published.",
				}),
				date: fields.date({ label: "Start Date" }),
				endDate: fields.date({ label: "End Date" }),
				industry: fields.text({ label: "Industry" }),
				category: fields.text({ label: "Category" }),
				production: fields.text({ label: "Production Status" }),
				employer: fields.text({ label: "Employer" }),

				// Arrays
				client: fields.array(fields.text({ label: "Client" }), {
					label: "Clients",
					itemLabel: (props) => props.value,
				}),
				tags: fields.array(fields.text({ label: "Tag" }), {
					label: "Tags",
					itemLabel: (props) => props.value,
				}),
				tools: fields.array(fields.text({ label: "Tool" }), {
					label: "Tools",
					itemLabel: (props) => props.value,
				}),
				toolIcons: fields.array(fields.text({ label: "Icon Code" }), {
					label: "Tool Icons",
					itemLabel: (props) => props.value,
				}),

				// Forensic Metrics (Schema Parity Fix)
				forensic_metrics: fields.object({
					financial: fields.text({ label: "Financial Metric" }),
					process: fields.text({ label: "Process Metric" }),
					technical: fields.text({ label: "Technical Metric" }),
				}),

				// Forensic Architecture (Automated via hydrate_content.py)
				toolchain: fields.array(fields.text({ label: "Item" }), {
					label: "Forensic Toolchain",
					itemLabel: (props) => props.value,
					description: "Injected by Forensic Pipeline. Do not edit manually unless necessary.",
				}),
				forensic_summary: fields.text({
					label: "Forensic Summary",
					multiline: true,
					description: "The 'Crisis & Intervention' STAR summary.",
				}),

				// Visual Presentation Mode (Refactor 2026-01-14)
				presentation_mode: fields.select({
					label: "Presentation Mode",
					description: "Controls the visual styling in the Multiverse Graph",
					defaultValue: "standard",
					options: [
						{ label: "Standard (Default)", value: "standard" },
						{ label: "Deep Dive (Blue Ring)", value: "deep_dive" },
						{ label: "Flagship (Pulse Effect)", value: "flagship" },
					],
				}),

				// Skills Data
				skillData: fields.array(
					fields.object({
						name: fields.text({ label: "Name" }),
						value: fields.number({ label: "Value" }),
					}),
					{
						label: "Skill Data",
						itemLabel: (props) => props.fields.name.value || "Skill",
					},
				),
				additionalSkills: fields.array(fields.text({ label: "Skill" }), {
					label: "Additional Skills",
					itemLabel: (props) => props.value,
				}),
				skillGraph: fields.text({ label: "Skill Graph (JSON)" }),
				partGraph: fields.text({ label: "Part Graph (JSON)" }),
				job_title: fields.text({ label: "Job Title" }),

				// Stats & Metrics
				stats: fields.object({
					plastic: fields.number({ label: "Plastic" }),
					metal: fields.number({ label: "Metal" }),
					pcb: fields.number({ label: "PCB" }),
				}),

				metrics: fields.object({
					financial: fields.object({
						toolingBudget: fields.number({ label: "Tooling Budget" }),
						toolingActual: fields.number({ label: "Tooling Actual" }),
						costOfGoodsSold: fields.array(fields.text({ label: "Item" }), { label: "COGS" }),
						margins: fields.array(fields.text({ label: "Item" }), { label: "Margins" }),
					}),
					process: fields.object({
						engineeringChangeOrders: fields.array(fields.text({ label: "ECO" }), { label: "ECOs" }),
						dcdCount: fields.number({ label: "DCD Count" }),
					}),
					war_stories: fields.array(fields.number({ label: "Story ID" }), {
						label: "War Stories",
						itemLabel: (props) => props.value?.toString() || "",
					}),
				}),
				war_stories: fields.array(fields.number({ label: "Story ID (Legacy)" }), {
					label: "War Stories (Legacy)",
					itemLabel: (props) => props.value?.toString() || "",
				}),

				// Legacy/Metadata Fields
				teamSize: fields.text({ label: "Team Size" }),
				theme: fields.text({ label: "Theme" }),
				duration: fields.text({ label: "Duration" }),
				statusLabel: fields.text({ label: "Status Label" }),
				impact: fields.text({ label: "Impact" }),

				// Complex Objects
				phase_stats: fields.object({
					Strategy: fields.number({ label: "Strategy" }),
					Design: fields.number({ label: "Design" }),
					Engineering: fields.number({ label: "Engineering" }),
					Production: fields.number({ label: "Production" }),
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

				// Cyberspace (Scrollytelling Config)
				cyberspace: fields.object({
					layout: fields.text({ label: "Layout" }),
					stickies: fields.array(
						fields.object({
							id: fields.text({ label: "ID" }),
							type: fields.text({ label: "Type" }),
							title: fields.text({ label: "Title" }),

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

							// Data Payload (Union of all potential fields)
							data: fields.object({
								// Gallery Props
								layout: fields.text({ label: "Layout" }),
								columns: fields.number({ label: "Columns" }),
								scattered: fields.checkbox({ label: "Scattered" }), // Added Field
								featuredIndices: fields.array(fields.number({ label: "Index" }), {
									label: "Featured Indices",
									itemLabel: (props) => props.value?.toString() || "0",
								}), // Added Field

								images: fields.array(
									fields.object({
										src: fields.text({ label: "Src" }),
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
										itemLabel: (props) => props.fields.src.value || "Image",
									},
								),

								// Model Props
								modelSrc: fields.text({ label: "Model Src" }),
								poster: fields.text({ label: "Poster" }),
								cameraOrbit: fields.text({ label: "Camera Orbit" }),
								fieldOfView: fields.text({ label: "Field of View" }),

								// Nested Metadata (Legacy)
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

					// Legacy "Split Brain" Narrative (Text separated from Stickies)
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

				gallery: fields.array(
					fields.object({
						src: fields.text({ label: "Source Path (R2)" }), // R2 Path as string (Law of Assets)
						width: fields.number({ label: "Width" }),
						height: fields.number({ label: "Height" }),
						aspectRatio: fields.number({ label: "Aspect Ratio" }),
					}),
					{
						label: "Gallery Images",
						itemLabel: (props) => props.fields.src.value || "Image",
					},
				),

				// Assets (Law of Assets: Text Strings for R2 paths)
				heroImage: fields.text({
					label: "Hero Image Path",
					description: "Path to R2 asset (e.g. /assets/r2/project/hero.png)",
				}),

				// Slug field to prevent "Key not allowed" error
				slug: fields.text({
					label: "Slug (Read-Only)",
					description: "This field is managed by the file path. Do not edit.",
				}),

				// Content
				content: fields.mdx({
					label: "Case Study",
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
							directory: "src/content/projects/", // Only for local edits, R2 is preferred
							publicPath: "../",
						},
						divider: true,
						codeBlock: true,
					},
					components: {
						Admonition: ComponentBlocks.Admonition,
						ModelViewer: ComponentBlocks.ModelViewer,
						YouTube: ComponentBlocks.YouTube,
					},
				}),
			},
		}),
	},
});
