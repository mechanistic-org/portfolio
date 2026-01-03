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
3.  **SYMLINKS ARE THE BRIDGE:** We access assets *only* via the symlink `public/assets/r2` -> `R2_STAGING`.
4.  **VERIFICATION:** If you see a file path that does not start with `/assets/r2/`, it is a violation.

---

## 📡 II. The Law of Instrumentation (The "Signal-to-Noise" Decree)
**Status:** ENFORCED
**Date:** 2025-12-22
**Context:** The "Stitcher" script silently failed to extract text from PDFs, leading to "Kabuki Theater" where empty files were treated as intelligent data sources.

**The Law:**
1.  **NO SILENT FAILURES:** Tools must report their yield. A script that runs successfully but produces 0 bytes of data is a *FAILED* script.
2.  **VISUAL VERIFICATION:** The "ME Intuition" is supreme. If a file *should* be heavy (e.g. a PDD PDF) and the resulting artifact is light (1KB), **STOP**. Do not proceed.
3.  **THE BOLUS STRATEGY:** We prefer "Stitched Boluses" (Markdown Manifests + Extracted Text) over loose files, but *only* if the text is actually extracted.

---

## 🧠 III. The Interaction Model (The "Committee" Protocol)
**Status:** ACTIVE
**Date:** 2025-12-22
**Context:** The user felt "chafed by ignorance" when in reality they were detecting a system fault.

**The Law:**
1.  **TRUST THE SME NOSE:** Trust, but verify, the SME's intuition over the software's output. If the Domain Expert (User) feels something is "off", investigate until verified.
2.  **ARCHITECTURAL REVIEW:** When in doubt, invoke the **Architect Persona**. Ask: *"What would a Distinguished Engineer say about this decision?"*
3.  **STOP AND FIX:** Never "patch" a fundamental misunderstanding. If we are misaligned on *how* a tool works, we stop coding and fix the tool (as we did with `stitcher.py`).

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
*   [ ] **The Law of "Moves":** Defining the threshold for "Cool" vs "Gimmick" (re: Parallax/Breathe).

---
## 🎨 VI. The Law of Asset Sovereignty (The Interaction Decree)
**Status:** ENFORCED
**Date:** 2025-12-26
**Context:** Friction encountered when Agent generated a generic "Dreamjob" asset to fix a 404, overwriting the canonical (but missing locally) asset. This violated the "Director's Vision".

**The Law:**
1.  **Implicit vs. Explicit:** The Agent must assume "Missing Asset" = "Needs Retrieval", NOT "Needs Creation".
2.  **Localhost Air Gap:** The Agent must valididate Symlinks before questioning existence. A failure locally is not a failure globally.
3.  **Creative License Limits:** Code is mutable; Content/Assets are immutable (unless explicitly in a "Constructed Reality" context like *Dreamjob* OR explicitly authorized).
4.  **ErikNorris Exception:** For defined "Dream" projects, Synthesis is allowed if no historical truth exists.


