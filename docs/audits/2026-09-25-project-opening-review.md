# Shared project presentation: opening and record review

Candidate implementation: `0d352fa4`, on `codex/project-presentation-audit`,
reviewed against main `c014aeb35e030d9ac4553314c8d895e13832300a`.
This continues [#340](https://github.com/mechanistic-org/portfolio/issues/340)
and the [Glyph/C24 audit](2026-09-24-glyph-c24-presentation.md).
Source landing and production publication are still separate, uncompleted steps.

## Result

- C24 uses Glyph's shared inline galleries, comparison, enlargement and image
  browser. Its six existing groups and 32 selected images retain their captions.
  The narrow visual rail, trailing gallery wall, disabled model's old placement,
  canonical-record implementation note and oversized bottom navigation are gone.
  Supported Cast & Credits remains; compact named navigation sits in the footer.
- The career graphic has a compact project mode with larger marks, aligned date
  labels and centered previous/next controls. The homepage keeps its expanded
  mode. "Work from this period" names the displayed date window explicitly.
- Optional records are concise sidebar entries opening 96vw dialogs, capped at
  100rem. Escape restores the actual opener without scrolling the article.
  Record links return to their article sections; repeated fragment activation
  reopens a closed record. Without scripts, native disclosures expand across
  the reading width instead of squeezing a table into the sidebar.
- Authored pages have one identity H1, a separate subtitle where applicable,
  reduced title scale, no repeated project eyebrow/byline/top photo row, and one
  counted image-browser action in the responsive contents area. Pagefind receives
  separate title, project identity and intro metadata from that reader.
- Project development is distinct from career context. Existing authored
  `Development at a glance` phases keep their exact text and native links and
  receive a two-column desktop / one-column phone treatment. Other pages use
  supported chronology phases and events; absent data says "Timeline not
  available." No dates or phases are invented. Detailed event display prefers
  authored `date_label` precision and retains ranges.
- The article H2/H3 scale is shared across C24 and the authored reader. Generated
  body titles retain their text and IDs as aliases beneath the masthead; figures
  no longer create an automatic H4 step in the article outline.
- Contents highlighting works in both reading directions. A direct fragment is
  realigned once after gallery enhancement/font layout, unless the reader has
  already interacted. Native anchors remain the navigation mechanism.

## Qualification

The final normal-config `npm run build` passed on `0d352fa4`: static output,
377 files checked, zero errors/warnings, publication integrity, built claims and
151 indexed Pagefind pages. Twenty authored-media, chronology, article and held
reading tests passed. `git diff --check` passed. Build log:
`D:/GitHub/portfolio-workspace/project-presentation-audit/build-final-review.log`.

Connected-browser checks covered C24, Glyph, Cinema's read-only r22 composition,
a long conventional project title and the homepage. Tested desktop 1440 and
phone 390 widths without document overflow. One H1 was observed per project;
the shared title measured 86.4px at 1440 and 48px at 390. Cinema phases preserve
their links; direct section navigation/reload lands below the fixed header.
Keyboard image stepping, nested viewer/browser Escape and exact opener return,
record reopening, record-to-article links and preserved article scroll position
passed. Glyph's browser contains 74 images; C24's model remains absent.

The Cinema preservation checker passed all twelve assertions: original source
hashes, 26 images / 13 groups / 36 events, every baseline prose paragraph, approved
framing, rejected graphic/disclaimer omissions, one counted action, one H1,
native fragment resolution and preserved date labels/figure anchors.

Scripting-blocked checks used compiled review HTML/CSS served with
`script-src 'none'`, not merely hidden controls. This does not turn on browser
`<noscript>` branches: selected-media fallback uses ordinary `.gallery-grid`
markup, present before enhancement, rather than a `<noscript>` branch.
Cinema's phase and figure links remain native, all 26
figure records remain in HTML, Glyph exposes 74 full-size image links, and C24's
native record expands to 1361px in a 1440px viewport with working article links.
Reduced-motion CSS covers both shared media roots and chronology transitions;
the new phase graphic itself has no animation. The connected browser exposes no
media-preference emulation, so an OS-level reduced-motion run was not claimed.
Existing full browser-probe suites were not rerun; interactions used the connected
browser. The final homepage still renders the expanded career component.

## Review surface and custody

- C24: `http://127.0.0.1:4345/projects/c24/`
- Glyph: `http://127.0.0.1:4345/projects/avegant-glyph/`
- Exact Cinema r22 composition: `http://127.0.0.1:4345/__review/cinema-one/`

The private Cinema fixture reads the controller's generated entry and chronology
without editing them, uses this candidate's shared reader, and matches the
controller's local-only asset-prefix mapping. Fixture/config/server files and
screenshots live outside the repository. A separate review build is used only
for no-JS inspection. The final normal build has no `__review` route, local source
loader or unuploaded-media adapter; a bounded scan of its HTML/JS found none.
The real `/projects/cinema-one/` here still uses main's older conventional content.
Exact r22 actual-route inheritance remains #323's post-merge generation/build
check. The fixture is not a claim that #323 has inherited or accepted this source.

Screenshots, under `D:/GitHub/portfolio-workspace/project-presentation-audit/`:
`cinema-desktop.png`, `cinema-phone-opening.png`, `cinema-phone-phases.png`,
`c24-desktop.png`, `c24-record-dialog.png`, `c24-nojs-record.png`,
`glyph-desktop.png`, `glyph-phone.png`.

## Review and remaining boundaries

Standards review: no actionable findings. Spec review found one P2 covering
same-fragment record reopening and actual-opener restoration; reproduced, fixed
in `0d352fa4`, rechecked in the browser and cleared by the reviewer.

The authored reader now connects career context, optional chronology/revisions
and footer navigation. Supported authored cast remains explicitly deferred to a
bounded content/schema decision; no names are inferred or scraped. Public
citations, legacy theme controls, deeper color-token consolidation and finer C24
figure placement remain follow-ups. The source-trail wording that says photos
are "below" remains a canon-owned editorial correction, not a renderer rewrite.

#341's navigation/search/archive/resume/claims implementation is untouched;
only #340's identity/intro metadata provider responsibility is included. Generated
MDX, canon, selected-media definitions, captions, chronology inputs and all
parked/stopped material remain unchanged. C24's model stays disabled under #339.

The concrete remaining landing gate is #340's requirement: "Obtain scoped review
for meaningful page-composition changes." Software and independent agent review
do not substitute for that operator review. The bounded PR can be inspected now;
merge, source-landing reconciliation and Main Board completion wait for the gate.
No production deployment is authorized or performed.
