---
description: How to execute the Resume Roundtrip (Gem -> Code -> PDF)
---

# 🔄 The Forensic Resume Roundtrip

This workflow documents how to update the "Master Resume" using the Gem as the drafting engine.

## 1. The Mining Phase (Gem)

Use the **Forensic Portfolio Architect** Gem with the `GEM_RESUME_PROMPT.txt` protocol.

1.  **Prompt:** Paste the protocol (`public/assets/prompts/GEM_RESUME_PROMPT.txt`).
2.  **Generate:** The Gem scans attached notebooks (SC48, C24, etc.) and generates "Mode B" (Forensic) bullets.
3.  **Refine:** Ask the Gem to "polish" or "condense" as needed.

## 2. The Authoring Phase (Text)

Copy the Gem's output into your text editor.

1.  **Verify Integers:** Check that temps (75°C) and ECOs (ECO 8000) are accurate.
2.  **Tone Check:** Ensure "Brutalist" naming (Hard Ore / Rhythm / Integer) is serving the narrative.

## 3. The Commit Phase (Code)

Update the source of truth in `src/config/resume_master.ts`.

1.  **Tagline:** Ensure the top-level `tagline` matches your current branding.
2.  **Experience:** Paste the new project blocks into the `experience` array.
    - _Tip:_ Use `resume_polish.ts` for A/B testing if you aren't sure.

## 4. The Deployment Phase (PDF)

Regenerate the static asset for the redirect (`resume.eriknorris.com`).

```powershell
# 1. Generate the PDF from the local dev server
node scripts/generate_resume_pdf.cjs

# 2. Upload to Cloudflare R2 (Hotfix)
python scripts/upload_resume_hotfix.py
```

## 5. Verification

Check [resume.eriknorris.com](https://resume.eriknorris.com) to confirm the new file is served.
