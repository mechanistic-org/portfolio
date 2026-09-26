# Shared project timeline

`ProjectTimeline.astro` accepts `chronology` and an optional `referenceHtml`. It owns
the phase overview, selection, full reference, dialog and navigation cleanup. Page
layouts decide placement; neither the component nor its controller reads a project
draft, source archive or private research directory.

The overview uses the admitted phase labels and prominent events. Dates use
`chronologyDate`, including explicit `date_label` values. Phase groups express
sequence, not a proportional time axis: a partial date never acquires an invented
position. The complete reference retains every event, cluster, verification note
and article link. C24 has 25 records, eight prominent events and six phases; its
DCD cluster retains seven checkpoints and the 18-identifier statement.

## Authored reference ownership

`selectAuthoredTimeline` moves the existing `development-timeline` section once,
inserts the feature after the authored `development-at-a-glance` section, and
preserves all other HTML and media pieces. The legacy heading ID stays with the
reference. `bindTimelineReference` attaches a sidecar ID only when the complete
displayed date/title, summary, article fragment and link label match uniquely.
It rejects changed, missing, ambiguous or unsupported rows rather than joining
by order, count or date alone. Existing anchors that collide with generated
anchors also fail. The only modifications inside the moved section are identity
and focus attributes on its list items.

The accepted Cinema input has 36 exact associations. Its January 2012 and April
2013 labels remain month precision; the November 13-14, 2014 proposal remains a
proposal. Supplying that accepted authored input is a review operation, not a
change to the current published Cinema entry or the owner of its draft.

## Interaction and fallback

One nullable event ID survives both views. Opening Reference without a selection
does not select its first event. A reference event outside the prominent subset
keeps its identity and complete detail when returning to Visualization. Changing
the phase does not silently replace the selected event.

`project-event-<sidecar-id>` is the unique reference anchor. The original
`development-timeline` or structured `chronology-heading` fragment also opens the
reference. Article links leave the dialog and focus the article target. Close or
Escape returns to the opener; switching to Visualization returns to the selected
marker or detail. Phase/event links support arrow, Home and End keys in addition
to normal Tab/Enter navigation.

Without enhancement, every reference row is ordinary in-flow HTML and native
fragment navigation works. Enhancement moves that single reference into a native
dialog. Browser Find inside a closed dialog is browser-dependent; the explicit
Reference action remains available. Disconnect and `astro:before-swap` close the
dialog, restore the exact prior body overflow and remove listeners.

`ProjectRecords` supplies the left-column shortcut. The account's top cluster and
career context remain separate. Glyph's private research and source-note handling
are outside this component.

## Verification

Run `node --test tests/authoring/*.test.mjs`. To include the optional, read-only
accepted Cinema integration case, set `PORTFOLIO_TIMELINE_CINEMA_MDX` and
`PORTFOLIO_TIMELINE_CINEMA_CHRONOLOGY` to its exact reviewed generated MDX and
chronology sidecar. The test invokes the production authored loader, verifies all
36 associations and checks conservation of the remaining article and media.

Browser review must separately cover desktop/phone scanning, null selection,
nonprominent selection, both views, original and new fragments, article return,
Escape/focus, script-disabled reading, and repeated Astro navigation. Unit tests
and compiler checks do not establish those browser behaviors.
