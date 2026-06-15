# Erik Norris

### Principal Mechanical Architect | Forensic Engineering | Digital Systems

**[eriknorris.com](https://eriknorris.com)**

> **"I built this sovereign infrastructure because I treat software intent with the exact same forensic rigor I apply to physical hardware."**

This repository is a headless, agentic data pipeline that compiles **digital exhaust into data stories**. It is a "living portfolio" engine that forensically titrates 30 years of engineering "Red Gold" (raw project data, CAD, PDFs) into a high-performance static identity.

Operating at the intersection of deep engineering legacy and modern software agility, I architect the hardware interface for the physical world.

---

### 🔧 The Stack

- **Engine:** Astro (Static Site Generation)
- **Content:** MDX + Zod schema (Astro Content Collections)
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
