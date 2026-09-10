---
title: Shared project claims - proposed design and implementation plan
status: implemented-candidate
recorded: 2026-09-10
ticket: https://github.com/mechanistic-org/portfolio/issues/277
sources:
  - https://github.com/mechanistic-org/portfolio/issues/277
  - https://eriknorris.com/how-i-work/
  - https://eriknorris.com/colophon/
  - https://eriknorris.com/resume/
  - https://eriknorris.com/projects/c24/
  - https://eriknorris.com/projects/sc48/
  - https://eriknorris.com/projects/avegant-glyph/
  - https://github.com/mechanistic-org/portfolio/blob/157716c24a0c8f70fe007447e8cbdf9a49b42fc2/src/config/method_nodes.ts
  - https://github.com/mechanistic-org/portfolio/blob/157716c24a0c8f70fe007447e8cbdf9a49b42fc2/src/data/forensic_registry.json
  - https://github.com/mechanistic-org/portfolio/blob/157716c24a0c8f70fe007447e8cbdf9a49b42fc2/src/config/resume_master.ts
  - https://github.com/mechanistic-org/portfolio/blob/157716c24a0c8f70fe007447e8cbdf9a49b42fc2/docs/agents/resume-authority.md
  - https://github.com/mechanistic-org/portfolio/blob/157716c24a0c8f70fe007447e8cbdf9a49b42fc2/scripts/audits/validate_publication_integrity.mjs
  - https://github.com/mechanistic-org/portfolio-canon/blob/main/SCHEMA.md
  - https://github.com/mechanistic-org/portfolio-canon/blob/main/DEEP_DIVE_SOP.md
  - https://github.com/mechanistic-org/portfolio/issues/229
---

# Shared project claims

Make reusable engineering assertions parametric while keeping the argument,
selection and voice deliberately authored. Case studies, How I Work, resume
achievements and colophon career cards should consume reviewed claims from
canon. A public case study is one presentation of the record, not the database
that the other presentations scrape.

