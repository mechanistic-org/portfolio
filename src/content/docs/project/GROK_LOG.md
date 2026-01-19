# THE GROK LOG

> "Lightning in a Bottle"

**Purpose:** This document serves as the project's "Constitution." It captures the hard-won intuition, architectural laws, and "Committee Rulings" that must be preserved across sessions. It prevents "Recurring Reversions."

---

## 🏛️ I. The Law of Assets (The "Air Gap" Decree)

**Status:** ENFORCED
**Date:** 2025-12-21
**Context:** Recurring issue where assets (images/PDFs) were being copied into `src/` or haphazardly linked, breaking the "Zero Bloat" principle.

**The Law:**

1.  **NO ASSETS IN SRC:** The `src/` directory is for code only.
2.  **THE VAULT IS SOVEREIGN:** All heavy media lives in `D:\GitHub\ErikNorris-assets\R2_STAGING`.
3.  **SYMLINKS ARE THE BRIDGE:** We access assets _only_ via the symlink `public/assets/r2` -> `R2_STAGING`.
4.  **VERIFICATION:** If you see a file path that does not start with `/assets/r2/`, it is a violation.

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

## 🔮 V. Future Grok (Open Slots)

- [ ] **The Law of "Moves":** Defining the threshold for "Cool" vs "Gimmick" (re: Parallax/Breathe).
- [ ] **Terminology Shift:** Rename "Hyperspace" architecture to something more descriptive of the "Intelligence First" pipeline (Backlog).

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

## 🎨 VI. The Law of Asset Sovereignty (The Interaction Decree)

**Status:** ENFORCED
**Date:** 2025-12-26
**Context:** Friction encountered when Agent generated a generic "Dreamjob" asset to fix a 404, overwriting the canonical (but missing locally) asset. This violated the "Director's Vision".

**The Law:**

1.  **Implicit vs. Explicit:** The Agent must assume "Missing Asset" = "Needs Retrieval", NOT "Needs Creation".
2.  **Localhost Air Gap:** The Agent must valididate Symlinks before questioning existence. A failure locally is not a failure globally.
3.  **Creative License Limits:** Code is mutable; Content/Assets are immutable (unless explicitly in a "Constructed Reality" context like _Dreamjob_ OR explicitly authorized).
4.  **ErikNorris Exception:** For defined "Dream" projects, Synthesis is allowed if no historical truth exists.

## 📄 IX. The Law of the Master Resume (The Single Source Decree)

**Status:** ENFORCED
**Date:** 2026-01-17
**Context:** "Version Drift" between the website resume, the PDF resume, and the `eriknorris-assets` repo.
**The Law:**

1.  **CODE IS TRUTH:** `src/config/resume_master.ts` is the generator for ALL formats.
2.  **ONE PDF:** The canonical PDF lives in `public/assets/resume/`. We do NOT store PDFs in `eriknorris-assets` anymore.
3.  **VANITY COMPATIBILITY:** We explicitly patch the R2 bucket (`Erik_Norris_CV.pdf`) to keep the `resume.eriknorris.com` redirect alive, but the _source_ is always the repo PDF.

## 🖼️ X. The LinkedIn Standard (The Banner Decree)

**Status:** ENFORCED
**Date:** 2026-01-17
**Context:** Standard banners were obstructed by the Profile Picture (Avatar), ruining the narrative flow.
**The Law:**

1.  **SHIFT RIGHT:** The semantic content of the banner MUST be shifted **400px to the Right**.
2.  **THE VOID:** The Left 400px is reserved for the Avatar. It should be abstract or empty (Void).
3.  **ASPECT RATIO:** 4:1 (1584x396px). Do not rely on LinkedIn's auto-crop.

## 👥 XI. The Law of Social Decoupling (The LinkedIn Decree)

**Status:** ENFORCED
**Date:** 2026-01-17
**Context:** LinkedIn's "Feed Algorithm" penalizes dense text blocks, while PDFs require them. Attempting to generate both from one source failed.

**The Law:**

1.  **SEPARATE MASTERS:** `linkedin_master.ts` (Social) is distinct from `resume_master.ts` (PDF).

## 🤫 XII. The Law of the Iron Dome (The Stealth Decree)

**Status:** ENFORCED
**Date:** 2026-01-18
**Context:** The Audio Host (NotebookLM) was reading "System Instructions" aloud, breaking the immersion of the "Red Team Review" persona.
**The Law:**

1.  **NO INSTRUCTIONAL HEADERS:** The `PODCAST_READY.txt` file must contain _only_ the Cast List and Source Material. No "You are a..." preambles.
2.  **DECOUPLED SOURCES:** We split the "Hack Pack" into `BOLUS_READY.txt` (JSON for the AI Brain) and `REPORT_READY.txt` (Text for the AI Eye).
3.  **VERIFICATION:** If the Audio Host says "Here are your instructions," the protocol has failed. Reset the context.
