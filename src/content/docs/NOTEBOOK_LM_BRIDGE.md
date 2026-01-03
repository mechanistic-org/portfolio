---
title: "The NotebookLM Bridge: Chief of Staff Protocol"
slug: "notebook_lm_bridge"
sidebar:
  group: "Workflows"
  order: 2
---
# The NotebookLM Bridge: Chief of Staff Protocol

**Objective:** Use NotebookLM as an "Archivist & Research Lead" to mine raw project data and feed verified, high-density context to the Antigravity execution agents.

> [!TIP]
> **The Metaphor:** Antigravity is the **Ferrari** (Execution/Speed). NotebookLM is the **Chief of Staff** (Memory/Grounding). Use the Chief of Staff to brief the Driver before you hit the gas.

---

## 0. The Author Identity Protocol (The Author's Voice)

**Crucial Step:** NotebookLM doesn't inherently search for "you." To ensure your portfolio charts *your* specific impact, you must establish your identity and **voice** within the notebook.

### The "I Am The Designer" Prompt
Paste this first before any extraction:
> "Context: I am **Erik Norris**. Looking at the uploaded sources for [Project Name], identify every instance where 'Erik' or 'Lead Mechanical/Industrial Designer' is mentioned. Associate all technical wins, CAD decisions, and manufacturing resolutions directly with me. **I am the sole designer of all physical components (metal, plastic, and PCB topology).** When I ask for a spec or narrative, write it from my perspective as the Lead Designer who built the entire product. Use first-person 'I' and 'my' to reflect my direct ownership of the design."

---

## 1. The "Context Bridge" Workflow

To prevent "Context Bloat" in Antigravity, we use a structured handoff.

### Step 1: Ingest (NotebookLM)
1.  Create a new Notebook in NotebookLM for the specific project (e.g., "Xbox Controller Design").
2.  **Upload Raw Artifacts:** 
    *   **Files:** PDFs, Spreadsheets, Docs.
    *   **Emails:** Export threads as **PDF** (Print -> Save as PDF) or copy-paste into a **Google Doc** source.
    *   **Transcripts:** Upload text files or YouTube URLs for video-based meetings.
3.  **Vibe Check:** Generate an **Audio Overview**. Listen for the "Narrative Arc"—what makes this project impressive?

### Step 2: Extract (NotebookLM)
Use the **Structured Extractor Prompt** (see Section 2) to turn the mess into a clean "Project Spec."

### Step 3: Verify (NotebookLM)
Click the [1] citations to ensure the metrics (e.g., "40% efficiency gain") are factually supported by the documents.

### Step 4: Build (Antigravity)
Copy the extracted specimen into Antigravity. Instruct your agent:
`@Agent: Use this verified Spec to build the legacy case study for [Project Name]. Adhere to the DLS Style Guide.`

---

## 2. The NotebookLM Prompt Stack

### Prompt 1: The Technical Spec Extractor
Copy and paste this into NotebookLM after uploading your sources:

```markdown
Analyze the uploaded documents for [Project Name]. Output a comprehensive summary in Markdown format with the following headers:

# Project Title: (Official name)
# One-Line Pitch: (A punchy <100 char description)
# The Challenge: (What was the hard problem?)
# The Solution: (What did we build/design?)
# Key Metrics: (List specific numbers/wins)
# Tech Stack: (List tools/languages mentioned)
# Evidence Locker: (List exact filenames and page numbers where these facts are found)
```

### Prompt 2: The "Intelligence Package" Handoff (The Handoff Gold)
Use this prompt to package the "Gold" for ingestion by Antigravity (the AI coder). This ensures a high-density, zero-friction handoff.

```markdown
"Synthesize all extraction into a final 'Intelligence Package' for my coding agent. 
Format it as a single block of Markdown. 
Emphasize my specific role (Erik Norris) as the sole physical component designer. 
List 3 key 'Manufacturing Scars' (lessons learned) and 3 'Strategic Wins'.
Include specific part numbers, vendor names, and precise measurement variances if available.
Categorize the findings into: Technical Specifications, Manufacturing War, and Engineering Solution."
```

