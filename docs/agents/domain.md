# Domain docs

How the engineering skills consume this repository's domain documentation.

## Before exploring

Read these when they exist:

- Root `CONTEXT.md`.
- Root `CONTEXT-MAP.md` if the repository later becomes multi-context.
- Relevant records under `docs/adr/`.
- Context-specific ADRs under `src/<context>/docs/adr/` if a multi-context layout
  is introduced.

Missing domain documents are not setup errors. Proceed silently.
`domain-modeling`, reached through `grill-with-docs`, creates them only when domain
language or consequential decisions are actually settled.

## File structure

This repository uses a single-context layout:

```text
/
├── CONTEXT.md
├── docs/adr/
└── src/
```

## Use the glossary vocabulary

Use terms as defined in `CONTEXT.md` in issues, specifications, hypotheses, tests,
and implementation discussion. Do not drift to synonyms the glossary explicitly
avoids.

If a needed concept is absent, reconsider whether the term belongs to the domain
or record the gap for `domain-modeling`.

## Flag ADR conflicts

Surface any conflict with an existing ADR explicitly instead of silently
overriding it.
