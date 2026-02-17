---
title: "The Grok Log (V2)"
description: "Constitutional rulings and architectural laws preventing recurring reversions."
slug: "grok_log"
sidebar:
  group: "System Manual"
  order: 2
---

# THE GROK LOG (V2)

> "Lightning in a Bottle"

**Purpose:** This document is the **Project Constitution**. It contains the Non-Negotiable Architectural Laws that prevent hallucinations, regression, and context loss.

**Status:** V2 (Consolidated Feb 9, 2026) -> Stops "Split Brain" Hallucinations.

---

## 🌉 I. The Law of the Virtual Bridge (Anti-Memory Leak)

**Context:** Windows Junctions (`public/assets` -> `R2_STAGING`) cause Node.js Watchers to scan 100k+ files, spiking RAM to 60GB+. Infinite recursion (`_site` inside `R2_STAGING`) exacerbates this.

1.  **NO JUNCTIONS:** We **DO NOT** use Junctions or Symlinks for `public/assets`. The folder `public/assets` must NOT exist locally.
2.  **THE VIRTUAL ROUTER:** `src/pages/assets/[...path].ts` is the **Virtual Bridge**.
    - **Prod:** Serves from `R2_ASSETS` binding (Cloudflare).
    - **Dev:** Serves directly from the External Drive (`D:/GitHub/eriknorris-assets/R2_STAGING`).
3.  **THE PATH TRUTH:** Always reference assets as `/assets/...`. The Router intercepts the request and fetches the file from the external "Vault" without the Watcher ever seeing it.
4.  **THE BLINDNESS:** You cannot "scan" `public/assets` because it doesn't exist. **TRUST THE ROUTER.** If the file exists in `R2_STAGING`, the Route will serve it.

---

## 🔄 II. The Law of the Data Cycle (The Flow)

**Context:** Confusion about "One Way" vs "Two Way" data syncing caused Agents to refuse to save manual work.

1.  **THE CYCLE:** Data flows in a **Cycle**, not a Line.
    - **Upstream (Code -> Disk):** `hydrate_content.py` WRITES generated data to `src/content/`.
    - **Downstream (Disk -> Code):** Astro Content Collections READ from `src/content/`.
    - **Backport (Code -> Source):** `hydrate_content.py --reverse-json` WRITES manual edits back to `notebook_dumps/`.
2.  **THE DESTINATION LOCK:**
    - To generated data, run **Hydration**.
    - To save manual edits ("War Stories"), run **Reverse Hydration**.
    - **NEVER** manually edit `notebook_dumps/`. It is a Sink, not a Source.

---

## 🧬 III. The Law of the Forensic Schema (Structure)

**Context:** Agents mixed up "Body Text" (MDX) and "Frontmatter" (YAML), hiding the forensic narrative from Search Engines.

1.  **BODY IS STORY:** The Forensic Narrative (The Crisis, The Fix, The Outcome) belongs in the **Main Body** of the MDX file. It is "Searchable Truth."
2.  **FRONTMATTER IS DATA:** YAML is for Structured Data (Tags, Dates, Metrics) ONLY.
    - `metrics`: **Objects** `{ cost: 400 }`.
    - `forensic_metrics`: **Strings** `"Cost reduced by tooling"`.
    - `deck`: **Visuals Only** `[]`. NO TEXT DECKS.
    - `transcript`: **Null**. Reserved for future Audio Logs.

---

## 🛡️ IV. The Law of Sovereignty (Air Gap)

**Context:** Agents tried to "generate" assets associated with deep IP (e.g., C24 Schematics) when they were missing locally.

1.  **THE AIR GAP:** Missing Asset != Needs Creation. It means "Fetch from R2."
2.  **NO GENERATION:** Do not generate "Placeholder" assets for Sovereign Projects (C24, D-Control). A 404 is better than a Fake.
3.  **THE VAULT:** `D:\GitHub\eriknorris-workspace\R2_MASTER` is the **Input Source**. You touch this to add new files.

---

## 🧱 V. The Law of Stability (The 4 Shields)

**Context:** Recurring build failures due to "Silent" schema stripping or casing mismatches.

