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
    ```

    > **Note:** For local development with heavy assets, it is recommended to have the `quantum-assets` repository checked out as a sibling directory: `../quantum-assets/R2_STAGING`.

## 📚 Documentation

*   **[Manifesto](docs/MANIFESTO.md):** Core directives, philosophy, and the "Physical Asset Law".
*   **[Architecture](docs/ARCHITECTURE.md):** Data schema, ingestion pipeline, and component breakdown.
*   **[Roadmap](docs/ROADMAP.md):** Current status, active work, and backlog.
*   **[User Manual](docs/MAINTENANCE.md):** Instructions for content updates and maintenance.
*   **[Context Tools](docs/ONBOARDING_PROMPT.md):** Prompts for AI session onboarding and mining.
*   **[Branding Protocol](docs/BRANDING_PROMPT.md):** System instruction for establishing the Design Language System.

## 🛠️ Tech Stack

*   **Framework:** [Astro v5](https://astro.build)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com)
*   **Interactivity:** Vanilla JS (3D & UI)
*   **Data Processing:** Python (Pandas, Matplotlib)
*   **Visualization:** Static SVGs (Zero-Runtime)
*   **Asset Hosting:** Cloudflare R2

## 🌟 Features
*   **Technical Spec Sheet:** Detailed project modal with split-view layout and keyboard navigation.
*   **Debug Mode:** Global wireframe toggle for UI inspection (accessible via footer).
*   **Project Directory:** Interactive table with spotlight hover effects and deep linking.
*   **Trust Wall:** Client grid with automated logo discovery.
*   **Hardware Dashboard:** Real-time metrics visualization (Plastic/Metal/PCB).

## 📂 Project Structure

```text
/
├── data_source/       # Raw CSVs and Manual Markdown Content
├── docs/              # Project Documentation
├── public/            # Static Assets
├── src/
├── src/
│   ├── components/    # Astro & React Components
│   ├── content/       # Generated MDX Files (DO NOT EDIT MANUALLY)
│   ├── pages/         # Astro Routes
│   └── styles/        # Global Styles
├── ingest_data.py     # Data Ingestion Script
└── README.md          # You are here
```
