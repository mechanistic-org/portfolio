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
import ComponentBlocks from "@components/KeystaticComponents/ComponentBlocks";

export default config({
	// works in local mode in dev, then cloud mode in prod
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
		 * * Blog posts collection
		 * This gets used by Astro Content Collections, so if you update this, you'll need to update the Astro Content Collections schema
		 */
		blog: collection({
			label: "Blog",
			slugField: "title",
			path: "src/data/blog/*/",
			columns: ["title", "pubDate"],
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
					description: "Set this post as draft to prevent it from being published.",
				}),
				authors: fields.array(
					fields.relationship({
						label: "Post author",
						collection: "authors",
					}),
					{
						label: "Authors",
						validation: { length: { min: 1 } },
						itemLabel: (props) => props.value || "Please select an author",
					},
				),
				pubDate: fields.date({ label: "Publish Date" }),
				updatedDate: fields.date({
					label: "Updated Date",
					description: "If you update this post at a later date, put that date here.",
				}),
				heroImage: fields.image({
					label: "Hero Image",
					publicPath: "../",
					validation: { isRequired: true },
				}),
				tags: fields.array(fields.text({ label: "Tag" }), {
					label: "Tags",
					itemLabel: (props) => props.value,
					validation: { length: { min: 1 } },
				}),
				content: fields.mdx({
					label: "Content",
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
							directory: "src/data/blog/",
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
		 * * Authors collection
		 * This gets used by Astro Content Collections, so if you update this, you'll need to update the Astro Content Collections schema
		 */
		authors: collection({
			label: "Authors",
			slugField: "name",
			path: "src/data/authors/*/",
			columns: ["name"],
			entryLayout: "content",
			format: { contentField: "bio" },
			schema: {
				name: fields.slug({
					name: {
						label: "Name",
						validation: {
							isRequired: true,
						},
					},
					slug: {
						label: "SEO-friendly slug",
						description: "Never change the slug once this file is published!",
					},
				}),
				avatar: fields.image({
					label: "Author avatar",
					publicPath: "../",
					validation: { isRequired: true },
				}),
				about: fields.text({
					label: "About",
					description: "A short bio about the author",
					validation: { isRequired: true },
				}),
				email: fields.text({
					label: "The author's email",
					description: "This must look something like `you@email.com`",
					validation: { isRequired: true },
				}),
				authorLink: fields.url({
					label: "Author Website or Social Media Link",
					validation: { isRequired: true },
				}),
				bio: fields.mdx({
					label: "Full Bio",
					description: "The author's full bio",
					options: {
						bold: true,
						italic: true,
						strikethrough: true,
						code: true,
						heading: [2, 3, 4],
						blockquote: true,
						orderedList: true,
						unorderedList: true,
						table: true,
						link: true,
						image: {
							directory: "src/data/authors/",
							publicPath: "../",
						},
						divider: true,
						codeBlock: true,
					},
				}),
			},
		}),

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
			path: "src/content/projects/*", // Flat files in src/content/projects/
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
				date: fields.date({ label: "Start Date" }),
				endDate: fields.date({ label: "End Date" }),
				industry: fields.text({ label: "Industry" }),
				category: fields.text({ label: "Category" }),
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

				// Complex Arrays (Skills & Gallery)
				skillData: fields.array(
					fields.object({
						name: fields.text({ label: "Skill Name" }),
						value: fields.number({ label: "Proficiency (%)" }),
					}),
					{
						label: "Skill Matrix",
						itemLabel: (props) => `${props.fields.name.value} (${props.fields.value.value}%)`,
					},
				),

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
					},
				}),
			},
		}),
	},
});
