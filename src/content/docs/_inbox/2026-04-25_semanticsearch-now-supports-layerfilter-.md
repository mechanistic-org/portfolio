---
title: "`semantic_search` now supports `layer_filter` for targeted context retrieval."
description: "The `semantic_search` function in the EN-OS Router/Registry Server now accepts an optional `layer..."
---

The `semantic_search` function in the EN-OS Router/Registry Server now accepts an optional `layer_filter` argument. This allows for precise retrieval of vectors from ChromaDB by applying a `where` query clause based on the `context_layer` metadata, significantly enhancing the accuracy of context-aware searches.

**Tags:** chromadb, search, api_update, context_management
