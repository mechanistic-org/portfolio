import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

// 1. BLOG
const blogCollection = defineCollection({
    loader: glob({ pattern: "**/[^_]*{md,mdx}", base: "./src/data/blog" }),
    schema: ({ image }) => z.object({
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

// 2. AUTHORS
const authorsCollection = defineCollection({
    loader: glob({ pattern: "**/[^_]*{md,mdx}", base: "./src/data/authors" }),
    schema: ({ image }) => z.object({
        name: z.string(),
        avatar: image(),
        about: z.string(),
        email: z.string(),
        authorLink: z.string(),
    }),
});

// 3. OTHER PAGES
const otherPagesCollection = defineCollection({
    loader: glob({ pattern: "**/[^_]*{md,mdx}", base: "./src/data/otherPages" }),
    schema: () => z.object({
        title: z.string(),
        description: z.string(),
        draft: z.boolean().optional(),
    }),
});

// 4. PROJECTS
const projectsCollection = defineCollection({
    loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
    schema: z.object({
        title: z.string(),
        slug: z.string().optional(),
        date: z.coerce.date().optional(),
        endDate: z.coerce.date().optional(),

        employer: z.string().optional(),
        industry: z.string().default("Other"),
        category: z.string().optional(),
        tools: z.array(z.string()).default([]),
        production: z.string().optional(),

        client: z.array(z.string()).default([]),
        tags: z.array(z.string()).default([]),

        skillData: z.array(z.object({
            name: z.string(),
            value: z.number()
        })).default([]),

        gallery: z.array(z.object({
            src: z.string(),
            width: z.number(),
            height: z.number(),
            aspectRatio: z.number()
        })).default([]),

        documents: z.array(z.object({
            name: z.string(),
            url: z.string()
        })).default([]),

        links: z.array(z.object({
            name: z.string(),
            url: z.string()
        })).default([]),

        stats: z.object({
            plastic: z.number().default(0),
            metal: z.number().default(0),
            pcb: z.number().default(0)
        }).optional(),

        heroImage: z.string().optional(),
        draft: z.boolean().default(false),
        description: z.string().optional(),

        // New fields
        duration: z.string().optional(),
        statusLabel: z.string().optional(),
        additionalSkills: z.array(z.string()).default([]),
        skillGraph: z.string().optional(),
        partGraph: z.string().optional(),

        // V4 Scrolly Engine
        cyberspace: z.any().optional(),

        // Theme Selector (Core Architecture)
        theme: z.string().optional(),

        // Visibility
        listed: z.boolean().default(true),
    }),
});

export const collections = {
    blog: blogCollection,
    authors: authorsCollection,
    otherPages: otherPagesCollection,
    projects: projectsCollection,
};