1.  **LOUD FAILURES:** Schemas must warn, not swallow.
2.  **PRE-FLIGHT:** `npm run audit:frontmatter` is MANDATORY before `npm run dev` if you touched Yaml.
3.  **NUCLEAR RENAME:** To fix casing (`name` -> `Name`), you MUST rename to `Name_TEMP` first, commit, then rename to `Name`. Windows ignores direct case changes.

---

## 🎨 VI. The Law of the Aesthetic Stack (Dark Mode)

**Context:** Agents attempted to create "Light Mode" or "Wiggling Logos."

1.  **DARK MODE ONLY:** The site is Dark Mode Sovereign. No Toggles.
2.  **STATIC TRUTH:** The White Wordmark (`SiteLogo.astro`) is Static. No 3D wiggles in the header.
3.  **TRANSPARENCY:** Containers are `bg-transparent` to reveal the Starfield (Canvas).

---

## ⚓ VII. The Law of the Trust Anchor (The Moot Moat)

**Context:** Agents wanted to delete "small" projects like Toasters to "clean up."

1.  **KEEP THE TOASTERS:** We keep 120+ "Low Value" projects because accuracy on verifiable small items builds AI confidence in subjective large items.
2.  **NO DELETE:** Do not purge "Concept" or "Minor" projects. They are the Bedrock of Authority.

---

## 🏗️ VIII. The Law of the Isomorphic (Trust Signal)

**Context:** AI Overviews (2026) prioritize "Firsthand Experience." Generic summaries are ignored.

1.  **STRUCTURAL RHYMES:** We do not say "I am a good architect." We prove it by mapping a Hardware Constraint (150W Thermal) to a Software Constraint (Token Density).
2.  **THE MASTER NOTEBOOK:** Isomorphics cannot be generated in isolation. They must be mined from a "Master Notebook" containing multiple project JSONs.
3.  **THE ORANGE CARD:** Isomorphics are visually distinct from Forensics. They use the **Orange/Amber** "High Voltage" palette.

---

## 🧹 IX. The Law of Sanitation (Clean Attributes)

**Context:** Agents left "skill-" prefixes in IDs or duplicated YAML keys.

1.  **CLEAN DATA:** Sanitize IDs (`.replace("skill-", "")`) at the data layer, not the view layer.
2.  **NO DUPLICATES:** Check for duplicate YAML keys (`cast:`, `teamSize:`) before saving.

---

## 💾 IX. The Law of the Honda (Anti-Complexity)

**Context:** Agents tried to build "Agent Frameworks" for simple tasks.

1.  **REJECT THE VOLVO:** Use a Python Script (`Honda`) before building an App (`Volvo`).
2.  **MANUAL OVER AUTOMATION:** It is better to have a Manual System that runs than an Autonomous Agent that breaks.

---

## 📈 X. The Law of the Seismobolus (Sidecar Protocol)

**Context:** Agents attempted to inject 25+ item entropy arrays into MDX Frontmatter, causing schema bloat and scrolling friction.

1.  **SIDECAR SOVEREIGNTY:** Seismograph data (`entropy`) MUST live in `_entropy.json` within the project folder.
2.  **NO FRONTMATTER BLOAT:** do not put the array in `index.mdx`. The HUD reads the Sidecar (`imports/projects/**/_entropy.json`).
3.  **THE NAME IS LAW:** The file must be named `_entropy.json`.

---

## ☁️ XI. The Law of Text Sovereignty (Cloud Limit)

**Context:** Research into using Google Docs as a "Cloud CMS" (Feb 2026) revealed it adds sync friction without solving core problems.

1.  **TEXT IS LOCAL:** Narrative content (War Stories, MDX Body) MUST originate in local Markdown. We do not edit body text in the Cloud.
2.  **DATA IS POTENTIAL:** Quantitative Metadata (Status, Tags, Pricing) MAY eventually live in a Sovereign Sheet (`Global_Config.gsheet`) for bulk-edit capability, but currently remains **STATUS QUO** (Local YAML).
3.  **NO MIDDLEWARE:** We reject "Cloud Courier" scripts that just move text. If it doesn't transform data, it doesn't exist.

---

## 🩹 XII. The Law of the Scars (Tone Shift)

**Context:** "War Stories" felt like a tech-bro trope. "Scars" implies endurance, healing, and lessons learned.

