---
title: "Site Maintenance Manual"
slug: "maintenance"
sidebar:
  group: "System Manual"
  order: 1
---

# Site Maintenance Manual (IFU)

Internal documentation for maintaining and updating the portfolio site.

## 1. Git Workflow

### Feature Branches

- `feature/immersive-prototypes`: Confirmed R&D branch. Contains the "Reality Distortion" field prototypes (Conspiracy Board, Comparator, Living Grid upgrades). Merged functionality into `SharedLayoutGallery`, but the specific components (`ConspiracyBoard.tsx`, `Comparator.tsx`) reside here for future use.

## 2. Trust Wall Logic

### Priority Order (Ingestion Script)

1.  **Hardcoded Map:** Checks `CLIENT_ICON_MAP` in `ingest_data.py` for a specific icon slug.
2.  **Clearbit API:** Uses the domain from `CLIENT_DOMAIN_MAP` to fetch the logo from Clearbit (`logo.clearbit.com/{domain}`).
3.  **Staging Logo:** Checks `R2_STAGING/_site/logos/` for `{clientname}.svg` or `.png`.
4.  **Text:** Fallback if no logo is found.

### Workflow for Missing Logos

**Method A (Automated - Recommended):**

1.  Check `ingest_data.py` and add the client's domain to `CLIENT_DOMAIN_MAP`.
2.  Run `python ingest_data.py`.
3.  The script will attempt to fetch the logo from Clearbit.

**Method B (Manual - Staging):**

1.  Find a PNG/SVG of the logo.
2.  Rename it to match the client name (e.g., `clientname.svg`).
3.  Drop it into `R2_STAGING/_site/logos/`.
4.  Run `python ingest_data.py`.

**Method C (Manual - Override):**

> [!WARNING]
> `src/config/clients.json` is overwritten by the ingestion script. Manual changes here will be lost on the next ingestion run unless you skip that step.

1.  Drop logo into `public/images/clients/`.
2.  Update `src/config/clients.json`: set `"logo": "/images/clients/filename.png"`.

## 2. Colophon Marquee

The marquee on the Colophon page displays the tech stack.

