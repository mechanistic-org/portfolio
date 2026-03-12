---
name: "Project Hydration Pipeline"
about: "Execute the Ready State and Deep Dive vectors for a project."
labels: ["hydration", "ready-state"]
---

### 🚰 Phase I: The Metal & The Model (NotebookLM MCP)

**Objective:** Extract the "Red Gold" via NotebookLM and inject via Python.

- [ ] **Data Ingest:** Feed raw project files into NotebookLM.
- [ ] **Extraction [MCP Target]:** Use NotebookLM to run `deep_research_prompt_v1.txt`. _(Future: NotebookLM MCP CLI automatically executes this step)._
- [ ] **Hydration:** Run `python scripts/hydrate_content.py --slug {SLUG} --force` to inject Narrative, Complexity, and Entropy strings.
- [ ] **Validation:** Verify HUD renders cleanly locally without Zod Schema errors.

### 🤿 Phase II: Deep Dive Vectors (Sequential Thinking)

**Objective:** Map the physical constraints and telemetry. _(Agent Note: Use Sequential Thinking MCP to validate each constraint logically before proceeding)._

- [ ] **Physical BOM:** Sourced and mapped into frontmatter schema.
- [ ] **Cast (Team Topology):** Key players mapped (`org` field mandatory).
- [ ] **Timeline (Executive Schedule):** Key dates and milestones mapped.
- [ ] **Vector 1 (Specific Failure):** Populated.
- [ ] **Vector 2 (Market Silence):** Populated.
- [ ] **Vector 3 (Price/Value Friction):** Populated.
- [ ] **Vector 4 (Legacy Impact):** Populated.
- [ ] **Vector 5 (Trophy Case):** Awards & IP populated.

### 🧠 Phase III: The 8-Core Compounding Cascade (Agent Swarm)

**Objective:** Subject the hydrated data to the 8-Persona C-Suite Audit (`vault_s_synthesis_v29.json` protocol).

- [ ] **CTO Audit:** Physics-First validation gate.
- [ ] **CBDO Audit:** Defensible Data Moat valuation.
- [ ] **CFO Audit:** Execution Insurance / Capital Preservation framing.
- [ ] **Physicist Audit:** Mutual Invalidation Loop check (Thermodynamics/Kinematics).
- [ ] **COO Audit:** Global yield and CM Backfill Spec check.
- [ ] **Legal Audit:** IP assignment and Liability Cap validation.
- [ ] **Architect Audit (The Mentor):** Strategic ECU alignment.
- [ ] **HCI Audit:** Dashboard psychology and telemetry focus.

### 💾 Phase IV: The Sovereign Save

- [ ] Run `npm run content:hydrate -- --reverse-json` to backport the Gold to `notebook_dumps/`.
- [ ] Add `{SLUG}` to `tags` array to wire it into the `ResVizSwarm` visualization.
- [ ] Generate Audio ("Voice of God") and link `audio_url`.
