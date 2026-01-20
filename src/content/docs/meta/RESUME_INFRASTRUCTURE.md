# Resume Infrastructure: The "Pulse" Protocol

> [!IMPORTANT]
> **Vanity URL:** `resume.eriknorris.com`
> **Target:** `assets.eriknorris.com/resume/Erik_Norris_Resume_Current.pdf`
> **Automation Level:** 95% (User Initiated, Script Executed)

## 1. The Strategy

We moved from manual PDF exports to a **Code-First Pipeline**:

1.  **Source of Truth:**
    - **Header/Skills:** `src/config/resume_master.ts`
    - **Project Data:** `src/content/projects/*.mdx` (via Reverse Hydration)
    - **Page Layout:** `src/pages/resume/index.astro` (Tailwind + CSS Print Media)
2.  **Output:**
    - **Public Asset:** `Erik_Norris_Resume_Current.pdf` (Stable URL, never changes).
    - **Archive:** `archive/Erik_Norris_..._YYYY-MM-DD.pdf` (Historical record).

## 2. The Pipeline

To update the resume, run the FULL CYCLE:

```bash
# 1. Reverse Hydrate (MDX -> Text Prompts)
python scripts/hydrate_content.py --reverse

# 2. Generate PDF (Localhost -> PDF)
# Note: Requires 'npm run dev' running on port 4321
node scripts/generate_resume_pdf.cjs
```

### Script Manifest

- **`hydrate_content.py`**:
  - Reads `src/content/projects/*.mdx`.
  - Extracts "War Stories" and "Forensic Metrics".
  - **Filter Logic:** Explicitly excludes "Berry Creek" from public artifacts.
  - Updates: `public/assets/prompts/RESUME_READY.txt` and `public/assets/branding/LINKEDIN_READY.txt`.
- **`generate_resume_pdf.cjs`**:
  - Connects to `http://localhost:4321/resume` via Puppeteer.
  - "Prints" the page to PDF (ensures pixel-perfect font rendering).
  - Saves stable copy (`Current.pdf`) and timestamped copy (`Archive`).

## 3. Deployment & Redirects

The vanity URL `resume.eriknorris.com` is a **Cloudflare Page Rule** (302 Redirect).

- **Old Way:** Update Page Rule every time filename changes.
- **New Way (The Lazy Option):** The Page Rule points to `Erik_Norris_Resume_Current.pdf`. We simply overwrite this file in R2.

**Deployment Trigger:**
Pushing to `main` triggers Cloudflare Pages build, which deploys the `public/assets/resume` folder to the assets bucket.

```bash
git add .
git commit -m "feat: update resume"
git push origin main
```

## 4. Troubleshooting

- **Title Wrapping:** Fixed by forcing `whitespace-nowrap` and reducing font size in `index.astro`.
- **EBUSY Error:** Occurs if `Erik_Norris_Resume_Current.pdf` is open in Acrobat/Browser. **Close the file** before running the script.
- "Junk" PDF: If the PDF looks like raw text, `generate_resume_pdf.cjs` fell back to text-mode (legacy). Ensure it's using the Puppeteer logic.

## 5. The "Forensic Seismograph" Protocol (Maintenance)

When do we re-run this cycle? **Do not** rely on a simple calendar. The "Forensic" brand relies on _density_ of evidence, not freshness of dates.

### The Trigger: "Gold Critical Mass"

Re-run the **Mining -> Priming -> Resume** cycle when **ONE** of the following thresholds is met:

1.  **The "Black Swan" Event (Immediate Trigger):**
    - You solve a **crisis** that threatens the existence of a project/company.
    - You invent a **novel workaround** (e.g., "The Headband Heat Sink") that redefines a constraint.
    - _Action:_ Mine transcript immediately -> Updates Resume "War Stories" -> Updates NotebookLM.

2.  **The "Standard Volume" Batch (Lagging Trigger):**
    - **Interval:** Every **3-5** completed projects of "Standard" complexity.
    - _Why?_ Routine excellence needs volume to become a pattern. One standard project changes nothing; five prove consistency.

3.  **The "Vocabulary Shift" (Strategic Trigger):**
    - You notice you are using new forensic terms (e.g., shifting from "Thermal Envelope" to "Entropy Management").
    - _Action:_ Update `mine_themes.py` keywords -> Re-mine ALL transcripts -> Re-prime NotebookLM.

### The Workflow Loop

1.  **Record:** Capture the technical debrief (Podcast).
2.  **Mine:** Run `scripts/mine_themes.py` and `scripts/mine_skepticism.py`.
3.  **Consolidate:** Append findings to `GOLDEN_DIALOGUE_CORPUS.md`.
4.  **Prime:** Feed corpus to NotebookLM to update the "Voice".
5.  **Publish:** Run `hydrate_content.py` to push new "Gold" to Resume/LinkedIn text files.
