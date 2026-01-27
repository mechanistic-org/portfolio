---
title: 'Strategy: Visual Log Integration'
slug: visual_log_strategy
sidebar:
  group: Backlog
description: 'Documentation for Strategy: Visual Log Integration.'
---
# Visual Log Integration Strategy

**Status:** Paused (Dec 2025)
**Intent:** Integrate the 128 mined screenshots (`data_source/mined_assets`) into the core documentation system.

## The Challenge: "Blind Curator"
The assets were mined programmatically. Integrating them requires manual filtering ("Culling") to remove duplicates or irrelevant steps.

## Proposed Stucture
To avoid bloating the main `WORKFLOW_3D.md` ("Core Tunnel"), we proposed splitting the documentation into "Deep Dives":

1.  **Core Tunnel:** `WORKFLOW_3D.md` (High-level SOP).
2.  **Deep Dives:**
    *   `deep-dives/MATTE_CARBON_DEBUGGING.md`: For session `ed0788e5` (Debug logs + Images).
    *   `deep-dives/ANISOTROPY_GUIDE.md`: For session `933c1250`.
    *   `deep-dives/EXPORT_SPECS.md`: For session `d0e908d8`.

## Visual Layouts
Use specific layouts to enhance readability:

### 1. Zigzag (Narrative Steps)
For clear sequences:
```html
<img src="..." class="!float-right !ml-6 !mb-4 !w-2/5 rounded-lg shadow-lg" />
<img src="..." class="!float-left !mr-6 !mb-4 !w-2/5 rounded-lg shadow-lg" />
```

### 2. Masonry Grid (Bulk)
For archival dumps:
```html
<div class="grid grid-cols-2 md:grid-cols-3 gap-4 not-content">
  <!-- Images -->
</div>
```

## Next Steps
1.  Create the Deep Dive files.
2.  Inject images using `scripts/generate_gallery.py` mapping logic.
3.  Perform the **Visual Cull** (Delete key).
