# Shared project article rollout

The operator-accepted #222 trial is `c24`, `d-command`, `sundance`, `room-director`, and
`webtv-elmer` on the main site. The authorized #223 rollout adds `sc48`, `d-control`,
`bazooka`, `webtv-galaxy`, `webtv-cortez`, `backsplash`, `ksystem-120`, and `wall-plates`.
These thirteen existing deep dives have reviewed original NotebookLM migration records.
The first five retain their accepted presentation; visual tweaks remain deferred. Expansion
beyond these thirteen is a separate operator decision, as the remaining records become ready.

## Ownership and extension

`src/config/projectArticleTrial.ts` owns the presentation configuration and its exact
allowlist. Shared Astro components own layout and behavior. Canon owns the content;
generated MDX remains a read-only projection. Membership overrides the renderer at the
route boundary without changing canonical `theme` values or generated pages, including
D-Command, WebTV Galaxy, WebTV Cortez, Backsplash, and KSystem-120. The existing `Trial`
module/API names are retained so this bounded rollout requires no unrelated renaming.

To configure an approved page:

1. Map stable semantic section keys to existing article anchors. A heading edit requires
   updating this map, not every rail, image selection, and feature card.
2. Map stable media keys to an existing gallery ID and exact image `src`. Alt text is
   accessible copy, never a lookup key. The initial C24 keys preserve familiar archive
   names, but changing the image's alt does not change its identity.
3. Configure scenes using those keys and existing metrics, scars, or curated galleries.
   Labels default to the corresponding article heading. No component assumes C24's
   narrative sequence. Preserve gallery captions and the limits they place on evidence.
4. Add featured evidence only when an existing reviewed presentation supports it. Empty
   instruments and media panels are omitted. Pages without galleries remain complete.
5. Where reviewed image limitations live only in legacy gallery cards, explicitly list
   those gallery IDs in `galleryCaptionsFromDeck`. Their existing card bodies become the
   fallback caption for both the rail and full gallery. Existing captions take precedence;
   unresolved IDs or missing card bodies fail validation. SC48 uses this for its three
   nonempty galleries. Other configurations retain their original captions.
6. List existing model sticky IDs in `models` when the old renderer exposes a curated
   model. The shared article preserves its source, camera settings, and caption. Cortez
   retains its model behind a native disclosure; the installed viewer loads on demand,
   without automatic rotation. With JavaScript disabled, the model file remains linked.

`resolveProjectPresentation` rejects unresolved section keys, missing or ambiguous
media references, and duplicate scene keys during rendering, including production builds.
The plain article and native links remain usable with JavaScript disabled. The optional
coordinator changes rail visibility on desktop, reconnects after navigation, and honors
reduced motion. Inactive panels are inert; mobile and no-JS expose their supported content.

## Career context

`routeEligibleProjects` supplies the same site-target/draft policy to project routes,
previous/next navigation, and the lightweight career roster. Empty targets arrays, such
as the retired Zeus alias, produce no ribbon destination. Draft routes remain available
in development, but ribbon neighbors use the published roster.

`careerIdentityAliases` projects the two accepted merged identities from canon's roster.
The ribbon excludes those aliases, including the still-reachable legacy Switches page;
their routes are unchanged. Update that projection only against an accepted identity ruling.

The roster is projected once per static-path enumeration; the ribbon no longer constructs
skill links, physics attributes, or intelligence metadata. Each ribbon remains a bounded
selection of the current project plus at most six temporal neighbors, with the recorded
span padded by two calendar years on each side. Ties use canonical IDs. Missing end dates
remain point markers, and a project without neighbors omits the ribbon. The neighbor pool
is all eligible projects, independent of which pages have the trial presentation enabled.

## Verification

```sh
node scripts/probes/project_article_trial_contract.mjs --data-only
node scripts/probes/project_article_trial_contract.mjs
node scripts/probes/context_ribbon_contract.mjs
npm run check:ci
npm run build
node scripts/probes/project_article_trial_contract.mjs --built
```

The browser contracts each own a temporary server on port 4321 and must run serially.
Screenshots are local ignored outputs under `node_modules/.cache/`. Coverage includes all
thirteen pages, non-rollout controls (Avegant Glyph, KPlayer-6000, and M500), themes, four
viewport widths, reference integrity, keyboard and no-JS navigation, reduced motion,
deterministic geometry, and navigation lifecycle. The eight added pages also load their
32 selected rail images, and SC48's gallery-card context is checked in the rendered page.
Cortez's existing model is loaded and checked at mobile width, with its caption and
no-JavaScript file link preserved. No new model asset or viewer dependency is introduced.

Sources: portfolio#137, portfolio#222, portfolio#223, the canon deep-dive migration dashboard and SOP,
and the existing generated project records. This is presentation validation, not a new
mining or content-acceptance claim.
