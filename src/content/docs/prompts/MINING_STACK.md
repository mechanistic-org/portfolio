# The Mining Stack: NotebookLM Prompt Library

**Status:** PROVEN (Basis of '40-Min Win')
**Purpose:** Standardized prompts to extract high-density engineering narratives from raw project archives (Emails, PDFs, PSTs) using NotebookLM.

## Phase 1: The Identity Anchor (MANDATORY)
*Always run this first to ground the AI.*
> "Context: I am **Erik Norris**. Looking at the uploaded sources, identify every instance where 'Erik' or 'Lead Mechanical/Industrial Designer' is mentioned. Associate all technical wins, CAD decisions, and manufacturing resolutions directly with me. I am the sole designer of all physical components. When I ask for a narrative, write it from my perspective using 'I' and 'my'."

## Phase 2: The "War Story" Extractor (The 40-Min Win)
*Use this to generate the core 'Bubble' narrative.*
> "Analyze the uploaded documents for the [Topic, e.g., 'Side Cap Crisis']. 
> Construct a dramatic, chronological narrative of the event.
> Structure it as:
> 1. **The Trigger:** What specific event (email, ECO, failure) started this?
> 2. **The Tension:** What was at risk? (Schedule, cost, line-down).
> 3. **The Engineering Action:** What specific technical decision did I make? (Cite Part Numbers).
> 4. **The Resolution:** How was it fixed? (Cite ECO numbers).
> output format: Markdown."

## Phase 3: The LinkedIn Mirror (The "WOPE" Protocol)
*Use this to generate the 'Key Wins' section for `deck.md`.*
> "Based on the evidence in these documents, extract 5 'Bulletproof Wins' suitable for a Senior Principal Engineer's LinkedIn profile.
> Rules:
> 1. **Quantify:** Every bullet must have a number ($, %, hours, days).
> 2. **Active Voice:** Start with verbs (Led, Solved, Saved, Designed).
> 3. **Verify:** Only include wins backed by the uploaded docs (e.g., 'Saved 15%' must be visible in a quote or chart).
> Format: Markdown list."

## Phase 4: The Visual Archaeologist
*Use this to select which images to drag into the Bubble.*
> "Analyze the visual attachments in the source files. 
> Identify the 'Smoking Gun' images that prove the narrative.
> Look for:
> 1. **Redlines:** Photos with hand-drawn circles or arrows.
> 2. **Failures:** Photos of cracked plastic, paint defects, or interference.
> 3. **The Fix:** The 'After' photo showing the resolved part.
> List the filenames of these key images."
