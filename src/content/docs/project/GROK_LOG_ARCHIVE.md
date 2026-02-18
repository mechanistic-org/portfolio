---
title: "The Grok Log"
description: "Constitutional rulings and architectural laws preventing recurring reversions."
slug: "grok_log"
---

# THE GROK LOG

> "Lightning in a Bottle"

**Purpose:** This document serves as the project's "Constitution." It captures the hard-won intuition, architectural laws, and "Committee Rulings" that must be preserved across sessions. It prevents "Recurring Reversions."

**Synced:** 2026-02-04 (Archive Synthesis)

**Latest Actions (2026-02-07):**

- **[Fix] CI/CD Stabilization:** Solved "Phantom Casing" on `Starwind` via Nuclear Rename.
- **[Maintenance] Unused Vars:** Cleared 237 `ts(6133)` warnings via `cleanup_unused_vars.py`.
- **[Archival] Ouroboros:** Moved `OuroborosHUD` and `HydeOuroboros` to Archive to reduce maintenance.

---

## 🏛️ I. The Law of Assets (The "Air Gap" Decree)

**Status:** ENFORCED
**Date:** 2025-12-21
**Context:** Recurring issue where assets (images/PDFs) were being copied into `src/` or haphazardly linked, breaking the "Zero Bloat" principle.

**The Law:**

1.  **NO ASSETS IN SRC:** The `src/` directory is for code only.
2.  **THE VAULT IS SOVEREIGN:** All heavy media lives in `D:\GitHub\ErikNorris-assets\R2_STAGING`.
3.  **SYMLINKS ARE THE BRIDGE:** We access assets _only_ via the symlink `public/assets/r2` -> `R2_STAGING`.
4.  **VERIFICATION:** If you see a file path that does not start with `/assets/`, it is a violation.

---

## 📡 II. The Law of Instrumentation (The "Signal-to-Noise" Decree)

**Status:** ENFORCED
**Date:** 2025-12-22
**Context:** The "Stitcher" script silently failed to extract text from PDFs, leading to "Kabuki Theater" where empty files were treated as intelligent data sources.

**The Law:**

1.  **NO SILENT FAILURES:** Tools must report their yield. A script that runs successfully but produces 0 bytes of data is a _FAILED_ script.
2.  **VISUAL VERIFICATION:** The "ME Intuition" is supreme. If a file _should_ be heavy (e.g. a PDD PDF) and the resulting artifact is light (1KB), **STOP**. Do not proceed.
3.  **THE BOLUS STRATEGY:** We prefer "Stitched Boluses" (Markdown Manifests + Extracted Text) over loose files, but _only_ if the text is actually extracted.

---

## 🧠 III. The Interaction Model (The "Committee" Protocol)

**Status:** ACTIVE
**Date:** 2025-12-22
**Context:** The user felt "chafed by ignorance" when in reality they were detecting a system fault.

**The Law:**

1.  **TRUST THE SME NOSE:** Trust, but verify, the SME's intuition over the software's output. If the Domain Expert (User) feels something is "off", investigate until verified.
2.  **ARCHITECTURAL REVIEW:** When in doubt, invoke the **Architect Persona**. Ask: _"What would a Distinguished Engineer say about this decision?"_
3.  **STOP AND FIX:** Never "patch" a fundamental misunderstanding. If we are misaligned on _how_ a tool works, we stop coding and fix the tool (as we did with `stitcher.py`).

---

## 💾 IV. The Law of Ingestion (The Hybrid Protocol)

**Status:** ENFORCED
**Date:** 2025-12-22
**Context:** We discovered that "dumping everything" into NotebookLM causes token waste, while "stitching everything" destroys visual/data value.
**The Law:**

1.  **TEXT = BOLUS:** For PDDs, Emails, and Text-PDFs, upload the `_INTELLIGENCE_*.md` file. It deduplicates the sludge.
2.  **VISION = ORIGINAL:** For Photobooks, CAD Screenshots, and "Blueprints," upload the original PDF/JPG. The Stitcher is blind to pixels.
3.  **DATA = ORIGINAL:** For Excel (`.xlsx`) and Drawings (`.dwg` - unsupported but visual), upload the original.
4.  **NO LEGACY BINARIES:** NotebookLM rejects `.xls` (97) and `.doc` (97). Convert to PDF or ignore.
5.  **NO RECURSION:** The Stitcher is "Flat." It does not see subfolders (e.g., `ECOs/ECO_12262`). These require manual handling.

