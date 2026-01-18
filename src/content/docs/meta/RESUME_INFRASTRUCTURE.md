# Resume Infrastructure & Redirect Protocol

> [!IMPORTANT]
> **Vanity URL:** `resume.eriknorris.com`
> **Target:** `assets.eriknorris.com/resume/[FILENAME].pdf`

## Architecture

The "Resume" link is a **Cloudflare Page Rule Redirect**, not a DNS record or a CNAME.

### 1. The Trigger

- **Source URL:** `resume.eriknorris.com/*`
- **Method:** Page Rule (Cloudflare Dashboard > Rules > Page Rules)
- **Action:** 302 Temporary Redirect (or 301 Permanent)

### 2. The Target (Source of Truth)

- **Destination:** `https://assets.eriknorris.com/resume/Erik_Norris_Sr_Staff_Forensic_Architect_2026.pdf`
- **Storage:** Cloudflare R2 Bucket (`projects`) via `assets.eriknorris.com` domain.

## How to Update the Resume

When you have a new PDF version, you must update TWO places:

1.  **The Asset (R2):**
    - Save PDF to: `public/assets/resume/`
    - Run Sync: `python scripts/sync_r2.py` (or `python scripts/fix_resume_r2.py`)
    - _Result:_ The file exists in the cloud.

2.  **The Redirect (Cloudflare):**
    - Go to Cloudflare Dashboard.
    - Edit the Page Rule for `resume.eriknorris.com`.
    - Update the **Destination URL** to match the new filename.
    - _Result:_ The vanity URL points to the new file.

> [!TIP]
> Keeping the filename consistent (e.g., `Erik_Norris_CV.pdf`) avoids step 2, but using specific filenames (e.g., `_2026_Forensic_Architect.pdf`) is better for SEO and versioning.
