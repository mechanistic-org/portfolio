---
title: "Video Asset Pipeline (SOP)"
slug: "workflow_video"
sidebar:
  group: "Workflows"
  order: 4
---
# Video Asset Pipeline (SOP)

**Objective:** "Broadcast Quality" assets for the engineering portfolio. High-bitrate 4K hosted on YouTube, embedded with a minimalist, "Zero-UI" aesthetic.

## 1. The Source (Master)
*   **Location:** `~/ErikNorris_Workspace/02_MASTER/{slug}/video/`
*   **Format:**
    *   **ProRes 422 HQ** (Preferred for archiving)
    *   **DNxHR HQX** (Alternative)
*   **Resolution:** 3840x2160 (4K UHD)
*   **Framerate:** 60fps (Smooth motion) or 24fps (Cinematic), depending on content.
*   **Naming:** `{slug}-master-{version}.mov`

## 2. The Export (YouTube Delivery)
Use the **"ErikNorris Tube"** Export Preset (Premiere/DaVinci):

*   **Codec:** H.265 (HEVC) - significantly better efficiency than H.264 at 4K.
*   **Resolution:** 3840x2160 (Always upload 4K to trigger VP9 codec on YouTube).
*   **Bitrate:**
    *   **VBR 2-Pass:** Target 45 Mbps, Max 60 Mbps.
    *   *Note:* YouTube recommends 35-45 Mbps for 4K/60. We aim slightly higher to survive transcoding.
*   **Audio:** AAC, 320 kbps, 48 kHz.
*   **Filename:** `{slug}-youtube-v{version}.mp4`

## 3. The Thumbnail (The Hook)
Do not let YouTube auto-select a frame.
*   **Specs:** 1280x720 (Minimum) or 1920x1080 (Preferred). Max 2MB.
*   **Format:** JPG
*   **Naming:** `{slug}-thumb.jpg`
*   **Style:** consistent with `hero.png` branding (High contrast, focal point).

## 4. The Embed (Zero-UI)
We use the `<YouTube />` component with specific parameters to strip away YouTube's "social junk" and maximize the "Datasheet" feel.

### Component Usage
```astro
import { YouTube } from '@astro-community/astro-embed-youtube';

<YouTube
  id="dQw4w9WgXcQ"
  class="w-full aspect-video rounded-xl border border-neutral-800 shadow-2xl"
  params="rel=0&modestbranding=1&controls=1"
  title="Project Demo"
/>
```

### Parameters Explained
*   `rel=0`: Shows related videos *from the same channel* (not random ones) at the end.
*   `modestbranding=1`: Removes the YouTube logo from the control bar.
*   `controls=1`: Basic player controls (Play/Pause/Volume).
*   `class`: Enforces the DLS aesthetic (Border, Rounded Corners, Shadow).

## 5. Workflow
1.  **Edit** locally.
2.  **Export** master and delivery versions.
3.  **Upload** to YouTube (Unlisted or Public).
4.  **Copy** the Video ID.
5.  **Write** the manual content in `data_source/manual_content/{slug}.md`.
6.  **Embed** using the component.

> [!TIP]
> **Why YouTube?**
> We violate the "Physical Asset Law" here for practical reasons. Hosting 4K video locally via R2 is expensive (Bandwidth) and technically complex (Adaptive Bitrate Streaming). YouTube solves both for free. We treat YouTube as our "Video CDN."