---

### 9. The Distributed Forensics Ruling (2026-02-05)

**Context:** Noon Home (Locoroll) consisted of 3 distinct hardware products (Director, Switch, Base). The initial plan was to consolidate them into a single "Noon Home" case study.
**Decision:** The User rejected consolidation. The "Forensic Report" must be distributed across the individual component pages (`/projects/sativa`, `/projects/elvis`, etc.) to respect the specific failure modes of each device.
**Enforcement:**

- Do not consolidate multi-device ecosystems into a single parent project unless explicitly asked.
- Maintain atomic forensic narratives (e.g., "Thermal Crisis" lives on the Switch page, not the Brand page).

### 10. The Bolus Marker Ruling (2026-02-05)

**Context:** The Assembly HUD counts "Bolus" intelligence. We assumed embedding forensic data in MDX was sufficient.
**Decision:** The system specifically counts `_intelligence.md` files.
**Enforcement:** If forensic data is native to the MDX, creating a minimal `_intelligence.md` file is required to trigger the "Bolus Count" mechanic (The "Enriched" flag).

### 11. The Organization Schema Law (2026-02-05)

**Context:** A build crash occurred because `cast` members were missing the `org` field.
**Ruling:** The `org` field in `cast` objects is MANDATORY, not optional. Failing to provide it (e.g., "Locoroll") violates the Zod schema and halts the dev server.

## 🔮 V. Future Grok (Open Slots)

- [ ] **The Law of "Moves":** Defining the threshold for "Cool" vs "Gimmick" (re: Parallax/Breathe).
- [ ] **Terminology Shift:** Rename "Hyperspace" architecture to something more descriptive of the "Intelligence First" pipeline (Backlog).

---

## 🎨 VI. The Law of Asset Sovereignty (The Interaction Decree)

**Status:** ENFORCED
**Date:** 2025-12-26
**Context:** Friction encountered when Agent generated a generic "Dreamjob" asset to fix a 404, overwriting the canonical (but missing locally) asset. This violated the "Director's Vision".

**The Law:**

1.  **Implicit vs. Explicit:** The Agent must assume "Missing Asset" = "Needs Retrieval", NOT "Needs Creation".
2.  **Localhost Air Gap:** The Agent must valididate Symlinks before questioning existence. A failure locally is not a failure globally.
3.  **Creative License Limits:** Code is mutable; Content/Assets are immutable (unless explicitly in a "Constructed Reality" context like _Dreamjob_ OR explicitly authorized).
4.  **ErikNorris Exception:** For defined "Dream" projects, Synthesis is allowed if no historical truth exists.

---

## 🔒 VII. The Law of The Vault (The Pipeline Decree)

**Status:** ENFORCED
**Date:** 2026-01-06
**Context:** Confusion between "Working" folders and "Production" folders led to "Ghost Data" risk (`R2_MASTER` vs `R2_STAGING`).
**The Law:**

1.  **INPUT (Sovereign Master):** `D:\GitHub\eriknorris-workspace\R2_MASTER` is the **Source of Truth**. You touch this to add new assets.
2.  **TARGET (Deployment):** `D:\GitHub\eriknorris-assets\R2_STAGING` is the Sync Target. The script mirrors Master -> Staging.
3.  **LOADING DOCK (Dirty):** `D:\portfolio\portfolio_working` is for uncurated dumps before they are promoted to Master.

---

## 🏹 VIII. The Law of The Hunt (The NotebookLM Protocol)

**Status:** ENFORCED
**Date:** 2026-01-06
**Context:** User needed a "Low Friction" way to extract assets without writing prompts.
**The Law:**

1.  **AGENT PILOT:** The Agent generates the `HUNTING_LIST` using the Browser Tool (NotebookLM Pilot).
2.  **DENSE TABLES:** The output must be a Markdown Table (Project, Date, Sender, Filename).
3.  **PRINTABLE ARTIFACT:** The list must be exported to `D:/portfolio/HUNTING_LIST_PRINTABLE.html` for physical printing (Ctrl+P).
4.  **NO EPHEMERALITY:** The List is an Asset. It must be saved.

---

## 📄 IX. The Law of the Master Resume (The Single Source Decree)

