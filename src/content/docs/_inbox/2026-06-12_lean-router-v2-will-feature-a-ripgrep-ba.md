---
title: "Lean Router v2 will feature a ripgrep-backed search for drift-free retrieval across multiple corpora, retain the validated write path, fix read truncation, and eliminate dead tools."
description: "The revised Lean Router v2 architecture plan focuses on a ripgrep-backed search tool over configu..."
source: "8fb0fe4d-1604-457b-b32c-90257ac52e91"
---

The revised Lean Router v2 architecture plan focuses on a ripgrep-backed search tool over configured corpus roots, replacing the failed semantic search and dead tools. This new `search_registry` will return paths, line numbers, and snippets, supporting multiple roots (`registry/`, portfolio, mechanistic docs) and making data drift structurally impossible. The proven `push_forensic_doc` write path will be kept on the router, and `read_forensic_doc` will be fixed with `offset`/`limit` parameters to prevent truncation. The six dead tools will be dropped.

**Tags:** architecture plan, router, ripgrep, data integrity, tooling
