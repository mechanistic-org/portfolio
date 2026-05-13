---
title: "PM2 environment hardening was necessary to ensure critical suppression variables were persistent across reboots, preventing loss of protection if Python scripts crashed prematurely."
description: "The PM2 environment was not sufficiently hardened; critical suppression variables like `TOKENIZER..."
---

The PM2 environment was not sufficiently hardened; critical suppression variables like `TOKENIZERS_PARALLELISM=false` and `HF_HUB_DISABLE_PROGRESS_BARS=1` were set programmatically in Python but not in `ecosystem.config.js`. This meant if the Python script crashed before these lines executed, the environment protection would be lost for that boot cycle, requiring PM2 configuration for persistence.

**Tags:** system_config, PM2, environment_variables, stability, architecture