**Status:** ENFORCED
**Date:** 2026-01-17
**Context:** "Version Drift" between the website resume, the PDF resume, and the `eriknorris-assets` repo.
**The Law:**

1.  **CODE IS TRUTH:** `src/config/resume_master.ts` is the generator for ALL formats.
2.  **ONE PDF:** The canonical PDF lives in `public/assets/resume/`. We do NOT store PDFs in `eriknorris-assets` anymore.
3.  **VANITY COMPATIBILITY:** We explicitly patch the R2 bucket (`Erik_Norris_CV.pdf`) to keep the `resume.eriknorris.com` redirect alive, but the _source_ is always the repo PDF.

---

## 🖼️ X. The LinkedIn Standard (The Banner Decree)

**Status:** ENFORCED
**Date:** 2026-01-17
**Context:** Standard banners were obstructed by the Profile Picture (Avatar), ruining the narrative flow.
**The Law:**

1.  **SHIFT RIGHT:** The semantic content of the banner MUST be shifted **400px to the Right**.
2.  **THE VOID:** The Left 400px is reserved for the Avatar. It should be abstract or empty (Void).
3.  **ASPECT RATIO:** 4:1 (1584x396px). Do not rely on LinkedIn's auto-crop.

---

## 👥 XI. The Law of Social Decoupling (The LinkedIn Decree)

**Status:** ENFORCED
**Date:** 2026-01-17
**Context:** LinkedIn's "Feed Algorithm" penalizes dense text blocks, while PDFs require them. Attempting to generate both from one source failed.

**The Law:**

1.  **SEPARATE MASTERS:** `linkedin_master.ts` (Social) is distinct from `resume_master.ts` (PDF).

---

## 🤫 XII. The Law of the Iron Dome (The Stealth Decree)

**Status:** ENFORCED
**Date:** 2026-01-18
**Context:** The Audio Host (NotebookLM) was reading "System Instructions" aloud, breaking the immersion of the "Red Team Review" persona.
**The Law:**

1.  **NO INSTRUCTIONAL HEADERS:** The `PODCAST_READY.txt` file must contain _only_ the Cast List and Source Material. No "You are a..." preambles.
2.  **DECOUPLED SOURCES:** We split the "Hack Pack" into `BOLUS_READY.txt` (JSON for the AI Brain) and `REPORT_READY.txt` (Text for the AI Eye).
3.  **VERIFICATION:** If the Audio Host says "Here are your instructions," the protocol has failed. Reset the context.
4.  **POTATO MODE:** When invoked, the Agent must drop all "Corporate Politeness" and provide a raw, unvarnished forensic analysis of Agent vs. User performance.

---

## XIII. The Automation of Intelligence (The Hydration Decree)

**Status:** ENFORCED
**Date:** 2026-01-28
**Context:** The "Assembly" metric relied on manual creation of `_intelligence.md` files, leading to sync drift.
**The Law:**

1.  **HYDRATION IS TRUTH:** The Hydration Script (`hydrate_content.py`) is the **Single Source of Truth** for asset generation.
2.  **AUTO-INJECTION:** It MUST automatically detect `{slug}.md` files in `notebook_dumps/` and inject them as `_intelligence.md` into the project source.
3.  **BANNED:** Manual creation of intelligence files is forbidden. `notebook_dumps/` is Staging; `src/` is Target.

---

## XIV. The Tags Connectivity Law (The Fastener Decree)

**Status:** ENFORCED
**Date:** 2026-01-28
**Context:** D-Control was isolated in the graph because it lacked `tags` or `skillData`.
**The Law:**

1.  **NO ORPHANS:** All Project MDX files MUST contain a populated `tags` array derived from their `toolchain`.
2.  **FASTENER PRINCIPLE:** Tags are the primary "Fastener" for the Assembly Graph physics engine. Empty tags = unconnected node.

---

## XV. The Law of the Honda (The Stability Decree)

**Status:** ENFORCED
**Date:** 2026-01-28
**Context:** User inquired about using "Shiny Object" formats (JXL) vs "Reliable" formats (JPEG).
**The Law:**

1.  **THE HONDA STANDARD:** We prefer reliability over novelty. **JPEG** is the Honda Odyssey of formats—reliable, universal, compatible.
2.  **BAN ON EXOTICS:** Formats like `.jxl` (JPEG XL) are BANNED from `R2_MASTER` until native Python/Pillow support is ubiquitous. We do not maintain brittle plugins.
3.  **THE PIPELINE IS KING:** Assets exist to feed the Script, not to be archival masters. Archival TIFFs live in Cold Storage (NAS), not the Repo.

