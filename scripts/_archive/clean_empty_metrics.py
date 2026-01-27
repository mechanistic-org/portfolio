import os
import re
import yaml
from pathlib import Path

CONTENT_DIR = Path("src/content/projects")

def clean_file(file_path):
    # Debug specific file
    is_target = "odie" in str(file_path) or "morpheus" in str(file_path) or "mars-k" in str(file_path) or "ocean" in str(file_path)
    
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Parse Frontmatter
    match = re.search(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not match:
        if is_target: print(f"[{file_path}] No frontmatter found.")
        return

    fm_text = match.group(1)
    try:
        data = yaml.safe_load(fm_text)
    except Exception as e:
        print(f"[{file_path}] Error parsing YAML: {e}")
        return

    if "metrics" not in data or not data["metrics"]:
        if is_target: print(f"[{file_path}] No metrics block or empty.")
        return

    metrics = data["metrics"]
    modified = False

    if is_target:
        print(f"[{file_path}] Inspecting metrics: {metrics.keys()}")

    # 1. Remove empty objects (cogs, profitability, interventions, time_to_market)
    keys_in_metrics = list(metrics.keys())
    for k in keys_in_metrics:
        val = metrics[k]
        if isinstance(val, dict) and not val:
             print(f"[{file_path}] Removing empty metrics.{k}")
             del metrics[k]
             modified = True
        elif isinstance(val, dict) and k in ["cogs", "profitability", "interventions", "time_to_market"]:
             # Check for "effectively empty" or missing required keys
             # If it has keys but they are not the required ones, we might need to remove it or fix it.
             # For now, just logging if we see them not empty.
             if is_target: print(f"[{file_path}] metrics.{k} is present and not empty: {val}")

    # 2. Fix Governance
    if "governance" in metrics:
        gov = metrics["governance"]
        if "dcos" not in gov:
            print(f"[{file_path}] Adding dcos: 0 to governance")
            gov["dcos"] = 0
            modified = True

    # 3. Validation Fixes not caught by empty check
    if "interventions" in metrics:
        inter = metrics["interventions"]
        if "count" not in inter:
             print(f"[{file_path}] Adding count: 0 to interventions")
             inter["count"] = 0
             modified = True
        if "label" not in inter:
             print(f"[{file_path}] Adding label: 'Interventions' to interventions")
             inter["label"] = "Interventions"
             modified = True

    if modified:
        new_fm = yaml.dump(data, sort_keys=False, allow_unicode=True)
        new_content = f"---\n{new_fm}---\n" + content[match.end():].lstrip("\n")
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"[{file_path}] Fixed.")
    elif is_target:
        print(f"[{file_path}] No changes needed.")

def main():
    print(f"Scanning {CONTENT_DIR}...")
    count = 0
    for root, dirs, files in os.walk(CONTENT_DIR):
        for file in files:
            if file.endswith(".mdx") or file.endswith(".md"):
                clean_file(Path(root) / file)
                count += 1
    print(f"Scanned {count} files.")

if __name__ == "__main__":
    main()
