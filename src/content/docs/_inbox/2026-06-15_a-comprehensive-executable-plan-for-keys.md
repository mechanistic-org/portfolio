---
title: "A comprehensive, executable plan for Keystatic removal (#104) was documented, detailing all steps from dependency removal to build verification."
description: "The recommended long-term solution to the recurring Keystatic friction is to fully retire it by c..."
source: "16646fc3-ac7a-4268-b2f4-d89b3bb3f29c"
---

The recommended long-term solution to the recurring Keystatic friction is to fully retire it by completing issue #104, which involves removing all Keystatic dependencies, configuration, the `astro.config.mjs` integration, the `/admin` redirect, and crucially, deleting the `Keystatic ↔ Zod Schema Parity` CI step. However, the decision was made to defer the full Keystatic removal (#104) to a fresh session, rather than attempting it during the current long session close, due to the "atomic-or-broken" nature of the task and high risk of a broken deploy. A detailed, executable plan for Keystatic removal (issue #104) was documented, including removing `@keystatic/astro` and `@keystatic/core` dependencies, surgically editing `astro.config.mjs` (removing import, integration, redirect), deleting `keystatic.config.tsx` and `src/components/KeystaticComponents/`, dropping the parity step from `ci.yml`, retiring related scripts, cleaning Keystatic references, and a non-negotiable full `astro build` verification.

**Tags:** architecture, roadmap, Keystatic, documentation, project plan, technical debt, CI, decision, agent limitations, risk management, session management
