# Site Maintenance Manual (IFU)

Internal documentation for maintaining and updating the portfolio site.

## 1. Trust Wall Logic

### Priority Order (Ingestion Script)
1.  **Hardcoded Map:** Checks `CLIENT_ICON_MAP` in `ingest_data.py` for a specific icon slug.
2.  **Staging Logo:** Checks `R2_STAGING/_site/logos/` for `{clientname}.svg` or `.png`.
3.  **Text:** Fallback if no logo is found.

### Workflow for Missing Logos
**Method A (Automated - Recommended):**
1.  Find a PNG/SVG of the logo.
2.  Rename it to match the client name (e.g., `clientname.svg`).
3.  Drop it into `R2_STAGING/_site/logos/`.
4.  Run `python ingest_data.py`.

**Method B (Manual - Temporary):**
> [!WARNING]
> `src/config/clients.json` is overwritten by the ingestion script. Manual changes here will be lost on the next ingestion run unless you skip that step.

1.  Drop logo into `public/images/clients/`.
2.  Update `src/config/clients.json`: set `"logo": "/images/clients/filename.png"`.

## 2. Colophon Marquee
The marquee on the Colophon page displays the tech stack.

*   **Location:** `src/pages/colophon.astro`
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
    *   `public/assets/r2/` (Synced assets).

### Running the Script
```bash
python ingest_data.py
```

## 4. Project Detail Pages
Project pages are generated from MDX files in `src/content/projects/`.

### Adding Resources (PDFs, Links)
*   **PDFs:** Place `.pdf` files in `R2_STAGING/{project-slug}/`. The script automatically adds them to the "Resources" section.
*   **Links:** Add a "Link" column in `Main.csv` with the URL.

### Adding Images & Videos
*   **Hero Image:** Name a file `hero.jpg` (or png/webp) in `R2_STAGING/{project-slug}/`.
*   **Gallery:** Any other images in that folder are added to the gallery.
*   **3D Models:** Add a `.glb` file in the folder. It will be auto-detected.
*   **Videos:** Currently, the script inserts a placeholder YouTube ID. You must manually edit the generated `.mdx` file or update the script to map video IDs from a CSV column.

## 5. Maintenance & Enhancements
To keep this site healthy:
*   **Regularly:** Run ingestion script after updating Google Sheets.
*   **Check:** `src/config/clients.json` for missing logos (null values).
*   **Backup:** Ensure `data_source/` CSVs are committed or backed up.
