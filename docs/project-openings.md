# Authored project openings

`AuthoringPage` uses `ProjectOpening` for its title, optional metadata/subtitle and supplied prose/media. The public entry loader and private authoring loader share this renderer. Page identity, Pagefind metadata, chapter IDs and the media experience remain independent of the display title.

`src/config/project-openings.json` contains explicit accepted selections. An account without a selection retains its original content order. Glyph is the first selected opening: the existing second paragraph of “Joining Avegant” becomes three blocks (product, inherited stage, responsibility), and the existing `figure-1` group moves beside it. No account text is duplicated in configuration or the component.

`selectProjectOpening` checks a SHA-256 digest of the paragraph's normalized rendered HTML. Whitespace is collapsed; private source-note nodes are excluded from the digest only. Their original HTML moves intact with the corresponding sentence. Two explicit break markers preserve the accepted 2/1/2 sentence grouping. The selector rejects missing/duplicated paragraphs or groups, changed content and breaks crossing inline markup. Content edits require deliberate re-selection of the accepted paragraph; they never silently fall back to a different opening.

The opening uses the existing `MediaGroup` and shared project title hierarchy. C24's article adapter and Cinema's accepted authored composition keep their current content placement. Adding another selected opening requires reviewing that account's composition, rather than inferring it from the first paragraph or image.

All projects are intended to receive full timelines. A project chronology must support coordinated visualization, linked highlights near the opening and a detailed reference section, connected to the homepage's career context. The current authored fallback hides an empty overview and links to a real narrative timeline when present; it does not mark an account's timeline work complete. Accepted authored overviews continue to suppress a duplicate generated overview.

Validation: `node --test tests/authoring/*.test.mjs`, the full static build, and public/private desktop and phone review. The opening tests check original content/media conservation, unchanged unselected accounts, private source-note retention and fail-closed selection drift.
