import os
import re
import yaml
from pathlib import Path

CONTENT_DIR = Path("src/content/projects")

def check_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    match = re.search(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not match:
        return

    try:
        data = yaml.safe_load(match.group(1))
    except:
        return

    if "metrics" not in data or not data["metrics"]:
        return

    metrics = data["metrics"]
    issues = []
    
    # Check for empty objects in required fields
    required_complex = ["cogs", "profitability", "interventions", "time_to_market"]
    
    for k, val in metrics.items():
        if isinstance(val, dict) and not val:
            issues.append(f"Empty object: {k}")
        elif k in required_complex and isinstance(val, dict):
            # Check for partials
            if k == "interventions" and ("count" not in val or "label" not in val):
                 issues.append(f"Invalid Interventions: {val}")
            # we could add more checks here

    if issues:
        print(f"ERROR: {file_path}")
        for i in issues:
            print(f"  - {i}")

def main():
    print("Checking for validation errors...")
    for root, dirs, files in os.walk(CONTENT_DIR):
        for file in files:
            if file.endswith(".mdx") or file.endswith(".md"):
                check_file(Path(root) / file)
    print("Done.")

if __name__ == "__main__":
    main()
