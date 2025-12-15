---
title: "Quantum Image Workflow (SOP)"
slug: "image_workflow"
sidebar:
  group: "Workflows"
  order: 2
---
# Quantum Image Workflow (SOP)

**Objective:** Standardize all portfolio assets to "Premium" quality using a Hybrid (Lightroom + Python) workflow.

## 1. The Workspace
We use a dedicated local workspace to keep the Git repo clean.

*   **Location:** `~/Quantum_Workspace/` (User Home Directory)
*   **Structure:**
    ```text
    /Quantum_Workspace/
    ├── 01_INGEST/          # [DROP ZONE] Raw Camera Files (CR2, NEF) & Web Scraps
    │   └── {project_slug}/
    ├── 02_MASTER/          # [LIGHTROOM EXPORT] High-Res TIFFs (The Source of Truth)
    │   └── {project_slug}/
    │       ├── {slug}-hero-01.tif
    │       └── {slug}-detail-01.tif
    ```

## 2. Naming Convention (Strict)
All files must follow this regex-enforceable schema:

`{project_slug}-{view_type}-{sequence}.{ext}`

*   **`project_slug`**: Matches the folder name (e.g., `xbox`, `kavo-dental`).
*   **`view_type`**:
    *   `hero`: The main cover image.
    *   `detail`: Close-ups, textures, macro shots.
    *   `context`: Wide shots, environment, in-situ.
    *   `ui`: Screenshots, digital interfaces.
    *   `diagram`: Technical drawings, schematics.
*   **`sequence`**: 2-digit number (01, 02, ...).

**Example:** `xbox-detail-03.tif`

---

## 3. The Workflow

### Step 1: Ingest (The Darkroom)
1.  **Import:** Import your raw source material (CR2, JPG, PNG) directly into Lightroom Classic.
2.  **Organize:** Ensure your Lightroom catalog is organized by project.

### Step 2: Art Direction (Human)
1.  **Cull:** Rate images. Select the best.
2.  **Develop:** Color grade, crop, and correct perspective.
3.  **Crop:** Ensure the aspect ratio is intentional.

### Step 3: Export Master (The Hand-off)
Use the **"Quantum Master"** Export Preset in Lightroom:

*   **Export To:** Hard Drive (`~/Quantum_Workspace/02_MASTER/{slug}`)
*   **File Naming:** Custom Name - Sequence -> `{slug}-{view_type}-` + Sequence #
*   **File Settings:**
    *   **Image Format:** TIFF
    *   **Compression:** ZIP
    *   **Bit Depth:** 16 bits/component
    *   **Color Space:** sRGB (CRITICAL for web consistency)
*   **Image Sizing:**
    *   **Resize to Fit:** Long Edge
    *   **Pixels:** 4000 pixels
    *   **Resolution:** 72 pixels per inch
*   **Output Sharpening:** Screen / Standard
*   **Metadata:** All Metadata

### Preset: Quantum Sequence (For Animations)
Used for exporting frame sequences (e.g., 360 spins, exploded views).
*   **Export To:** Hard Drive (`~/Quantum_Workspace/R2_MASTER/{slug}/{animation-name}`)
*   **File Naming:** Filename - Sequence (Keep original camera filenames or simple numbering)
*   **File Settings:**
    *   **Image Format:** TIFF
    *   **Compression:** ZIP
    *   **Bit Depth:** 8 bits/component (16-bit is overkill for web frames)
    *   **Color Space:** sRGB
*   **Image Sizing:**
    *   **Resize to Fit:** Long Edge
    *   **Pixels:** 2000 pixels
    *   **Resolution:** 72 ppi
*   **Output Sharpening:** Screen / Standard

### Step 4: The Machine (Python)
Run the processing script to generate web-optimized assets.

```bash
# Process a specific project
python scripts/process_images.py xbox

# Process ALL projects (Batch)
python scripts/process_images.py --all
```

**What happens?**
1.  **Images:** Converts TIFFs to AVIF/WebP (Resized to breakpoints).
2.  **Animations:** Detects **subfolders** (e.g., `R2_MASTER/xbox/spin/`), stitches frames, and creates Animated WebP.
3.  **Pass-Through:** Copies non-image assets (`.pdf`, `.glb`, `.mp4`) directly to staging.

