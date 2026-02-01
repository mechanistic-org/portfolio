---
title: "Keystatic & Schema Survival Guide"
description: "Manual for managing content via Keystatic and resolving validation errors."
slug: "keystatic_guide"
---

# Keystatic & Schema Survival Guide

> **Purpose:** This document is the "Jump Back In" manual for managing the Portfolio content via Keystatic and resolving validation errors.

## 1. The Architecture

The portfolio uses **Keystatic** as a visual CMS for **Astro Content Collections**.

- **Source of Truth:** The `.mdx` files in `src/content/projects/`.
- **The Enforcer:** `keystatic.config.tsx` defines the strict schema.
- **The Protocol:** Keystatic reads the MDX files. If _any_ key in the MDX frontmatter is missing from the Config, Keystatic throws a "Validation Error" (The Red Screen of Death).

## 2. The Dashboard Layout

The Keystatic UI (`/keystatic`) has been reorganized (as of Jan 2026) into logical sectors:

### I. Core Identity

_Title, Listing Status, Hero Image, Description._
Start here to define the project's public face.

### II. Context & Classification

_Industry, Category, Theme._
Controls how the project is filtered and styled (e.g., "Hyperspace" vs "Standard").

### III. Timeline & Status

_Dates, Duration, Production Status._
Critical for the timeline view.

### IV. Forensic Intelligence (The "Deep" Data)

This is where the complex data lives:

- **Forensic Summary:** The STAR format narrative.
- **Metrics:** A massive nested object containing `financial` (budgets), `process` (yields), and `war_stories`.
- **Forensic Metrics:** Summarized text blocks for the Resume view.

### V. Cyberspace (Scrollytelling)

The most complex section.

- **Enable:** Switches on the scrollytelling engine.
- **Stickies:** The individual scroll-trigger points.
  - **Deck:** Slide content.
  - **Data:** Payload for 3D models or Galleries.

## 3. Troubleshooting "The Red Screen"

If you load a project and see a red error bar:

**1. Read the Error Message**
It usually says: `Field validation failed: metrics.financial: Key on object value "riskBuy" is not allowed`

- **Translation:** "The file has a key called `riskBuy`, but `keystatic.config.tsx` doesn't know about it."

**2. The Fix**
You have two options:

1.  **Delete the key** from the MDX file if it's garbage.
2.  **Add the key** to `keystatic.config.tsx` if it's valid data you want to keep.

**3. The Nuclear Option (Audit Script)**
If you are lost, run the audit script to find _all_ keys used in your project files:

```bash
node scripts/audit_keys.mjs
```

This prints a unique list of every key used in your content. Compare this list to `keystatic.config.tsx`.

## 4. Key Workflows

### Creating a New Project

1.  Click **Projects** > **Create**.
2.  Fill in **Title** (Slug is auto-generated).
3.  Set **Listing** to Active.
4.  Pick a **Theme** (e.g., `hyperspace`).
5.  Save.

### Adding a War Story

1.  Scroll to **Forensic Intelligence** > **Metrics** > **War Stories**.
2.  Add Item.
3.  **Label:** The punchy title (e.g., "The Meltdown").
4.  **Value:** The quantifiable impact (e.g., "$50k Saved").
5.  **Description:** The context.

### Scrollytelling (Cyberspace)

1.  Go to **Cyberspace** section.
2.  Add a **Sticky**.
3.  **ID:** Unique anchor name (e.g., `intro`).
4.  **Deck:** Add slides (Title/Body) that appear over the visual.
5.  **Data:** Choose `Gallery` or `Model` and configure assets.
