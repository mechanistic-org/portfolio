import os
import yaml
from pathlib import Path

CONTENT_DIRS = [Path("src/content/projects"), Path("src/data/otherPages")]

def check_structure(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception as e:
        print(f"Read Error {file_path}: {e}")
        return

    # Parse frontmatter by splitting
    if not content.startswith("---"):
        return
    
    parts = content.split("---", 2)
    if len(parts) < 3:
        return # No closing ---
    
    fm_text = parts[1]
    
    try:
        data = yaml.safe_load(fm_text)
    except Exception as e:
        print(f"YAML Error in {file_path}: {e}")
        # Try to print context
        lines = fm_text.splitlines()
        import re
        # Error usually like "... line 50, column 26"
        m = re.search(r'line (\d+)', str(e))
        if m:
            ln = int(m.group(1))
            # YAML line numbers are 1-based
            idx = ln - 1
            start = max(0, idx - 2)
            end = min(len(lines), idx + 3)
            print("Context:")
            for i in range(start, end):
                prefix = ">>" if i == idx else "  "
                print(f"{prefix} {i+1}: {lines[i]}")

def main():
    files = []
    for d in CONTENT_DIRS:
        if d.exists():
            files.extend(list(d.glob("**/*.mdx")) + list(d.glob("**/*.md")))
    print(f"Scanning {len(files)} files...")
    for f in files:
        check_structure(f)

if __name__ == "__main__":
    main()