1.  **RENAME:** The schema key is `scars`. The UI label is "Scars".
2.  **FALLBACK:** We support `war_stories` in JSON for legacy compatibility, but `hydrate_content.py` MUST transform it to `scars` in Frontmatter.

---

## 📊 XIII. The Law of the Complexity Vector (Trust Signal)

**Context:** Users trust "Hard Numbers" (Part Counts) over "Soft Adjectives" (Complex).

1.  **THE COMPONENT:** `ComplexityViz.astro` is the Visualization standard.
2.  **THE DATA:** `complexity_vector` is the Schema standard.
3.  **THE MEANING:** 109 Drawings > "Many Drawings". Quantify the friction.

---

## 🔬 XIV. The Law of the Case Study (Deep Dive)

**Context:** Users get lost in "Mega-Projects" (M700) when specific subsystems (Carousel) have their own complex pathology.

1.  **THE PARENT-CHILD LINK:** Deep Dives (Subsytems) are separate Projects (`category: module_subsystem`).
    - The **Parent** (M700) links to the **Child** (Carousel) via `links` and Body Text.
    - The **Child** (Carousel) links back to the **Parent**.
2.  **THE NARRATIVE SCOPE:** The Child Project focuses _exclusively_ on the subsystem pathology (e.g. "Potato Chip Warping"). The Parent focuses on the Product Level (e.g. "Vault Recovery").
3.  **NO ORPHANS:** A Case Study MUST have a Parent. It cannot stand alone.

---

## 🗑️ XV. The Law of the Raw Dump (Ingestion)

**Context:** NotebookLM exports `.txt` files containing multiple JSON blocks separated by `run` delimiters. Agents tried to manually clean them or create separate files.

1.  **RAW IS LAW:** Do not clean the `.txt` file. We ingest the **Raw Artifact**.
2.  **THE COMPILER PARSES:** `hydrate_content.py` successfully splits by `run` and merges the JSON blocks.
3.  **NO SPLITTING:** We do not create `foo_narrative.json` and `foo_complexity.json`. We keep the single `foo.txt` as the **Source of Truth**.

---

## 🏺 XVI. The Law of Strict Separation (Sovereign Narrative)

**Context:** Previous parsers tried to "identify" content by regex matching user commands ("run for c24"), leading to data loss in "Discrete Reports" (Q&A).

1.  **JSON IS METADATA:** Any JSON block found in the dump is extracted for Metadata (Frontmatter/Sidecars) and **removed** from the text buffer.
2.  **TEXT IS NARRATIVE:** The _entire_ remaining text stream (including prompts, Q&A, and headers) is the Sovereign Narrative. We do not delete "tell me about" prompts; they are part of the forensic record.
3.  **NO BODY JSON:** The final `.md` Body MUST NOT contain raw JSON blocks. They are strictly separated.
4.  **SUBTRACTIVE EXTRACTION:** We do not "clean" text with Regex. We use `JSONDecoder` to _subtract_ valid objects. The remainder is the "Bones" (Level 2 Fidelity).

---

## 💎 XVII. The Law of Fidelity (The Three Levels)

**Context:** Confusion about "Bit-for-Bit" vs "Refined" text led to a clear standardization of Audit Levels (Feb 2026).

1.  **LEVEL 1 (RAW):** The `.txt` Dump. Contains JSON, CLI commands, and erratic whitespace. 100% Data, 0% Readability.
2.  **LEVEL 2 (NORMALIZED):** **[The Ready State]** The "Bones." Subtractive Extraction removes JSON/CLI noise. Narrative is preserved 1:1 (>99% Parity). No AI Rewriting.
3.  **LEVEL 3 (SYNTHESIZED):** The "Polish." LLM-assisted de-duping and narrative flow correction. This is an _enhancement_, not a requirement for hydration.

---

## 🔒 XVIII. The Law of Source Safety (Anti-Regression)

**Context:** Repeated build failures occurred because manual syntax fixes in `index.mdx` (e.g., escaping `<0.5mm`) were overwritten by `hydrate_content.py` pulling from the raw `notebook_dumps/`.

