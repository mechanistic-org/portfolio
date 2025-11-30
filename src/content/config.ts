import { defineCollection, z } from "astro:content";

const projects = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        slug: z.string(),
        date: z.string(),
        endDate: z.string().optional(),
        employer: z.string(),
        client: z.array(z.string()),
        industry: z.string(),
        category: z.string(),
        tools: z.array(z.string()),
        production: z.string(),
        tags: z.array(z.string()),
        skillData: z.array(z.object({ name: z.string(), value: z.number() })),
        additionalSkills: z.array(z.string()).optional(),
        stats: z.object({ plastic: z.number(), metal: z.number(), pcb: z.number() }).optional(),
        gallery: z.array(z.string()),
        documents: z.array(z.object({ name: z.string(), url: z.string() })),
        links: z.array(z.object({ name: z.string(), url: z.string() })),
        heroImage: z.string(),
        draft: z.boolean(),
        description: z.string(),
        duration: z.string(),
        statusLabel: z.string(),
        skillGraph: z.string().optional(),
        partGraph: z.string().optional(),
    }),
});

export const collections = { projects };
