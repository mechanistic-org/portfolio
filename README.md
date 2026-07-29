# Erik Norris

### Principal Mechanical Architect | Forensic Engineering | Digital Systems

**[eriknorris.com](https://eriknorris.com)**

Thirty years of shipped hardware across SGI, Frog Design, WebTV/Microsoft, Digidesign/Avid, Kaleidescape, Avegant, Noon and Hyphen — workstations, pro-audio consoles, set-top boxes, a head-mounted display, and a cobotic food-assembly platform.

This repository builds the record of it. Every published claim traces to an artifact: an ECO number, a drawing revision, an inspection report with a measurement on it. Where it does not, the page says so and downgrades the claim.

The pipeline below is the instrument that recovered that evidence from thirty years of paper and drives. It is not the product. Start with [the C|24 teardown](https://eriknorris.com/projects/c24/).

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

1.  **Immutable locker.** Raw evidence is extracted into a content-hashed archive of 152 program vaults. Nothing edits it; everything downstream cites it.
2.  **Canon is the source of truth.** One curated Markdown record per project, in its own git repo, each naming the locker directory its claims trace to. Not the website, not the résumé.
3.  **Single writer, proven every run.** `scripts/project_pipeline.py` projects canon into site content and verifies it: a field-by-field diff canon → site → canon plus a double-generate hash check. Non-lossless or non-idempotent exits non-zero. **Site content is a read-only render target** — no hand-editing published pages.
4.  **Publish gate.** `npm run build` refuses to ship machine placeholders, leaked markup, demo assets posing as evidence, or an unsourced deep dive. Incompleteness is reported as a burn-down rather than concealed.
5.  **Asset sovereignty.** Images and 3D models live in Cloudflare R2 (`assets.eriknorris.com`), never in Git.
6.  **Zero runtime.** Pre-compiled to static HTML. `output: "static"` is guarded at agent-time and build-time.

> Superseded 2026-07: an earlier NotebookLM → `_intelligence.md` bolus → hydration flow. `hydrate_content.py` was deleted for destructively rewriting curated frontmatter; NotebookLM is now one input among several, not the system of record.

### 🚀 Quick Start (Local Dev)

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

---

_Built with [Cosmic Themes](https://github.com/Cosmic-Themes) & Custom Engineering._
