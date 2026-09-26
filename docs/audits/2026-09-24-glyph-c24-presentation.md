# Glyph / C24 presentation audit

2026-09-24. Narrative maturity and factual claim quality are outside this audit.

Glyph is the stronger direction for reading and visual evidence. C24 has useful
context and chronology, but its instruments precede the article and its small
media rail separates evidence from the passage that explains it. The next common
presentation should combine Glyph's inline composition with compact reference
tools and section-aware navigation.

## Baseline and version drift

- GitHub main was verified at `7668a06ffec5672643fa3c407108c84a637fd4e3`.
  The shared `D:/GitHub/portfolio` checkout was still at `03c85e01`.
- Implementation is isolated in `codex/project-presentation-audit` under
  `D:/GitHub/portfolio-workspace/project-presentation-audit/site`.
- Inspected fresh public `/`, `/projects/c24/`, and `/projects/avegant-glyph/`,
  plus the existing Glyph working preview at port 4335. An already-open homepage
  tab retained the older timeline/index; a fresh navigation served the new shared
  career timeline. Do not use that retained tab or the older checkout as the
  current homepage baseline.
- Public Glyph uses `AuthoringPage.astro` through `cyberspace.layout: authored`.
  C24 uses `ProjectArticle.astro`. This is an actual renderer split, not just
  different content or image counts.

## Baseline findings (before this revision)

| Area | C24 | Glyph | Implication |
| --- | --- | --- | --- |
| Entry into reading | Career timeline, chronology, entropy, revision history, then article shell and summary | Masthead, contents, then account | C24 makes the reader traverse reference tools before reading |
| Evidence placement | Changing right rail and a later gallery breakout | 26 inline media groups at authored positions | Adopt the inline relationship between explanation and evidence |
| Evidence scale | A 300 px rail uses two columns; measured images were 146 px wide | Measured image stage was 863 px wide | C24's technical documents are hard to inspect in context |
| Image treatment | Rail uses 4:3 `object-fit: cover`, one-line truncated captions | Contained large images, fuller captions, comparison, thumbnails, all-images view and enlargement | The two readers have different inspection capabilities |
| Mobile | Context/media rails are hidden below 1024 px; bottom galleries remain | Media stays between the relevant prose passages | Mobile C24 loses the section-to-evidence relationship |
| Career context | Shared `CareerTimeline` with overview, seven local rows and adjacent links | No career timeline or adjacent-project navigation in the authored renderer | Restore shared navigation through a small common presentation surface |
| Sources | Source-trail section, references and documentary instruments | Public renderer suppresses the private authoring-note panel | A public citation interface is still needed; do not publish private authoring notes wholesale |
| Cast | Cast & Credits populated from the project record | No cast section in the authored reader | Preserve supported credits; future people/LinkedIn work needs its own content pass |
| Visual language | Theme selector, HUD boxes, telemetry labels and duplicate page/body H1 | Large editorial masthead, byline, one H1, local color variables | Standardize structure and tokens while retaining useful project-specific content |

These are layout and interaction differences. They do not imply that the two
projects need equal numbers of images, metrics, instruments or words.

### The opening stack

The fresh public C24 sample at 1649 × 1251 measured approximately:

| Block | Height |
| --- | ---: |
| Career timeline | 382 px |
| Delivery chronology | 650 px |
| Project entropy | 542 px |
| Revision records | 1,313 px |

The article shell began at document y=3,488, before its additional summary and
body headings. Glyph's first account section began at y=568 in the public sample.
Viewport and typography affect these measurements, but the structural cause is
unambiguous: expanded supporting records occupy the entry to C24.

### The timeline divergence

The current homepage and conventional project pages already import the same
`CareerTimeline.tsx` and canonical career projection. They do not need a second
timeline implementation or another date source. Their surrounding widths and
default information density differ. C24's delivery chronology is a separate
project-level instrument, with a different visual vocabulary and purpose.

Glyph bypasses `ContextRibbon` entirely. That omission should be addressed when
the authored reader becomes the common project presentation, preferably with
compact career context after the account or in a small optional strip.

## Local revision completed

The initial compact disclosures were revised again after the eight annotated
browser comments. The current local result is:

1. The shared career renderer has a compact project mode. The visible Career
   Timeline label is gone. The current title/date is centered above its actual
   mark; endpoint years align with the graphic's horizontal centerline; adjacent
   links form a centered group underneath. The SVG uses the available width.
   "Nearby work" is now "Work from this period", with the actual date window.
2. Optional records live in the left column as a short list. Each opens a native
   wide dialog, preserving chart scale without moving the article. Close/Escape
   restores focus and reading position. Chronology links dismiss the dialog and
   navigate to the article. Without JS, native details retain the record content.
   Chronology remains documentary, entropy remains an explicitly scored view,
   and revisions retain their original drawing/ECO data. No instrument quota.
3. C24 now uses Glyph's MediaGroup and the extracted shared MediaExperience:
   six curated galleries, all 32 existing images and captions, distributed at
   section boundaries. Large contained images, paging, comparison, thumbnails,
   view-all, a whole-article image browser, enlargement and original links share
   the existing implementation. The narrow media rail and trailing Visual
   Evidence wall are absent. Static HTML contains every figure without JS.
