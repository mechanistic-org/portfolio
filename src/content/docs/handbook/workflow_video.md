---
title: "Video Asset Pipeline (SOP)"
description: "Native video players and reproducible photographic sequences."
slug: "workflow_video"
sidebar:
  group: "Workflows"
---

# Video asset pipeline

Short engineering clips and photographic sequences use H.264 MP4 derivatives with
native controls. The shared player supports optional `poster` (an image URL) and
`loop` (a boolean). Playback starts on demand; neither option enables autoplay.
Existing clips without these options retain their current behavior.

In authored canon gallery items:

```json
{"kind":"video","src":"https://assets.eriknorris.com/project/clip.mp4","poster":"https://assets.eriknorris.com/project/cover.jpg","loop":true,"alt":"Description of the clip","caption":"What the clip shows."}
```

An image group with `mode: "sequence"` can additionally set `data.sequenceVideo`
to the same video object. The shared reader shows the video above an **Inspect
photographs** disclosure, preserving the photographs, captions, comparison and
full-size inspection. The video is a derivative, not a replacement for sources.
Posters use the same public asset URL restrictions as photographs. Timings in a
photo sequence describe presentation holds, not elapsed manufacturing time.

## Export a photographic sequence

The Darkroom entry point is `global_agent/scripts/process_assets.py`.
Its opt-in `--sequence-manifest INPUT.json --output-dir OUTPUT` mode generates:

- `NAME.mp4`: silent H.264, yuv420p, faststart, CRF20.
- `NAME-poster.jpg`: independently selected cover image.
- `NAME.manifest.json`: resolved source identities/hashes, timings, encoding and output checksums. Keep this provenance file private; it contains local source paths.

Input example (paths are relative to the input manifest):

```json
{
  "schema_version": 1,
  "output_stem": "assembly",
  "width": 1620,
  "fps": 30,
  "default_duration_seconds": 2,
  "poster": "photos/cover.jpg",
  "frames": [
    {"source": "photos/first.jpg"},
    {"source": "photos/last.jpg", "duration_seconds": 3}
  ]
}
```

Array order is authoritative. Durations must be positive and align to whole video
frames. The canvas uses the first photograph's oriented aspect ratio; other
shapes fit inside it with black padding, without cropping. Existing output names
are refused; use a fresh output directory for a revised export. No upload occurs.

The older sequence-folder mode remains animated WebP: 2000 ms per photograph,
overridden by a folder suffix such as `_750ms`, filename-sorted frames, four
responsive widths, infinite looping. MP4 export is explicit and does not silently
change existing WebP assets.

Keep masters and derivatives outside Git. Review the local candidate before any
asset upload or site publication. YouTube remains an editorial option for longer
standalone videos; it does not change this native player contract.
