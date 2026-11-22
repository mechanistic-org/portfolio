# Biography and hiring-copy refresh

When Erik requests a refresh after a useful batch of deep dives or lites, start with the existing private Moreplay package on **main**: `authoring/biography/README.md`, `review-workflow.md`, `refresh-history.md`, `inventory.json` and `publication-status.md`. Include current working edits from `authoring/biography-working/edits.json`. This is the source for the existing bios, resume, LinkedIn sections, three-site copy, reuse map and design reference.

A few useful projects or a larger run that is substantially developed can justify a refresh. Roughly 80% is an editorial judgment, not a software threshold. Erik supplies the trigger; individual canon-file changes and project closes do not create biography obligations.

## Resume the existing work

1. Open the current review with `npm run bio:serve`. Inspect the registered copy, intended uses and published/draft states before drafting. Reuse its stable IDs, templates, current resume layout and shared styles.
2. Read the relevant current canon records for the selected batch. Compare what is new with the existing wording; revise the entries it improves. Exact shared copy regenerates together. Deliberate short/channel variants are reviewed as adaptations. A no-change result is valid.
3. Record the batch, changed IDs, publication/draft state and carryovers in the private refresh history. Preserve that source on private main. Publish selected accepted changes through the site's existing workflow and verify the result.

The full procedure and history live with the private source. If it is missing, recover private Moreplay main; do not reconstruct an approximate replacement from chats or older files.

## Connect and open

The bridge resolves `BIO_CONTENT_ROOT`, then local `git config bio.contentSource`, then the in-repository/sibling Moreplay package. Point a separate registered source checkout at private Moreplay **main**, not a review branch:

```powershell
git config bio.contentSource /absolute/path/to/private-moreplay/authoring/biography
npm run bio:status
npm run bio:serve
```

Use Node 24 and Python 3.12+. `BIO_PYTHON` can select an interpreter. `bio:check` verifies the package and any installed supporting-copy projection; `bio:preview` prepares the current review; `bio:export` exports working copy plus the clearly labeled current published PDF to ignored `.astro/biography/`. `bio:project` updates local supporting-copy JSON only where that consumer is installed. Pending public placements retain their separate review checkout until accepted.

## Existing authorities remain in use

Canon owns career facts and project/client claims; raw evidence remains private. For resume/LinkedIn installation, preserve role identities, supported dates and company links and follow the portfolio's `docs/agents/resume-authority.md`. The existing published web/PDF layout is the starting point; two pages is a target, not a rule. Moreplay selections still use `publishing/` and its revision/asset checks. Mechanistic keeps its existing build/release workflow. Private review commands do not deploy or edit LinkedIn.

## Reconcile and verify the existing review system

Run the new `bio:reconcile` and `test:bio` commands from the private Moreplay source checkout. Consumer repositories keep their existing `bio:check`, `bio:serve` and export commands. After an operator-selected batch, update the existing source records and selected publication pointers, run `npm run bio:reconcile`, `npm run bio:check`, and `npm run test:bio`, then review the diff. The generated checklist and status page must not be hand-edited. Their catalog reads the existing Projects, Featured and supporting-field inventories as well as the copy blocks.

Publication receipts retain their original dates and bytes. Record new live observations with their own timestamp; never carry an old PDF hash forward as a current parity claim. A normal offline check does not fetch LinkedIn or the public sites. During an authorized release, verify the changed destinations and the current public PDF through the existing publication workflow.

For recovery, clone private Moreplay main into a fresh directory. With Node 24 and Python 3.12+, run `npm run bio:check`, `npm run test:bio`, and `npm run bio:serve` without site dependency installation. Check the generated live/source/review links. Preserve any existing working overlay before changing a registered source checkout. The normal editor remains at ports 8842/8863-8865; stop the prior owner before starting another instance.

## Selected metadata and legacy copy

The private source now includes `metadata-selection.json`, linked to the reviewed metadata/legacy packet. `bio:project` regenerates installed `src/data/biography-metadata.json` and the portfolio machine biography from that selection and existing copy IDs; `bio:check` detects stale installed projections. About-map wording reads that JSON by its existing node IDs. Map dates remain in the layout source and are not rewritten by the metadata projection.

Intentional short descriptions and legacy hiring/manual passages are reviewed adaptations. Their exact source IDs and target paths are recorded in the selected packet and release receipt. Update those existing fields during an operator-selected batch, then verify the affected page, preview image and links. Do not overwrite a PDF because unrelated head metadata changed; retain the accepted PDF and verify the resume document and current PDF hash.
