import os
import re
from pathlib import Path

CONTENT_DIRS = [Path("src/content/projects"), Path("src/data/otherPages")]

# Keys that are arrays in schema but often null in files
ARRAY_KEYS = {"tags", "tools", "client", "links", "gallery", "documents", "skillData", "additionalSkills", "toolchain"}

def fix_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
    
    modified = False
    new_lines = []
    
    for line in lines:
        # Check for key: (empty or null)
        # Regex: key followed by colon and optional whitespace, then newline
        match = re.match(r'^(\s*)([a-zA-Z0-9_]+):\s*$', line.rstrip())
        if match:
            indent = match.group(1)
            key = match.group(2)
            
            if key in ARRAY_KEYS:
                # Check next line to see if it has list items
                # If next line starts with indent + "- ", then do NOT set to []
                # But we need lookahead. 
                # This script reads all lines first, so we use index i
                next_line_idx = i + 1
                has_items = False
                if next_line_idx < len(lines):
                    next_line = lines[next_line_idx]
                    next_indent = len(next_line) - len(next_line.lstrip())
                    if next_line.lstrip().startswith("-") and next_indent > len(indent):
                        has_items = True

                if not has_items:
                    print(f"Fixing null array {key} in {file_path}")
                    new_line = f'{indent}{key}: []\n'
                    new_lines.append(new_line)
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
