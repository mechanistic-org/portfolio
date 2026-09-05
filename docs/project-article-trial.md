# Shared project article trial

The authorized #222 population is `c24`, `d-command`, `sundance`, `room-director`, and
`webtv-elmer` on the main site. These are existing deep dives with reviewed original
NotebookLM migration records. The current rollout order is this trial, the remaining
mined/reviewed deep dives, then remaining deep dives. Expanding membership is a separate
operator decision.

## Ownership and extension

`src/config/projectArticleTrial.ts` owns the presentation configuration and its exact
allowlist. Shared Astro components own layout and behavior. Canon owns the content;
generated MDX remains a read-only projection. The trial overrides D-Command's renderer
at the route boundary without changing its canonical `theme` or its generated page.

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
five pages, non-trial controls, themes, four viewport widths, reference integrity, keyboard
and no-JS navigation, reduced motion, deterministic geometry, and navigation lifecycle.

Sources: portfolio#137, portfolio#222, the canon deep-dive migration dashboard and SOP,
and the existing generated project records. This is presentation validation, not a new
mining or content-acceptance claim.
