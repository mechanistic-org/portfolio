import os
from pathlib import Path

CONTENT_DIRS = [Path("src/content/projects"), Path("src/data/otherPages")]

def fix_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
    
    modified = False
    new_lines = []
    in_fm = False
    fm_count = 0
    
    for line in lines:
        if line.strip() == "---":
            fm_count += 1
            if fm_count == 1: in_fm = True
            elif fm_count == 2: in_fm = False
            new_lines.append(line)
            continue
            
        if in_fm:
            # Check for root level list item
            if line.startswith("- "):
                print(f"Removing orphaned list item in {file_path}: {line.strip()}")
                modified = True
                continue
                
        new_lines.append(line)
        
    if modified:
        with open(file_path, "w", encoding="utf-8") as f:
            f.writelines(new_lines)

def main():
    for d in CONTENT_DIRS:
        if d.exists():
            files = list(d.glob("**/*.mdx")) + list(d.glob("**/*.md"))
            print(f"Scanning {len(files)} files in {d}...")
            for f in files:
                fix_file(f)

if __name__ == "__main__":
    main()
