# Shared project claims

Implemented under portfolio#278. The source is the private canon checkout's
`claims/project-claims.json`. The site's JSON files are deterministic public
projections. They contain rendered statements and public destinations, never
source locators, testimony, evidence hashes or review notes.

## Editing a claim

1. Read the project's current research record and the claim's exact source
   locators. Resolve changed support or attribution before proposing replacement
   wording. A byte hash verifies custody, not the truth of an interpretation.
2. Edit the canon record's complete statement, quantities, scope, sources and
   variants. Preserve unresolved dispositions. A numerical fact includes its
   unit, precision, kind and scope. Every variant must retain the complete
   assertion; the renderer cannot drop a number and leave a success claim.
3. Set `CANON_ROOT` to the intended isolated canon checkout. Run
   `node scripts/claims/propose.mjs --id <id>`. This increments the revision,
   clears acceptance, lists affected consumers, updates the pilot case-study
   block and exports a checked candidate. It never grants acceptance. Source
   failures remain blocking and leave an explicit proposal to resolve.
4. Update the declared nonpilot project excerpt or table/metadata guards only
   after reconciling the actual project changes. These are exact dependency
   checks, not an HTML number scraper. The pilot blocks are C24 interfaces,
   Glyph cohorts and SC48 thermal comparison. Other excerpts retain their fuller
   project narrative and fail on drift instead of being automatically rewritten.
5. Regenerate each affected project using `project_pipeline.py <slug>
   --write-live`, then run its default lossless/idempotency check. The Python
   pipeline calls the same Node checker as the TypeScript surfaces.
6. Run `test:claims`, `test:resume`, `build:worker` and `check:worker`; inspect the
   affected desktop/phone views. Generate a fresh PDF with the existing
   `prepare:resume-pdf` command. Claim data and resolver inputs are part of the
   PDF's source digest.
7. Record exact candidate acceptance in the private review fields only after
   the operator's ruling. `review.digest` binds all assertion/support/variant
   fields; a source/meaning change invalidates it. Set `CLAIMS_PDF_RECEIPT` to
   the approved candidate's receipt for the existing manual release. Both npm
   deployment commands check private acceptance, source parity, PDF input/byte
   parity and the built statements/anchors before invoking Wrangler.

`check:claims` with `CANON_ROOT` validates current local evidence bytes and
canon/site parity. Public CI without canon validates public references and the
build checks actual visible statements, JSON résumé and evidence anchors. It
does not claim to have re-read private evidence. Release requires canon.

## Authority and bounds

`resume_master.ts` retains career identity and the accepted #152 channel
baseline. `resume_projection.ts` selects the current project achievements for
the website, JSON résumé and PDF. Scoped C24/Glyph/SC48 achievements resolve
through the shared package; the résumé summary is ordinary editorial copy.
Accepted LinkedIn export text and its acceptance hashes are unchanged. Its
historical wording is not silently re-approved by this migration.

This first migration covers 14 assertions, 16 method examples, eight colophon
cards, six résumé bullets and three case-study blocks. One further method node
describes the site's infrastructure. Existing Makeline/M700/NOON and earlier
career text keeps its prior acceptance and remains outside this migration;
its independent project review is not represented as completed here.

The old colophon registry/component were removed after their imports retired.
Git retains them at `f404066b`. The private disposition list records held
examples and why they were not silently declared false. Career competencies
remain intact when a specific Glyph example lacks current support.

The Collaboration Log was originally sardonic AI-persona satire. Its removal
from the primary colophon follows the operator's judgment that the joke no
longer lands. The original component/data remain in Git history; there is no
new public outtakes page or replacement endorsement wall.

## Sources

- [Execution and scope](https://github.com/mechanistic-org/portfolio/issues/278).
- [Captured design](../plans/shared-project-claims.md).
- Accepted C24, Glyph and SC48 accounts and exact primary-source locators are
  recorded per assertion in the private canon package.
- Existing career/LinkedIn boundary: [résumé authority](resume-authority.md).
