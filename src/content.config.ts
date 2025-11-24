import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

// Type-check frontmatter using a schema
const blogCollection = defineCollection({
	loader: glob({ pattern: "**/[^_]*{md,mdx}", base: "./src/data/blog" }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// reference the authors collection https://docs.astro.build/en/guides/content-collections/#defining-collection-references
			authors: z.array(reference("authors")),
			// Transform string to Date object
			pubDate: z
				.string()
				.or(z.date())
				.transform((val) => new Date(val)),
			updatedDate: z
				.string()
				.optional()
				.transform((str) => (str ? new Date(str) : undefined)),
			heroImage: image(),
			tags: z.array(z.string()),
			// blog posts will be excluded from build if draft is "true"
			draft: z.boolean().optional(),
		}),
});

// authors
const authorsCollection = defineCollection({
	loader: glob({ pattern: "**/[^_]*{md,mdx}", base: "./src/data/authors" }),
	schema: ({ image }) =>
		z.object({
			name: z.string(),
			avatar: image(),
			about: z.string(),
			email: z.string(),
			authorLink: z.string(), // author page link. Could be a personal website, github, twitter, whatever you want
		}),
});

// other pages
const otherPagesCollection = defineCollection({
	loader: glob({ pattern: "**/[^_]*{md,mdx}", base: "./src/data/otherPages" }),
	schema: () =>
		z.object({
			title: z.string(),
			description: z.string(),
			draft: z.boolean().optional(),
		}),
});

// PROJECTS
const projectsCollection = defineCollection({
    // Pointing to where your script wrote the files:
    loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }), 
    schema: z.object({
        title: z.string(),
        slug: z.string().optional(),
        
        // Dates
        date: z.coerce.date().optional(),
        endDate: z.coerce.date().optional(),

        // Professional Context
        employer: z.string().optional(),
        client: z.union([z.string(), z.array(z.string())]).optional(),
        role: z.string().optional(),

        // Taxonomy
        tags: z.array(z.string()).optional(),
        industry: z.string().optional(),
        category: z.string().optional(),
        codename: z.string().optional(),

        // Visuals: We use z.string() to allow external URLs (placeholders/R2)
        // The theme uses image() which requires local files. We bypass that here.
        heroImage: z.string().optional(),

        // Status
        draft: z.boolean().default(false),
        featured: z.boolean().default(false),
        description: z.string().optional(),
    }),
});

// EXPORT ALL
export const collections = {
    blog: blogCollection,
    authors: authorsCollection,
    otherPages: otherPagesCollection,
    projects: projectsCollection, // <--- This is the key fix
};