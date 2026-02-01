import os
import re

ARCHIVE_DIR = "src/content/docs/archive_2025"

def ensure_frontmatter(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Check for existing frontmatter
    if content.startswith("---"):
        # Could parse it to see if 'title' exists, but for now assuming if it has frontmatter, it might be partial or ok.
        # But the error was specific to 'title'. 
        # Let's check if 'title:' is inside the first block.
        match = re.search(r"^---\n(.*?)\n---", content, re.DOTALL)
        if match:
            fm = match.group(1)
            if "title:" in fm:
                print(f"Skipping (Has Title): {file_path}")
                return
            else:
                # Add title to existing frontmatter
                print(f"Patching (Missing Title): {file_path}")
                filename = os.path.basename(file_path).replace(".mdx", "").replace(".md", "").replace("_", " ").title()
                new_fm = fm + f'\ntitle: "{filename}"'
                new_content = content.replace(fm, new_fm, 1) # only replace first occurrence
                
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(new_content)
                return

    # No frontmatter at all
    print(f"Injecting Frontmatter: {file_path}")
    filename = os.path.basename(file_path).replace(".mdx", "").replace(".md", "").replace("_", " ").title()
    
    # Simple frontmatter injection
    frontmatter = f"""---
title: "{filename}"
description: "Archived legacy document."
---

"""
    new_content = frontmatter + content
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)

def main():
    print("--- Starting Frontmatter Injection ---")
    
    if not os.path.exists(ARCHIVE_DIR):
        print(f"Error: {ARCHIVE_DIR} does not exist.")
        return

    for root, dirs, files in os.walk(ARCHIVE_DIR):
        for file in files:
            if file.endswith(".md") or file.endswith(".mdx"):
                path = os.path.join(root, file)
                try:
                    ensure_frontmatter(path)
                except Exception as e:
                    print(f"Failed to process {path}: {e}")

    print("--- Injection Complete ---")

if __name__ == "__main__":
    main()
