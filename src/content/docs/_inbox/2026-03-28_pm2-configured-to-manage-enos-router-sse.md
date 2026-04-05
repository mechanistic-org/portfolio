---
title: "PM2 configured to manage `enos-router` (SSE) and `ollama-keepalive` (GPU resident model) for optimized performance."
description: "PM2's `ecosystem.config.js` was meticulously configured to manage two vital processes: `enos-rout..."
---

PM2's `ecosystem.config.js` was meticulously configured to manage two vital processes: `enos-router`, which runs `mcp_router_node.py` from its isolated virtual environment and binds silently to `http://127.0.0.1:8000/sse`; and `ollama-keepalive`, which ensures the `deepseek_r1:latest` model remains entirely resident in the GPU with the `--keepalive -1m` flag, optimizing performance.

**Tags:** PM2, ecosystem.config.js, enos_router, Ollama, keepalive, GPU, architecture, configuration
