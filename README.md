# Quantum
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
If you plan to process images locally:
1.  **Workspace:** Run `python scripts/setup_workspace.py` to create the `~/Quantum_Workspace` structure.
2.  **Libraries:** `pip install Pillow pillow-heif`