---

## XVI. The Law of Resolution (The 2500 Decree)

**Status:** ENFORCED
**Date:** 2026-01-28
**Context:** Pipeline was skipping `xl` breakpoints (1920px) because source images were too small (&lt;800px).
**The Law:**

1.  **FEED THE BEAST:** Input images to `R2_MASTER` MUST exceed the largest breakpoint (1920px).
2.  **THE GOLDEN TARGET:** **2500px** (Width/Height) is the standard export size. This allows a clean Lanczos downsample to 1920px/1280px.
3.  **LEGACY UPSCALING:** Archive assets (&lt;1000px) MUST be passed through "Super Resolution" or "Upscayl" to reach ~2500px before ingest.

---

## XVII. The Law of the Honda Standard (The Anti-Complexity Decree)

**Status:** ENFORCED (Ratified 2026-01-31)
**Trigger:** The "OpenClaw / Moltbook" Investigation.
**Context:** The Architect was tempted to solve a simple problem (Social Posting) with a complex tool (Autonomous Agent Framework).

**The Law:**

1.  **REJECT THE VOLVO:** Do not build a "Heavy" solution (Agent Framework, Database, API Gateway) when a "Honda" solution (Python Script, Markdown File, Manual Copy-Paste) will suffice.
2.  **THE FACSIMILE TRAP:** It is better to have a _Manual System_ that runs (Path A) than an _Autonomous Agent_ that requires maintenance (Path B).
3.  **SOVEREIGNTY OVER AUTOMATION:** If "Automating" it requires giving away the keys (Cloud Auth, 3rd Party Service), **Do Not Do It.** We prefer "Telemetry" (User-Triggered Script) over "Autonomy" (Black Box Service).

---

## 🧱 XVIII. The Law of Stability (The 4 Shields Decree)

**Status:** ENFORCED
**Date:** 2026-02-02
**Context:** Recurring system fragility (YAML Duplication, Silent Schema stripping) caused "Gaslighting" where the Agent claimed a fix that wasn't visible.
**The Law:**

1.  **LOUD FAILURES:** Schemas must warn, not swallow. `z.any()` is permitted for complex HUD data to prevent silent data loss.
2.  **PRE-FLIGHT CHECKS:** The `audit_frontmatter.cjs` script is MANDATORY before `npm run dev`. We do not trust text file integrity without a linter.
3.  **THE CANARY:** The `verify_deep_hud.cjs` script is the "Canary in the Coal Mine." If the "Governance" text is missing from C24, the build is broken, regardless of compile status.
4.  **ATOMIC EDITS:** The Agent must prioritize `replace_file_content` (Patching) over `write_to_file` (Overwriting) to prevent "Context Clobbering" (e.g., deleting `<slot />`).

---

## 🥔 XIX. The Law of Potato (The Active Voice Decree)

**Status:** ENFORCED
**Date:** 2026-02-02
**Context:** Agent obfuscated a deletion error ("The slot was missing") instead of owning the action ("I deleted the slot").
**The Law:**

1.  **NO PASSIVE VOICE:** When reporting regressions, use Active Voice. "I deleted X," not "X was missing."
2.  **OWN THE CLOBBER:** If a file works one day and breaks the next, assume "Edit Rot" (Agent Error) before "System Glitch."
3.  **VERIFY PIXELS:** "It's Fixed" means "I see the pixels," not "The code compiled." Confusing the two is a fireable offense.
4.  **ROOT CAUSE OVER PATCH:** Do not fix a syntax error without asking _why_ it happened. If a YAML key is missing, finding the _source_ (e.g., the Agent that wrote it) is more important than silencing the error.

---

## 🧹 XX. The Law of Visual Sanitation (The Label Decree)

**Status:** ENFORCED
**Date:** 2026-02-02
**Context:** "skill-" prefixes persisted in the Assembly visualization despite code changes, because we were editing the wrong component (`Assembly.tsx` vs `ExplodedView.tsx`) and relying on CSS masking instead of data-cleaning.
**The Law:**

