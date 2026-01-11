---
title: "Maintenance & Troubleshooting"
slug: "maintenance"
sidebar:
  group: "Workflows"
  order: 99
---

# System Maintenance & Troubleshooting

This document serves as the first line of defense for system issues, build failures, and pipeline errors.

## Asset Pipeline

### DXF Rendering Issues

- **Symptom:** `ModuleNotFoundError: No module named 'ezdxf'` or `matplotlib`.
- **Context:** The DXF pipeline ("The Sidecar") introduces heavy Python dependencies that are not part of the standard `requirements.txt` core set to keep the main build light.
- **Fix:**

  ```bash
  pip install -r scripts/requirements.txt
  ```

  _Note: We recently added `ezdxf` and `matplotlib` to `requirements.txt` (Jan 2026), so ensure your local environment is synced._

- **Symptom:** `[ERROR] Rendering failed: ...`
- **Fix:**
  1.  Verify the input file is a valid DXF (Try opening in a viewer like Autodesk TrueView or ODA Viewer).
  2.  Check for "Text Style" missing fonts (matplotlib backend may fallback to default font, which is non-fatal but looks different).
  3.  Run the sidecar in standalone mode to isolate the error:
      ```bash
      python scripts/lib/dxf_renderer.py "path/to/dxf/file.dxf"
      ```

### MDX Errors (Astro Content Layer)

- **Symptom:** `MDXError: Unexpected character 0` (or 1-9) preventing dev server startup.
- **Cause:** The MDX parser interprets unquoted keys starting with numbers (e.g., `01_intro:`) as octal or invalid identifiers. It also flags `<` symbols followed by numbers in body text (e.g., `<0.5mm`) as invalid JSX tags.
- **Fix:**
  1.  **Frontmatter:** Quote ALL keys/values starting with a number: `01_intro` -> `"01_intro"`.
  2.  **Body Text:** Escape `<` if followed by a number: `<0.5mm` -> `&lt;0.5mm` or backtick `` `<0.5mm` ``.

### IDE Tooling Errors ("Stream Error")

- **Symptom:** "Error generating commit message: ... stream error" or "404 models/gemini-1.5-flash not found".
- **Cause:**
  1. **Global IDE Outage:** The Antigravity IDE has a known bug with the native "Generate" button failing to stream responses (Jan 2026).
  2. **Billing Mismatch:** "Google One Ultra" (Consumer) does NOT cover API usage. You must have a credit card on the specific Google Cloud Project for the API Key.
- **Fix:**
  1.  **Run Diagnostic:** `python scripts/test_gemini_key.py`.
  2.  **If Script Works:** The API Key is fine. The IDE is broken. **Use Manual Commits.**
  3.  **If Script Fails (429):** Add billing to Google Cloud Console for the project.
