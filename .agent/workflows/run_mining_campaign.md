---
description: The automated workflow for orchestrating a NotebookLM Mining Campaign via the MCP CLI.
---

# The NotebookLM "Mining Campaign" Protocol
This workflow automates the extraction of project data from a dedicated NotebookLM instance. By using the `notebooklm-mcp-cli` ("nlm"), we completely bypass the need for manual, copy-pasted "Chat Config Instructions" in the browser. 

**Pre-requisite:** The `nlm` CLI must be installed (`pip install notebooklm-mcp-cli`) and accessible at `C:\Users\erik\AppData\Roaming\Python\Python314\Scripts\nlm.exe` or globally in the PATH.

## Execution Trigger
To trigger this workflow, the USER will provide the name of the target Notebook.
Example: *"/run_mining_campaign on notebook 'C24 Control Surface Archive'"*

---

## 1. Establish NLM Connection
First, verify connection to the target notebook using the CLI.

// turbo
```powershell
C:\Users\erik\AppData\Roaming\Python\Python314\Scripts\nlm.exe query "Hello, are you ready to begin the forensic extraction?" --notebook "{NOTEBOOK_NAME}"
```

```powershell
# CRITICAL: Do NOT attempt to pass these massive multi-line prompts via PowerShell string variables. 
# PowerShell is notorious for tokenizing whitespace and hyphens as CLI flags (e.g. `No such option: ->`), causing Exit 1 errors.
# Instead, instruct the Agent to dynamically generate and execute this pure Python orchestration script:

Write-Host "Instruct the Agent to create and run `run_campaign.py` containing the following subprocess logic:"
```

```python
import sys
import subprocess

uid = "{NOTEBOOK_ID}"
cli = r"C:\Users\erik\AppData\Roaming\Python\Python314\Scripts\nlm.exe"

def run_query(prompt_text, output_file):
    print(f"Executing query for {output_file}...")
    result = subprocess.run([cli, "query", "notebook", uid, prompt_text], capture_output=True, text=True, encoding="utf-8")
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(result.stdout)
    if result.stderr:
        print(f"Warnings/Errors for {output_file}:\n{result.stderr}")

# 1. BOLUS
with open(r"public\assets\prompts\BOLUS_NLM-INPUT.txt", "r", encoding="utf-8") as f:
    run_query(f.read(), r"src\content\_raw_nlm\{PROJECT_SLUG}_bolus.json")

# 2. REPORT
with open(r"public\assets\prompts\REPORT_NLM-INPUT.txt", "r", encoding="utf-8") as f:
    run_query(f.read(), r"src\content\_raw_nlm\{PROJECT_SLUG}_report.md")

# 3. VIGNETTES
with open(r"public\assets\prompts\VIGNETTES_NLM-INPUT.txt", "r", encoding="utf-8") as f:
    run_query(f.read(), r"src\content\_raw_nlm\{PROJECT_SLUG}_vignettes.md")

# 4. TEAM
with open(r"public\assets\prompts\TEAM_NLM-INPUT.txt", "r", encoding="utf-8") as f:
    run_query(f.read(), r"src\content\_raw_nlm\{PROJECT_SLUG}_team.md")

# 5. BOM
with open(r"public\assets\prompts\BOM_NLM-INPUT.txt", "r", encoding="utf-8") as f:
    run_query(f.read(), r"src\content\_raw_nlm\{PROJECT_SLUG}_parts.md")

# 6. TIMELINE
with open(r"public\assets\prompts\TIMELINE_NLM-INPUT.txt", "r", encoding="utf-8") as f:
    run_query(f.read(), r"src\content\_raw_nlm\{PROJECT_SLUG}_development_timeline.md")
```

*The Python script will safely deposit the 6 massive JSON/MD payloads directly into `src/content/_raw_nlm/`.*

## 5. Context Smell Integration (Manual / Ad-Hoc)
This is an intentional pause in the automated pipeline. As the data is extracted, the "context smell" may trigger memories or specific angles you want to explore deeper. 
1. The Agent will pause and notify you.
2. You may manually use the NotebookLM UI (or ask the agent to run targeted nlm CLI queries) to dig into those specific threads.
3. Paste or save these ad-hoc "Discrete Reports" into `src/content/_raw_nlm/{PROJECT_SLUG}_adhoc.md`.

## 6. Generate the PODCAST (Stealth Protocol V3)
Trigger the audio generation using the phonetic keys and 'The Tribunal' persona from `D:\GitHub\eriknorris\public\assets\prompts\PODCAST_NLM-INPUT.txt`.

```python
# Append this to the run_campaign.py script, or run it separately.
print("Triggering PODCAST_NLM-INPUT Audio Generation...")
with open(r"public\assets\prompts\PODCAST_NLM-INPUT.txt", "r", encoding="utf-8") as f:
    podcast_prompt = f.read()

# Crucial: Use --length short and pass the exact prompt via --focus
audio_cmd = [
    cli, "audio", "create", uid, 
    "--length", "short", 
    "--focus", podcast_prompt, 
    "-y"
]
audio_result = subprocess.run(audio_cmd, capture_output=True, text=True, encoding="utf-8")
print(f"Audio Task Initiated:\n{audio_result.stdout}")
if audio_result.stderr:
    print(f"Audio Task Warnings/Errors:\n{audio_result.stderr}")
```

*Note: The CLI will initiate the background compilation and return an Artifact ID. Wait for completion via `nlm studio status` and then download the final asset into your local Sovereign Asset Bucket folder at: `D:\GitHub\eriknorris-assets\R2_STAGING\{PROJECT_SLUG}\`.*

---

## 7. Handoff to Hydration
Once the 5 raw payloads (Bolus, Report, Vignettes, Ad-Hoc, and Audio) are successfully written to disk, the Mining Campaign is complete. The Agent should immediately transition to the `/hydrate_project` workflow to convert these raw files into the final Component-Driven MDX Schema.