- **Location:** `src/pages/colophon.astro`
- **Component:** Uses the shared `Marquee.tsx` component.
- **Layout:** Must be placed **outside** the `site-container` div to achieve full-width display.
- **Logic:** The `marqueeTools` array defines the items.
- **Icons:** Uses [Simple Icons](https://simpleicons.org/). The `slugMap` object maps tool names to Simple Icons slugs (e.g., "Google Gemini" -> "googlegemini").
- **To Update:** Edit `src/pages/colophon.astro` directly. Add new tools to the `tools` array and update `slugMap`/`linkMap` if necessary.

66:

## 4. The "Zero-Bloat" Architecture

To respect Cloudflare Pages limits (20k files, 25MB script size), we use a Hybrid Static approach:

1.  **Astro:** Configured as `output: static`. Generates pure HTML/CSS/JS.
2.  **Dynamic Routes:** Handled by **Native Pages Functions** (`functions/[[path]].js`).
    - _Why:_ This keeps the Worker extremely lightweight (less than 50KB) because it ONLY handles the proxy logic, not the entire site render code.
3.  **Asset Proxy:**
    - **Route:** `/r2/*` -> Maps to `projects` R2 bucket.
    - **Caching:** Uses `Cache-Control: no-cache` to ensure instant updates during dev (relies on Cloudflare CDN for edge caching).

### 5. Ingestion Script

The core engine of the site is `ingest_data.py`.

### Theory of Operation

- **Inputs:** CSV files in `data_source/` (exported from Google Sheets).
- **Assets:** Checks `R2_STAGING` (or environment variable path) for images and 3D models.
- **Outputs:**
  - `src/config/*.json` (Site data, clients, colors, specs).
  - `src/content/projects/*.mdx` (Project pages).
  - `src/content/projects/*.mdx` (Project pages).
  - **Manual Content:** Injects `data_source/manual_content/{slug}.md` into the MDX body if found.
  - `public/assets/r2/` (Synced assets).

### Cloud Asset Sync

To manage large assets (images, 3D models, PDFs), we use Cloudflare R2.

- **Source:** `../ErikNorris-assets/R2_STAGING/{slug}/` (Sibling Directory - Recommended) or `R2_STAGING/{slug}/` (Local)
- **Destination:** `https://assets.eriknorris.com/{slug}/` (Remote)
- **Command:** `python ingest_data.py` (Auto-runs sync)

### R2 Pruning (Replacements)

By default, the sync script is **Additive** (Uploads Only). If you rename or delete files locally and want R2 to match (Mirroring):

```bash
python scripts/sync_r2.py --prune
```

- **Flags:**
  - `--prune`: Deletes remote files that do not exist locally.
  - `--dry-run`: Simulates the operation (Safe check).

**Prerequisites:**

1.  Ensure you are logged in: `npx wrangler login`
2.  Ensure `scripts/sync_r2.py` has the correct `BUCKET_NAME`.

### Running the Ingestion

```bash
python ingest_data.py
```

### Stream Signature Protocol (Forensic Classification)

Before ingesting a "Dump Folder," we must classify its "Stream Signature" to choose the right visualization strategy.

1.  **Visual Stream (e.g., Noon):** domination by `.jpg`, `.png`, `.heic`.
    - **Strategy:** Gallery-First. "Smart Bento" grid.
2.  **Process Stream (e.g., Hyphen):** domination by `.pdf`, `.docx`, `.pptx`.
    - **Strategy:** Methodology-First. Timeline of Key Deliverables.
3.  **Industrial Stream (e.g., Kaleidescape):** domination by CAD (`.prt`, `.asm`) and BOMs (`.xls`).
    - **Strategy:** Taxonomy-First. "Exploded View" list or 3D Model viewer.

## 4. Project Detail Pages

Project pages are generated from MDX files in `src/content/projects/`.

### Authoring Project Pages (The Snippet Workflow)

We use custom VS Code snippets to rapidly scaffold "Visual Taxonomy" components.

1.  **Prerequisite:** Ensure `.vscode/ErikNorris.code-snippets` is present in your workspace.
2.  **Workflow:** In any `.md` or `.mdx` file, type `qq-` to see available snippets.
    - `qq-zigzag`: Insert Product Grid.
    - `qq-process`: Insert Process Timeline.
    - `qq-model`: Insert 3D Viewer.
    - `qq-admonition`, `qq-chip`, `qq-wire`: Insert UI primitives.
3.  **Reference:** Visit `http://localhost:4321/about/elements` to see live examples and trigger names.

### Adding Resources (PDFs, Links)

- **PDFs:** Place `.pdf` files in `R2_STAGING/{project-slug}/`. The script automatically adds them to the "Resources" section.
- **Links:** Add a "Link" column in `Main.csv` with the URL.

### Adding Images & Videos

- **Hero Image:** Name a file `hero.jpg` (or png/webp) in `R2_STAGING/{project-slug}/`.
- **Gallery:** Any other image file in that folder (that isn't `hero.png` or a chart) is automatically ingested into the Project Gallery.
- **3D Models:** Add a `.glb` file in the folder. It will be auto-detected.
- **Videos:** Currently, the script inserts a placeholder YouTube ID. You must manually edit the generated `.mdx` file or update the script to map video IDs from a CSV column.

### Troubleshooting Charts

If a chart isn't showing up:

1.  **Check Data:** Ensure `Stats.csv` has non-zero values for Plastic/Metal/PCB for that project.
2.  **Check Generation:** Run `python ingest_data.py` and watch for errors.
3.  **Check Output:** Verify `public/assets/r2/{slug}/part-graph.svg` exists.

## 5. Maintenance & Enhancements

To keep this site healthy:

- **Regularly:** Run ingestion script after updating Google Sheets.
- **Check:** `src/config/clients.json` for missing logos (null values).
- **Backup:** Ensure `data_source/` CSVs are committed or backed up.

### Adding Scroll Effects to New Pages

To apply the standard "Flee/Focus" scroll narrative to a new page:

1.  **Import the Coordinator:**
    ```astro
    import ScrollCoordinator from "@components/Effects/ScrollCoordinator.astro";
    ```
2.  **Tag Elements:**
    - **Header/Intro:** `<div data-scroll-effect="flee">...</div>`
    - **Content List:** `<div data-scroll-effect="fade-out">...</div>`
    - **Background Viz:** `<div data-scroll-effect="focus" style="opacity: 0.2">...</div>`
3.  **Mount Component:**
    Add `<ScrollCoordinator />` at the bottom of your `<Layout>`.

## 6. Debug Mode

The site includes a built-in "Wireframe Mode" for visual debugging.

- **Activation:** Scroll to the footer and click the **"DEBUG [ OFF ]"** button.
- **Features:**
  - **Cyan Outlines:** Shows element boundaries.
  - **Magenta Outlines:** Shows layout containers (`.site-container`).
  - **Grayscale/Yellow Images:** Checks image contrast and focus.
- **Persistence:** The state is saved in `localStorage`, so it survives page reloads.

### Visual Sitemap (`/map`)

- **Purpose:** Inspect the raw site topology and link hierarchy.
- **Usage:** Visit `/map` to see a tree visualization of `navData` and the `projects` collection. Useful for auditing structure before major refactors.

## 7. Managing Site Status

The site features a global status badge (e.g., "UNDER CONSTRUCTION") configured in `src/config/siteData.json.ts`.

### Configuration

Edit the `status` object in `siteData`:

```typescript
status: {
    type: "under-construction", // Options: "production" | "under-construction" | "maintenance"
    text: "UNDER CONSTRUCTION", // Optional override text
},
```

### Modes

- **`production`**: Badge is hidden. Use this for live launches.
- **`under-construction`**:
  - **Local:** Shows `[ LOCAL DEV ]`.
  - **Deployed:** Shows `[ UNDER CONSTRUCTION: <SHA> ]`.
- **`maintenance`**: Shows `[ MAINTENANCE ]`.

## 8. Project Directory Maintenance

- **Deep Linking:** You can link to a pre-filtered view using URL parameters: `https://eriknorris.com/projects?client=Google`.

### 8. Troubleshooting

### "Zombie" Dev Servers

- **Symptom:** You make code changes, but the browser shows the old version. Screenshots show port `4321` but the terminal says `4323`.
- **Cause:** Multiple instances of `npm run dev` running in background terminals.
- **Fix:**
  1.  Check terminal output for the _actual_ active port.
  2.  Run `taskkill /F /IM node.exe` (Windows) or `pkill -f node` (Mac/Linux) to nuke all stray servers.
  3.  Restart _one_ instance.

### JSON Duplicate Keys

- **Symptom:** Console error `Encountered two children with the same key`.
- **Fix:** `src/data/timeline/sacred_timeline.json` requires unique `id` fields. Use `grep` to find duplicates (e.g., `KSERVER-1500`).

### Ghost Data (The "Manifest Override")

- **Symptom:** HUD shows incorrect data (e.g., "$0k Budget") even though `.mdx` frontmatter is correct.
- **Cause:** Legacy data in `src/config/project_manifest.json` merges with and **overrides** MDX data.
- **Fix:**
  1.  Search `project_manifest.json` for the slug key (e.g., `"c24": { ... }`).
  2.  Delete the entire object entry.
  3.  Restart the dev server to force a clean hydration from MDX.

### Astro Compiler Panic (Exit Code 2 / "originalIM was set twice")

- **Symptom:** `npm run dev` crashes instantly with `bad parser state` or `Go program has already exited`.
- **Cause:** A `.astro` file is missing the opening Frontmatter Fence (`---`) at the very top. The compiler misinterprets TypeScript interfaces as HTML/Content.
- **Fix:** Ensure the file starts immediately with `---`.

### Flexbox Centering vs. Overflow

- **Symptom:** Content at the top of a scrollable container is clipped/unreachable.
- **Cause:** Determining `justify-center` on a flex container that also has `overflow-y-auto`. When content exceeds the viewport, the "center" logic pushes the top content off-screen.
- **Fix:** Remove `justify-center` and use padding (e.g., `pt-24`) to position content safely below sticky headers.

### Raw HTML rendering in Hyperspace

- **Symptom:** Content with `<ul>` or `<strong>` tags renders as escaped text (e.g., `<p><ul>...</ul></p>`).
- **Cause:** Passing HTML strings through intermediate props (e.g., `<Component body={html} />`) can trigger auto-escaping.
- **Fix:** Use the "Slot Pattern".
  1.  **Layout:** Render the HTML directly using `set:html` on a container: `<div set:html={n.body} />`.
  2.  **Component:** Accept the rendered content via `<slot />`.

### Asset Ingestion Fails (File Locking)

- **Symptom:** `ingest_data.py` crashes with `PermissionError: [WinError 32]` or `shutil` errors.
- **Cause:** The local dev server (`npm run dev`) locks files in `public/assets/r2`, preventing the script from overwriting them during sync.
- **Fix:** The script has been patched to use `try/except` blocks and `dirs_exist_ok=True`. If it persists, stop the dev server, run `python ingest_data.py`, then restart the server.

### Ingestion Script Crashes (Windows Unicode)

- **Symptom:** `ingest_data.py` crashes instantly with `UnicodeEncodeError`.
- **Cause:** Windows console (CP1252) chokes on emoji output (`📂`, `🚀`).
- **Fix:** Ensure the script includes `sys.stdout.reconfigure(encoding='utf-8')` if running on Windows.

### Ingestion Data Override (The "Golden Master" Protocol)

- **Context:** Sometimes MDX frontmatter fails to merge with the manifest due to dev server caching or schema issues.
- **Protocol:** For critical benchmark projects (e.g., C24), use a specific toggle in `ingest_data.py` to force-write the correct data to `project_manifest.json`.
- **Goal:** Ensure the HUD is factually correct even if the frontend cache is stale.

### Overbaked 3D Models (Washed Out / Too Bright)

- **Symptom:** 3D model looks nuclear white or loses surface detail.
- **Cause:** Default `model-viewer` exposure (1.0) or "Neutral" environment map is too aggressive for our data-viz aesthetic.
- **Fix:**
  1.  Force `exposure="0.3"` in the component props.
  2.  Remove `environment-image` attribute (reverts to unlit/legacy shading).

### Scrolly Sidenav Dots Not Filling

- **Symptom:** Sidenav dots remain empty circles even when the section is active.
- **Cause:** CSS Specificity issue or missing color token.
- **Fix:** Ensure the active class targets the inner circle with the specific YinMn Blue token:
  ```css
  .active .nav-dot-circle {
    background-color: #2e5cff; /* YinMn Blue */
    border-color: #2e5cff;
  }
  ```

### `pointer-events-none` blocking Hover Interactions

- **Symptom:** A component (like a Title Animator) visually renders but refuses to trigger `onMouseEnter` events.
- **Cause:** Parent containers or the element itself often inherit `pointer-events-none` from utility classes intended to "pass through" clicks.
- **Fix:** Explicitly add `pointer-events-auto` to the specific interactive child div.

### Swarm Nodes Unclickable (Input Masking)

- **Symptom:** Hovering over Swarm nodes does nothing; no tooltips, no highlight.
- **Cause:** The "Carny Bell" Logo Layer (`z-50`) sits on top of the Swarm (`z-10`). Even if opacity is 0, it blocks clicks.
- **Fix:** Use `visibility: hidden` or `pointer-events: none` on the overlay layer once the entrance sequence completes.

### Double Scrollbars in Fiche

- **Symptom:** Two vertical scrollbars appear on the right side.
- **Cause:** The Fiche container is scrollable, and so is the Body.
- **Fix:** Add the `.no-scrollbar` utility to the Fiche container to hide the track while preserving functionality.

### Missing DataViz in Hyperspace Theme

- **Symptom:** You added `<MetricComparison />` to MDX, but it doesn't render on the page.
- **Cause:** The `Hyperspace.astro` layout is missing the `<slot />` element for the main content flow.
- **Fix:** Add `<section><slot /></section>` below the `Narrative` section in the layout file.

### Zombie Asset Checks

- **Symptom:** Terminal shows hanging `curl` commands running for hours; system feels sluggish.
- **Cause:** Previous asset verification scripts (checking R2 headers) lacking timeouts (`--max-time`) may become zombie processes if the session suspends.
- **Fix:** Run `taskkill /F /IM curl.exe` to clear the process table.

### "PHASE STATS DUMP" in Terminal

- **Symptom:** Verbose logs showing `undefined` for `phase_stats` or `phases`.
- **Cause:** Legacy `console.log` debugging left in `[...slug].astro`.
- **Fix:** These are harmless noise. Remove the console statements in `src/pages/projects/[...slug].astro` lines 30-35.

### "NO_DATA" in Dashboards (Schema Validation Trap)

- **Symptom:** `SkillRadar` or `ImpactResonance` shows placeholders even though data exists in the MDX frontmatter.
- **Cause:** Astro's Zod schema (`src/content/config.ts`) is too strict. If the Python script outputs a float (e.g., `85.0`) but Zod expects an interactive object, or vice-versa, Astro silently strips the entire field.
- **Fix:** **Loosen the Schema.** Change the field definition to `z.any()` in `config.ts` during debugging to confirm data flow, then tighten it only if strict layout safety is required.
  ```typescript
  // src/content/config.ts
  phase_stats: z.any(), // WAS: z.record(z.number())
  ```

### Broken Docs Build (Missing Frontmatter)

- **Symptom:** Build fails with `[content] Error: ... required "title"`.
- **Cause:** A raw markdown file (like `implementation_plan.md`) was added to `src/content/docs/` without the required YAML frontmatter block.
- **Fix:** Ensure _every_ `.md` file in the docs folder starts with:
  ```
  title: "Doc Title"
  slug: "doc-slug"
  description: "Brief summary"
  ---
  ```

### Build Crash (localeCompare / Title Sort)

- **Symptom:** `npm run build` fails with `Cannot read properties of undefined (reading 'localeCompare')`.
- **Cause:** A legacy markdown file in `src/content/docs` is missing the `title` frontmatter field. The sidebar sort logic crashes when trying to compare undefined titles.
- **Fix:**
  1.  The build system has been patched to explicitly filter out these files in `[...slug].astro`.
  2.  If it persists, run `scripts/debug_docs.py` (if available) or manually `grep` for files without frontmatter.
  3.  **Rule:** All docs MUST have a `title`.

### Ghost Workspace ("workspace.json")

- **Symptom:** VS Code sidebar shows a `workspace.json` workspace that is slow or disconnected.
- **Cause:** VS Code creates an ephemeral workspace when multiple folders (`ErikNorris`, `ErikNorris-assets`) are opened without a defined `.code-workspace` file.
- **Fix:** Create and open a named workspace file (e.g., `ErikNorris.code-workspace`) that explicitly lists the folders.
  ```json
  {
    "folders": [{ "path": "." }, { "path": "../ErikNorris-assets" }]
  }
  ```

### Asset Staging Mismatch (Ghost Assets)

- **Symptom:** You place assets in `R2_STAGING` but they don't appear after ingestion.
- **Cause:** You might be using the local repo folder (`ErikNorris/R2_STAGING`) instead of the external asset repo (`ErikNorris-assets/R2_STAGING`).
- **Fix:** Always stage assets in `../ErikNorris-assets/R2_STAGING`. The ingestion script looks there first.

### Image Extension Mismatch (404s)

- **Symptom:** New AI-generated assets return 404 errors despite existing on disk.
- **Cause:** AI tools often output `.png` by default, while legacy prompts/MDX might reference `.jpg`.
- **Fix:** Check the actual file extension in `R2_STAGING` and update the `.mdx` file to match (e.g., change `hero.jpg` to `hero.png`).

### "Ghost" Images in JSON Data

- **Symptom:** Image works locally but fails in production, or `multiverse.json` points to a file that doesn't exist.
- **Cause:** Determining the "Hero" image relies on manual entry in `multiverse.json`, which can drift from the actual file system (e.g., `hero-sm.webp` vs `project-hero-01-sm.webp`).
- **Fix:**
  1.  Trust the File System, not the JSON.
  2.  Check `list_dir public/assets/r2/[slug]`.
  3.  Update `multiverse.json` to match the _exact_ filename found.

### Build Crash (Esbuild Pipe Error / Readable.push)

- **Symptom:** `npm run build` fails with `Error: Readable.push` or generic pipe failure, often blaming `esbuild`.
- **Cause:** A hidden **Syntax Error** inside a `<script>` tag in an `.astro` file (e.g., a missing function declaration or unclosed bracket). Astro's compiler sometimes chokes entirely rather than reporting the line number.
- **Fix:**
  1.  Check recent edits to `<script>` blocks.
  2.  Look for "orphaned" code (code outside a function that should be inside one).
  3.  Run `npm run dev` and watch the browser console for specific syntax errors that the build CLI missed.

### Build Issues

- **Async Rendering in Astro Templates**
  - **Symptom:** Build fails with generic errors when using `await` inside a `.map()` in JSX.
  - **Cause:** Astro's JSX renderer struggles with async operations inside array maps.
  - **Fix:** Pre-render the content in the component script (frontmatter) using `Promise.all()`, then map over the rendered result in the template.
    ```typescript
    // Correct Pattern
    const renderedItems = await Promise.all(
      items.map(async (item) => {
        const { Content } = await item.render();
        return { ...item.data, Content };
      }),
    );
    // ... use renderedItems in JSX
    ```

- **Build Fails on "Missing Collection"**
  - **Symptom:** `npm run build` fails with errors like `Collection 'blog' does not exist` or `ReferenceDataEntry not found`.
  - **Cause:** Unused templates (e.g., `src/pages/blog/...`) are trying to query content collections that haven't been defined or populated.
  - **Fix:** Delete the unused template directories (`src/pages/blog`, `src/pages/tags`) and their associated components (`PostCard`, `SidebarCards`). The portfolio is designed to be lean; remove what you don't use.

- **Symptom:** `npm run build` or `npx astro check` fails with ~32 errors (e.g., `examples/blog-post-3.astro`).
  - **Context:** These are pre-existing type errors in example/unused files.
  - **Action:** They do not affect the core `project` or `colophon` pages. If deployment fails, ensure `astro build` is configured to not fail on TS errors, or ignore `examples/` in `tsconfig.json`.

- **Error:** `Cannot apply unknown utility class 'text-3xl'` (or similar) inside an Astro component's `<style>` block.
  - **Cause:** Tailwind v4 styles are isolated. Astro's scoped `<style>` blocks do not inherit the global Tailwind context automatically.
  - **Fix:** Add the `@reference` directive to the top of the style block to link it to the global CSS configuration.
    ```css
    <style>
      @reference "../../styles/global.css";
      /* ... your styles ... */
    </style>
    ```

- **Error:** `Cannot apply unknown utility class 'bg-noise'`
  - **Cause:** Using `@apply` with a self-defined utility class in the same CSS scope/file causes recursion or resolution order issues in Tailwind's JIT.
  - **Fix:** Replace the `@apply` rule with the direct CSS property (e.g., `background-image: ...`) from the definition.

- **Ghost Data (The "Nuclear" Formatting Fix)**
  - **Symptom:** Data keys (like `phaseStats`) exist in the MDX frontmatter but appear as `undefined` in the Astro component, even after schema updates.
  - **Cause:** Complex YAML nesting (objects inside lists) or invisible character/indentation issues causing the frontmatter parser to silently fail or truncate.
  - **Fix:** **Use Inline JSON for complex arrays.**
    - Instead of fragile YAML lists:
      ```yaml
      phases:
        - phase: Strategy
          value: 10
      ```
    - Use robust inline JSON:
      ```yaml
      phases: [{ "phase": "Strategy", "value": 10 }, ...]
      ```
    - This bypasses whitespace ambiguity entirely.

- **Error:** `Could not resolve "virtual:keystatic-config"`
  - **Cause:** The Keystatic integration is initializing before other required plugins.
  - **Fix:** Move `keystatic()` to the very end of the `integrations` array in `astro.config.mjs`.

- **Error:** `Identifier "Admonition" has already been declared` (in MDX files)
  - **Cause:** The component is being imported manually (e.g., `import Admonition...`) but is _also_ configured for global auto-import in `astro.config.mjs`.
  - **Fix:** Remove the manual import statement from the MDX file. The system automatically provides this component.

- **Error:** `Could not resolve "../components/About/ClientGrid.astro"` (on Cloudflare)
  - **Cause:** Git case-sensitivity mismatch (e.g., `About` vs `about`) between Windows (Dev) and Linux (CI).
  - **Fix:** The "Nuclear Option":
    1.  Create a new directory with a distinct name (e.g., `src/components/Home`).
    2.  Move the component there.
    3.  Update imports to use relative paths (`../components/Home/Clients.astro`) to bypass alias caching.

### Runtime Issues

- **Error:** `Uncaught SyntaxError: ... does not provide an export named 'AXObjectRoles'`
  - **Cause:** Vite is incorrectly optimizing the `axobject-query` dependency (used by `eslint-plugin-jsx-a11y`).
  - **Fix:** Ensure `axobject-query` is in the `optimizeDeps.exclude` list in `astro.config.mjs`.

### TypeScript Errors in Content Collections

- **Symptom:** `Property '...' does not exist on type '...'` or `No overload matches this call` for `Date` constructors.
- **Cause:** Astro's generated content collection types might be out of sync, or strict TypeScript checks are flagging optional/complex types.
- **Fix:**
  1.  Run `npx astro sync` to regenerate types.
  2.  If errors persist for `Date` fields, cast them: `new Date(project.data.date as any)`.
  3.  For missing optional properties (e.g., `toolIcons`), use type assertion: `(project.data as any).toolIcons`.

### Blank Project Pages

- **Symptom:** Clicking a project leads to a blank page or raw HTML attributes.
- **Cause:** The `Layout` component in Astro templates might be self-closing (`<Layout ... />`) instead of wrapping content (`<Layout ...>...</Layout>`).
- **Fix:** Ensure the `Layout` component properly wraps the page content.

### Blank View Container (The "Homeless Component" Trap)

- **Symptom:** A specific view (e.g., "Radial") is blank, but `console.logs` inside the component fire correctly, and no errors appear.
- **Cause:** The component logic is fine, but its HTML container (e.g., `<div id="view-radial">`) is missing from the parent page markup. The UI switcher toggles the "hidden" class on a non-existent element.
- **Fix:** Ensure the HTML container exists in the `.astro` template.
  ```astro
  <!-- Missing Container -->
  <div id="view-radial" class="view-container hidden">
    <MyComponent />
  </div>
  ```

### Project Page Layout Collapse

- **Symptom:** The main content column is squeezed to the left, overlapping the sidebar or losing its grid span.
- **Possible Causes:**
  1.  **Misplaced Content:** The `<Content />` component (rendering the MDX) is outside the `<article>` tag. It _must_ be inside `<article>` to inherit the `col-span-8` grid class.
  2.  **Malformed JSX:** An unclosed tag (e.g., `<img ... >` without `/>`) inside a conditional block can corrupt the DOM tree, causing the browser to "swallow" subsequent containers.
- **Fix:** Check `src/pages/projects/[...slug].astro` for unclosed tags and ensure `<Content />` is nested correctly.

### MDX Compilation Errors

- **Error:** `Unexpected character 0 (U+0030) before name` or similar parsing errors.
- **Cause 1 (Numeric Slugs):** A project slug starts with a number (e.g., `002-rack`). MDX compiles content into JavaScript, and identifiers cannot start with digits.
- **Fix 1:** Rename the project in `Main.csv` (or use the `Slug Name` column) to start with a letter (e.g., `rack-002`).
- **Cause 2 (Invalid Tags):** Markdown content contains text like `&lt;0.5%`. MDX interprets `<` followed by a number/letter as an opening HTML tag.
- **Fix 2:** Escape the less-than sign: `&lt;0.5%`.

### Empty Content Collection

- **Symptom:** A specific content collection (e.g., `colophon`) returns an empty array `[]` via `getCollection`, even though files exist.
- **Cause:** Potential conflict between Astro's Content Layer and integrations like Keystatic, or caching issues.
- **Fix:** Use `import.meta.glob` to manually load the files as a fallback.
  ```typescript
  // Workaround:
  const globFeatures = import.meta.glob("../content/colophon/*.mdx", { eager: true });
  const features = Object.values(globFeatures).map((file: any) => ({
    id: file.file,
    ...file.frontmatter,
    Content: file.Content || file.default,
  }));
  ```

### Visible Grid Not Showing

- **Symptom:** The background is solid color; no grid lines are visible.
- **Cause:** The `<body>` element likely has a background color class (e.g., `bg-white` or `bg-neutral-950`) that is painting over the `<html>` element's grid pattern.
- **Fix:** Ensure `BaseLayout.astro` does NOT apply background color classes to the `<body>` tag. It should be transparent.

### Double Bullets in Lists

- **Symptom:** Lists on project pages show two bullets (e.g., `â€¢ â€¢ Item`).
- **Cause:** Hardcoded bullet characters (`â€¢`) in the manual Markdown files colliding with CSS `list-style-type`.
- **Fix:** Remove all hardcoded bullets from `data_source/manual_content/*.md`. Let CSS handle the styling.

### Tailwind v4 Typography

- **Requirement:** To use `prose` classes (e.g., `list-disc` inside markdown), the plugin must be registered in the **CSS Entry Point**, not just the config.
- **File:** `src/styles/global.css`
- **Code:** `@plugin "@tailwindcss/typography";`

### Missing Part Breakdown Graph

- **Symptom:** "Part Breakdown" graph is missing on a specific project page.
- **Cause:** Name mismatch between `Main.csv` (Slug Name) and `Stats.csv` (Slug Name).
- **Fix:** Ensure the "Slug Name" column in `Stats.csv` _exactly_ matches `Main.csv`.
  - _Example:_ "002 Rack" (Wrong) vs "Rack 002" (Correct).

### Blank 3D Model Viewer

- **Symptom:** Viewer loads but shows a blank/empty scene (not the fallback).
- **Cause:** `src` URL points to a non-existent file, often due to a mismatch between the generated slug and the `R2_STAGING` folder name.
- **Fix:** Ensure the folder in `ErikNorris-assets/R2_STAGING/` matches the project slug exactly (e.g., `rack-002`, not `002-rack`).

### Stale TypeScript Errors ("File Not Found")

- **Symptom:** `tsconfig.json` reports an error for a file that was recently deleted (e.g., "File '.../template-test.astro' not found").
- **Context:** The Astro language server sometimes holds onto stale file references after deletion.
- **Fix:** Open `tsconfig.json`, make a trivial change (add a space or comment), save, and then revert the change. This forces the language server to refresh its file list.

## 9. Writing Manual Content

### Invisible Swarm / "Zero Swarm"

- **Symptom:** The Swarm component renders nothing (white/black space), even though data exists.
- **Cause 1 (Physics Math):** If `velocityDecay` (friction) is too high (>0.2) and launch velocity is too low (<-50), the nodes stall off-screen and never enter the viewport.
  - **Fix:** Ensure `vy / friction > required_distance`. set `friction` to `0.05`.
- **Cause 2 (Dimensions):** If the `ResizeObserver` logic is deleted or failing, `dimensions` defaults to `{0,0}`, preventing the D3 simulation from starting.
  - **Fix:** Verify `useResizeObserver` or explicit `ResizeObserver` logic exists in `ResVizSwarm.tsx`.

When creating deep-dive content in `data_source/manual_content/{slug}.md`, follow the **Narrative STAR** framework.

### Template

```markdown
import { YouTube } from '@astro-community/astro-embed-youtube';
import ModelViewer from '@components/mdx/ModelViewer.astro';

## The Challenge

> **Context:** [Brief 1-sentence context setting the scene]

[Narrative description of the problem, constraints, and the "Task". Focus on the "Why".]

## Engineering Approach

[The "Action" section. Describe the specific steps, design decisions, and analysis.]

- **[Key Action/Feature]:** [Detail]
- **[Key Action/Feature]:** [Detail]

## Impact

[The "Result" section. Quantifiable outcomes, awards, and legacy.]

### Project Artifacts

{{MODEL_URL}}
```

### Adding a Project Impact Summary

1.  Open the project's MDX file (e.g., `src/content/projects/dreamjob.mdx`).
2.  Add the `impact` field to the frontmatter.
3.  **Format:** Keep it to 1-2 sentences. Focus on quantitative results (e.g., "Reduced latency by 40%") or high-level strategic wins.
4.  **Example:**
    ```yaml
    impact: "Established a comprehensive Visual Taxonomy... reducing documentation time by 40%."
    ```

### Generating Meta-Testimonials

1.  Refer to `src/content/docs/prompts/TESTIMONIAL_GENERATOR.md` for the persona definitions.
2.  Add new entries to `src/data/testimonials.json`.
3.  **Note:** The `TestimonialWall` component in `/colophon` will automatically ingest and display new entries.

## 10. Context Tools & AI Workflows

We use specific prompts to maintain context across AI sessions.

- **Onboarding:** Copy `docs/ONBOARDING_PROMPT.md` to start a session.
- **Mining:** Copy `docs/CONVERSATION_MINER_PROMPT.md` to end a session and extract value.
- **Branding:** Use `docs/BRANDING_PROMPT.md` when working on visual design, CSS, or "Voice & Tone" updates.

## 11. Living Style Guide

The page at `/about/elements` is the source of truth for our visual system.

- **Source:** `src/data/otherPages/elements/index.mdx`
- **Workflow:** When creating a new UI component, **MUST** add an example to this file to verify it renders correctly in a prose context.
- **Troubleshooting:**
  - **Issue:** Components not rendering in MDX.
  - **Fix:** Ensure the component is imported at the top of the MDX file (e.g., `import Chip from '@components/dls/Chip.astro';`).

### Image Assets (The Hybrid Workflow)

See `docs/IMAGE_WORKFLOW.md` for the full SOP.

### The "Two-Step Dance" (Image vs. Data)

We have decoupled image processing from data ingestion to prevent "Script Bloat" and accidental overwrites.

1.  **Step 1 (The Darkroom):** Run `python scripts/process_images.py {slug}` to optimize raw assets.
2.  **Step 2 (The Refinery):** Run `python ingest_data.py` to update metadata and sync to R2.

3.  **Ingest:** Import raw files into Lightroom Classic.
4.  **Develop:** Use Lightroom Classic. Export using "ErikNorris Master" preset (TIFF, sRGB, 4000px) to `R2_MASTER`.
5.  **Process:** Run `python scripts/process_images.py {slug}`.
6.  **Deploy:** Run `python ingest_data.py`.

## Troubleshooting

### Missing Images (Build Script Skips File)

- **Symptom:** Source file exists in `R2_MASTER` (e.g., `hero.png`), but `process_images.py` does not generate optimized assets in `R2_STAGING`.
- **Cause:** The build script uses a **Strict Whitelist (Regex)**. It ignores any file that does not match the `{slug}-{view_type}-{sequence}.{ext}` taxonomy (e.g., `c24-hero-01.png`). Simple names like `hero.png` or `temp.jpg` are treated as "Gravel" and silently skipped.
- **Fix:** Rename the source file to match the convention (e.g., rename `hero.png` -> `c24-hero-01.png`) and re-run the processor.

### Image Processing Errors

- **Symptom:** `AttributeError: 'Constant' object has no attribute 's'` during install.
- **Cause:** Python 3.14 compatibility issue with `pillow-avif-plugin`.
- **Fix:** Use `pillow-heif` instead. Run `pip install pillow-heif`.

### Missing Theme Textures (Redacted/Command)

- **Symptom:** Redacted themes look plain; missing scanlines, noise, or paper textures (404 errors).
- **Cause:** The procedural textures for `r3` assets might be missing from the build.
- **Fix:**
  1.  Check `public/assets/r3/common/`.
  2.  If missing, use the **AI Image Generator** to recreate them:
      - `scanline.png`: "Seamless black scanline pattern, 4px height."
      - `noise.png`: "Monochrome digital static noise."
      - `paper-texture.png`: "Seamless beige manila paper texture."

### Missing Texture / "Clean" Look

- **Symptom:** The site looks too clean; the "film grain" is missing.
- **Cause:** The `.noise-overlay` might be hidden or the Data URI is corrupt.
- **Fix:** Check `global.css`. We use a baked-in Base64 SVG for the noise texture (`.bg-noise`). Do NOT use external URLs.

### Missing Assets / 500 Errors

- **Symptom:** Images fail to load with 500 errors, or the site crashes with `ENOENT`.
- **Cause:** Often caused by deleting asset directories (like `assets/logos`) while the dev server is running, or lingering references in cached build artifacts.
- **Fix:** Ensure `process_images.py` is handling letterboxing correctly.

### The "Ghost Port" Anomaly

- **Symptom:** You see a feature (like the Cockpit HUD) on one port (e.g., `localhost:4322`) but it is completely missing from your main development port (`localhost:4321`) and the git history.
- **Cause:** A zombie process or a parallel terminal instance is running an older or diverged version of the site on a secondary port. This often happens if an Astro server isn't terminated properly.
- **Fix:**
  1.  **Kill all Node processes:** Run `taskkill /F /IM node.exe` (Windows) or `pkill node` (Mac/Linux).
  2.  **Verify Git Status:** Ensure you are actively looking at the files in the file system, not just what's in the browser.
  3.  **Trust `git log`:** If it's not in git, it effectively doesn't exist, regardless of what a rogue browser tab shows.

### React Three Fiber (R3F) Assets

- **Symptom:** 3D Model (`.glb`) fails to load or returns 404.
- **Cause:** R3F looks for assets relative to the compiled root.
- **Fix:** Ensure models are placed in `public/assets/models/` and referenced as `/assets/models/filename.glb`.

### Loose Props in Project Cards

- **Context:** `ProjectSpecCard` is used in both Collections (CMS) and "Meta-Portfolio" pages (hardcoded).
- **Trap:** Passing loose props without an `entry` object caused type errors in earlier versions.
- **Fix:** The component now handles hybrid props. You can pass raw strings (`title`, `role`, etc.) directly if no `entry` is provided.

### Squished Animations

- **Symptom:** Animation frames look stretched or compressed.
- **Cause:** Frames have varying aspect ratios, and the pipeline was forcing them to match the first frame.
- **Fix:** The pipeline now uses **Letterboxing** (`ImageOps.pad`). If this happens, ensure you are running the latest version of `process_images.py`.

### Missing Gallery Images

- **Symptom:** Valid images in `R2_STAGING` are not appearing in the gallery.
- **Cause:** They might be referenced in the manual content (Writeup). The system auto-hides used assets.
- **Fix:** This is intended behavior. If you want it in both, rename the file or duplicate it (discouraged).

### "Hero" Image Not Picking Correctly

- **Symptom:** The wrong image is selected as the cover.
- **Fix:** Ensure the filename contains `-hero-` or starts with `hero-`. The logic was tightened to avoid false positives (e.g., `super-hero.jpg`).

### Squished Gallery Images

- **Symptom:** Images in the gallery look compressed or distorted.
- **Cause:** The grid cell aspect ratio doesn't match the image, and `object-fit` is missing or set to `fill`.
- **Fix:** Ensure `ProjectGallery.tsx` has `object-fit: cover` on the `<img>` tag. This forces the image to fill the cell (cropping if necessary) rather than stretching.

### Content Schema Mismatch

- **Symptom:** `npm run dev` fails with `[InvalidContentEntryDataError] ... Expected type "string", received "object"`.
- **Cause:** The `src/content.config.ts` schema definition for `gallery` is outdated (expects strings) but the MDX files contain objects (generated by a newer `ingest_data.py`).
- **Fix:** Update `src/content.config.ts` to match the new object structure:
  ```typescript
  gallery: z.array(z.object({
      src: z.string(),
      width: z.number(),
      height: z.number(),
      aspectRatio: z.number()
  })).default([]),
  ```

### Asset Path Mismatch (Broken Images on Production)

- **Symptom:** Images load on `localhost` but are broken 404s on the deployed site.
- **Cause:** The "Physical Asset Law" Violation.
  - **Local:** `ingest_data.py` (default) generates paths like `/assets/r2/project/file.jpg`.
  - **Prod:** Assets live on R2 (`https://assets.eriknorris.com/project/file.jpg`). The relative path `/assets/r2/` does not exist on the production server (only on your local machine via git).
- **Fix:**
  1.  Ensure `PUBLIC_R2_DOMAIN` is set to your R2 bucket URL in CI/CD environment variables.
  2.  For local testing of production paths, run:
      ```powershell
      $env:PUBLIC_R2_DOMAIN="https://assets.eriknorris.com"; python ingest_data.py
      ```
  - _Note:_ The ingestion script now automatically hunts for and replaces local path strings (e.g., `/assets/r2/`) with the remote domain in manual content.

### Broken Images on Localhost (CORS)

- **Symptom:** Images are valid (200 OK) but fail to render in Javascript components (ModelViewer) or Canvas.
- **Cause:** Cloudflare R2 Bucket missing CORS headers for `localhost`.
- **Fix:** Update R2 Bucket CORS Policy to allow `GET` from `http://localhost:4321`.

  ```json
  [
    {
      "AllowedOrigins": ["http://localhost:4321", "https://eriknorris.com"],
      "AllowedMethods": ["GET", "HEAD"],
      "AllowedHeaders": ["*"]
    }
  ]
  ```

  ```

  ```

### "Missing" Frontmatter Data (The Snake Case Law)

- **Symptom:** Data exists in the `.mdx` file (verified) but appears as `undefined` in the Astro component props.
- **Cause:** Astro's Content Layer sometimes has caching conflicts or parsing ambiguities with `camelCase` object keys in YAML, especially when changing schema types (e.g., from `z.any()` to `z.object`).
- **Fix:** **Rename the field to `snake_case`**.
  1.  Update `ingest_data.py` to output `my_field_name`.
  2.  Update `src/content.config.ts` to expect `my_field_name`.
  3.  Update the component to read `data.my_field_name`.
      _Why?_ Snake_case seems to bypass specific internal caching layers or reserved keyword conflicts that plague camelCase in this specific stack.

### Recharts "width(-1)" Error

- **Symptom:** Console spam: `The width(-1) and height(-1) of chart should be greater than 0`.
- **Cause:** `ResponsiveContainer` fails to measure its parent container in a Flexbox/Grid layout if the parent lacks an explicit constraint, causing it to collapse to 0px width temporarily.
- **Fix:** Add `min-width: 0` (Tailwind `min-w-0`) to the parent container of the `ResponsiveContainer`.
  ```tsx
  // Correct Pattern for Grid/Flex Items
  <div style={{ width: "100%", height: "100%", minWidth: 0 }}>
    <ResponsiveContainer width="100%" height="100%">
      ...
    </ResponsiveContainer>
  </div>
  ```

### Stale Content Collection Schema

- **Symptom:** Valid frontmatter data (e.g., `phase_stats`) is correctly defined in MDX and Schema, but appears as `undefined` in the component props.
- **Cause:** Astro's Content Layer cache can become stale, especially when renaming fields or changing Zod types in `config.ts`.
- **Fix:** Force a Schema Rebuild.
  1. Open `src/content/config.ts`.
  2. Make a trivial change (e.g., add a comment `// force rebuild`).
  3. Save the file.
  4. The dev server will pick up the new schema definition.

### AI Generation Quota (429)

- **Symptom:** `generate_image` tool fails with "Resource Exhausted" or "Quota Exhausted".
- **Cause:** The AI model has hit its rolling usage limit (typically resets every ~4 hours).
- **Fix:**
  1.  **Pause:** Stop generation immediately.
  2.  **Save Prompts:** Ensure pending prompts are saved to `src/content/docs/prompts/`.
  3.  **Resume Later:** Pick up the task in a new session once the quota resets.

### Interactive Elements Missing After Navigation

- **Symptom:** Canvas backgrounds or interactive scripts fail to load when navigating between pages (e.g., from Home to Projects).
- **Cause:** Astro's `ClientRouter` (View Transitions) does not re-execute `<script>` tags on subsequent navigations.
- **Fix:** Wrap initialization logic in the `astro:page-load` event listener.
  ```javascript
  document.addEventListener("astro:page-load", () => {
    cleanup(); // Prevent memory leaks
    init(); // Re-bind canvas context and listeners
  });
  ```

## 12. The data ingestion protocol

We use a **Hybrid Ingestion Strategy** to feed "Intelligence Boluses" to LLMs like NotebookLM.

### 12.1 The Stitcher Script (`scripts/stitcher.py`)

- **Purpose:** Consolidates scattered files into a single, context-rich Markdown Bolus.
- **Capabilities:**
  - **Text:** Extracts text from `.txt`, `.md`, `.py`, `.json`, `.csv`.
  - **PDF:** Extracts text using `pypdf`. _Warning: Fails on image-only scans._
  - **PPTX:** Extracts text from slides using `python-pptx`.
  - **Msg:** Extracts email bodies from `.msg` files.
- **Limitations:**
  - **Flat Only:** Does not recurse into subfolders (prevents "Sludge Avalanches").
  - **No OCR:** Blind to pixels. If a PDF is a scan, it outputs "Text: None".

### 12.2 The Hybrid Protocol (for NotebookLM)

When preparing a folder for AI ingestion:

1.  **Run Stitcher:** `python scripts/stitcher.py "D:\Path\To\Folder"`
2.  **Upload the Bolus:** The `_INTELLIGENCE_*.md` file covers all text/email/code.
3.  **Upload Visuals:** Drag original `.pdf` (scans), `.jpg`, and `.png` files alongside the bolus.
4.  **Upload Data:** Drag `.xlsx` files (converted from legacy `.xls` if needed).

## 13. Documentation System

All documentation is now consolidated in `src/content/docs/` to serve as the Single Source of Truth (SSOT).

- **Location:** `src/content/docs/`
- **Format:** Markdown with Astro Frontmatter.
- **Requirement:** Every file **MUST** have the following frontmatter to be queried by the content collection:
  ```yaml
  ---
  title: "Doc Title"
  description: "Brief description."
  ---
  ```
- **Legacy:** The root `docs/` folder has been deprecated and removed.

## 13. Hardening Against Case Sensitivity

Since we develop on Windows (case-insensitive) but deploy to Cloudflare (Linux/case-sensitive), file naming issues are a common source of build failures.

### The "Infection" Vector

Importing code from other themes often introduces inconsistent casing (e.g., `components/About` vs `components/about`).

### Prevention Protocol

1.  **Git Configuration:**
    Run this command to force Git to respect case changes:

    ```bash
    git config core.ignorecase false
    ```

    _Note: This may suddenly show "untracked" files if your repo already has casing mismatches. Handle with care._

2.  **The "Nuclear" Rename:**
    If a directory is "infected" (Git thinks it's lowercase, Windows thinks it's Uppercase), standard renaming often fails.
    - **Fix:** Rename the folder to a temporary name, commit, then rename to the correct name.
    - _Example:_ `About` -> `About_Temp` -> [Commit] -> `About` -> [Commit].

3.  **Strict Imports:**
    - Always use relative paths (`../components/Home/Clients.astro`) when debugging resolution errors.
    - Avoid relying on aliases (`@components`) if you suspect a casing mismatch, as the alias resolver might mask the issue locally.

4.  **Linter Enforcement:**
    - We enforce `PascalCase` for component filenames (`MyComponent.astro`) and `kebab-case` for directories/pages (`my-page/index.astro`).

### Ingestion Script Crash (`AttributeError: 'NoneType' has no attribute 'strip'`)

- **Context:** Occurs during `python ingest_data.py`.
- **Cause:** A column exists in the CSV header (e.g., `Impact`) but is empty for some rows, and the parser attempts to `.strip()` a `None` value.
- **Fix:** Use safe retrieval in the dictionary comprehension:
  ```python
  # ingest_data.py
  clean_row = {k.strip(): (v.strip() if v else "") for k, v in row.items() if k}
  ```

## 14. Asset Hygiene & Symlinks (The Air Gap)

To prevent repo bloat (Git LFS limits), we strictly enforce an "Air Gap" for assets.

### The Problem

- **Git:** Good for code (KB/MB). Bad for heavy assets (GB).
- **Cloudflare Pages:** Free tier limits size (<25MB script, <20k files).
- **Dev Server:** Needs access to all 100GB of assets to render the site.

### The Solution: The Symlink Bridge

We use a Symbolic Link to bridge the external `ErikNorris-assets` repo into the `public` folder during local development.

**Windows PowerShell (Run as Admin):**

```powershell
New-Item -ItemType SymbolicLink -Path "d:\GitHub\ErikNorris\public\assets\r2" -Target "D:\GitHub\ErikNorris-assets\R2_STAGING"
```

**Golden Rules:**

1.  **NEVER COPY** files from `ErikNorris-assets` into `ErikNorris`.
2.  **ALWAYS LINK.** If a file is missing, check the Symlink 404, then add it to `ErikNorris-assets/R2_STAGING`.
3.  **VERIFY:** If `npm run dev` throws 404s, stop. Do not move the file. Check if the symlink is valid and if the file exists in the _Target_ directory.

### Changes Disappear After Build

- **Context:** You edited a file, ran `npm run dev`, and your changes vanished.
- **Cause:** You likely edited a build artifact (e.g., `src/content/projects/dreamjob.mdx`) instead of the source (`data_source/manual_content/dreamjob.md`).
- **Fix:** Apply edits to the `data_source/` files.

### Substance Painter: Texture Looks "Flat" or "Camo-like"

- **Symptom:** Forged Carbon material looks like soft blobs or a 2D print wrap ("Urban Camo").
- **Root Cause 1:** Soft Noise. Using standard "Cells" or "Clouds" noise creates organic, melted shapes.
  - **Fix:** Switch to **"Crystal 1"** or **"Cells 4"** with Contrast `0.95`. You need sharp, angular islands.
- **Root Cause 2:** Missing Anisotropy. If chips are only defined by Height, they look like plastic.
  - **Fix:** Enable **Anisotropy Level** (`0.9+`) and drive **Anisotropy Angle** with a random grayscale noise (`Cells 4`). This creates the "Holographic" rotation effect.
- **Root Cause 3:** Scale Mismatch. Large chips look like paving stones.
  - **Fix:** Crank Noise Scale to `75-100` for "Confetti" sizing.

### Toggling Site Status

- **Goal:** Switch from "Under Construction" back to "System Online".
- **File:** `src/components/Hero/HardTechHero.astro`
- **Action:**
  1.  Import `ImpactResonance` from `../DataViz/ImpactResonance`.
  2.  Replace `<ConstructionGauge ... />` with `<ImpactResonance label="SYSTEM STATUS" value={98} />`.
  3.  Update the text label below it to `[SYSTEM ONLINE]` (Emerald-500).

### Blender: Cyan Lines vs. Red Lines

- **Symptom:** User sees bright light-blue (Cyan) lines and thinks they are holes/open edges.
- **Reality:** Cyan lines are **"Sharp Edges"** marked by CAD software (Plasticity). They are safe.
- **Action:** You can often use these as a guide for Seams. Select them (`Select Sharp Edges`), then `Mark Seam` (Red) to cut them.

### 3D Asset - "The Smooth Blob" Issue

- **Symptom:** Asset looks low-poly, smooth, and missing all surface detail (chips/scratches) in the web viewer.
- **Cause:** The glTF file does not contain **Tangents**, so the Normal Map is ignored.
- **Fix:** Re-export from Blender. In Export Settings > Geometry > Check **Tangents**.

### 3D Asset - "Shiny Plastic" / "Dark Edges"

- **Symptom:** Asset looks like wet plastic, or has strange black outlines.
- **Cause:**
  1.  **Color Space:** Metallic/Roughness/Normal textures are set to `sRGB` (Gamma Corrected) instead of `Non-Color`.
  2.  **Wiring:** Red Channel (Occlusion) is connected to Metallic.
- **Fix:**
  1.  Set Image Nodes to `Non-Color`.
  2.  Connect **Blue** Channel of ORM to Metallic.

### 3D Asset - "Z-Index Fighting"

- **Symptom:** Background effects (Noise, Stars) appear _in front_ of the model.
- **Fix:**
  1.  Ensure `.noise-overlay` is `z-index: 5` (or low).
  2.  Ensure `model-viewer` container is `z-[60]` (High).

### R2 Assets Not Updating (The "Green" Regression)

- **Symptom:** You updated an image in `R2_STAGING`, ran the sync script, but the live site still shows the old version.
- **Cause 1 (The Emulator Trap):** The `wrangler` command often defaults to `--local` mode, updating a hidden SQLite file instead of the real bucket.
- **Fix:** Ensure your sync command includes the `--remote` flag. (Note: `scripts/sync_r2.py` has been patched to handle this automatically).
- **Cause 2 (Edge Cache):** You previously served the file with `Cache-Control: immutable`. Use `curl -I [url]` to check headers.
- **Fix:** Change the filename (e.g., `-v2`) OR change the Worker headers to `no-cache` and purge the zone.

### R2 SignatureDoesNotMatch (Credential Rotation)

- **Symptom:** `sync_r2.py` fails with: `The request signature we calculated does not match the signature you provided.`
- **Cause:** The Access Key or Secret Key in `.env` is invalid or expired. Cloudflare R2 tokens expire silently if created with a default TTL.
- **Fix:**
  1.  Generate a NEW Token in Cloudflare (Select "Forever" or "End Date: 2099").
  2.  Use "Account API Token" (surer than User Token).
  3.  Update `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY` in `.env`.
  4.  **Important:** Boto3 requires `region_name='auto'` to authorize correctly (already patched in `scripts/sync_r2.py`).

### Asset Pipeline Troubleshooting ("The Two Ghosts")

If assets appear locally but break on Production (or vice-versa), check these common traps:

#### 1. The "Ghost Link" (Git vs. Symlink)

- **Symptom:** Images load locally but are 404 on Cloudflare.
- **Cause:** `public/assets/r2` is a Symlink/Junction. If `.gitignore` ignores it (CORRECT), Git won't track the _contents_.
- **Fix:**
  - **Prod:** Ensure `npm run sync:assets` is run to push files to R2. Cloudflare fetches from R2, not the repo.
  - **Git:** NEVER remove `public/assets/r2` from `.gitignore`. If you do, Git might try to index the symlink as a folder or deadlock on files.

  - **Assets:** Ensure filenames verify against the whitelist regex `^([\w-]+)`. Use dashes, not pipes or slashes.

### The Hybrid Registration Protocol (Creating New Projects)

- **Context:** When a new project requires "High-Res" data that overlaps/conflicts with the legacy "Low-Res" CSVs.
- **Protocol:**
  1.  **The Stub:** Add a minimal row to `data_source/Main.csv` (Slug, basic dates). _Required for build system visibility._
  2.  **The Override:** Create `data_source/manual_content/{slug}.md` with the "Narrative STAR" content. _Overrides the CSV body._
  3.  **The Result:** `ingest_data.py` merges them (Existence from CSV + Fidelity from MD).

### Levels of Ingestion (Menu vs. Ingredients)

- **Concept:** Distinguishing the Oracle's _Visual Desire_ from the File System's _Physical Reality_.
- **Rule:**
  - **Direct Match:** If an isolated JPG exists (e.g., `fan_duct.jpg`), use it.
  - **The Container:** If the evidence is inside a PDF (e.g., `thermal_report.pdf`), ingest the _entire PDF_. Do not demand manual extraction. The PDF serves as both the "Artifact" (Download) and the "Data Source" (Mining).

### Astro MDX: The Placeholder Trap

- **Symptom:** A project page loads, but ignores your Custom Hero Image and shows a random placeholder (e.g., `tech-2.jpg`).
- **Cause:** **Schema Validation Failure.** If your Frontmatter YAML is invalid (e.g., `teamSize: "18"` string instead of number, or malformed JSON-in-YAML), Astro silently _rejects_ the entire file and your `[...slug].astro` fallback logic kicks in to "simulate" the entry using `project_manifest.json` defaults.
- **Fix:**
  1.  Check the terminal for Zod validation errors.
  2.  Use **Standard YAML**, not JSON-like syntax in frontmatter.
  3.  Verify strict types (`teamSize` must be a `number`).

### SwarmFiche: Double Scrollbars

- **Symptom:** Two vertical scrollbars appear on the right side of the screen.
- **Cause:** The Parallax container (`body`) and the Fiche List (`#fiche-col`) are both scrollable.
- **Fix:** Apply the `.no-scrollbar` utility class to `#fiche-col`. This hides the visual bar but keeps the scroll functionality, allowing the Swarm to breathe.