The operator subsequently directed implementation under [portfolio#278](https://github.com/mechanistic-org/portfolio/issues/278).
The shared assertion package, consumers, drift checks, corrected site candidate
and PDF preparation are implemented. [The operating contract](../agents/shared-claims.md)
records the actual scope and commands. The candidate awaits exact page/PDF
acceptance and publication; the earlier capture-only and P1-only stops are superseded.
The P1-P5 labels below remain design history, not separate GitHub tickets.

## Editorial context: the colophon satire

Erik clarified on 2026-09-10 that the AI praise wall was intentionally funny,
sardonic and satirical. It came from MootMoat's early period, when "brains in
boxes" were a novelty. In his account, roughly a year later the humor lands
differently: AI reviewing AI has become unfunny rather than ironic amid the AI
backlash. The approximate age and reception judgment are operator testimony,
not an independently dated history or a universal audience finding.

The earlier assessment must not turn this into a story about originally
attempting to pass AI praise off as independent endorsement. Its present
editorial effect and its original intention are distinct.

Proposed disposition: retire the wall from the main colophon while preserving
the original material and its intent in Git history. A dated, clearly labeled
historical outtake is an optional later editorial choice, not a required new
page. Do not replace the wall with solemn AI testimonials or an apologetic
disclaimer. Preserve the useful system architecture and build-log material.
This disposition is separate from the claim-system implementation and remains
a proposed change until the exact candidate is reviewed.

## Problem and evidence boundaries

The 2026-09-10 read-only inspection found a real gap between authored surfaces
and reviewed project records. These are dated observations, not standing
assertions about later deployments:

| Example | Observed mismatch | Required protection |
| --- | --- | --- |
| Glyph life tests | Method/resume prose describes T1-T6 as tooling progression and generalizes seizure rates; the case study bounds results to dated specimen cohorts. | Carry population, test conditions, chronology and interpretation with the assertion. |
| C24 economics | The case study identifies 51.8% as a July estimate at an $8,995 price; a colophon card pairs it with the later $9,995 price as achieved performance. | Keep estimate/actual state and snapshot context attached. |
| SC48 thermal | A colophon card treats 22.6 degrees C as temperature rise; the case study's comparable test row identifies it as ambient temperature. | Type ambient, rise and absolute temperature separately. |
| C24 evidence link | The method page references the absent `vi-the-epistemic-boundary` anchor. | Resolve stable public destinations and validate built anchors. |

Absence from a public case study establishes a citation gap, not necessarily
falsehood or absence from the archive. Repetition across pages establishes
neither support nor correct interpretation. Different formal titles and
contribution descriptions may be legitimate; standards revisions must be
resolved per project. Do not blanket-normalize either.

The initial attachment's numerical tally was not adopted as a verified truth
audit. Its proposed A/B/C hierarchy and promise of a site incapable of lying
are also not adopted. Code can enforce identity, approval bindings and
consistency; it cannot establish the truth of arbitrary prose or a source's
correct interpretation.

Re-read the current canon research records and exact operator rulings before
using these examples in implementation. The #229 campaign is changing project
accounts. An in-review candidate is not an accepted replacement, and a historic
acceptance does not silently approve a later assertion.

## Existing authorities to preserve

| Authority | Current responsibility | Proposed addition |
| --- | --- | --- |
| Private `portfolio-canon` | Reviewed project knowledge, decisions, source references and narrative | Structured identities and revisions for reusable project assertions, linked to the existing review record |
| Local `portfolio-evidence` | Original/derived sources and private receipts | Exact claim support locators, source identity checks and approval support where appropriate |
| `resume_master.ts` and `resume_projection.ts` | Career identity, dates, titles and resume/JSON/identity/PDF projections | References for project achievements; retain career authority and reviewed channel mappings |
| `method_nodes.ts` | Method selection, authored examples and competency coverage | Approved claim/variant references in claim-bearing examples |
| `forensic_registry.json` | Colophon career-card text | Claim/variant references or generated approved card data |
| Project pipeline | Canon-to-generated-project projection | Consume the same reusable assertions while retaining authored case-study narrative |
| Publication checks | Invalid-content, evidence-integrity and competency checks | Shared claim resolution, approval/version checks and final output checks |

The existing [resume contract](../agents/resume-authority.md) already
centralizes resume outputs and deliberately pins accepted wording. Do not
replace it with a competing career database or update acceptance hashes simply
to make a changed claim pass.

The [Pulse ADR](../adr/0001-publish-dated-metrics-from-private-receipts.md)
provides useful precedents for exact approval, atomic output and private
receipts. Historical project claims do not inherit the Pulse's 90-day archive
rule or operational-metric eligibility requirements.

## Proposed design

### Complete assertions

Use one stable claim identity scoped to its project, with explicit revisions.
The private record should carry the following meaning; exact field names and
file layout remain decisions for the pilot:

| Element | Meaning |
| --- | --- |
| Identity | Stable claim ID, project ID, revision, and associated career/contribution identity when needed |
| Assertion | The bounded proposition, including attribution and whether it describes a proposal, observation, validation or shipped outcome |
| Measurements | Named values, units, precision, denominators, populations, dates/configurations and derivation inputs where applicable |
| Support | Existing evidence IDs, exact document/sheet/row/section locators, relevant content identities and support or contradiction notes |
| Review | Current finding, unresolved questions, effective operator ruling, and what earlier interpretation it supersedes |
| Public variants | Authored text or templates for named surfaces, bound to the exact claim revision, measurement formatting and approval |
| Destination | Stable public project/section target that actually explains the claim, or an explicitly approved alternative |
| Publication disposition | Proposed, approved, held, withdrawn or superseded, mapped to existing review vocabulary rather than introduced as a rival workflow |

Keep source class, research completeness, claim acceptance and permission to
publish independent. A measured artifact can be misread; a recorded
recollection can support an explicitly accepted account. Do not reduce these
dimensions to an automatically assigned confidence grade.

Private approved variants live with their claim or reference a canon-owned
variant record. Surface files choose and arrange them. Facts and assertion
wording must not become independently maintained copies in four repositories
or files. The pilot should prefer one per-project structured sidecar over a
new global store, provided it complements the current project review entry
point without duplicating that record's decisions.

### Authored presentation

How I Work retains the method argument and selection of examples. The resume
retains its compression and emphasis. A case study retains chronology,
mechanism and attribution detail. Sharing assertions does not require sharing
an entire paragraph or automatically generating all prose.

Render a complete approved assertion or an explicitly reviewed alternative.
Never delete an unsupported numeral while retaining unsupported words such as
"qualified", "eliminated", "caused" or "shipped". A number-free statement can
still exceed the evidence. Required variants fail rather than silently vanish;
optional omissions require a recorded editorial disposition.

Surrounding prose can also change meaning. Combining two individually valid
claims can invent causality, ownership or chronology. The review packet must
show the exact assembled sentences and context, not merely approved fragments.
Store meaningful context changes as a reviewed variant/composition revision.

The public page should lead with the engineering argument, one concrete
example and a usable supporting link. Evidence metadata belongs in the review
system unless it helps the reader assess the claim. There is no mandatory
number, source-count, word-count or component quota for each capability.

### One shared module

The consumer interface should be small: resolve a claim ID, its pinned revision
and an approved surface variant into display text/values and a public link.
Its implementation owns lookup, project identity, eligibility, formatting and
errors. Both the canon generator and site consumers must share its contract;
avoid independent Python and TypeScript copies of the publication rules.

Prefer a deterministic exported public package that the existing Python
pipeline and TypeScript consumers can both read. Private preparation validates
sources and exact approval before exporting. Public CI validates the exported
package, approved digest and consumer bindings; it does not require access to
private evidence or report unavailable source verification as successful.

Public output uses an allowlist: public claim identity/revision, approved text,
permitted formatted values and public destinations. Exclude private evidence
paths, source extracts, review notes, transcripts, private source hashes and
raw approval receipts. Publishing a source artifact remains a separate act.

No new database, runtime retrieval service, LLM generation step, or HTML-number
scraper is required. Generated project MDX remains read-only. Astro stays static.

### Changes, review and release

1. A new proposed revision does not automatically replace the accepted one.
2. Material change to an assertion, interpretation, value, unit, population,
   attribution, qualifier or public wording creates an affected review set.
3. A material challenge or withdrawal holds affected new publication until an
   exact disposition exists. Merely leaving a warning on an invalid claim is
   insufficient. Explicit retention of an older version needs a supportable
   ruling; a broken provenance chain cannot inherit approval by default.
4. Renaming a source while preserving verified identity, or changing unrelated
   project copy, does not invalidate every claim. Reconcile the locator and
   retain approval where meaning and support are unchanged.
5. The reverse dependency report identifies affected surface instances,
   variants, outputs and next actions. Source changes never silently delete
   a true claim or automatically reapprove it.
6. Corrected public output ships as one approved release set. Include HTML,
   cards, JSON, linked PDF and other affected downloads/exports. Preserve
   historical receipts and distinguish prepared, approved and published states.

Deterministic export and release checks prove that consumers use the reviewed
record. They do not prove that no unstructured sentence elsewhere can be wrong.
During migration, explicitly inventory unmanaged claim-bearing copy; record
its support/hold disposition and do not call it verified merely because it is
on a temporary compatibility list. Completion removes the scoped duplicates.

## Implementation packages and dependencies

These are proposed packages, not permission to start several writers or a
published Epic. Create execution tickets only after the package boundaries
and exact scope have been reviewed. Keep one coordinated portfolio write lane
and isolated worktrees; existing project research continues under #229.

| ID | Work and bounded deliverable | Depends on | Exit criterion |
| --- | --- | --- | --- |
| P1 | Reconcile the exposed claim set and prepare editorial correction candidates across the four surfaces; include the satire-wall disposition. | None | An occurrence-level matrix records current text, project, support/ruling, discrepancy, proposed replacement/hold, affected outputs and exact unresolved questions. |
| P2 | Define and prove the private claim contract/public export using C24 interfaces, SC48 thermal measurements and Glyph cohort testing. | P1 | One pilot package preserves context, source/approval separation and surface variants; includes a supported case, bounded measurement case and held/contradicted interpretation. |
| P3 | Integrate shared resolution, reverse dependencies and publication checks with the existing pipeline and consumers. | P2 | All pilot surfaces resolve the same approved revisions; meaningful positive/negative checks pass; no new truth store or duplicated rule implementations. |
| P4 | Migrate remaining scoped method examples, colophon career cards and resume project achievements. | P3 | Every scoped occurrence resolves or has an explicit reviewed omission; unmanaged duplicate assertions are retired; career identity remains under resume authority. |
| P5 | Prepare exact public candidates, obtain scoped acceptance, release and verify affected outputs. | P4 | Approved source/artifact identities, relevant HTML/JSON/PDF parity, working evidence links, public readback and closeout are recorded. |

Dependency sequence: **P1 -> P2 -> P3 -> P4 -> P5**.

P1's urgent corrections and satire retirement may receive a separately scoped
early editorial release after exact review; the complete claim mechanism is
not a prerequisite for correcting known copy. That release must have its own
explicit artifact/approval scope and feeds the accepted baseline into P2.

P1 combines the copy inventory and editorial proposal because they use the
same surface review. P2 stays separate from integration so real examples can
change the schema cheaply. P3 combines resolution and enforcement because a
resolver without checks permits drift. P4 separates broad migration from that
proof. P5 keeps final acceptance and actual public-output parity explicit.
Avoid creating one ticket per field or per metric; split P4 by consumer only
if the pilot demonstrates independently reviewable slices without divergent
publication rules.

Do not repeat completed project-wide research to populate a claim record.
Reuse exact current rulings and source locators. Send unresolved engineering
questions through their existing project research record and #229 selection;
this proposal does not reopen or advance campaign children. Missing support
for one assertion need not block unrelated supported pilot cases.

Search indexing is a separate diagnostic concern, not a dependency of this
design. The earlier check found permissive robots, successful sitemap/page
responses and some search visibility. Search Console and relevant access logs
must establish any Google-specific problem before infrastructure changes.

## Acceptance checks for the implementation

| Scenario | Required result |
| --- | --- |
| Claim from SC48 attached to a C24-only example | Reject the project mismatch. |
| Temperature ambient substituted for rise | Reject the measurement/variant mismatch. |
| Two of five tested specimens generalized into a production failure rate | Reject an unapproved assertion variant; preserve the bounded denominator and context. |
| Estimated margin paired with a different date/price as realized margin | Reject the changed scope/state. |
| Supported value rounded according to the approved format | Render successfully; string identity is not required. |
| A variant's qualifier or contribution wording changes | Require review of the changed variant and assembled context. |
| Claim withdrawn or relevant evidence identity no longer verifies | Fail affected new publication with an actionable dependency report. |
| Evidence relocated without changing verified support | Reconcile locator without forcing unrelated claim review. |
| Unrelated project paragraph or image changes | Leave unaffected approved claims usable. |
| Missing/renamed public anchor | Fail link validation or use an explicitly reviewed replacement target. |
| Private fields added to public export | Reject unknown/disallowed fields. |
| Unchanged inputs exported twice | Produce identical public bytes. |
| Required assertion cannot render | Fail rather than silently truncate the sentence/page. |
| HTML changed but linked PDF still carries the superseded claim | Fail the affected release's output-parity check. |

Use consumer-facing contract tests for these failures. Final built-HTML tests
check links and assembled output, not arbitrary-number extraction as truth.
Retain the existing focused resume checks and publication integrity checks.
Run the current repository-required type/build and affected browser/release
checks when implementation changes runtime or presentation. The implementation requires the complete validation and exact candidate review described in the operating contract.

## Current execution handoff

Continue portfolio#278 against its live scope and current candidate receipt.
The earlier P1-only planning handoff is superseded by the operator's direction
to implement the solution. The code and migrated candidate now exist; do not
restart the audit or replace execution with another proposal.

Use the isolated site/canon worktrees named in the execution record, preserve
the exact claim dispositions, verify the current candidate and operator
ruling, then finish the authorized publication and normal closeout. A changed
artifact needs a new exact review. Do not advance the independent #229 project
campaign or edit its other active project account.
