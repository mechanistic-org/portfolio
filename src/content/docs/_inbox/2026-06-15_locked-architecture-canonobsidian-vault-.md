---
title: "Locked architecture: Canon/Obsidian vault is single source of truth for generator-fed Astro, Keystatic removed, provenance captured at conversion, and `canon/SCHEMA.md` defines sensitivity."
description: "The core architectural principle established is to \"Decouple content from presentation.\" The new ..."
source: "a088bd10-553f-4b9a-94bf-d132022d36c4"
---

The core architectural principle established is to "Decouple content from presentation." The new content pipeline must adhere to a strictly unidirectional flow: `Obsidian Vault (Truth) -> Generator Script -> Astro src/content (Read-Only Render Target)`. All content edits must originate in the Obsidian vault, and generated Astro `.mdx` files should be flagged with `<!-- GENERATED FILE - DO NOT EDIT -->`. This architecture, which resolved 'generator-rot' and 'schema sediment' by establishing the canon vault as the single source of truth, has been validated and is now locked and proven. It eliminates Keystatic, enforces provenance via capture-at-conversion (never backfilling), and includes a sensitivity gate defined by `canon/SCHEMA.md`.

**Tags:** architecture, source-of-truth, generator, Astro, Keystatic, provenance, schema, content model, design principle, law, workflow, content pipeline, data flow, migration, pipeline, documentation, validation, problem-solved