4. Gallery placement is presentation configuration, validated against headings
   during the static render. Splitting the rendered article preserves all prose.
   Generated MDX, canon records, R2 assets and narrative claims were not edited.
5. C24's model selection is disabled, matching Erik's later removal on
   `codex/336-c24-model-disabled`; the baseline used for this preview had restored
   it. The canonical-record colophon paragraph is removed from ProjectArticle.
6. Cast & Credits is retained and linked from C24's contents. Glyph's absent cast
   remains an explicit convergence gap; no people enrichment was attempted.
7. Compact previous/next links, with project names and All work, now occupy the
   top of the site footer on ProjectArticle pages. The large standalone cards are
   removed. Footer context is optional, so general pages remain unchanged.

At 1440 × 1000, the current C24 career strip is 165 px high, its graphic is
1,217 × 80 px, and the article shell starts at y=667. The inline image stage is
1,093 px wide. A record overlay is 1,382 px wide; the footer navigation is 78 px
high. The title and active mark centers, and the graphic and adjacent-navigation
centers, match within one pixel. Narrow layouts preserve contained images and
scrollable record content.

The homepage retains its expanded career renderer. Glyph retains its composition
and content while sharing the extracted viewer shell. No deployment was performed.

## Scroll-based storytelling within the article

The earlier continuity-rail work survives in the generic
`ProjectRailCoordinator.astro`: section activation, hash navigation, reverse-scroll
recovery, reduced-motion treatment and Astro-transition cleanup. Glyph has its
own smaller heading observer for contents highlighting. Older scrolly HUD code
also remains on the Hyperspace path. Neither current article needs to become a
full-screen scroll sequence to recover the useful parts of that work.

The shared contract should be:

1. Ordinary document scroll, stable heading/media anchors and a visible contents
   route. Reading position controls orientation, not access to evidence.
2. Large inline figures and small curated groups located beside the explanation.
   Images, captions and videos remain in document order on mobile and without JS.
3. Use a sticky visual stage only where successive passages explain the same
   object or an actual before/after, assembly, geometry or test sequence. Keep its
   scope local to that section and provide the same content in ordinary flow.
4. Keep current-section highlighting and optional progressive emphasis. Avoid
   forcing extra viewport-height spacing or requiring animation to understand a
   mechanism. Honor reduced motion, direct links, keyboard access and reverse
   scrolling.
5. Keep timelines, detailed revisions, metrics and sources available as reference
   tools. Their presence should not delay the first engineering explanation.

For further refinement, the existing section/media associations are useful input:
product/prototype views with the shipped-product section; side-cap defect,
support-method and inspection figures with paint curing; fabrication photographs
with panel recovery; the DCD and revision crop with board interfaces; the jack
change record with serviceability. Reuse those reviewed associations, then review
exact figure selection and captions in canon before changing the generated page.

Do not make the rail the only home of an explanatory photograph or drawing.
It can carry orientation, a short fact or a pointer to a full-size inline figure.

## Remaining convergence work

The [September 25 opening review](2026-09-25-project-opening-review.md) records
subsequent implementation, current verification and the remaining landing gate.
The list and checks below describe this September 24 checkpoint.

- Extend common navigation to the authored reader (career context, project footer,
  supported cast) without forcing all project records into one content checklist.
- Refine C24's gallery-level placements into smaller figure sequences where the
  explanation warrants it. Any caption or directional prose revision belongs in
  canon; the existing source-trail sentence still refers to photographs "below".
- Define a public citation treatment independent of private authoring notes.
- Unify the two TOC controllers, including active-location accessibility,
  reverse-scroll/direct-anchor behavior and transition cleanup.
- Resolve the legacy theme selector against the documented dark-theme policy,
  remove duplicate body H1s through the content pipeline, and move authored-page
  color constants onto shared design tokens.

## Verification

- Full `npm run build` passed: frontmatter, Astro diagnostics (0 errors, 0 warnings,
  53 hints), publication integrity, readiness report, static build, built claims
  and Pagefind (151 pages).
- Eleven career/held-reading/authored-public/composition tests passed. The new
  split checks prove prose preservation and fail closed on missing heading anchors.
- C24 chronology data checks passed; its browser probe now opens the wide record
  dialog before exercising the established chronology interactions.
- Hydrated homepage retained the expanded timeline and selected C24 without
  navigating away; the selected career ID became `c24`. The local preview uses
  a temporary config outside the repository to allow the reused, lockfile-matched
  dependency directory through Vite and keep its development cache separate.
- Browser inspection covered 1440, 768, 390 and 320 px without document overflow
  in the checked states. The second revision checked wide record dialogs, Escape
  focus/scroll restoration, eight chronology markers and arrow-key movement,
  fourteen revision rows, and the fabrication link closing the dialog and placing
  its heading at 96 px. Media paging, comparison selection, enlargement and the
  32-image browser worked. Glyph's 26 groups and 74-image browser/enlargement still
  worked after the shared extraction. SC48 rendered its compact timeline/footer.
- Updated browser probe scripts pass syntax checks; their complete automated
  suites were not rerun. Browser interaction checks used the connected browser.
- `git diff --check` passed. No merge or deployment was performed.
