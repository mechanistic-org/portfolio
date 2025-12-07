import { defineCollection, z } from "astro:content";

const projects = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        slug: z.string(),
        date: z.string(),
        endDate: z.string().optional(),
        role: z.string().optional(),
        employer: z.string(),
        client: z.array(z.string()),
        industry: z.string(),
        category: z.string(),
        tools: z.array(z.string()),
        toolIcons: z.array(z.string()).optional(),
        production: z.string(),
        tags: z.array(z.string()),
        teamSize: z.string().optional(),
        skillData: z.array(z.object({
            name: z.string(),
            value: z.number(),
            benchmark: z.number().optional()
        })).optional(),
        additionalSkills: z.array(z.string()).optional(),
        phases: z.any(),
        gallery: z.array(z.object({
            src: z.string(),
            width: z.number(),
            height: z.number(),
            aspectRatio: z.number()
        })),
        documents: z.array(z.object({ name: z.string(), url: z.string() })),
        links: z.array(z.object({ name: z.string(), url: z.string() })),
        heroImage: z.string(),
        draft: z.boolean(),
        description: z.string(),
        duration: z.string(),
        statusLabel: z.string(),
        skillGraph: z.string().optional(),
        partGraph: z.string().optional(),
        impact: z.string().optional(),
    }),
});

const colophon = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        slug: z.string().optional(),
        subtitle: z.string(),
        icon: z.string(), // Lucide icon name
        color: z.string(), // Tailwind color class base (e.g., "green", "blue")
        order: z.number(),
    }),
});

const docs = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        draft: z.boolean().optional(),
        sidebar: z.object({
            label: z.string().optional(),
            group: z.string().optional(),
            order: z.number().optional(),
            badge: z.object({
                text: z.string(),
                variant: z.enum(["default", "production", "prototype", "concept"]).optional(),
            }).optional(),
        }).optional(),
    }),
});

export const collections = { projects, colophon, docs };
