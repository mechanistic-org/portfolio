---
description: The pipeline for transferring updated narrative data into the Master Resume, generating the PDF, and deploying it.
---

# Update Resume

Trigger this workflow by running `/update_resume`.

## Protocol

This process is strictly defined to prevent data loss or styling regressions in the PDF.

### Phase 1: Data Migration

If the user asks to "update the resume to reflect new LinkedIn data", follow these translation rules:

1. **Sources:** Read `src/config/linkedin_master.ts` and `src/content/prompts/LINKEDIN_READY.txt`.
2. **Target:** Read `src/config/resume_master.ts`.
3. **Translation Context:** The Resume requires specific string arrays (`bullets`), whereas LinkedIn uses paragraphs (`blurb`) + dynamically injected Forensic Summaries.
4. **Action:** Synthesize the new LinkedIn data into tight, brutalist, "Hard Ore" bullets (focusing on metrics, temperature, force, failure rates). Use the `multi_replace_file_content` tool to safely inject the new bullets into `src/config/resume_master.ts`.
5. **DO NOT GUESS IMAGINARY DATA.** Only transfer facts present in the LinkedIn sources or MDX files. Let the user review the proposed `resume_master.ts` changes if there is ambiguity.

### Phase 2: PDF Generation (Local Server Required)

The PDF generation script requires the local Vite development server to be running on port `4321`.

// turbo

1. Test if the server is running by attempting the generation script:
   `node scripts/generate_resume_pdf.cjs`
2. If the terminal throws an error (e.g. "ERR_CONNECTION_REFUSED"), inform the user: _"Please run `npm run dev` in a separate terminal so I can print the PDF."_
3. Wait for the user to confirm the dev server is running, then re-run the `node` command.

_Note: The script outputs exclusively to `public/assets/resume/Erik_Norris_Resume_Current.pdf`._

### Phase 3: Cloudflare Deploy (Hotfix)

Once the PDF is generated locally, it must be hot-swapped into the R2 bucket so that the `resume.eriknorris.com` redirect catches it instantly.

// turbo

1. Push the asset to Cloudflare R2:
   `python scripts/upload_resume_hotfix.py`

### Phase 4: Final Sign-off

Notify the user that the process is complete, providing them the live URL:
_"Update complete. Please verify the deployed resume at [resume.eriknorris.com](https://resume.eriknorris.com)."_
