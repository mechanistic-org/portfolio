---
description: Scaffolds a new project entry using the production-grade C24 schema.
---

# Scaffold New Project

Trigger this workflow by running `/scaffold_project` or asking to "Scaffold a new project".

1.  **Request Input**: Ask the user for the following required fields:
    - `slug` (Must be snake_case, e.g., `project_feature`)
    - `title` (Project Name)
    - `employer` (Company or Context)

2.  **Create Directory**: Create the folder `src/content/projects/{slug}`.

3.  **Generate MDX**: Create `src/content/projects/{slug}/index.mdx` using the **Strict C24 Schema** below. This file serves as your **Career Master Matrix**. Replace the `{placeholders}` with the inputs.

    ```markdown
    ---
    slug: { slug }
    title: "{title}"
    employer: "{employer}"
    date: 2026-01-01
    draft: true
    # Asset Sovereignty: Image must exist in R2_STAGING/{slug}/
    heroImage: /assets/r2/{slug}/hero.webp
    theme: hyperspace
    production: Concept
    category: Uncategorized
    industry: Tech
    client: []
    tags: []
    tools: []
    toolIcons: []
    teamSize: "Unknown"
    duration: "Active"
    statusLabel: "In Progress"

    # METRICS (The Real Data - C24 Schema)
    metrics:
      financial:
        toolingBudget: 0
        toolingActual: 0
        margins: []
        costOfGoodsSold: []
      process:
        dcdCount: 0
        engineeringChangeOrders: []
      isomorphic_proofs: []

    # STATS
    phase_stats:
      Strategy: 0
      Design: 0
      Engineering: 0
      Production: 0

    # CYBERSPACE (The Layout)
    cyberspace:
      layout: linear
      narrative: []
      stickies: []

    additionalSkills: []
    documents: []
    gallery: []
    links: []
    skillData: []
    stats: {}
    isomorphic_proofs: []
    ---

    ## I. PROJECT SUMMARY

    - **Role:** [Role]
    - **Timeline:** [Dates]
    - **Objective:** [Goal]
    - **Core Achievement:** [Result]

    ## II. THE CAST (Stakeholders & Nodes)

    - **Name**: Role

    ## III. METABOLIC LAYER (Isomorphic Proofs)

    _Isomorphic Proofs are enrichment: the secret sauce added to cement credibility, ownership, and trust by showing you've survived Round Zero and possess deep, cross-domain knowledge._

    ### 1. The Constraint (The Scar)

    - **The Physical Constraint:** [Describe the hardware reality/constraint]
    - **The Structural Property (sharedFailureMode):** [The invariant mechanism connecting both domains]
    - **The Digital Analogue (Structural Rhyme):** [How this maps to a software/digital principle]
    - **The Action/Result:** [How you navigated it]
    ```

4.  **Enforce Asset Sovereignty**:
    - Check if the directory `d:\GitHub\eriknorris-assets\R2_STAGING\{slug}` exists.
    - If NOT, remind the user: _"Please create the Sovereign Asset folder at `...R2_STAGING\{slug}` and ensure `public/assets/r2` is symlinked."_

5.  **Completion**: Notify the user that the project shell is ready at `src/content/projects/{slug}/index.mdx`.