### Prompt 2: The JSON Miner (Optional)
If you need to update `Main.csv` or a JSON data file:

```text
Turn that summary into a clean JSON object. 
Keys: title, slug, summary, metrics (array), tags (array). 
Ensure all text is escaped for programmatic use.
```

---

## 3. The "Visual Grounding" Protocol

As of 2025, NotebookLM is fully multimodal. It can "see" photos, CAD diagrams, and handwritten notes. Use this to extract "Intelligence Density" that text ignores.

### Prompt: The Visual Archaeologist
"Analyze the images and diagrams in the sources for [Project Name]. Specifically:
1. **PCB Topology:** Describe the internal board layouts, key chips, and modular sub-assemblies.
2. **Silk-Screen QA:** Identify any misalignments, color temperature conflicts, or font weight issues visible in the photos.
3. **The 'Handwritten Signal':** What do whiteboard markers, paint-pen circles on prototypes, or handwritten QC notes reveal about the design struggle?
4. **Assembly Hierarchy:** Describe the 'sandwich' of components seen in exploded views."

---

## 4. The "Evidence Locker" Protocol

To achieve **Level 10 (The Singularity)** on the Architect Evaluation, our claims must be verifiable.

1.  **Identify:** Find the most critical "Win" in NotebookLM.
2.  **Capture:** Take a screenshot of the source document page (e.g., a chart showing the metric).
3.  **Cite:** In your MDX content, use the `<EvidenceBadge />` (see Style Guide) to link this screenshot to the claim.

> [!IMPORTANT]
> A portfolio that *claims* success is 7/10. A portfolio that *proves* success with cited evidence is 10/10.

---

## 5. Zero-Dependency Architecture

**Crucial Clarification:** Your website has **ZERO ongoing dependency** on the NotebookLM service.

*   **Transient Tool:** NotebookLM is used only during the **"Mining Phase"**. 
*   **Static Extraction:** Once the metrics and "Evidence Locker" assets (screenshots) are committed to the `d:\GitHub\ErikNorris` repository, they are permanent.
*   **Deletion Safety:** You can delete your notebooks in NotebookLM immediately after extraction. This will **not** break your site.

### What is lost if you delete a notebook?
1.  The ability to click the `[1]` footnotes in the NotebookLM UI to jump to the PDF source.
2.  The ability to generate new "Audio Overviews" or ask new questions about that project's archive.

### What is kept on your site?
1.  All text claims (The "Truth").
2.  The metadata citations (e.g., "Source: Project_Specs.pdf, Page 12").
3.  The physical proof (The screenshots you captured and put in `R2_STAGING`).

---

## 6. Operation: PST Ore (Deep Archive Mining)

For large, legacy email archives (`.pst`), follow this "Survey to Handoff" pipeline:

### 1. Prospect (The Surface Scan)
- **Identify:** Map filename/timestamp of the `.pst` to your project timeline in `Main.csv`.
- **Match:** Find the "Hot Spots" (e.g., `kaleidescape_PST` likely covers 2013-2015).
-   **Keyword Filtering (Surgical Scrub):** Use Outlook's search bar with these specific combinations:
    *   `Danko "rev"` (Finds revision history)
    *   `Danko "spec" OR "requirement"` (Finds design constraints)
    *   `Danko "issue" OR "problem" OR "fixed"` (Finds the "Story" of the project)
    *   `Danko "BOM" OR "Part"` (Finds the technical ingredients)
    *   `Danko from:"Javier" OR from:"ManagerName"` (Filters by key technical leads)

