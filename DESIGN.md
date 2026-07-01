# Sovereign Design System (Portfolio)

**Status:** Canonical
**Vibe:** Discovery / YInMn Blue / Engineering

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

Fonts are loaded in [`src/styles/fonts.css`](src/styles/fonts.css) (Google Fonts
+ a self-hosted JetBrains Mono variable face) and assigned in
[`src/styles/global.css`](src/styles/global.css) /
[`src/styles/tailwind-theme.css`](src/styles/tailwind-theme.css).

- **Body:** `Barlow` — the "Engineer" text face. Stack:
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

| Role | Name | Hex |
|---|---|---|
| Primary | YInMn Blue | `#2E5CFF` |
| Secondary | Electric Cyan | `#00C2FF` |

`#2E5CFF` is hardcoded at `--color-primary-500`/`600` in
[`src/styles/tailwind-theme.css`](src/styles/tailwind-theme.css) for absolute
brand consistency; the surrounding ramp (`primary-50`…`950`) is expressed in
`oklch`.

### Neutrals

| Token | Hex |
|---|---|
| white | `#FFFFFF` |
| titanium | `#E5E7EB` |
| aluminum | `#9CA3AF` |
| steel | `#4B5563` |
| carbon | `#1F2937` |
| black | `#030303` |

### Semantic

| Role | Hex | Note |
|---|---|---|
| Success | `#2E5CFF` | **Deliberately blue, not green** — success reads as YInMn Blue. |
| Warning | `#F59E0B` | Amber. |
| Error | `#EF4444` | Red. |
| Info | `#00C2FF` | Electric Cyan. |

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
