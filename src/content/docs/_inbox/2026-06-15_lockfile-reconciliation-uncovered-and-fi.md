---
title: "Lockfile reconciliation uncovered and fixed two latent bugs: npm 11.6.3's `overrides` crash (fixed with npm 11.17.0) and `vite` as an undeclared peer dependency (fixed by explicit declaration)."
description: "The process of reconciling the lockfile exposed and led to the fix of two pre-existing infrastruc..."
source: "4cc484d3-e38c-46b1-b282-9863e8cc6acc"
---

The process of reconciling the lockfile exposed and led to the fix of two pre-existing infrastructure bugs. First, the npm 11.6.3 `overrides` crash (npm/cli #8757), where any override caused a failure, was resolved by using npm 11.17.0. Second, `vite` was identified as an undeclared peer dependency required by `@vitejs/plugin-react`, which was fixed by explicitly declaring `vite ^6.4.1` to match Astro's bundled version and ensure proper hoisting.

**Tags:** npm, bug fix, dependency management, overrides, vite, hoisting, infrastructure, project summary
