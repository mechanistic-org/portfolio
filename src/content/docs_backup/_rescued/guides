# Feeding the Assembly (NotebookLM Ingestion Protocol)

**Purpose:** This guide explains how to inject high-density "Intelligence Boluses" from NotebookLM into the **Career Assembly** (`/assembly`) visualization.

## The Theory

The **Neural Assembly** is a dynamic visualization (D3/React) that constructs a physics-based graph of your career.

- **Nodes (Bodies):** Projects (derived from `src/content/projects/**/*.mdx`).
- **Links (Fasteners):** Skills (derived from `tools` and `tags`).
- **Payload (The Brain):** Deep forensic narratives (The "Bolus") extracted via NotebookLM.

## The Workflow

### 1. Extract (NotebookLM)

1.  Open your **NotebookLM** source for the project.
2.  Run the **Universal Extraction Prompt**:
    - Source: [`src/content/docs/prompts/UNIVERSAL_NOTEBOOK_PROMPT.md`](../prompts/UNIVERSAL_NOTEBOOK_PROMPT.md)
3.  Copy the generated Markdown output.

### 2. Ingest (The File System)

The Assembly scanner (`mapCareerAssembly.ts`) looks for a specific "magic file" inside any project folder.

1.  Navigate to the project directory:
    - `src/content/projects/[project_slug]/`
2.  Create a new file named:
    - `_intelligence.md`
    - _(Note: The underscore is critical. It marks the file as "partial" so Astro doesn't try to render it as a standalone page.)_
3.  Paste the raw Markdown content into `_intelligence.md`.
4.  Save.

### 3. Verification

1.  Visit the **Assembly** page: `http://localhost:4321/assembly`
2.  Find the project node.
3.  Click/Hover (depending on current interaction mode) to verify the "Intelligence" payload is attached.
    - _Note: If the node glows or has a special halo, the injection was successful._

## Troubleshooting

- **Node not showing?** Ensure the project is not `draft: true` in its main `.mdx` file.
- **Intelligence not found?**
  - Check the filename: Must be exactly `_intelligence.md`.
  - Check the location: Must be in the same folder as the project's `index.mdx`.