### Step 5: Sync & Deploy
The ingestion script will automatically detect the new assets in `R2_STAGING`.

```bash
python ingest_data.py
```

---

## 4. Technical Specifications
The Python script (`scripts/process_images.py`) implements the following standards:

*   **Formats:**
    *   **AVIF:** Primary format (High compression, HDR support). Quality: 80.
    *   **WebP:** Fallback format (Universal support). Quality: 85.
*   **Breakpoints (Widths):**
    *   `xl`: 1920px (Desktop / Hero)
    *   `lg`: 1280px (Laptop)
    *   `md`: 800px (Tablet / Half-width)
    *   `sm`: 500px (Mobile)
*   **Processing:**
    *   **Lanczos Resampling:** For sharpest downscaling.
    *   **Metadata:** Strip all EXIF/IPTC *except* Color Profile (sRGB).

---

## 5. Lightroom Power User Tips

### A. The "Sequence" Workflow (Animations)
Don't export GIFs! Use Lightroom to export high-quality frames.
1.  **Select** your burst of photos.
2.  **Develop** the first one.
3.  **Sync Settings** (Ctrl+Shift+S) to apply edits to ALL frames (Critical for consistency).
4.  **Match Total Exposures:** If you have flicker (timelapse/burst), go to `Settings > Match Total Exposures` (Ctrl+Alt+Shift+M).
5.  **Export** using the **"Quantum Sequence"** preset to a **Subfolder** inside the project master (e.g., `R2_MASTER/xbox/turn-anim/`).
    *   **Folder Naming:** Use `kebab-case` (e.g., `explode-view`, `ui-flow`). This folder name becomes the animation ID.

**Timing Configuration (The Suffix Rule):**
*   **Default:** 2000ms (0.5 fps) per frame.
*   **Custom:** Append `_{ms}ms` to the folder name.
    *   `base-click_testing` -> 2000ms (Default)
    *   `base-click_testing_500ms` -> 500ms
    *   `base-click_testing-100ms` -> 100ms

**Aspect Ratio (Letterboxing):**
*   **Problem:** If animation frames have different aspect ratios (e.g., hand-held burst), simple resizing causes "squishing".
*   **Solution:** The pipeline uses **Smart Letterboxing** (`ImageOps.pad`).
*   **Logic:** The **First Frame** sets the canvas size. Subsequent frames are resized to fit *within* that canvas, and black bars are added to fill the gaps. This preserves the original geometry of every frame.
*   **Orientation:** The script also respects **EXIF Orientation**, ensuring vertical photos don't get rotated or stretched sideways.

### B. Smart Collections (The Automated Inbox)
Stop manually hunting for files. Let the software work for you. Create this hierarchy:

1.  **`00_INBOX`** (Smart Collection)
    *   *Rules:* `Rating` is `0 stars` AND `Capture Time` is `this month`.
    *   *Action:* This is your triage center. Rate everything here.

2.  **`01_WORKING`** (Smart Collection)
    *   *Rules:* `Rating` is `1 star` OR `2 stars`.
    *   *Action:* These need edits.

3.  **`02_READY_TO_EXPORT`** (Smart Collection)
    *   *Rules:* `Rating` is `>= 3 stars` AND `Has Edits` is `True`.
    *   *Action:* These are done. Select All -> Export.

### C. Keyword-Driven Naming
Stop renaming files manually. Use Metadata.
1.  **Tagging:** Add keywords like `hero`, `detail`, `context` to your images in the Library module.
2.  **Export Preset:** In the "File Naming" section of your Export preset, use the `{Keywords}` token.
    *   *Template:* `{Filename}-{Keywords}-{Sequence}`
    *   *Result:* If you tag an image `hero`, it exports as `xbox-hero-01.tif`.

### D. The "Architectural" Look
For product and hardware shots, vertical lines must be vertical.
*   **Transform Panel:** Use "Auto" or "Vertical" Upright to fix perspective distortion.
*   **Lens Corrections:** Always enable "Remove Chromatic Aberration" and "Enable Profile Corrections".

### E. ISO Adaptive Presets
If you shoot in variable industrial lighting (dark server rooms vs. bright labs):
*   Create a preset that applies different Noise Reduction settings based on ISO.
*   *How:* Select two images (Low ISO, High ISO), edit them, select both, `Create Preset`, and check "ISO Adaptive".
