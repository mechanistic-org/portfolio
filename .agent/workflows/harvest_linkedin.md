---
description: The official protocol for harvesting project data and generating the LINKEDIN_READY.txt artifact.
---

# Harvest LinkedIn

Trigger this workflow by running `/harvest_linkedin`.

## Usage

**When to use:** The user has updated a project's MDX file (e.g., adding a new Forensic Summary) or updated the broad company narrative, and wants to push those changes to the `LINKEDIN_READY.txt` file for copy-pasting into LinkedIn.

## 1. Safety Check

- Ensure the `linkedin_master.ts` is up-to-date with any top-level company changes. If the user asks to "update the LinkedIn data," do this FIRST before harvesting.
- Verify `src/content/projects/` contains the projects you want to harvest.

## 2. Execute the Harvest

// turbo

1. Run the Python script:
   `python scripts/harvest_linkedin.py`

_What this does:_ The script automatically maps the `slugs` to the companies in `linkedin_master.ts`, extracting the `Trigger/Intervention/Result` yaml blocks from `index.mdx` files and combining them with the company `blurb` text into a single cohesive document.

## 3. Verification

// turbo

1. Open the generated file to verify completion:
   `cat src/content/prompts/LINKEDIN_READY.txt` (or use `view_file` tool).

2. Confirm that the newly updated project (or new wording) successfully propagated to the `.txt` file.

## 4. Notify User

Inform the user: _"The LinkedIn harvest is complete. The updated text is available in `src/content/prompts/LINKEDIN_READY.txt` and is ready to be copy-pasted into your LinkedIn profile."_
