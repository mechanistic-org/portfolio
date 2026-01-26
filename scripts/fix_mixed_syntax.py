import os
import re
from pathlib import Path

CONTENT_DIRS = [Path("src/content/projects"), Path("src/data/otherPages")]

def fix_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
    
    modified = False
    new_lines = []
    
    for i in range(len(lines)):
        line = lines[i]
        
        # Check for key: []
        match = re.match(r'^(\s*)([a-zA-Z0-9_]+):\s*\[\]\s*$', line)
        if match:
            indent = match.group(1)
            key = match.group(2)
            
            # Look ahead for list items OR indented keys
            if i + 1 < len(lines):
                next_line = lines[i+1]
                next_indent = len(next_line) - len(next_line.lstrip())
                # If next line is indented deeper than current key, it belongs to it.
                if next_line.strip() and next_indent > len(indent):
                    print(f"Fixing mixed syntax for {key} in {file_path}")
                    new_lines.append(f"{indent}{key}:\n")
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
