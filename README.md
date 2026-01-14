# Erik Norris

### Mechanical Engineer | Forensic Architect | Tool Builder

**[eriknorris.com](https://eriknorris.com)**

This repository is the operating system for my professional identity. It is a "living portfolio" engine that ingests raw project data (CSV, JSON, CAD) and compiles it into a high-performance static website.

---

### 🔧 The Stack

- **Engine:** Astro (Static Site Generation)
- **CMS:** Keystatic (Local Admin)
- **Language:** TypeScript (Core), Python (Automation)
- **Deployment:** Cloudflare Pages (Edge Network)
- **Asset Storage:** Cloudflare R2 (Object Storage)
- **Styling:** TailwindCSS + Custom UI Library

### 🏗️ Architecture

This project follows the **"Law of Asset Sovereignty"**:

1.  **Intelligence First:** Content is mined from unstructured data (PDFs, Engineering Notebooks) using **NotebookLM**, then crystallized into Markdown Boluses (`_intelligence.md`).
2.  **ETL Pipeline:** We run a sophisticated Extraction, Transformation, and Load pipeline: `Raw PDF` -> `NotebookLM Bolus` -> `Dynamic Astro Collection` -> `Static HTML`.
3.  **Air Gapped:** Assets (images, 3D models) are stored separately in an R2 bucket (`assets.eriknorris.com`), never checked into Git.
4.  **Agentic Layer:** The `.agent` directory contains autonomous skills (`/scaffold-project`, `/deploy-production`) that manage the codebase.
5.  **Zero Runtime:** The site is pre-compiled into static HTML for maximum speed and security.

### 🚀 Quick Start (Local Dev)

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

---

_Built with [Cosmic Themes](https://github.com/Cosmic-Themes) & Custom Engineering._