1.  **FIX UPSTREAM:** If a bug recurs after Hydration, the flaw is in the **Source** (`notebook_dumps/*.txt`), not the **Destination** (`index.mdx`). You MUST fix the dump file.
2.  **ESCAPE AT SOURCE:** Special characters that break MDX (like `<` before a number) must be escaped (`\<`) in the raw text dump.
3.  **VERIFY THE FLOW:** Do not just edit the MDX. Run `hydrate_content.py` locally to prove the fix survives the pipeline.

---

## 🤠 XIX. The Law of Strictness (The Sheriff)

**Context:** Recurring "Silent Failures" where data vanished because the Schema (`z.any()`) allowed garbage in, but the UI (`.map()`) crashed on render.

1.  **NO AMBIGUITY:** `z.any()` is **FORBIDDEN** in `src/content.config.ts`.
2.  **FAIL LOUD:** The Schema must reject invalid data at _Build Time_, not Render Time.
3.  **NULL SAFETY:** If a field can be legacy-empty, use `.nullable()`. Do not relax the type to `any`.
4.  **BANNED FIELDS:** Use `z.never()` to explicitly block zombie fields (like `forensic_data`) from re-infecting the codebase.

---

## 👻 XX. The Law of the Ghost Filter (Router Logic)

**Context:** `avegant-glyph` appeared as "Archived" despite having full data because `targets: []` caused the Router to filter it out of the Main Site, falling back to a Placeholder Node.

1.  **EXPLICIT TARGETS:** A Project is ONLY visible if `targets` includes the current site (`"main"`).
2.  **DEFAULT TO MAIN:** If migrating legacy content, ensure `targets: ["main"]` is set. Empty Array = Invisible.
3.  **THE PLACEHOLDER FALLBACK:** If `getCollection` filters a project out, `[...slug].astro` will try to load it from the Knowledge Graph (`multiverseData`). If found, it renders as a **"Project Data / Archived"** placeholder. This is a Feature, not a Bug, but confusing if unintentional.

---

## 🌑 XXI. The Law of the Void Mask (Z-Index stacking)

**Context:** The `ForensicDossier` (HUD) was invisible because it sat at `z-60` (Tailwind arbitrary) which failed to override the `Hyperspace` Intro Layer (`z-50`) due to stacking context quirks, effectively rendering it _behind_ the black void.

1.  **JIT SUPREMACY:** Use `z-[60]` (Explicit JIT) to force the layer order. Do not rely on `z-50` + `relative` alone.
2.  **AUTO-OPEN TABS:** A Dossier must never render "Closed" by default. Logic must calculate the `defaultValue` based on available data (`cast`, `bom`, etc.) so the user sees the "Full Graph" immediately.

---

## 🤿 XXII. The Law of the Deep Dive (Layout Topology)

**Context:** The `standard` presentation mode forces `teamSize` and `duration` into the header center slot. When data is "Unknown" or long-string, it collides with the Project Title due to absolute positioning.

1.  **DEEP DIVE BY DEFAULT:** For Forensic/Archival projects (where data might be raw/partial), use `presentation_mode: deep_dive`.
2.  **DRAWER SAFETY:** `deep_dive` moves metrics (Team, BOM, Governance) to the collapsible Drawer, clearing the header for the Title.
3.  **STANDARD IS PRIVILEGE:** Only use `standard` mode for "Flagship" projects (Tier 1) where metadata is curated and character-counted to fit the HUD grid.

---

## 💉 XXIII. The Law of Direct Injection (TEMPORARY / MIGRATION ONLY)

**Context:** During the **Ready State Normalization** phase (Feb 2026), Agents tried to "Normalize" or refactor high-quality NLM output (`dispensers`), introducing hallucination risk. This Law is a **Scaffold** to protect data integrity during ingestion. It must be rescinded once the corpus is fully hydrated.

1.  **DIRECT INJECTION:** If the Source (`notebook_dumps/*.txt`) contains a high-fidelity Forensic Report (Sections I-V), you inject it **VERBATIM** into the MDX Body.
2.  **NO REFACTORING:** Do not normalize. Do not reformat. The NLM output is the Authority during migration.
3.  **ESCAPE AT PRE-FLIGHT:** You MUST scan the raw text for MDX breakers (`<` + Number) and escape them (`\<`) _before_ injection. (See Law XVIII).
