---
title: "Agentic API Blueprint"
description: "Future roadmap and architecture for migrating eriknorris.com to a Compiled Context metadata graph."
---

# 🤖 Agentic API Blueprint (Phase 2 CC Migration)

> **Status:** **DEFERRED.** This architecture was generated in a Feb 2026 session with an external Gemini architect. Implementation is officially paused until the legacy project portfolio (120+ projects) reaches a ready-state baseline. Do not execute this code until the "Scheduled CC Burst" protocol is activated.

## The Objective

To transition `eriknorris.com` from a passive HTML renderer (NLI) into an active, headless Knowledge Graph (Compiled Context).

## The Core Concept

Astro 5's Content Layer renders pages via Zod-validated collections. We can intercept this at build time to build a native API endpoint for LLMs that ignores the human MDX body, concatenates all deterministic variables (e.g., `<THE_CRISIS>`), and emits a highly dense `application/json` payload for Answer Engines.

## The Production Blueprint

### Endpoint: `src/pages/api/agent/projects.json.ts`

When activated, this Astro endpoint will automatically harvest all `index.mdx` Zod properties and compile them into a headless metadata graph:

```typescript
// src/pages/api/agent/projects.json.ts
import { getCollection } from "astro:content";

export const GET = async ({ request }) => {
  // 1. Ingest the entire legacy project collection
  const projects = await getCollection("project");

  // 2. Compile the deterministic Solid-State Cartridges
  const agenticPayload = projects.map((project) => {
    return {
      "@context": "https://schema.org",
      "@type": "EngineeringProject",
      entity_id: `https://eriknorris.com/projects/${project.id}`,

      // Strict metadata extraction via Zod frontmatter schema
      metadata: {
        title: project.data.title,
        taxonomy: {
          industry: project.data.industry,
          category: project.data.category,
        },
      },

      // Relational edges (MUST be converted to strict URIs in Phase 2)
      relational_edges: {
        hardware_constraints: project.data.hardware_constraints || [],
        software_constraints: project.data.software_constraints || [],
        applied_skills:
          project.data.skills?.map((skill) => `https://eriknorris.com/skills#${skill}`) || [],
      },

      // INGRESS POINT: The Compiled Context
      // LLMs parse the tags embedded within the markdown body.
      compiled_context: {
        raw_mdx_payload: project.body,
        directive: "Extract <THE_CRISIS> and <THE_RESOLUTION> tags from the raw payload.",
      },
    };
  });

  // 3. Emit the optimized, cacheable JSON Knowledge Graph
  return new Response(JSON.stringify(agenticPayload), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
};
```

## Infrastructure Integration (Phase 2)

1.  **Cloudflare WAF:** The URI Bypass rule must be updated to include `http.request.uri.path eq "/api/agent/projects.json"` to prevent JS blocks.
2.  **Breadcrumbs:** Inject an absolute URI pointing to this endpoint into `public/llms.txt`.
3.  **Schema Hardening:** Open `src/content.config.ts` and modify `relational_edges` arrays to strictly enforce URI mappings instead of flat strings (e.g., Map "Onshape" to a wikidata entity).
