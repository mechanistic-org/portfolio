# Portfolio design reference

**Status:** Canonical
**Scope:** Current portfolio foundations and selected shared reading treatments.

> **Note:** The former "Dark Hangar" system (Inter + Fira Code, a pure-black
> glassmorphism palette with terminal-green / pure-red status colors) is
> **deprecated**. It was a conflation that never matched the shipped code. This
> document describes the system actually in the repo. When in doubt, the code —
> not this file — is the source of truth: see the paths cited in each section.

## Single Source of Truth

Color logic is owned by two files; treat them as the SSOT:

- [`src/data/design_tokens.json`](src/data/design_tokens.json) — raw palette
  tokens (hex), semantic roles, and category mappings.
- [`src/config/color_registry.ts`](src/config/color_registry.ts) — the typed
  "Sovereign Color Registry" that imports those tokens and exposes the palette,
  employer-identity overrides, and the resolver API (`getEntityColor`, …).

Tailwind theme wiring lives in
[`src/styles/tailwind-theme.css`](src/styles/tailwind-theme.css) and
[`src/styles/global.css`](src/styles/global.css); fonts are declared in
[`src/styles/fonts.css`](src/styles/fonts.css); code-block theming is in
[`astro.config.mjs`](astro.config.mjs) (Expressive Code).

## Typography

Fonts are loaded in [`src/styles/fonts.css`](src/styles/fonts.css) through Google Fonts
and a self-hosted JetBrains Mono variable face. They are assigned in
[`src/styles/global.css`](src/styles/global.css) and
[`src/styles/tailwind-theme.css`](src/styles/tailwind-theme.css).

- **Body:** `Barlow`. Stack:
  `"Barlow", "Inter", system-ui, sans-serif`. `Inter` is a **fallback only**
  (no longer the primary face).
- **Headings (HUD):** `Barlow Condensed` via `--font-header`. Stack:
  `"Barlow Condensed", "Impact", "Arial Narrow", sans-serif`. Used by the
  `.h1` / `.h2` / `.h3` heading classes.
- **Monospace / telemetry:** `Share Tech Mono` via `--font-mono`. Stack falls
  back to `"JetBrains Mono Variable"`, then the usual system mono chain
  (`SFMono-Regular`, `Menlo`, `Monaco`, `Consolas`, …).
- **Code blocks:** `JetBrains Mono` (Expressive Code `codeFontFamily` in
  [`astro.config.mjs`](astro.config.mjs)), with the same system-mono fallback
  chain.
- **Accent / hero:** `Roboto` and `Roboto Flex` are also loaded for hero
  treatments.

## Color

Palette values below are copied from
[`src/data/design_tokens.json`](src/data/design_tokens.json) — do not hand-edit
hex here; edit the token file and let this doc follow.

### Brand

| Role      | Name          | Hex       |
| --------- | ------------- | --------- |
| Primary   | YInMn Blue    | `#2E5CFF` |
| Secondary | Electric Cyan | `#00C2FF` |

`#2E5CFF` is hardcoded at `--color-primary-500`/`600` in
[`src/styles/tailwind-theme.css`](src/styles/tailwind-theme.css) for absolute
brand consistency; the surrounding ramp (`primary-50`…`950`) is expressed in
`oklch`.

### Neutrals

| Token    | Hex       |
| -------- | --------- |
| white    | `#FFFFFF` |
| titanium | `#E5E7EB` |
| aluminum | `#9CA3AF` |
| steel    | `#4B5563` |
| carbon   | `#1F2937` |
| black    | `#030303` |

### Semantic

| Role    | Hex       | Note                                                            |
| ------- | --------- | --------------------------------------------------------------- |
| Success | `#2E5CFF` | **Deliberately blue, not green** — success reads as YInMn Blue. |
| Warning | `#F59E0B` | Amber.                                                          |
| Error   | `#EF4444` | Red.                                                            |
| Info    | `#00C2FF` | Electric Cyan.                                                  |

### Category mappings

From `design_tokens.json` (`mappings`): engineering `#2E5CFF`, design
`#00C2FF`, strategy `#9CA3AF`, management `#4B5563`.

### Employer identity

Explicit per-entity brand colors (8-digit hex with alpha) and the resolver that
maps entity names to colors live in
[`src/config/color_registry.ts`](src/config/color_registry.ts)
(`EMPLOYER_IDENTITY`, `getEntityColor`). Use that API rather than hardcoding
employer colors.

## Theme

- **Dark-only.** The site ships a single dark theme; there is **no light/dark
  toggle** (committed decision). Tailwind's `dark` variant plumbing still exists
  in [`src/styles/global.css`](src/styles/global.css), but dark is the shipped
  and canonical mode.
- The dark canvas is driven by the `--background` / `--foreground` tokens
  (base-900 / base-200) in `html.dark`.
- A unified "LED-like" process-blue grid color is set in dark mode
  (`--grid-color: rgba(0, 133, 202, 0.3)`).

## Surfaces & effects

- **Glassmorphism** survives only as a scoped navbar treatment (`.nav-glass` in
  [`src/styles/global.css`](src/styles/global.css)):
  `rgba(10, 10, 10, 0.5)` + `backdrop-filter: blur(16px)` in dark mode. It is
  **not** a site-wide surface system.
- A subtle SVG **noise overlay** (`.bg-noise` / `.noise-overlay`) is available
  for texture (`mix-blend-mode: overlay`, ~15% opacity).