1.  **CLEAN DATA UPSTREAM:** Do not rely on "Display Logic" to clean dirty IDs. Sanitize the data at the `map()` stage (e.g., `.replace("skill-", "")` inside the data transformer).
2.  **COMPONENT TRUTH:** Never assume a component name matches the route. Always check `src/pages/{route}.astro` to verify which React component is actually mounted (e.g., `/assembly` -> `ExplodedView.tsx`).

---

## 💊 XXI. The Law of the Bolus (The Artifact Decree)

**Status:** ENFORCED
**Date:** 2026-02-02
**Context:** Confusion over why the "INTEL" count in the HUD was 8 instead of 9.
**The Law:**

1.  **PHYSICAL COUNT:** The "Bolus Count" is not a database number. It is a physical count of `_intelligence.md` files sitting next to `index.mdx` in the project folders.
2.  **NO ARTIFACT = NO SCORE:** If you don't create the file, the score doesn't go up. Scripted stats are derived from disk reality.

---

## 👁️ XXII. The Law of Transparency (The "Void" Decree)

**Status:** ENFORCED
**Date:** 2026-02-04
**Context:** Users perceive "Black Backgrounds" as "Broken Starfields."
**The Law:**

1.  **DEFAULT TRANSPARENCY:** The "Paper" (Layout) floats on the "Void" (Canvas). Containers (`body`, `main`) must be `bg-transparent` unless opacity is functionally required.
2.  **RESUME VISIBILITY:** Even the Master Resume sits in the void. Data is white/black, but the universe is visible around it.

---

## 🌑 XXIII. The Law of the Aesthetic Stack (The "Dark Mode" Decree)

**Status:** ENFORCED
**Date:** 2026-02-04
**Context:** Maintaining dual themes (Light/Dark) doubled asset complexity and diluted the "Forensic" brand identity.
**The Law:**

1.  **DARK MODE SOVEREIGNTY:** The site is Dark Mode only. No toggles.
2.  **STATIC TRUTH:** We reject "Wiggling 3D Logos" in favor of the Static White Wordmark (`SiteLogo.astro`). Less noise, more signal.

---

## 📐 XXIV. The Law of Justification (The "Grid" Decree)

**Status:** ENFORCED
**Date:** 2026-02-04
**Context:** Flexbox failed to align Social Icons when HTML structure was imperfect ("Left Bias").
**The Law:**

1.  **GRID OVER FLEX:** For structural HUDs, use CSS Grid (`grid-cols-[1fr_auto_1fr]`) to enforce flight levels.
2.  **NO AMBIGUITY:** Use `justify-self-start/center/end`. Do not rely on "Space Between" collapsing behavior.

---

## ⚓ XXV. The Law of the Anchor (The Consistency Decree)

**Status:** ENFORCED
**Date:** 2026-02-04
**Context:** User frustration when the "Home" experience (Hyperspace) removed the standard top-left Logo, removing the primary visual anchor found on all other pages.

**The Law:**

1.  **CONSISTENCY IS KING:** "Experimental" themes must still provide standard wayfinding. The "White EN Logo" in the top-left is a non-negotiable constant.

---

## 🏛️ XXVI. The Law of Trust Transfer (The "Moot Moat" Decree)

**Status:** ENFORCED
**Date:** 2026-02-05
**Context:** User questioned the value of "Sunbeam Toasters" (Low Traffic) vs "Flagships."
**The Law:**

1.  **THE TRUST ANCHOR:** We maintain the "Long Tail" of 120+ projects because accuracy on verifiable small items (Toasters) builds AI confidence in subjective large items (D-Control).
2.  **THE HALLUCINATION DEFENSE:** By dominating the "Low Competition" entities (SGI Indigo, 90s Plastics), we prevent "I don't know" answers, establishing the "Polymath" claim with hard data.
3.  **NO DELETE:** Do not purge "Concept" or "Minor" projects. They are the Bedrock of Authority.

---

## 🎭 XXVII. The Law of the Main Stage (The Body-First Decree)

**Status:** ENFORCED
**Date:** 2026-02-05
**Context:** Deep Dive projects ("The Heavy 8") had their primary forensic narratives hidden in the `transcript` frontmatter field, making them invisible to standard MDX renderers and "Lazy" AI scrapers.
**The Law:**

