# Selective visual reuse in the project reader

Audit date: November 20, 2026. Focal controller: [#422][controller]. First comparison worker: [#423][worker]. Source snapshot: portfolio main `7a4badd7e5d6865a08772d61f3cc4b00f6fbacba`, verified against the remote main reference. This is an inventory and recommendation, not visual acceptance or production qualification.

**Recommendation:** recover useful visual explanation inside the current account reader. Prioritize inline evidence and measured comparisons that answer a reader's question. Use C24 for a small placement comparison because its existing revision record has a bounded acceptance history. C24 is the lowest-data-risk first experiment, not necessarily the highest-payoff visualization opportunity.

The supplied historical audit correctly identified a large body of reusable work, but its renderer cohorts and several live/dormant classifications no longer describe main. Today all 30 distinct deep dives use the shared reader, chronology is present across that roster, and Glyph already contains a measured-data study more relevant to this request than generic HUD pips. The historical audit remains a discovery map; current code, exact rulings and project-owner records govern reuse.

## What changed since the historical audit

| Earlier framing | Current finding | Consequence for this work |
| --- | --- | --- |
| 13 rollout pages, six new article pages, eleven legacy Hyperspace deep dives | The main-site route selects `ProjectReader` for deep dives, with an earlier authored route for Glyph and Cinema One. Both feed `AuthoringPage`. | Do not restore instruments through the old fixed HUD or use the old cohort counts to plan rollout. |
| C24 alone has chronology | Thirty tracked chronology sidecars contain 487 events. | Expand explanatory use selectively; do not commission another all-project chronology extraction campaign. |
| `ChronoStrip` is the live chronology renderer | `ProjectTimeline` is the current shared renderer. `ChronoStrip` and `DevelopmentTimeline` have no current importers. | Prefer the current timeline contract and interactions. |
| C24 entropy is live | No `_entropy.json` sidecar remains on main. C24's was removed in `66659637`. | A surviving component does not authorize restoring withdrawn data. |
| Toolchain has no renderer anywhere | `HXOConsole` renders toolchain chips; the account reader does not currently render that separate field. | Any additional renderer needs a specific reader benefit. |
| Relationship visualization is still blocked or ready to revive | Focused constellations shipped historically; #291 subsequently removed them from the selected homepage. The derivation utility now has no source importers. | Do not treat the dormant utility as an unfinished authorized feature. |

These findings follow the [current route][route], [shared reader][reader], [account composition][authoring], [chronology source tree][projects], [entropy deletion][entropy-removal], [toolchain renderer][toolchain] and [#291 disposition][homepage].

## Current inventory and reuse assessment

“Present” below means source or data exists. “Wired” means a source call path exists. Neither establishes exact claim acceptance, production deployment parity or visual usefulness.

| Family | Current wiring and meaning | Recommendation |
| --- | --- | --- |
| Career strip and homepage map | `ProjectCareerContext` calls `ContextRibbon`, which uses shared `CareerTimeline`. Glyph has focused overview/scrubbing; other project strips retain native links. The homepage keeps D3 positioning, recorded employer/time context, held selection and motion controls. | Retain as orientation. Do not add another independent timeline or navigation model. |
| Full project chronology | `AuthoringPage` passes supported chronology to `ProjectTimeline`; native event/reference links remain in the output and enhancement supplies dialog behavior. | Improve presentation only where it helps an actual account. Thirty sidecars are coverage, not a demand for thirty visible dashboards. |
| C24 revision matrix | `ProjectRecords` exposes a “Part revisions” entry and opens the existing `RevMatrix`. Two illustrative part histories contain fourteen dated marks. | Compare a compact contextual preview with the unchanged baseline, keeping full-record access. Never reinterpret marks as productivity or contribution totals. |
| Entropy | `ProjectRecords` retains a conditional `EntropySeismograph` slot, but no project sidecar supplies it. | Keep dormant in this scope. Any future use needs its own purpose, exact scored data and approval. |
| Glyph spring study | `MediaGroup` renders `SpringStudy` from an authored study group. It shows measured force curves, group means, individual assemblies, a width slider, test-coverage matrix and exact-value tables. | Strongest current pattern for explanatory data visualization. Reuse its principles before generalizing its domain-specific code. |
| Inline media and workbench investigations | The shared reader places selected evidence alongside prose. Glyph's `Workbench` and `EvidenceSequence` associate steps with evidence panels and offer an inline reading option. | Highest-priority visual-interest pattern: it can clarify mechanism and causality without inventing metrics. |
| Recorded metrics and engineering decisions | `ProjectReader` exposes supported text through concise records. It renders decision details and article links; the old `ScarTimeline` heat instrument remains in legacy layout/demo paths. | Choose whether a particular statement benefits from a figure. Do not turn prose categories into numerical scales. |
| Production and team pips | Legacy `ProjectManifestHUD`/`TeamPipChart` code survives. Current distinct deep dives have seven production-scale values, all `series`, and twelve team-size values, all `Cross-functional`. | Low priority. The available scale category provides little differentiation; the team label is not a headcount. |
| Stats primitives | `HBars`, `StatTile`, `Columns` and `StatGrid` survive without active importers. | Potential implementation references for a verified comparison. They supply neither data authority nor a placement rationale. |
| Isomorphics, toolchain and audio | Deep-dive projections contain no populated isomorphics or audio URL. Two contain toolchain. `SonicHeartbeat` and older dossier surfaces survive elsewhere in source. | Do not create content to fill these widgets. Follow project-owner decisions if a supported explanation needs them. |
| Relationship constellation and canvas | Constellation logic is now dormant. Canvas feel-test #135 and exporter #130 are Closed as not planned. | Exclude from this controller. Reopening either direction would be a separate product decision. |

Implementation references: [career strip][ribbon], [career timeline][career], [homepage swarm][swarm], [project timeline][timeline], [records][records], [revision matrix][matrix], [Glyph study][spring], [published study input][study-input], [workbench][workbench], [evidence sequence][sequence], [reader records][reader], [legacy HUD][hud], [stats directory][stats] and [dormant relationship utility][constellation].

The portfolio's [design contract][design] describes its current typography, palette and token ownership. Archived “Dark Hangar” styling is not a requirement for revived primitives. Match the current reader's labels, spacing and visual hierarchy instead of transplanting historical chrome.

## Data coverage, drift and approval boundaries

The source census parsed tracked project MDX at the bound commit and applied `routeEligibleProjects`: `targets` includes `main`, and the entry is not draft. It found 31 eligible deep-dive route records. The retained `switches` alias resolves to `extension-switches`, leaving 30 distinct governed projects. Twenty-eight distinct projects use `ProjectReader`; Glyph and Cinema One use the authored route. Both routes converge on `AuthoringPage`. The [route filter][roster] and [identity aliases][aliases] define this normalization.

| Field or record | Distinct deep-dive source observation | Interpretation |
| --- | --- | --- |
| Chronology | 30 files, 487 events | Counted from tracked sidecars. This is not a certification that every selected event has its final exact human ruling. |
| Revisions | One sidecar; two parts, fourteen marks | C24's bounded documentary record. |
| Entropy | Zero sidecars | Component availability is not data availability. |
| Forensic metrics / scars | 15 / 9 populated projections | Mostly structured explanatory text; presence does not justify numerical axes. |
| Production scale | Seven populated values, all `series` | An ordinal meter would add little distinction here. |
| Team size | Twelve populated values, all `Cross-functional` | Numeric pips would manufacture precision. |
| Toolchain / isomorphics / audio URL | Two / zero / zero populated projections | No broad article visualization opportunity is established by these fields. |
| BOM / cast | One / two populated site projections | A same-date canon cross-check found no corresponding structured fields in the governed project entity frontmatter. Treat this as projection/authority drift to resolve with the owners, not as approval to repair or copy it. |

The census is reproducible from the [tracked project source tree][projects]. The separate canon cross-check was limited to structured presence and chronology/revision coverage; it did not copy private claim-review contents into this report. Exact private provenance remains outside this public note. The observed BOM/cast discrepancy does not establish that the published content is false or unapproved: accepted content may have another represented authority, and the responsible owner must reconcile that before reuse.

New data work should begin from the exact accepted account and project review record, not from old raw extracts or archive sidecars. A diagram can also overclaim without inventing a number: grouping can imply a shared cause, an axis can imply comparable measurements, and revision density can imply effort. The worker must explain what each proposed encoding means and what it cannot establish.

## Historical decisions that still constrain reuse

[#340][shared] accepted a common reader direction: optional records in concise entries with wide dialogs, selected evidence inline, ordinary scrolling and stable anchors, with composition determined by each project. Its source-landing receipt does not make this audit a new production check. A permanent wall of instruments would need a fresh explanation for departing from that hierarchy.

[#346][timeline-issue] owns the shared timeline work and its recorded verification. Read the current implementation as well as that receipt: historical descriptions of controls are not a substitute for current source. This audit ran no timeline interaction tests.

[#139's release ruling][matrix-release] accepted the revision implementation while retaining a concern about its product purpose. The later [#136 acceptance][matrix-acceptance] explicitly accepted it as supporting documentary detail and closed the instrument campaign. It covers two illustrative part histories and fourteen dated marks, not exhaustive program coverage, unique parts designed, personal contribution, productivity or manufacturing release totals. That ruling created no successor scope. The new worker evaluates placement under #422; it does not resume the old campaign.

[#291][homepage] explicitly excludes restoring the old toolbar, Tour, pin controls, constellation, scrolling list and record band merely to satisfy earlier specifications. [#135][canvas] and [#130][exporter] are Closed with `state_reason: not_planned`. Earlier canvas concepts and component prototypes can inform judgment, but they are not an executable frontier.

## Recommended selection and ownership

| Priority | Reader question and likely treatment | Work boundary |
| --- | --- | --- |
| Highest explanatory potential | “What changed, how was it investigated, and what does the evidence show?” Use selected figures, comparisons or a measured series with clear variables and context. Glyph is the current implementation reference. | Existing project curation owners retain claims, captions, selections and exact acceptance. |
| First bounded experiment | “How do these two documented C24 part histories relate to the account?” Compare a small revision preview and, if useful, an already-accepted inline evidence arrangement. | #423 only; unchanged baseline plus at most two private treatments. |
| Existing project opportunities | SC48's thermal/architecture material and Carousel's QC/sample comparisons, simulation or bench-media leads may have more explanatory value than decorative HUD revival. | Return recommendations through [SC48 #351][sc48] and [Carousel #352][carousel]. Reuse existing preparation; no new mining campaign is commissioned here. |
| Deferred | Categorical pips, a generic metrics framework, new entropy scores, revived isomorphic cards without supported content, broader constellation/canvas work. | No implementation child unless a concrete reader question and accepted input justify one. |

The public project tickets already distinguish prepared material from outstanding exact selection. SC48 requests review of thermal traces/comparison, architecture sequence and images/captions; Carousel requests review of its account, event selection and QC/sample-comparison visuals. Their preparation is not blanket approval for this controller to select or publish those assets. Recommendations should enter the existing owner workflow, with no competing factual ledger.

The shared opening and nested-index work under [#341][openings] remains outside this controller. A candidate must coordinate overlapping reader paths and the active C24 owner [#354][c24-owner] before editing. Other work is not a blanket blocker, but overlapping ownership cannot be assumed away.

## First worker and fresh pickup

Use [#423][worker] as the fresh worker's entry point. It is the single initial child of [#422][controller]; its creation does not record an operator visual selection. Cold-read that issue, this note, current main, #354 and the exact C24 acceptance references before implementation.

The worker may prepare reversible private prototypes in a separate isolated checkout, with exact paths declared. It compares the unchanged current reader against at most two treatments: a concise revision preview retaining the full record, and an inline evidence/comparison arrangement using an already accepted C24 image or diagram only if it answers a clear question. It must not edit generated project MDX by hand, alter claims or captions, manufacture new totals, or create a public experimental route on the inventory branch.

The review package must show actual desktop and phone renders, state the exact input and meaning of each treatment, and check labels, keyboard/focus behavior, full-record links, reduced motion, static readability and factual/media conservation. Preserve the candidate and validation state, return one recommendation to #422, then stop for the exact visual choice. “Keep the baseline” is a valid outcome. Public integration, wider rollout and deployment require the subsequent selected scope.

## Verification and limits of this inventory

Completed: remote-main identity readback; bounded source inspection; current import/call-path checks; frontmatter and sidecar census; Git history for withdrawn/superseded surfaces; live issue and exact acceptance-comment reads; and a same-date structured canon cross-check. The stale shared checkout was not used as current implementation authority.

Not performed in this audit: build, screenshots, browser interaction checks, production byte/deployment parity, exhaustive private acceptance auditing, new source extraction or engineering-claim review. Earlier receipts retain their original scope and date. No current visual quality or production behavior is certified by this note. The recommendations remain recommendations until the concrete worker comparison is reviewed.

[controller]: https://github.com/mechanistic-org/portfolio/issues/422
[worker]: https://github.com/mechanistic-org/portfolio/issues/423
[route]: https://github.com/mechanistic-org/portfolio/blob/7a4badd7e5d6865a08772d61f3cc4b00f6fbacba/src/pages/projects/%5B...slug%5D.astro#L343
[reader]: https://github.com/mechanistic-org/portfolio/blob/7a4badd7e5d6865a08772d61f3cc4b00f6fbacba/src/components/Projects/ProjectReader.astro#L30
[authoring]: https://github.com/mechanistic-org/portfolio/blob/7a4badd7e5d6865a08772d61f3cc4b00f6fbacba/src/components/authoring/AuthoringPage.astro#L131
[projects]: https://github.com/mechanistic-org/portfolio/tree/7a4badd7e5d6865a08772d61f3cc4b00f6fbacba/src/content/projects
[entropy-removal]: https://github.com/mechanistic-org/portfolio/commit/6665963762fb976e44e616f1a940d51c682e3afb
[toolchain]: https://github.com/mechanistic-org/portfolio/blob/7a4badd7e5d6865a08772d61f3cc4b00f6fbacba/src/components/HXO/HXOConsole.tsx#L327
[homepage]: https://github.com/mechanistic-org/portfolio/issues/291
[ribbon]: https://github.com/mechanistic-org/portfolio/blob/7a4badd7e5d6865a08772d61f3cc4b00f6fbacba/src/components/primitives/ContextRibbon.astro#L11
[career]: https://github.com/mechanistic-org/portfolio/blob/7a4badd7e5d6865a08772d61f3cc4b00f6fbacba/src/components/DataViz/CareerTimeline.tsx#L22
[swarm]: https://github.com/mechanistic-org/portfolio/blob/7a4badd7e5d6865a08772d61f3cc4b00f6fbacba/src/components/DataViz/ResVizSwarm.tsx#L64
[timeline]: https://github.com/mechanistic-org/portfolio/blob/7a4badd7e5d6865a08772d61f3cc4b00f6fbacba/src/components/Projects/ProjectTimeline.astro#L15
[records]: https://github.com/mechanistic-org/portfolio/blob/7a4badd7e5d6865a08772d61f3cc4b00f6fbacba/src/components/Projects/ProjectRecords.astro#L20
[matrix]: https://github.com/mechanistic-org/portfolio/blob/7a4badd7e5d6865a08772d61f3cc4b00f6fbacba/src/components/primitives/RevMatrix.astro#L59
[spring]: https://github.com/mechanistic-org/portfolio/blob/7a4badd7e5d6865a08772d61f3cc4b00f6fbacba/src/components/authoring/SpringStudy.astro#L14
[study-input]: https://github.com/mechanistic-org/portfolio/blob/7a4badd7e5d6865a08772d61f3cc4b00f6fbacba/src/content/projects/avegant-glyph/index.mdx#L1034
[workbench]: https://github.com/mechanistic-org/portfolio/blob/7a4badd7e5d6865a08772d61f3cc4b00f6fbacba/src/components/authoring/Workbench.astro#L8
[sequence]: https://github.com/mechanistic-org/portfolio/blob/7a4badd7e5d6865a08772d61f3cc4b00f6fbacba/src/components/authoring/EvidenceSequence.astro#L8
[hud]: https://github.com/mechanistic-org/portfolio/blob/7a4badd7e5d6865a08772d61f3cc4b00f6fbacba/src/components/Projects/ProjectManifestHUD.astro#L89
[stats]: https://github.com/mechanistic-org/portfolio/tree/7a4badd7e5d6865a08772d61f3cc4b00f6fbacba/src/components/Stats
[constellation]: https://github.com/mechanistic-org/portfolio/blob/7a4badd7e5d6865a08772d61f3cc4b00f6fbacba/src/utils/deriveFocusedConstellation.ts#L37
[design]: https://github.com/mechanistic-org/portfolio/blob/7a4badd7e5d6865a08772d61f3cc4b00f6fbacba/DESIGN.md
[roster]: https://github.com/mechanistic-org/portfolio/blob/7a4badd7e5d6865a08772d61f3cc4b00f6fbacba/src/utils/projectRoster.ts#L1
[aliases]: https://github.com/mechanistic-org/portfolio/blob/7a4badd7e5d6865a08772d61f3cc4b00f6fbacba/src/config/projectArticleTrial.ts#L3192
[shared]: https://github.com/mechanistic-org/portfolio/issues/340
[timeline-issue]: https://github.com/mechanistic-org/portfolio/issues/346
[matrix-release]: https://github.com/mechanistic-org/portfolio/issues/139#issuecomment-5560125748
[matrix-acceptance]: https://github.com/mechanistic-org/portfolio/issues/136#issuecomment-5560945747
[canvas]: https://github.com/mechanistic-org/portfolio/issues/135
[exporter]: https://github.com/mechanistic-org/portfolio/issues/130
[sc48]: https://github.com/mechanistic-org/portfolio/issues/351
[carousel]: https://github.com/mechanistic-org/portfolio/issues/352
[openings]: https://github.com/mechanistic-org/portfolio/issues/341
[c24-owner]: https://github.com/mechanistic-org/portfolio/issues/354
