---
title: "LinkedIn & Resume Strategy Log"
slug: "linkedin_strategy_log"
sidebar:
  group: "System Manual"
---

# LinkedIn & Resume Strategy Log

> **Status:** RATIFIED (2026-01-12)
> **Goal:** Defining the rules for representing the "Forensic Architect" persona on external platforms.

---

## 1. The "Forensic Architect" Persona

We have pivoted from "Generalist Mechanical Engineer" to **"Forensic Product Architect"** and **"Program Rescue Specialist."**

- **Voice:** "Hyper-Functional Brutalist." No fluff.
- **Keywords:** Forensic, Recovery, Yield, Thermal, Optics, IP69K, AZ91D.
- **The Hook:** "I don't just design; I rescue troubled programs."

---

## 2. LinkedIn Formatting Protocols

### The "Anti-Collapse" Rule (Double Spacing)

LinkedIn's plain-text editor aggressively collapses standard lists into "Text Walls" (paragraphs).

- **Bad:**
  - Bullet 1
  - Bullet 2
  - (Result: `* Bullet 1 * Bullet 2`)

- **The Fix:** You **MUST** insert a full empty line between bullets.

  ```text
  ▪️ Bullet 1

  ▪️ Bullet 2
  ```

  (Result: Vertical List)

### The Unicode Bullet

Standard hyphens (`-`) or asterisks (`*`) look weak. We use specific Unicode/Emoji characters for visual hierarchy:

- `🔹` (Large Blue Diamond) = Role/Company Header
- `▪️` (Small Black Squaer) = Key Achievement Bullet

### The "Challenge" Hook

Every role MUST start with a **"Challenge"** line before the bullets. This frames the STAR method immediately.

- _Example:_ "**Challenge:** Architecting the 'Factory-in-a-Box'..."

---

## 3. The "Master Resume" Logic

We do **NOT** maintain separate "Human" and "ATS" resumes. We maintain a single **"Universal Source of Truth"** (`MASTER_RESUME_GENERATED.md`) designed for:

1.  **Semantic Density:** High keyword saturation for AI (ATS).
2.  **Visual Scanning:** Bold metrics for Humans.

- **Primary Identity:** "Erik Norris" (Unified).
- **Primary Contact:** `erik@eriknorris.com`.
- **Legacy Aliases:** Mapped internally but never used as primary.

---

## 4. Site Synchronization

- **Datasheet View (`/resume/one-pager`):** Sourced from `src/config/work_history.json`.
  - _Update Protocol:_ Manual sync from Master Resume.
- **PDF View (`/resume/pdf`):** Sourced from `src/content/projects` (Keystatic).
  - _Status:_ Secondary. Focus on Datasheet for speed.
