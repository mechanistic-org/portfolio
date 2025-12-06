---
title: "Site Maintenance Manual (IFU)
"
slug: "maintenance"
---
# Site Maintenance Manual (IFU)

Internal documentation for maintaining and updating the portfolio site.

## 1. Trust Wall Logic

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

*   **Location:** `src/pages/colophon.astro`
*   **Component:** Uses the shared `Marquee.tsx` component.
*   **Layout:** Must be placed **outside** the `site-container` div to achieve full-width display.
*   **Logic:** The `marqueeTools` array defines the items.
*   **Icons:** Uses [Simple Icons](https://simpleicons.org/). The `slugMap` object maps tool names to Simple Icons slugs (e.g., "Google Gemini" -> "googlegemini").
*   **To Update:** Edit `src/pages/colophon.astro` directly. Add new tools to the `tools` array and update `slugMap`/`linkMap` if necessary.

## 3. Ingestion Script
The core engine of the site is `ingest_data.py`.

### Theory of Operation
*   **Inputs:** CSV files in `data_source/` (exported from Google Sheets).
*   **Assets:** Checks `R2_STAGING` (or environment variable path) for images and 3D models.
*   **Outputs:**
    *   `src/config/*.json` (Site data, clients, colors, specs).
    *   `src/content/projects/*.mdx` (Project pages).
    *   `src/content/projects/*.mdx` (Project pages).
    *   **Manual Content:** Injects `data_source/manual_content/{slug}.md` into the MDX body if found.
    *   `public/assets/r2/` (Synced assets).

### Cloud Asset Sync
To manage large assets (images, 3D models, PDFs), we use Cloudflare R2.
*   **Source:** `../quantum-assets/R2_STAGING/{slug}/` (Sibling Directory - Recommended) or `R2_STAGING/{slug}/` (Local)
*   **Destination:** `https://assets.eriknorris.com/{slug}/` (Remote)
*   **Command:** `python ingest_data.py` (Auto-runs sync)

**Prerequisites:**
1.  Ensure you are logged in: `npx wrangler login`
2.  Ensure `scripts/sync_r2.py` has the correct `BUCKET_NAME`.

### Running the Ingestion
```bash
python ingest_data.py
```

### Scaffolding New Content
To automatically generate placeholder markdown files for projects that don't have them:
```bash
python ingest_data.py --scaffold
```
This creates `{slug}.md` files in `data_source/manual_content/` with a standard "Challenge/Approach/Impact" template.

### Data & Content Refinement
When adding new projects or resetting data, run these scripts before ingestion:

1.  **Regenerate Skills:**
    ```bash
    python scripts/refine_skills.py
    ```
    *   *Use when:* You add new projects and want them to have unique skill profiles immediately.

2.  **Batch Generate Content:**
    ```bash
    python scripts/generate_content.py
    ```
    *   *Use when:* You have imported a batch of projects and need placeholder "Hero Content" to avoid empty pages.
    *   *Note:* This script respects existing manual content (files > 1KB).

## 4. Project Detail Pages
Project pages are generated from MDX files in `src/content/projects/`.

### Authoring Project Pages (The Snippet Workflow)
We use custom VS Code snippets to rapidly scaffold "Visual Taxonomy" components.
1.  **Prerequisite:** Ensure `.vscode/quantum.code-snippets` is present in your workspace.
2.  **Workflow:** In any `.md` or `.mdx` file, type `qq-` to see available snippets.
    *   `qq-zigzag`: Insert Product Grid.
    *   `qq-process`: Insert Process Timeline.
    *   `qq-model`: Insert 3D Viewer.
    *   `qq-admonition`, `qq-chip`, `qq-wire`: Insert UI primitives.
3.  **Reference:** Visit `http://localhost:4321/about/elements` to see live examples and trigger names.

### Adding Resources (PDFs, Links)
*   **PDFs:** Place `.pdf` files in `R2_STAGING/{project-slug}/`. The script automatically adds them to the "Resources" section.
*   **Links:** Add a "Link" column in `Main.csv` with the URL.

### Adding Images & Videos
*   **Hero Image:** Name a file `hero.jpg` (or png/webp) in `R2_STAGING/{project-slug}/`.
*   **Gallery:** Any other image file in that folder (that isn't `hero.png` or a chart) is automatically ingested into the Project Gallery.
*   **3D Models:** Add a `.glb` file in the folder. It will be auto-detected.
*   **Videos:** Currently, the script inserts a placeholder YouTube ID. You must manually edit the generated `.mdx` file or update the script to map video IDs from a CSV column.

### Troubleshooting Charts
If a chart isn't showing up:
1.  **Check Data:** Ensure `Stats.csv` has non-zero values for Plastic/Metal/PCB for that project.
2.  **Check Generation:** Run `python ingest_data.py` and watch for errors.
3.  **Check Output:** Verify `public/assets/r2/{slug}/part-graph.svg` exists.

## 5. Maintenance & Enhancements
To keep this site healthy:
*   **Regularly:** Run ingestion script after updating Google Sheets.
*   **Check:** `src/config/clients.json` for missing logos (null values).
*   **Backup:** Ensure `data_source/` CSVs are committed or backed up.

## 6. Debug Mode
The site includes a built-in "Wireframe Mode" for visual debugging.

*   **Activation:** Scroll to the footer and click the **"DEBUG [ OFF ]"** button.
*   **Features:**
    *   **Cyan Outlines:** Shows element boundaries.
    *   **Magenta Outlines:** Shows layout containers (`.site-container`).
    *   **Grayscale/Yellow Images:** Checks image contrast and focus.
*   **Persistence:** The state is saved in `localStorage`, so it survives page reloads.

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
*   **`production`**: Badge is hidden. Use this for live launches.
*   **`under-construction`**:
    *   **Local:** Shows `[ LOCAL DEV ]`.
    *   **Deployed:** Shows `[ UNDER CONSTRUCTION: <SHA> ]`.
*   **`maintenance`**: Shows `[ MAINTENANCE ]`.

## 8. Project Directory Maintenance
*   **Deep Linking:** You can link to a pre-filtered view using URL parameters: `https://eriknorris.com/projects?client=Google`.

## 8. Troubleshooting

### Asset Staging Mismatch (Ghost Assets)
*   **Symptom:** You place assets in `R2_STAGING` but they don't appear after ingestion.
*   **Cause:** You might be using the local repo folder (`quantum/R2_STAGING`) instead of the external asset repo (`quantum-assets/R2_STAGING`).
*   **Fix:** Always stage assets in `../quantum-assets/R2_STAGING`. The ingestion script looks there first.

### Image Extension Mismatch (404s)
*   **Symptom:** New AI-generated assets return 404 errors despite existing on disk.
*   **Cause:** AI tools often output `.png` by default, while legacy prompts/MDX might reference `.jpg`.
*   **Fix:** Check the actual file extension in `R2_STAGING` and update the `.mdx` file to match (e.g., change `hero.jpg` to `hero.png`).

### Build Issues
*   **Async Rendering in Astro Templates**
    *   **Symptom:** Build fails with generic errors when using `await` inside a `.map()` in JSX.
    *   **Cause:** Astro's JSX renderer struggles with async operations inside array maps.
    *   **Fix:** Pre-render the content in the component script (frontmatter) using `Promise.all()`, then map over the rendered result in the template.
        ```typescript
        // Correct Pattern
        const renderedItems = await Promise.all(items.map(async (item) => {
            const { Content } = await item.render();
            return { ...item.data, Content };
        }));
        // ... use renderedItems in JSX
        ```

*   **Build Fails on "Missing Collection"**
    *   **Symptom:** `npm run build` fails with errors like `Collection 'blog' does not exist` or `ReferenceDataEntry not found`.
    *   **Cause:** Unused templates (e.g., `src/pages/blog/...`) are trying to query content collections that haven't been defined or populated.
    *   **Fix:** Delete the unused template directories (`src/pages/blog`, `src/pages/tags`) and their associated components (`PostCard`, `SidebarCards`). The portfolio is designed to be lean; remove what you don't use.

*   **Symptom:** `npm run build` or `npx astro check` fails with ~32 errors (e.g., `examples/blog-post-3.astro`).
    *   **Context:** These are pre-existing type errors in example/unused files.
    *   **Action:** They do not affect the core `project` or `colophon` pages. If deployment fails, ensure `astro build` is configured to not fail on TS errors, or ignore `examples/` in `tsconfig.json`.

*   **Error:** `Cannot apply unknown utility class 'text-3xl'` (or similar) inside an Astro component's `<style>` block.
    *   **Cause:** Tailwind v4 styles are isolated. Astro's scoped `<style>` blocks do not inherit the global Tailwind context automatically.
    *   **Fix:** Add the `@reference` directive to the top of the style block to link it to the global CSS configuration.
        ```css
        <style>
          @reference "../../styles/global.css";
          /* ... your styles ... */
        </style>
        ```

*   **Error:** `Could not resolve "virtual:keystatic-config"`
    *   **Cause:** The Keystatic integration is initializing before other required plugins.
    *   **Fix:** Move `keystatic()` to the very end of the `integrations` array in `astro.config.mjs`.

*   **Error:** `Identifier "Admonition" has already been declared` (in MDX files)
    *   **Cause:** The component is being imported manually (e.g., `import Admonition...`) but is *also* configured for global auto-import in `astro.config.mjs`.
    *   **Fix:** Remove the manual import statement from the MDX file. The system automatically provides this component.

*   **Error:** `Could not resolve "../components/About/ClientGrid.astro"` (on Cloudflare)
    *   **Cause:** Git case-sensitivity mismatch (e.g., `About` vs `about`) between Windows (Dev) and Linux (CI).
    *   **Fix:** The "Nuclear Option":
        1.  Create a new directory with a distinct name (e.g., `src/components/Home`).
        2.  Move the component there.
        3.  Update imports to use relative paths (`../components/Home/Clients.astro`) to bypass alias caching.

### Runtime Issues
*   **Error:** `Uncaught SyntaxError: ... does not provide an export named 'AXObjectRoles'`
    *   **Cause:** Vite is incorrectly optimizing the `axobject-query` dependency (used by `eslint-plugin-jsx-a11y`).
    *   **Fix:** Ensure `axobject-query` is in the `optimizeDeps.exclude` list in `astro.config.mjs`.

### TypeScript Errors in Content Collections
*   **Symptom:** `Property '...' does not exist on type '...'` or `No overload matches this call` for `Date` constructors.
*   **Cause:** Astro's generated content collection types might be out of sync, or strict TypeScript checks are flagging optional/complex types.
*   **Fix:**
    1.  Run `npx astro sync` to regenerate types.
    2.  If errors persist for `Date` fields, cast them: `new Date(project.data.date as any)`.
    3.  For missing optional properties (e.g., `toolIcons`), use type assertion: `(project.data as any).toolIcons`.

### Blank Project Pages
*   **Symptom:** Clicking a project leads to a blank page or raw HTML attributes.
*   **Cause:** The `Layout` component in Astro templates might be self-closing (`<Layout ... />`) instead of wrapping content (`<Layout ...>...</Layout>`).
*   **Fix:** Ensure the `Layout` component properly wraps the page content.

### Project Page Layout Collapse
*   **Symptom:** The main content column is squeezed to the left, overlapping the sidebar or losing its grid span.
*   **Possible Causes:**
    1.  **Misplaced Content:** The `<Content />` component (rendering the MDX) is outside the `<article>` tag. It *must* be inside `<article>` to inherit the `col-span-8` grid class.
    2.  **Malformed JSX:** An unclosed tag (e.g., `<img ... >` without `/>`) inside a conditional block can corrupt the DOM tree, causing the browser to "swallow" subsequent containers.
*   **Fix:** Check `src/pages/projects/[...slug].astro` for unclosed tags and ensure `<Content />` is nested correctly.

### MDX Compilation Errors
*   **Error:** `Unexpected character 0 (U+0030) before name` or similar parsing errors.
*   **Cause 1 (Numeric Slugs):** A project slug starts with a number (e.g., `002-rack`). MDX compiles content into JavaScript, and identifiers cannot start with digits.
*   **Fix 1:** Rename the project in `Main.csv` (or use the `Slug Name` column) to start with a letter (e.g., `rack-002`).
*   **Cause 2 (Invalid Tags):** Markdown content contains text like `<0.5%`. MDX interprets `<` followed by a number/letter as an opening HTML tag.
*   **Fix 2:** Escape the less-than sign: `&lt;0.5%`.

### Empty Content Collection
*   **Symptom:** A specific content collection (e.g., `colophon`) returns an empty array `[]` via `getCollection`, even though files exist.
*   **Cause:** Potential conflict between Astro's Content Layer and integrations like Keystatic, or caching issues.
*   **Fix:** Use `import.meta.glob` to manually load the files as a fallback.
    ```typescript
    // Workaround:
    const globFeatures = import.meta.glob("../content/colophon/*.mdx", { eager: true });
    const features = Object.values(globFeatures).map((file: any) => ({
        id: file.file,
        ...file.frontmatter,
        Content: file.Content || file.default
    }));
    ```

### Visible Grid Not Showing
*   **Symptom:** The background is solid color; no grid lines are visible.
*   **Cause:** The `<body>` element likely has a background color class (e.g., `bg-white` or `bg-neutral-950`) that is painting over the `<html>` element's grid pattern.
*   **Fix:** Ensure `BaseLayout.astro` does NOT apply background color classes to the `<body>` tag. It should be transparent.

### Double Bullets in Lists
*   **Symptom:** Lists on project pages show two bullets (e.g., `â€¢ â€¢ Item`).
*   **Cause:** Hardcoded bullet characters (`â€¢`) in the manual Markdown files colliding with CSS `list-style-type`.
*   **Fix:** Remove all hardcoded bullets from `data_source/manual_content/*.md`. Let CSS handle the styling.

### Missing Part Breakdown Graph
*   **Symptom:** "Part Breakdown" graph is missing on a specific project page.
*   **Cause:** Name mismatch between `Main.csv` (Slug Name) and `Stats.csv` (Slug Name).
*   **Fix:** Ensure the "Slug Name" column in `Stats.csv` *exactly* matches `Main.csv`.
    *   *Example:* "002 Rack" (Wrong) vs "Rack 002" (Correct).

### Blank 3D Model Viewer
*   **Symptom:** Viewer loads but shows a blank/empty scene (not the fallback).
*   **Cause:** `src` URL points to a non-existent file, often due to a mismatch between the generated slug and the `R2_STAGING` folder name.
*   **Fix:** Ensure the folder in `quantum-assets/R2_STAGING/` matches the project slug exactly (e.g., `rack-002`, not `002-rack`).

### Stale TypeScript Errors ("File Not Found")
*   **Symptom:** `tsconfig.json` reports an error for a file that was recently deleted (e.g., "File '.../template-test.astro' not found").
*   **Context:** The Astro language server sometimes holds onto stale file references after deletion.
*   **Fix:** Open `tsconfig.json`, make a trivial change (add a space or comment), save, and then revert the change. This forces the language server to refresh its file list.

## 9. Writing Manual Content
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

*   **[Key Action/Feature]:** [Detail]
*   **[Key Action/Feature]:** [Detail]

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

*   **Onboarding:** Copy `docs/ONBOARDING_PROMPT.md` to start a session.
*   **Mining:** Copy `docs/CONVERSATION_MINER_PROMPT.md` to end a session and extract value.
*   **Branding:** Use `docs/BRANDING_PROMPT.md` when working on visual design, CSS, or "Voice & Tone" updates.

## 11. Living Style Guide
The page at `/about/elements` is the source of truth for our visual system.

*   **Source:** `src/data/otherPages/elements/index.mdx`
*   **Workflow:** When creating a new UI component, **MUST** add an example to this file to verify it renders correctly in a prose context.
*   **Troubleshooting:**
    *   **Issue:** Components not rendering in MDX.
    *   **Fix:** Ensure the component is imported at the top of the MDX file (e.g., `import Chip from '@components/dls/Chip.astro';`).
### Image Assets (The Hybrid Workflow)
See `docs/IMAGE_WORKFLOW.md` for the full SOP.
1.  **Ingest:** Import raw files into Lightroom Classic.
2.  **Develop:** Use Lightroom Classic. Export using "Quantum Master" preset (TIFF, sRGB, 4000px) to `R2_MASTER`.
3.  **Process:** Run `python scripts/process_images.py {slug}`.
4.  **Deploy:** Run `python ingest_data.py`.

## Troubleshooting

### Image Processing Errors
*   **Symptom:** `AttributeError: 'Constant' object has no attribute 's'` during install.
*   **Cause:** Python 3.14 compatibility issue with `pillow-avif-plugin`.
*   **Fix:** Use `pillow-heif` instead. Run `pip install pillow-heif`.

### Missing Assets / 500 Errors
*   **Symptom:** Images fail to load with 500 errors, or the site crashes with `ENOENT`.
*   **Cause:** Often caused by deleting asset directories (like `assets/logos`) while the dev server is running, or lingering references in cached build artifacts.
*   **Fix:**
    1.  Stop the dev server (`Ctrl+C`).
    2.  Verify the asset exists in `public/assets/branding/`.
    3.  Update all references in code (grep for the old path).
    4.  Restart `npm run dev`.

### Ghost Assets (Images Not Updating)
*   **Symptom:** You run `process_images.py`, verify the files in `R2_STAGING`, but the local dev server (`localhost:4321`) still shows old or broken images.
*   **Cause:** `ingest_data.py` might be defaulting to the **Remote R2 Domain** (`https://assets.eriknorris.com`) instead of the local disk.
*   **Fix:**
    1.  Check `ingest_data.py`: Ensure `R2_DOMAIN` defaults to `/assets/r2` when `PUBLIC_R2_DOMAIN` is not set.
    2.  Check `.env`: Ensure you aren't accidentally overriding it.
    3.  **Verification:** Inspect the image URL in the browser. It should start with `/assets/r2/...`, not `https://...`.

### Squished Animations
*   **Symptom:** Animation frames look stretched or compressed.
*   **Cause:** Frames have varying aspect ratios, and the pipeline was forcing them to match the first frame.
*   **Fix:** The pipeline now uses **Letterboxing** (`ImageOps.pad`). If this happens, ensure you are running the latest version of `process_images.py`.

### Missing Gallery Images
*   **Symptom:** Valid images in `R2_STAGING` are not appearing in the gallery.
*   **Cause:** They might be referenced in the manual content (Writeup). The system auto-hides used assets.
*   **Fix:** This is intended behavior. If you want it in both, rename the file or duplicate it (discouraged).

### "Hero" Image Not Picking Correctly
*   **Symptom:** The wrong image is selected as the cover.
*   **Fix:** Ensure the filename contains `-hero-` or starts with `hero-`. The logic was tightened to avoid false positives (e.g., `super-hero.jpg`).

### Squished Gallery Images
*   **Symptom:** Images in the gallery look compressed or distorted.
*   **Cause:** The grid cell aspect ratio doesn't match the image, and `object-fit` is missing or set to `fill`.
*   **Fix:** Ensure `ProjectGallery.tsx` has `object-fit: cover` on the `<img>` tag. This forces the image to fill the cell (cropping if necessary) rather than stretching.

### Content Schema Mismatch
*   **Symptom:** `npm run dev` fails with `[InvalidContentEntryDataError] ... Expected type "string", received "object"`.
*   **Cause:** The `src/content.config.ts` schema definition for `gallery` is outdated (expects strings) but the MDX files contain objects (generated by a newer `ingest_data.py`).
*   **Fix:** Update `src/content.config.ts` to match the new object structure:
    ```typescript
    gallery: z.array(z.object({
        src: z.string(),
        width: z.number(),
        height: z.number(),
        aspectRatio: z.number()
    })).default([]),
    ```




### Asset Path Mismatch (Broken Images on Production)
*   **Symptom:** Images load on `localhost` but are broken 404s on the deployed site.
*   **Cause:** The "Physical Asset Law" Violation.
    *   **Local:** `ingest_data.py` (default) generates paths like `/assets/r2/project/file.jpg`.
    *   **Prod:** Assets live on R2 (`https://assets.eriknorris.com/project/file.jpg`). The relative path `/assets/r2/` does not exist on the production server (only on your local machine via git).
*   **Fix:**
    1.  Ensure `PUBLIC_R2_DOMAIN` is set to your R2 bucket URL in CI/CD environment variables.
    2.  For local testing of production paths, run:
        ```powershell
        $env:PUBLIC_R2_DOMAIN="https://assets.eriknorris.com"; python ingest_data.py
        ```
    *   *Note:* The ingestion script now automatically hunts for and replaces local path strings (e.g., `/assets/r2/`) with the remote domain in manual content.

### Broken Images on Localhost (CORS)
*   **Symptom:** Images are valid (200 OK) but fail to render in Javascript components (ModelViewer) or Canvas.
*   **Cause:** Cloudflare R2 Bucket missing CORS headers for `localhost`.
*   **Fix:** Update R2 Bucket CORS Policy to allow `GET` from `http://localhost:4321`.
    ```json
    [
      {
        "AllowedOrigins": [ "http://localhost:4321", "https://eriknorris.com" ],
        "AllowedMethods": [ "GET", "HEAD" ],
        "AllowedHeaders": [ "*" ]
      }
    ]
    ```

    ```

### "Missing" Frontmatter Data (The Snake Case Law)
*   **Symptom:** Data exists in the `.mdx` file (verified) but appears as `undefined` in the Astro component props.
*   **Cause:** Astro's Content Layer sometimes has caching conflicts or parsing ambiguities with `camelCase` object keys in YAML, especially when changing schema types (e.g., from `z.any()` to `z.object`).
*   **Fix:** **Rename the field to `snake_case`**.
    1.  Update `ingest_data.py` to output `my_field_name`.
    2.  Update `src/content.config.ts` to expect `my_field_name`.
    3.  Update the component to read `data.my_field_name`.
    *Why?* Snake_case seems to bypass specific internal caching layers or reserved keyword conflicts that plague camelCase in this specific stack.

### Recharts "width(-1)" Error
*   **Symptom:** Console spam: `The width(-1) and height(-1) of chart should be greater than 0`.
*   **Cause:** `ResponsiveContainer` fails to measure its parent container in a Flexbox/Grid layout if the parent lacks an explicit constraint, causing it to collapse to 0px width temporarily.
*   **Fix:** Add `min-width: 0` (Tailwind `min-w-0`) to the parent container of the `ResponsiveContainer`.
    ```tsx
    // Correct Pattern for Grid/Flex Items
    <div style={{ width: '100%', height: '100%', minWidth: 0 }}>
         <ResponsiveContainer width="100%" height="100%">
             ...
         </ResponsiveContainer>
    </div>
    ```

### Stale Content Collection Schema
*   **Symptom:** Valid frontmatter data (e.g., `phase_stats`) is correctly defined in MDX and Schema, but appears as `undefined` in the component props.
*   **Cause:** Astro's Content Layer cache can become stale, especially when renaming fields or changing Zod types in `config.ts`.
*   **Fix:** Force a Schema Rebuild.
    1. Open `src/content/config.ts`.
    2. Make a trivial change (e.g., add a comment `// force rebuild`).
    3. Save the file.
    4. The dev server will pick up the new schema definition.

### AI Generation Quota (429)
*   **Symptom:** `generate_image` tool fails with "Resource Exhausted" or "Quota Exhausted".
*   **Cause:** The AI model has hit its rolling usage limit (typically resets every ~4 hours).
*   **Fix:**
    1.  **Pause:** Stop generation immediately.
    2.  **Save Prompts:** Ensure pending prompts are saved to `src/content/docs/prompts/`.
    3.  **Resume Later:** Pick up the task in a new session once the quota resets.

### Interactive Elements Missing After Navigation
*   **Symptom:** Canvas backgrounds or interactive scripts fail to load when navigating between pages (e.g., from Home to Projects).
*   **Cause:** Astro's `ClientRouter` (View Transitions) does not re-execute `<script>` tags on subsequent navigations.
*   **Fix:** Wrap initialization logic in the `astro:page-load` event listener.
    ```javascript
    document.addEventListener("astro:page-load", () => {
        cleanup(); // Prevent memory leaks
        init();    // Re-bind canvas context and listeners
    });
    ```

## 12. Documentation System

All documentation is now consolidated in `src/content/docs/` to serve as the Single Source of Truth (SSOT).

*   **Location:** `src/content/docs/`
*   **Format:** Markdown with Astro Frontmatter.
*   **Requirement:** Every file **MUST** have the following frontmatter to be queried by the content collection:
    ```yaml
    ---
    title: "Doc Title"
    description: "Brief description."
    ---
    ```
*   **Legacy:** The root `docs/` folder has been deprecated and removed.

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
    *Note: This may suddenly show "untracked" files if your repo already has casing mismatches. Handle with care.*

2.  **The "Nuclear" Rename:**
    If a directory is "infected" (Git thinks it's lowercase, Windows thinks it's Uppercase), standard renaming often fails.
    *   **Fix:** Rename the folder to a temporary name, commit, then rename to the correct name.
    *   *Example:* `About` -> `About_Temp` -> [Commit] -> `About` -> [Commit].

3.  **Strict Imports:**
    *   Always use relative paths (`../components/Home/Clients.astro`) when debugging resolution errors.
    *   Avoid relying on aliases (`@components`) if you suspect a casing mismatch, as the alias resolver might mask the issue locally.

4.  **Linter Enforcement:**
    *   We enforce `PascalCase` for component filenames (`MyComponent.astro`) and `kebab-case` for directories/pages (`my-page/index.astro`).

### Ingestion Script Crash (`AttributeError: 'NoneType' has no attribute 'strip'`)
*   **Context:** Occurs during `python ingest_data.py`.
*   **Cause:** A column exists in the CSV header (e.g., `Impact`) but is empty for some rows, and the parser attempts to `.strip()` a `None` value.
*   **Fix:** Use safe retrieval in the dictionary comprehension:
    ```python
    # ingest_data.py
    clean_row = {k.strip(): (v.strip() if v else "") for k, v in row.items() if k}
    ```

### Changes Disappear After Build
*   **Context:** You edited a file, ran `npm run dev`, and your changes vanished.
*   **Cause:** You likely edited a build artifact (e.g., `src/content/projects/dreamjob.mdx`) instead of the source (`data_source/manual_content/dreamjob.md`).
*   **Fix:** Apply edits to the `data_source/` files.
