import os
import re
import yaml
from pathlib import Path

CONTENT_DIR = Path("src/content/projects")

# Safe fallback
DEFAULT_CATEGORY = "module_subsystem"

def fix_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    match = re.search(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not match:
        return

    fm_text = match.group(1)
    try:
        data = yaml.safe_load(fm_text)
    except:
        return

    if "category" not in data:
        return

    cat = data["category"]
    if cat in ["other", "unknown"]:
        print(f"[{file_path.stem}] Migrating category '{cat}' -> '{DEFAULT_CATEGORY}'")
        
        # We use regex substitution to preserve comments/structure if possible, 
        # or just reliable replace since these are simple lines.
        # "category: other" -> "category: module_subsystem"
        
        # Regex to match "category: other" allowing for whitespace
        new_content = re.sub(
            r'^category:\s*(other|unknown)\s*$', 
            f'category: {DEFAULT_CATEGORY}', 
            content, 
            flags=re.MULTILINE
        )
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)

def main():
    print("Migrating deprecated categories...")
    for root, dirs, files in os.walk(CONTENT_DIR):
        for file in files:
            if file.endswith(".mdx") or file.endswith(".md"):
                fix_file(Path(root) / file)
    print("Done.")

if __name__ == "__main__":
    main()