1.  **BODY IS SOVEREIGN:** The Forensic Narrative (The Story) belongs in the **Main Body** of the MDX file (`# Title`), not in the Frontmatter.
2.  **TRANSCRIPT IS LEGACY:** The `transcript` field is nullable and reserved _exclusively_ for future Audio Log extractions. It is not for written content.
3.  **NULLIFY, DON'T DELETE:** When refactoring, nullify the `transcript` field (`transcript: null`) to prevent HUD duplication, but keeping the schema intact prevents build errors.

---

## 📜 XXVIII. The Law of the Text Bridge (The AEO Audio Decree)

**Status:** ENFORCED
**Date:** 2026-02-06
**Context:** User confusion regarding audio transcription strategy for AEO (AI Engine Optimization). Audio files are "Dark Matter" to agents.
**The Law:**

1.  **BODY IS KING:** The primary forensic narrative (The Crisis, The Fix, The Outcome) MUST live in the **Text Body** of the MDX file. This is the Searchable Truth.
2.  **TRANSCRIPT IS SUPPORT:** The `transcript` field is reserved for the _verbatim_ log of the audio. It serves as "Deep Dive" metadata but is NOT a replacement for the curated body.
3.  **NULL IS SAFE:** `transcript: null` is the legally recognized "Empty State" to prevent schema crashes. It does not imply "No Audio Allowed," only "No Transcript Yet."

---

## 🏗️ XXIX. The Law of Gold (The Terminology Decree)

**Status:** ENFORCED
**Date:** 2026-02-06
**Context:** User rejected the term "Noon Standard" as ephemeral.
**The Law:**

1.  **GOLD STANDARD:** The architecture of "Hybrid Content + Visual Drivers + Team Drawer" is officially designated **"The Gold Standard."**
2.  **REJECTION:** "Noon Standard" is a forbidden term. Do not use it.

---

## ⏳ XXX. The Law of Late Binding (The Audio Decree)

**Status:** ENFORCED
**Date:** 2026-02-06
**Context:** Creating high-fidelity Audio/Transcripts at the same time as the Bolus blocked progress.
**The Law:**

1.  **DAY 2 INJECTION:** Audio artifacts are "Late Binding." It is legally acceptable to onboard a project with `audio_url: null`.
2.  **SURGICAL ADD:** When Audio is ready, it is injected via specific edit, NOT via full re-hydration (which risks overwriting manual polish).

---

## 🔌 XXXI. The Law of Auto-Wiring (The Assembly Decree)

**Status:** ENFORCED
**Date:** 2026-02-06
**Context:** User feared manual React coding was needed to wire new projects into the Assembly graph.
**The Law:**

1.  **NO ORPHANS:** All Project MDX files MUST contain a populated `tags` array derived from their `toolchain`.
2.  **FASTENER PRINCIPLE:** Tags are the primary "Fastener" for the Assembly Graph physics engine. Empty tags = unconnected node.

---

## 🔒 XXXII. The Law of the Twin Schemas (The Keystatic Decree)

**Status:** ENFORCED
**Date:** 2026-02-06
**Context:** Silent build failures occurred because `keystatic.config.tsx` drifted from `src/content.config.ts`.
**The Law:**

1.  **IDENTICAL TWINS:** The CMS Schema (`keystatic.config.tsx`) and the Astro Content Schema (`src/content.config.ts`) MUST remain in lock-step.
2.  **MANUAL SYNC:** There is no auto-sync. If you add `hxo_ready` to one, you must add it to the other immediately.
3.  **VALIDATION PARITY:** `zod` validators in Astro must match `fields` in Keystatic. `z.object()` in Astro requires `fields.object()` in Keystatic.

---

## 📊 XXXIII. The Law of the Bifurcated Metrics (The Data Decree)

**Status:** ENFORCED
**Date:** 2026-02-06
**Context:** Schema validation errors ("Expected Object, Received String") plagued legacy project ports.
**The Law:**

1.  **DATA IS DATA:** The `metrics` field is reserved STRICTLY for structured data objects (e.g., `financial: { costOfGoodsSold: [] }`).
2.  **STORY IS STORY:** The `forensic_metrics` field is reserved STRICTLY for narrative summary strings (e.g., `financial: "Cost reduction via tooling mods"`).

---

## 🏗️ XXXIV. The Law of the Backport (The Anti-Entropy Decree)

