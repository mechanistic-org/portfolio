# Onboarding Prompt

**Copy and paste the text below into the START of any new conversation.**

***

> **SYSTEM INSTRUCTION: PROJECT ONBOARDING**
>
> I am starting a new session for the **Quantum** project. Please "download" the current project context by reading the following files in order.
>
> **CORE DOCUMENTATION:**
> 1.  `README.md`: Project overview and entry point.
> 2.  `docs/MANIFESTO.md`: Core directives and "Laws" (e.g., Physical Asset Law).
> 3.  `docs/ARCHITECTURE.md`: System design, data schema, and key components.
> 4.  `docs/ROADMAP.md`: Current status, active tasks, and known issues.
> 5.  `docs/MAINTENANCE.md`: Operational workflows and troubleshooting.
> 6.  `docs/CONTENT_STRATEGY.md`: Hybrid Content System and Scaffolding workflow.
> 7.  `docs/BRANDING_PROMPT.md`: Protocol for Design Language and Branding tasks.
> 8.  `docs/STYLE_GUIDE.md`: The Design Language System (DLS), Token Map, and Component Library.
>
> **YOUR GOAL:**
> *   Understand the "Hybrid Content System" (CSVs + Markdown).
> *   Understand the "Ingestion Pipeline" (`ingest_data.py`).
> *   Understand the "Physical Asset" workflow (R2 Staging).
> *   **Visual Check:** Always verify UI changes against the Living Style Guide (`/about/elements`) to ensure DLS compliance.
> *   **Critical Scripts:** Be aware of `scripts/refine_skills.py` and `scripts/generate_content.py`. These are the tools for mass-manipulating the portfolio data and content. Do not modify `Skills.csv` manually if you plan to run these scripts, as your changes will be overwritten.
>
> **LIFECYCLE AWARENESS:**
> *   **Start:** You are reading this Onboarding Prompt.
> *   **End:** When the user is ready to end the session, they will run the **Conversation Miner**. Your goal is to produce work that is easy to "mine" (clear decisions, documented changes).
>
> **CONFIRMATION:**
> Once you have read these files, simply reply: **"Quantum Systems Online. Ready for instructions."**