- **Blueprint SVG inversion:** in the (non-canonical) light mode, `.svg` images
  are hue-inverted so blueprint linework flips; `img.no-invert` opts out.

## Layout

- Content is constrained by `.site-container` (`mx-auto max-w-5xl px-4`) in
  [`src/styles/global.css`](src/styles/global.css).
- Breakpoints (`--breakpoint-*` in
  [`src/styles/tailwind-theme.css`](src/styles/tailwind-theme.css)): `xs` 400px,
  `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, `2xl` 1536px.
- Base corner radius `--radius: 0.5rem`, with the `--radius-xs…3xl` scale derived
  from it.

## Current authority and permitted variation

Each row names the source to change for that decision. The rendered catalogue is a
reference and inspection surface, not another source for typography or biography wording.

| Decision                            | Controlling source                                                                                           | Derived or reviewed use                                                                                                     |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Palette and semantic color roles    | `src/data/design_tokens.json`                                                                                | Registry and theme wiring described above; reconcile copied constants when changing them                                    |
| Employer identity mapping           | `src/config/color_registry.ts`                                                                               | Employer and project displays                                                                                               |
| Font files and portfolio font roles | `src/styles/fonts.css`, `src/styles/tailwind-theme.css`, `src/styles/global.css`                             | Portfolio pages and components                                                                                              |
| Primitive behavior and styling      | The component imported by `src/pages/design-system.astro`                                                    | Selected executable examples in `/design-system/`                                                                           |
| Shared biography wording            | Private registered source located by `docs/biography-workflow.md`                                            | Installed `src/data/biography-intros.json` and its receipt                                                                  |
| Shared biography appearance         | The accepted common stylesheet revision recorded with the biography publication                              | Controlled `src/styles/biography-intros.css` copies in the three sites; coordinated review for a changed revision           |
| Portfolio connected-reading cards   | src/components/biography/BiographyConnections.astro                                                          | Same component on the homepage and catalogue.                                                                               |
| Author attribution and portrait     | `src/components/Footer/Footer.astro` and the approved image projection in `src/data/biography-metadata.json` | The portfolio footer and installed `src/styles/biography-images.css`. Moreplay has its own end-of-article author placement. |
| Article reading layout              | Installed `src/styles/biography-reading.css` and `src/components/biography/AboutReading.astro`               | `/about/`; other sites retain their own installed reader components and scoped adaptations                                  |
| Contact layout                      | `src/pages/contact.astro`                                                                                    | Actual route embedded by the catalogue, not a copied template                                                               |
| Resume layout and copy              | `src/pages/resume/index.astro`, `src/config/resume_master.ts`, `src/config/resume_projection.ts`             | Screen and HTML print renderer; `docs/agents/resume-authority.md` owns release details                                      |

The common biography stylesheet is a reviewed revision installed in three repositories.
It is not a universal shared package or a complete tokenization of all three sites.
Local projection checks verify its recorded hash. Source freshness and current private
copy are checked by `npm run bio:check`; neither check establishes visual quality.

Keep the shared type roles, readable measures, link and focus treatment, attribution and
clear return paths. Composition, imagery, editorial rhythm and specialist interactions
can follow each site's purpose. The portfolio's interactive map, Moreplay's longer
personal accounts and Mechanistic's practice/tools need not share one page template.
The approved November appearance remains the baseline. Older September identity
studies are historical alternatives, not instructions to restyle the current sites.

## Updating a design

Identify the component or stylesheet that already owns the treatment before editing.
Change that source and inspect the result where it is used. Use the closest existing
component and token roles for a new placement. Record a page-specific adaptation when
the page needs a different layout or interaction. Update the catalogue when a specimen
needs to show the change and check the affected site contexts.

## Specimens and workmanship

`/design-system/` renders selected production primitives and the installed connected-reading
styles. It points to the live author placements on the portfolio and Moreplay and embeds
the actual `/contact/`, `/about/` and `/resume/` screen routes. Open each route separately
for full-width and print review. The current published PDF linked by the resume authority
is the accepted print reference. Check print readability, white space and page breaks.

For the affected surface, inspect hierarchy and readable reflow on desktop and phone;
follow links; check keyboard access and visible focus; inspect meaningful image text,
contrast, reduced motion, and print pagination where applicable. WCAG 2.2 AA is the
accessibility target for this work, not a claim that the entire site has passed a
conformance audit. Scope verification to the changed uses and report untested states.

Existing checks have specific limits: `npm run test:visual` invokes the homepage
behavior contract; `npm run test:resume` checks the resume authority/projection; the
biography projection guard checks copy/style identity. The catalogue itself is not an
automated visual-regression test. A passing build does not replace reading and visual
inspection. No new platform or blanket component-test requirement is introduced here.

## Superseded references

`src/content/docs/design/style_guide.md` is retained as a historical route with an
explicit pointer here. Its old Inter/JetBrains narrative rules do not apply.
`src/content/docs/system/deep_dive_page_contract.md` now identifies its historical
status and points to the current canon-first workflow in `CLAUDE.md`. Do not revive
`hydrate_content.py`, mandatory crisis framing, or optional-component quotas from it.

This reference describes implementation and presentation. It does not prescribe
Erik's personality or narrative voice. The existing colophon is the home for selected,
evidence-backed accounts of how the design and publication system evolved.