### 2. Mine (The Extraction)
- **Goal:** Get emails out of the binary PST/OST and into individual files.
- **The "Familiar" Path:** Open your PSTs in **Outlook**. Find your project folders. 
- **The "Drag-To-Folder" Trick:** Create a folder on your Desktop (e.g., `ore_orpheus`). Select 50-100 emails in Outlook and **drag them into that folder**. Outlook will instantly create individual `.msg` files for each email. 
- **The "Windows Dedupe" Trick:** If you have multiple backups with overlapping content, drag them all into the same folder. Windows will ask if you want to replace or skip files with the same name. Selecting **"Skip"** effectively dedupes your extraction instantly without you having to clean up Outlook.

### 3. Refine/Purify (The "Kiln")
- **Tool:** **Microsoft MarkItDown** (Open Source Python Utility).
- **Action:** Batch convert your folder of `.msg` files into high-density Markdown.
- **Command:** `markitdown ./ore_orpheus/*.msg > orpheus_master.md`
- **Why:** MarkItDown understands the internal structure of `.msg` files and turns them into clean, citeable Markdown for NotebookLM.

### 4. Brief (NotebookLM)
- **Tool:** NotebookLM (The "Chief of Staff").
- **Action:** Load the `orpheus_master.md`. Use the **Technical Spec Extractor** (from Section 3) to synthesize the case study.

### 4. Map (The Handoff)
- **Goal:** Link to `d:\GitHub\ErikNorris`.
- **Action:** Paste the refined spec into `data_source/inbox/{project_slug}.technical.txt`.
- **Command:** Run `python scripts/ingest_inbox.py` to bake it into your site.

> [!NOTE]
> **Privacy Filter:** NotebookLM sources are private to your account. This is the safest way to "scrub" private internal emails into publicly shareable, metrics-focused case studies before they ever touch GitHub.

---

## 7. The "Asset Mapping" Protocol (High-Fidelity Transition)

To move from "Verification Screenshots" to "High-Fidelity Assets," use NotebookLM to index your original media and CAD documentation.

### Step 1: Ingest Visual Sources
- **The "Photo Dump" (Contact Sheet Strategy):** To avoid hitting NotebookLM's 50-source limit, do not upload individual JPGs. Instead, combine your photos (e.g., the `DSC02771-99` batch) into a single **PDF Contact Sheet** or a multi-page PDF. 
    - *Why?* NotebookLM treats one PDF as one source slot, but can still "see" and index every individual photo within that PDF.
- **Adobe Illustrator (.ai) Workflow:** I cannot natively "see" proprietary .ai files. To make them citeable, export your vector artwork as **High-Res PDFs**.
- **The Font Insurance Protocol:**
    1. **Map (Intelligence Check):** Map legacy fonts (e.g., `HelveticaNeue-ThinCond`) to local OpenType versions (e.g., `HelveticaNeueLTPro-ThCn.otf`) in the Illustrator "Replace Fonts" dialog.
    2. **Outline (Visual Proof):** Before exporting your final "WOW" PNGs for the site, use **Type > Create Outlines** (Shift+Cmd+O) on a copy of the file. This converts text to shapes, ensuring the layout never breaks again, even if you lose the font files.

### Step 2: The "Indexer" Prompt
> "Analyze the uploaded images and PDFs for [Project Name]. Create an **Asset Manifest** that correlates visual evidence with technical claims. 
> For example: 'Claim: Left Sidecap shrinkage' -> 'Evidence: Photo_QA_08.png (shows red paint-pen marker)'. 
> Specifically identify:
> 1. High-fidelity renders of the 3D assembly.
> 2. Original artwork PDFs (silk-screen masks).
> 3. Production-line photos showing real-world QA struggles."

### Step 3: Handoff to Antigravity
- Provide the generated **Asset Manifest** to Antigravity.
- Instruct: `@Agent: Use this Manifest to replace all AI-placeholders in the case study with these authentic assets.`

> [!TIP]
> **The Onshape Hack:** Note specific Part IDs (e.g., `9100-55144-00`) from the Onshape assembly. NotebookLM can cross-reference these IDs in your emails and PDFs to find the hidden "Why" behind a CAD change.

---

## 8. The "Asset Air-Gap" Strategy (External Staging)

