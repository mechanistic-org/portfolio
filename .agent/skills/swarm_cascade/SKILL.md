---
name: swarm_cascade
description: Deploys the automated, parameter-driven LLM Swarm to perform a sequential, compounding forensic audit of a GitHub Issue.
---

# 🐝 The Swarm Cascade Protocol

This skill replaces manual execution of the "Virtual C-Suite" by orchestrating an automated Python execution script that runs the heavy multi-agent LLM cascade using `asyncio` and `gemini-2.5-flash`.

## 🎯 When to Use (Triggers & Intent)

**Keywords:** "run the swarm", "trigger the cascade", "mechanistic swarm", "portfolio swarm"
**Intent Patterns:** When the user explicitly asks to run a forensic cascade, an executive audit, or a swarm against a specific GitHub Issue.

## ⚙️ The Process

1. **Acknowledge:** Confirm to the user that you are initiating the Swarm Cascade.
2. **Determine Parameters:** Ensure you know the target **Swarm Configuration** and either the **Issue Number** or a **Local Path**. Available configurations are defined as JSON files in `.agent/swarms/`:
    * `mechanistic` (Deep tech, hardware vs software, capital ROI. The 8-Core C-Suite)
    * `portfolio` (eriknorris.com project UI, Narrative, SEO)
    * `oss` (Open-Source code quality, security, performance)
    * *Fallback:* Default to `mechanistic` for tech/hardware, `portfolio` for the website, or `oss` for generic code.
3. **Execute:** Run the Python engine via your terminal tool using the determined parameters. 

**CLI Command Format (GitHub Target):**
```bash
python scripts/trigger_cascade_swarm.py --issue <ISSUE_NUMBER> --swarm <SWARM_NAME> --repo <DEFAULT: eriknorris/eriknorris>
```

**CLI Command Format (Local Target):**
```bash
python scripts/trigger_cascade_swarm.py --local-path <ABSOLUTE_OR_RELATIVE_PATH> --swarm <SWARM_NAME>
```

4. **Report Back:** Wait for the execution script to complete successfully. If operating on an issue, it will post to GitHub. If operating on a local path, it will save `swarm_output.md` in that directory. *Do not output the entire summary text inside the chat window!*

## 🛡️ Guardrails
- **DO NOT** attempt to run the 8 personas manually or hallucinate their outputs in the chat window. Your only job is to recognize the user's intent and execute the Python script as the Orchestrator. 
- **DO NOT** deploy the `browser_subagent`.
- **Sovereign Execution:** The script runs entirely locally on the host machine using the `.env` Gemini API credentials and the cached MCP GitHub PAT. Your API limits are preserved.