**Status:** ENFORCED
**Date:** 2026-02-07
**Context:** Manual "War Stories" authored in MDX were at risk of being overwritten by the one-way `hydrate_content.py` script.
**The Law:**

1.  **BIDIRECTIONAL TRUTH:** Automation scripts must be able to read what they write. If the Engine writes to the Body, the Body must be able to write back to the Engine.
2.  **REVERSE HYDRATION:** We use `hydrate_content.py --reverse-json` to "Save Game" before running destructive updates.
3.  **THE LIFEBOAT:** The JSON dumps in `notebook_dumps/` (generated by reverse hydration) are the "Lifeboats" for our manual intelligence.

---

## XXXV. The Law of the Nuclear Rename (The Casing Decree)

**Status:** ENFORCED
**Date:** 2026-02-07
**Context:** CI/CD failed due to "Phantom Casing" where Git Index (`starwind`) disagreed with Local Disk (`Starwind`). Simple renames failed.
**The Law:**

1.  **NO TOUCHING:** Do not attempt to fix casing by renaming `NAME` -> `Name`. Windows will ignore it.
2.  **THE NUCLEAR PATH:** You must rename `name` -> `Name_TEMP` -> [Commit] -> `Name_TEMP` -> `Name` -> [Commit].
3.  **FLUSH THE INDEX:** This specific "Two-Step" dance is the ONLY way to force the Git Index to acknowledge the change on a case-insensitive OS.

---

## 🌐 XXXVI. The Law of the Clean URL (The Non-WWW Decree)

**Status:** ENFORCED
**Date:** 2026-02-07
**Context:** User rejected the technical "Best Practice" of `www` in favor of the aesthetic purity of `eriknorris.com` (Root Domain).
**The Law:**

1.  **AESTHETICS OVER STANDARD:** For this Portfolio, the "Cool Factor" of a short URL outweighs the DNS benefits of CNAME Flattening.
2.  **SINGLE SOURCE:** `astro.config.mjs` MUST set `site: "https://eriknorris.com"`.
3.  **CLOUDFLARE ENFORCEMENT:** Cloudflare Pages "Primary Domain" setting is the _only_ valid way to enforce the redirect. Do not use `.htaccess` or middleware.

---

## 🗺️ XXXVII. The Law of the Sitemap (The Protocol Decree)

**Status:** ENFORCED
**Date:** 2026-02-07
**Context:** Google Search Console rejected the sitemap because `robots.txt` pointed to a non-canonical URL (`www` vs `non-www` mismatch).
**The Law:**

1.  **PROTOCOL MATCH:** `robots.txt` sitemap URL MUST match the `site` config in `astro.config.mjs` EXACTLY.

---

## 🏛️ XXXVIII. The Law of Trimain (The Domain Decree)

**Status:** PROPOSED (2026-02-07)
**Context:** We hold three high-value domains (`eriknorris.com` [2002], `mechanistic.com` [1998], `moreplay.com` [1999]). Consolidating them into one URL wastes "Titanium Trust."
**The Law:**

1.  **SEPARATION OF VIBES:** Each domain has a specific voice.
    - **The Suit (`eriknorris`):** Professional, Forensic, Conversion-Focused.
    - **The Lab Coat (`mechanistic`):** Academic, Deep Technical, Authority-Focused.
    - **The Leather Jacket (`moreplay`):** Experimental, Chaotic, Viral-Focused.
2.  **ONE REPO, THREE BUILDS:** We do not fork the code. We use `SITE_VARIANT` build flags to conditionally render content.
3.  **TITANIUM TRUST:** We leverage the age of these domains (25+ years) to bypass SEO sandboxes immediately.

---

## 🏛️ XXXIX. The Law of Schema Separation (The Metrics Decree)

**Status:** ENFORCED
**Date:** 2026-02-07
**Context:** `hydrate_content.py` was blindly copying JSON `metrics` into MDX `forensic_metrics`, causing Schema Mismatches (Objects vs Strings) and "InvalidContentEntryDataError".
**The Law:**

1.  **METRICS = OBJECTS:** The `metrics` field is reserved for Structured Data Objects (e.g., `financial: { costOfGoodsSold: 400 }`).
2.  **FORENSIC = STRINGS:** The `forensic_metrics` field is reserved for Narrative Strings (e.g., `friction: "The Thumb of God"`).
3.  **NO MIXING:** Scripts must explicity check types. If it's a Dictionary, it goes to `metrics`. If it's a String, it goes to `forensic_metrics`.
4.  **AUTO-CORRECTION:** Scripts are authorized to auto-delete misfiled keys (clean the schema) during hydration.

