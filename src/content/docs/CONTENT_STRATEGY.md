---
title: "Content Strategy & Workflow"
slug: "content_strategy"
---
# Content Strategy & Workflow

## The Hybrid Content System
Quantum uses a **Hybrid Architecture** to manage project data. This approach combines the structured efficiency of CSVs with the expressive power of Markdown.

### 1. Structured Data (CSV)
*   **Source:** `data_source/Main.csv`, `Expertise.csv`, etc.
*   **Purpose:** Metadata, metrics, tags, dates, and relationships.
*   **Why:** Easy to bulk edit, sort, and analyze. Perfect for the "Datasheet" aspect of the site.

### 2. Narrative Content (Markdown)
*   **Source:** `data_source/manual_content/{slug}.md`
*   **Purpose:** Detailed case studies, storytelling, code blocks, and rich media.
*   **Why:** Writing long-form content in CSV cells is painful and error-prone. Markdown offers a superior authoring experience.

---

## Workflow: Creating a New Case Study

We have streamlined the process of moving from a "Placeholder" to a "Case Study" using the Scaffolding tool.

### Step 1: Scaffold
Run the ingestion script with the `--scaffold` flag. This checks `Main.csv` for all projects and automatically creates a template markdown file for any project that doesn't have one.

```bash
python ingest_data.py --scaffold
```

### Step 2: Write
Navigate to `data_source/manual_content/` and open the newly created file (e.g., `xbox.md`). You will see a standard template:

*   **The Challenge:** Define the problem.
*   **Engineering Approach:** Explain the solution.
*   **Impact:** Quantify the results.

### Step 3: Ingest
Run the standard ingestion command to build the site with your new content.

```bash
python ingest_data.py
```

### Step 4: Verify
Check the local development server (`npm run dev`) to see your changes live.

---

## Best Practices
*   **Images:** Place images in `R2_STAGING/{slug}/`. They will be auto-detected.
*   **Models:** Place `.glb` files in `R2_STAGING/{slug}/`.
*   **Components:** You can import and use Astro components (like `<YouTube />` or `<ModelViewer />`) directly in the markdown.

### Special Characters
*   **Less-Than Signs:** MDX treats `<` as the start of a component. If you write `<0.5%` or `<3`, it may crash the build. Always escape it as `&lt;` (e.g., `&lt;0.5%`).

## Manual Content Overrides

### 3. Special Components
*   **3D Models:**
    *   **Standard:** Use `{{MODEL_URL}}` placeholder.
    *   **Custom Layout:** You **MUST** wrap the placeholder in the component: `<ModelViewer src="{{MODEL_URL}}" alt="Project Asset" />`.
    *   **Fallback:** Omit the `src` attribute to display the "Neil Armstrong" placeholder: `<ModelViewer alt="Placeholder" />`.


