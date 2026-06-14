---
title: "Strict hygiene protocols ensure tailored resume variants are isolated and `R2_STAGING` is restored to prevent public leakage."
description: "Initially, a specific resume generation sequence was established for tailored variants to prevent..."
source: "85f423c9-de53-4af4-bd50-0e5ac8deef2a"
---

Initially, a specific resume generation sequence was established for tailored variants to prevent clobbering the master resume or leaking to the public bucket, involving branching in the portfolio repo, swapping the variant into `resume_master.ts` on-branch, running the headless generator, then moving the PDF out of `R2_STAGING` and restoring `Current.pdf`. This process was further refined into strict hygiene protocols ensuring tailored resume variants remain isolated on a dedicated portfolio branch (`resume/openai-robotics-2026-06`) and are never merged to main. The `R2_STAGING` environment is byte-for-byte restored after each print, guaranteeing that `Current.pdf` remains the original master build and preventing any tailored content from leaking publicly via `sync_r2.py`.

**Tags:** data-safety, system-hygiene, architecture, workflow, version-control, resume_generation, version_control, data_security, pipeline, resume-generation, deployment-process
