---
title: "Decouple LLM observability backends using OpenTelemetry GenAI semantic conventions for flexible, fail-safe swapping."
description: "The strategic move for LLM observability isn't switching tools, but decoupling them. By instrumen..."
source: "15f11459-931a-4a7f-89cf-1cf31945a755"
---

The strategic move for LLM observability isn't switching tools, but decoupling them. By instrumenting via OpenTelemetry GenAI semantic conventions and pointing the OTLP exporter at a backend like Langfuse, the backend can be swapped (e.g., to Phoenix or SigNoz) with just an environment variable, requiring no code changes. This approach also ensures a properly-configured exporter cannot hang the router.

**Tags:** observability, OpenTelemetry, architecture, decoupling, LLM, strategy, llm
