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

3.  **Ingest Data (Regenerate Content):**
    ```bash
    python ingest_data.py
    ```

## 📚 Documentation

*   **[Manifesto](docs/MANIFESTO.md):** Core directives, philosophy, and the "Physical Asset Law".
*   **[Architecture](docs/ARCHITECTURE.md):** Data schema, ingestion pipeline, and component breakdown.
*   **[Roadmap](docs/ROADMAP.md):** Current status, active work, and backlog.
*   **[User Manual](docs/MAINTENANCE.md):** Instructions for content updates and maintenance.

## 🛠️ Tech Stack

*   **Framework:** [Astro v5](https://astro.build)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com)
*   **Interactivity:** React (Recharts), Vanilla JS
*   **Data Processing:** Python (Pandas)
*   **Asset Hosting:** Cloudflare R2

## 📂 Project Structure

```text
/
├── data_source/       # Raw CSVs and Manual Markdown Content
├── docs/              # Project Documentation
├── public/            # Static Assets
├── src/
│   ├── components/    # Astro & React Components
│   ├── content/       # Generated MDX Files (DO NOT EDIT MANUALLY)
│   ├── pages/         # Astro Routes
│   └── styles/        # Global Styles
├── ingest_data.py     # Data Ingestion Script
└── README.md          # You are here
```
