# Erik Norris

### Mechanical Engineer | Product Architect | Tool Builder

**[eriknorris.com](https://eriknorris.com)**

This repository is the operating system for my professional identity. It is a "living portfolio" engine that ingests raw project data (CSV, JSON, CAD) and compiles it into a high-performance static website.

---

### 🔧 The Stack

- **Engine:** Astro (Static Site Generation)
- **CMS:** Keystatic (Local Markdown Management)
- **Language:** TypeScript (Core), Python (Legacy Ingestion)
- **Deployment:** Cloudflare Pages (Edge Network)
- **Asset Storage:** Cloudflare R2 (Object Storage)
- **Styling:** TailwindCSS + Custom "Sci-Fi" UI Library

### 🏗️ Architecture

This project follows the **"Law of Asset Sovereignty"**:

1.  **Data First:** Content is derived from structured data (`specs.csv`, `bom.csv`), not written as prose.
2.  **Air Gapped:** Assets (images, 3D models) are stored separately in an R2 bucket (`assets.eriknorris.com`), never checked into Git.
3.  **Zero Runtime:** The site is pre-compiled into static HTML for maximum speed and security.

### 🚀 Quick Start (Local Dev)

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

---

_Built with [Cosmic Themes](https://github.com/Cosmic-Themes) & Custom Engineering._
