---
title: >-
  Implement a FastAPI middleware to automatically capture and store agent correction patterns in ChromaDB.
description: >-
  The "Write-Back Loop" gap addresses the current loss of agent correction patterns. To solve this,...
---

The "Write-Back Loop" gap addresses the current loss of agent correction patterns. To solve this, EN-OS will implement a FastAPI middleware hook to intercept agent output rejections, extract the delta pattern, and automatically tag it with `context_layer: behavioral_relationship` metadata for storage in ChromaDB, enabling self-updating behavioral context.

**Tags:** gap, write-back-loop, behavioral-relationship, fastapi, chromadb
