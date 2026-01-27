import os
import re
from pathlib import Path

CONTENT_DIRS = [Path("src/content/projects"), Path("src/data/otherPages")]

KEYS_TO_REMOVE = {"impact", "toolIcons", "role", "cast"}

def sanitize_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
    
    modified = False
    new_lines = []
    skip_indent = None
    
    # Simple state machine for frontmatter
    in_fm = False
    fm_lines_count = 0
    
    for i, line in enumerate(lines):
        stripped = line.lstrip()
        indent = len(line) - len(stripped)
        
        # Detect Frontmatter boundaries
        if line.strip() == "---":
            fm_lines_count += 1
            if fm_lines_count == 1:
                in_fm = True
                new_lines.append(line)
                continue
            elif fm_lines_count == 2:
                in_fm = False
                skip_indent = None # Reset skip logic at end of FM
                new_lines.append(line)
                continue
        
        if in_fm:
            # Check if we are currently skipping a block
            if skip_indent is not None:
                # If indentation is greater than key's indent, it's child content
                if indent > skip_indent:
                    modified = True
                    continue
                # If indentation is SAME and starts with '-', it's a list item belonging to key (quasi-valid YAML)
                elif indent == skip_indent and stripped.startswith("-"):
                    modified = True
                    continue
                else:
                    # Block ended
                    skip_indent = None
            
            # Check for keys to remove
            # Regex to capture "key:" or "key: value"
            match = re.match(r'^(\s*)([a-zA-Z0-9_]+):\s*(.*)$', line)
            if match:
                key_indent = len(match.group(1))
                key = match.group(2)
                value = match.group(3)
                
                if key in KEYS_TO_REMOVE:
                    print(f"Removing {key} in {file_path}")
                    skip_indent = key_indent
                    modified = True
                    continue
                
                # Check for empty description
                if key == "description" and not value.strip():
                    print(f"Fixing empty description in {file_path}")
                    # Skip line (equivalent to deleting it, making it undefined/optional)
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
                sanitize_file(f)

if __name__ == "__main__":
    main()
