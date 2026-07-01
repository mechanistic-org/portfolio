---
title: "Implement CI sharding to run expensive test suites only for relevant code changes, skipping full builds for content-only commits."
description: "Adopt change-classification CI sharding, where `main-ci.yml` classifies changed files and only ru..."
source: "f4d5cfd2-2380-462b-820c-5583e707c926"
---

Adopt change-classification CI sharding, where `main-ci.yml` classifies changed files and only runs expensive test suites when relevant. This prevents content-only commits or documentation updates from triggering full, time-consuming builds, optimizing CI resource usage.

**Tags:** CI/CD, optimization, workflow, documentation, testing
