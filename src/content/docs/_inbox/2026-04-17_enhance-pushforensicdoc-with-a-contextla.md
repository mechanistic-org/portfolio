---
title: "Enhance `push_forensic_doc` with a `context_layer` field and add `layer_filter` to `semantic_search` for vector space isolation."
description: "To address the lack of layer isolation in vector space, EN-OS will extend the `push_forensic_doc`..."
---

To address the lack of layer isolation in vector space, EN-OS will extend the `push_forensic_doc` tool to require a `context_layer` field (e.g., `domain_encoding`, `artifact_rationale`). This schema addition will enable `semantic_search` to accept an optional `layer_filter` argument, allowing queries to target specific context layer classes and prevent cross-contamination.

**Tags:** gap, chromadb, metadata, layer-isolation, query-optimization
