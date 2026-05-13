---
title: "The Intake Router uses Gemini Flash for intelligent content classification and dispatches files to specialized agents based on type and context."
description: "The `intake_router.py`, serving as the 'Brains in Boxes Gateway', implements a robust classificat..."
---

The `intake_router.py`, serving as the 'Brains in Boxes Gateway', implements a robust classification and routing engine. It leverages Gemini 2.5 Flash for rapid domain context classification of text, distinguishing between `HARDWARE_PRD` and `GENERIC_DUMP` contexts. Files are then statically dispatched based on type: audio/video to `transcribe_local.py`, PDFs to `run_mining_campaign`, and cross-section data to `mcp_prd_linter`, ensuring intelligent and automated data flow.

**Tags:** routing_logic, intake_router, llm_classification, architecture, data_flow, ai
