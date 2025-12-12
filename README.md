
# Quantum
> ⚠️ **CRITICAL:** Before modifying build settings or assets, read [**docs/ARCHITECTURE.md**](docs/ARCHITECTURE.md).
> This project uses a specific "Zero-Bloat" strategy to survive Cloudflare limits.

**Erik Norris High-Performance Engineering Portfolio**

A technical portfolio site built to function as a datasheet. It combines high-performance web technologies with a data-driven content pipeline to showcase mechanical engineering work.

## 🚀 Quick Start

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run Development Server:**
    ```bash
    npm run dev
    ```

3.  **Sync Assets (Upload to R2):**
    ```bash
    npm run sync:assets
    ```

3.  **Ingest Data (Regenerate Content):**
    ```bash
    python ingest_data.py
    ```

> **Performance Tip:** The site uses a "Living Grid" background. If performance is an issue on older devices, you can tweak `starCount` or `gridWidth` in `src/components/Interaction/FiberGrid.astro`.
> **Pro Tip:** Use the **Component Laboratory** at `http://localhost:4321/component-lab` to test component rendering or visit `/about/elements` for the snippet reference guide.

If you plan to process images locally:
1.  **Workspace:** Run `python scripts/setup_workspace.py` to create the `~/Quantum_Workspace` structure.
2.  **Libraries:** `pip install Pillow pillow-heif`

## 🔧 Setup (Ingestion Engine)
To use the automated content generator:
1.  Obtain a Google Gemini API Key.
2.  `pip install google-generativeai`
3.  Set environment variable: `GEMINI_API_KEY`.
