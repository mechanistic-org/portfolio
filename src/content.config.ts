import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

// 1. BLOG (Existing)
const blogCollection = defineCollection({
    loader: glob({ pattern: "**/[^_]*{md,mdx}", base: "./src/data/blog" }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            description: z.string(),
            authors: z.array(reference("authors")),
            pubDate: z.string().or(z.date()).transform((val) => new Date(val)),
            updatedDate: z.string().optional().transform((str) => (str ? new Date(str) : undefined)),
            heroImage: image(),
            tags: z.array(z.string()),
            draft: z.boolean().optional(),
        }),
});

// 2. AUTHORS (Existing)
const authorsCollection = defineCollection({
    loader: glob({ pattern: "**/[^_]*{md,mdx}", base: "./src/data/authors" }),
    schema: ({ image }) =>
        z.object({
            name: z.string(),
            avatar: image(),
            about: z.string(),
            email: z.string(),
            authorLink: z.string(),
        }),
});

// 3. OTHER PAGES (Existing)
const otherPagesCollection = defineCollection({
    loader: glob({ pattern: "**/[^_]*{md,mdx}", base: "./src/data/otherPages" }),
    schema: () =>
        z.object({
            title: z.string(),
            description: z.string(),
            draft: z.boolean().optional(),
        }),
});

// 4. PROJECTS (Updated for Faceted Architecture)
const projectsCollection = defineCollection({
    loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }), 
    schema: z.object({
        title: z.string(),
        slug: z.string().optional(),
        
        // Dates
        date: z.coerce.date().optional(),
        endDate: z.coerce.date().optional(),
        
        // Facets (Matching ingest_data.py)
        employer: z.string().optional(),
        industry: z.string().default("Other"),
        category: z.string().optional(), // Added this missing field
        production: z.string().optional(),
        
        // Arrays (Tools, Clients, Tags)
        tools: z.array(z.string()).default([]),
        client: z.array(z.string()).default([]), 
        tags: z.array(z.string()).default([]),
        
        // Visuals & Meta
        heroImage: z.string().optional(),
        draft: z.boolean().default(false),
        description: z.string().optional(),
    }),
});

export const collections = {
    blog: blogCollection,
    authors: authorsCollection,
    otherPages: otherPagesCollection,
    projects: projectsCollection,
};