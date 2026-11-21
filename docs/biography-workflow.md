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
