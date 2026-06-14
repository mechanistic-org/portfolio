---
title: "Obsidian's Reading view sanitizes inline scripts; use standalone HTML files or iframes for interactive JS widgets."
description: "Obsidian's Reading view sanitizes `<script>` tags, preventing inline JavaScript widgets from runn..."
source: "77fb3c26-af08-48a2-8734-647d7f5e51c3"
---

Obsidian's Reading view sanitizes `<script>` tags, preventing inline JavaScript widgets from running directly within notes. The robust pattern for embedding live JS widgets is to use a standalone, self-contained `.html` file opened in a browser or embedded via an `<iframe>` within Obsidian. This approach was adopted for the Amdahl analysis visualization.

**Tags:** Obsidian, JavaScript, Embedding, Security, Workaround, Architecture, design decision, HTML, visualization, technical constraint, solution
