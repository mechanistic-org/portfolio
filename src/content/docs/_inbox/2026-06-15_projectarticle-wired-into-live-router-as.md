---
title: "ProjectArticle wired into live router as opt-in theme, leveraging existing `data.json` sidecar merge for seamless data flow from generated pages."
description: "A critical discovery was made that the router's `data.json` sidecar merge mechanism is already li..."
source: "16646fc3-ac7a-4268-b2f4-d89b3bb3f29c"
---

A critical discovery was made that the router's `data.json` sidecar merge mechanism is already live (lines 161–184), meaning the generator's lean-mdx + sidecar design is compatible with ProjectArticle out of the box. ProjectArticle has been successfully wired into the live router as an opt-in `article` theme, with `wikipedia`/`imdb` aliases, ensuring a non-breaking transition for other pages. This leverages the existing `data.json` sidecar merge in the router, enabling generated lean-mdx pages to feed ProjectArticle identically to frontmatter-driven pages, establishing a robust and flexible data flow.

**Tags:** architecture, router, integration, data pipeline, theme, discovery