To avoid bloating your main source code repository with "gobs of images," use the **Asset Air-Gap** protocol. This leverages your existing `@R2_STAGING` and `d:\GitHub\ErikNorris-assets` structure.

### Track A: The External Storage Locker (`ErikNorris-assets`)
- **Location:** `d:\GitHub\ErikNorris-assets\R2_STAGING\{project_slug}\raw`
- **Role:** This is your "Pile." It lives **outside** the `ErikNorris` repo.
- **Process:** Maintain your existing sequence folders and strict naming conventions here. Antigravity can read this directory to index your work without ever "adding" it to Git.

### Track B: The Intelligence Subset (NotebookLM)
- **Role:** Technical grounding. 
- **Process:** Upload only the files that represent "Intelligence Nodes" (e.g., technical PDFs, specific labeled photos of failures).

### Track C: The Curation Layer (`ErikNorris`)
- **Location:** `d:\GitHub\ErikNorris\public\assets\r2\{project_slug}`
- **Role:** Optimized, final assets.
- **Process:** Once an asset is selected from the "Pile" (Track A) for the case study, Antigravity will copy and optimize it into the `ErikNorris` repo.

> [!IMPORTANT]
> **The Curation Loop:**
> 1. User dumps 100+ raw items into `d:\GitHub\ErikNorris-assets`.
> 2. User selects 10 items for NotebookLM intelligence.
> 3. Antigravity selects 5 "Hero" items from the externally indexed pile.
> 4. Antigravity copies/optimizes only those 5 items into the main repo.

---

## 9. The "CAD Envelope" Strategy (Precision 3D)

Exporting large 3D assemblies (e.g., 3,000+ parts) directly to the web will crash browser contexts. Use this tiered strategy:

1. **The Envelope (Interactive):** Export a simplified, low-poly shell of the assembly from Onshape or ProE. Aim for **< 5MB** as a `.glb` file. This provides the spatial context without the lag.
2. **The "Hero" Renders (Static):** Use Onshape's rendering engine to create 4K transparent PNGs of the full assembly. Use these as your `heroImage`.
3. **Exploded "High-Res" Detail:** Export individual high-fidelity sub-assemblies (e.g., just the "EDIT Board" or "Skynet PSU") for use in the `<ModelViewer />` within specific sections of the narrative.

---

## 10. The "BOM Intelligence" Protocol (Structured Data)

Bill of Materials (BOM) Excel files are high-density "Intelligence Gold." They bridge the gap between your CAD (Onshape) and your History (Emails).

### Step 1: Ingest
- **Storage:** Put the original `.xls/.csv` in `d:\GitHub\ErikNorris-assets\R2_STAGING\{project}\raw`.
- **Intelligence:** Upload a copy to NotebookLM. If the Excel is complex, export a simplified **CSV** or **PDF** version of the "Main Assembly" tab for easier AI parsing.

### Step 2: The "Part Story" Prompt
Use this prompt to find the human drama hidden in the spreadsheet:
> "Cross-reference the Part Numbers in this BOM with the uploaded email threads. Identify 3 'Problem Parts' (e.g., parts with multiple revisions, vendor delays, or QA failures). 
> For each, extract the 'Story': 
> 1. **The Part ID:** (e.g., 9440-55165-00)
> 2. **The Tension:** What was the manufacturing or design hurdle?
> 3. **The Resolution:** How did I (Erik Norris) solve it?"

### Step 3: Link to Onshape
- Match the "Problem Part" ID from the BOM to the **3961 parts** in your Onshape assembly. 
- Use the **Evidence Badge** on your case study to link the 2D "Part Story" to the 3D visual.

---

## 11. The Singularity (Level 10 Verification)
When a case study combines **NotebookLM Intelligence** (Grounding), **High-Fidelity Assets** (Visual Proof), and **BOM Data** (Structural Truth), it reaches "Level 10" status. You aren't just showing a design; you are presenting a complete, verifiable engineering history.

