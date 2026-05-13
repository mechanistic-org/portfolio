---
title: "Router stability requires aggressive environment-level silencing for HuggingFace/PyTorch libraries via specific environment variables to prevent `stdout/stderr` corruption."
description: "To permanently prevent `sentence-transformers` output from causing issues, the router requires ag..."
---

To permanently prevent `sentence-transformers` output from causing issues, the router requires aggressive environment-level silencing for all HuggingFace/PyTorch libraries before booting. This involves setting `TOKENIZERS_PARALLELISM=false`, `HF_HUB_DISABLE_PROGRESS_BARS=1`, and `TRANSFORMERS_VERBOSITY=error` in the environment. This configuration is crucial for maintaining router stability.

**Tags:** architecture, system_config, HuggingFace, PyTorch, environment_variables, stability
