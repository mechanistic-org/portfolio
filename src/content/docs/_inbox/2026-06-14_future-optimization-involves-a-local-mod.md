---
title: "Future optimization involves a local-model map (Ollama) with a strong-model reduce to cut Gemini latency."
description: "The roadmap for #221 includes an optimization strategy: utilizing a local model (Ollama) for the ..."
source: "b548833a-866e-4737-bd1d-7373472cafe1"
---

The roadmap for #221 includes an optimization strategy: utilizing a local model (Ollama) for the map calls and a strong model for the reduce step. This approach targets the map calls, which constitute the majority of latency, to significantly improve mining speed without requiring Gemini for every step.

**Tags:** roadmap, optimization, Ollama, Gemini, latency, architecture