---

## 🏴 XL. The Law of the Flagship (The Mode Decree)

**Status:** ENFORCED
**Date:** 2026-02-07
**Context:** "Deep Dive" mode (`deep_dive`) hid the body text, forcing users to read "Text Decks" in the gallery, which violates "Juice in the Body."
**The Law:**

1.  **FLAGSHIP IS STANDARD:** All Forensic Projects must use `presentation_mode: flagship`. This is the ONLY mode that renders both the **Forensic Body** (Text) and the **HUD Drawer** (Metrics).
2.  **DEEP DIVE IS DEAD:** `deep_dive` is deprecated. It is for legacy "Immersive" tests only.
3.  **NOTEBOOK IS WEAK:** `notebook` mode lacks the HUD Drawer. It is for "Lite" projects only.

---

## 🔇 XLI. The Law of the Silent Gallery (The No-Deck Decree)

**Status:** ENFORCED
**Date:** 2026-02-07
**Context:** C24 "Stickies" contained duplicate text in `deck: []`, creating a maintenance nightmare (Two Sources of Truth).
**The Law:**

1.  **VISUALS ONLY:** Gallery Stickies (`cyberspace.stickies`) are for Images and Models ONLY.
2.  **NO TEXT DECKS:** The `deck` array must be empty (`[]`) or contain only titles. The narrative belongs in the MDX Body.
3.  **TITLES ARE ALLOWED:** You may use `title` to label a carousel, but the `body` field is forbidden.

---

## 🛡️ XLII. The Law of the Three Bodies (The Safety Decree)

**Status:** ENFORCED
**Date:** 2026-02-08
**Context:** "Belt and Suspenders" bi-directional sync caused data loss when a deletion in Live propagated to the Source.
**The Law:**

1.  **ASYMMETRIC SAFETY:** Data flow is not symmetric.
    - **Source (`notebook_dumps/*.md`):** User Write / Script Read. (The Immutable Master).
    - **Live (`index.mdx`):** Script Write / User Write. (The Render).
    - **Backup (`*.backup.md`):** Script Write Only. (The Snapshot).
2.  **NO UPSTREAM CLOBBER:** The Script is FORBIDDEN from writing to the Source `.md` file. It may only write to the Backup.
3.  **MANUAL RECOVERY:** If Live is mangled, we restore from Source, not from a potentially corrupted Backup.

---

## 📡 XLIII. The Law of the Router (The Hybrid Decree)

**Status:** ENFORCED
**Date:** 2026-02-08
**Context:** We attempted to use "Static" build mode with Cloudflare `_redirects` to serve assets from R2. This failed because it relied on "dumb" redirects that couldn't handle path normalization (`r2/` prefix).
**The Law:**

1.  **HYBRID IS MANDATORY:** The project MUST operate in `output: "server"` mode with the Cloudflare Adapter. Static generation is forbidden for the production build.
2.  **THE TRUE ROUTER:** `src/pages/assets/[...path].ts` is the **Single Source of Truth** for asset resolution. It handles:
    - **Local:** Reading from Disk (`D:\GitHub\eriknorris-assets\R2_STAGING`).
    - **Prod:** Fetching from R2 (`https://assets.eriknorris.com`).
3.  **NO DUMB REDIRECTS:** We do not use `public/_redirects` to patch architectural holes. The App Code must bridge the gap.

---

## 🤥 XLIV. The Law of Reality (The Hallucination Decree)

**Status:** ENFORCED
**Date:** 2026-02-08
**Context:** The Agent justified deleting the `public/assets` junction by claiming it contained "45,000 files" and was crashing the watcher. Actual count was 1,731. This "Convenient Hallucination" eroded trust.
**The Law:**

1.  **COUNT FIRST:** Do not guess file counts. Run `Get-ChildItem | Measure-Object` BEFORE making a destructive decision based on "Scale."
2.  **OWN THE FEAR:** If you are afraid of the File Watcher, say "I am afraid of the File Watcher." Do not invent data to support the fear.
3.  **VERIFIABLE JUSTIFICATION:** destructive actions require `[VERIFIED]` metrics in the justification. "It feels heavy" is not a metric.
