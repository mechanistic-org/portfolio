---
title: "Resume pipeline documentation updated with detailed process and failure traps."
description: "The resume PDF generation process was corrected from an interactive browser print to a headless p..."
source: "85f423c9-de53-4af4-bd50-0e5ac8deef2a"
---

The resume PDF generation process was corrected from an interactive browser print to a headless process using `node scripts/generate_resume_pdf.cjs`. The canonical output path for the resume PDF was corrected to `D:\GitHub\portfolio-assets\R2_STAGING\resume\Erik_Norris_Resume_Current.pdf`, replacing the previously documented `public/resume/Erik_Norris_Sr_Staff_Forensic_Architect_[YEAR].pdf`. The resume deployment tool was updated from `scripts/fix_resume_r2.py` to `venv/Scripts/python.exe scripts/sync_r2.py --target portfolio`. These updates, along with the 'Trap:' idiom for silent-failure modes, were incorporated into the rewritten 'Resume Infrastructure (PDF Pipeline)' section, mirroring SKILL.md v3.0.0.

**Tags:** resume, pipeline, documentation, error_handling, docs, automation, puppeteer, filepaths, archiving, deployment, r2, scripts
