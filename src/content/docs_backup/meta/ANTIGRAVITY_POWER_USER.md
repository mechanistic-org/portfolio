---
title: "Antigravity Power User Protocol"
description: "How to drive the machine like a Process Engineer."
---

# Antigravity Power User Protocol

**Diagnosis:** You are not a Web Developer. You are a **Process Engineer**.
**Strength:** You understand systems, pipelines, and "Sources of Truth".
**Opportunity:** You can drive Antigravity better than most devs because you treat it like a *machine*, not a *chatbot*.

## 1. The "Architect" Pattern (Your Superpower)
Most users treat the AI as a "Junior Coder" ("Fix this function").
You treat the AI as a "System Module" ("Here is the `CONVERSATION_MINER_PROMPT`, run the protocol").

**How to level this up:**
*   **The Context Nuke:** Don't just paste prompts. Create a folder `src/content/docs/protocols/`.
*   **The Trigger:** Instead of pasting text, just say: *"Run Protocol Alpha from `protocols/ALPHA.md`"*. I can read the file myself.
*   **Why:** This turns your prompts into *Source Code* that is version-controlled and immutable.

## 2. "Raw Mode" Interaction
You intuitively understood to edit `RETROSPECTIVE_GENESIS.md` directly. This is the **highest bandwidth channel**.

*   **The Move:** If you need to explain a complex logic change, don't type it in chat.
*   **The Power Move:**
    1.  Create a file: `src/content/docs/drafts/new_feature_spec.md`.
    2.  Write your thoughts in bullet points, pseudo-code, or even "Engineer Rants".
    3.  Tell me: *"Read `new_feature_spec.md` and implement it."*
*   **Why:** Chat is ephemeral. Files are persistent. If I crash or you switch sessions, the context is saved in the file.

## 3. Artifact Awareness (The "Blue Button")
You asked about the "Artifact". This is the UI layer that sits *on top* of the file system.

*   **When to use it:** When you need a "Dashboard" or a "verify this plan" view.
*   **When to ignore it:** When you are deep in the code.
*   **The Trick:** You can ask me to *create* an artifact for anything. *"Make me an artifact that tracks the health of all 3D assets."* I can generate a living dashboard for you to refer to during a session.

## 4. The "Slash Command" Equivalent
Since you have a `docs/` folder full of SOPs (Standard Operating Procedures), use them as commands.

*   **"Check compliance":** *"Check `src/components/MyComponent.astro` against `docs/STYLE_GUIDE.md`."*
*   **"Onboard me":** *"Read `docs/ROADMAP.md` and tell me what we did last week."*
*   **"Debug mode":** *"Read `docs/MAINTENANCE.md` troubleshooting section and check if my current error matches anything."*

## 5. Driving the "Builder" vs. "Operator"
*   **Builder Mode:** "Write code." (High risk, high agency).
*   **Operator Mode:** "Update `data_source/Main.csv` and run `ingest_data.py`." (Low risk, high reliability).
*   **Tip:** Explicitly tell me which mode to be in. *"I am in Operator mode. Do not change code. Only change data."* This prevents me from "refactoring" things when you just wanted to add a project.

## Summary
You are already using the system correctly: **Define the Spec -> Build the Tool -> Run the Tool.**
The only leverage left is to trust the **File System** as your primary communication interface, using Chat only for triggers and confirmations.
