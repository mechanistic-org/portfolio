import os
import re
from pathlib import Path

CONTENT_DIR = Path("src/content/projects")

def fix_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
    
    modified = False
    new_lines = []
    
    keys_to_check = ["forensic_summary", "description", "label", "value", "title", "impact", "financial", "process", "technical"]
    
    for line in lines:
        # Check for key: VALUE
        match = re.match(r'^(\s*)([a-zA-Z0-9_]+):\s*(.+)$', line)
        if match:
            indent = match.group(1)
            key = match.group(2)
            val = match.group(3).strip()
            
            if key in keys_to_check:
                # If not quoted
                if not val.startswith('"') and not val.startswith("'"):
                    # If contains colon or invalid YAML chars (simplified check)
                    # We quote anything that looks like text with punctuation
                    if ':' in val or '{' in val or '[' in val:
                         # Exclude [REDACTED] or simple lists?
                         if val.startswith('[') and val.endswith(']'):
                             pass # Likely list
                         else:
                            print(f"Fixing {file_path} [{key}]: {val[:30]}...")
                            # Escape quotes in value
                            val_safe = val.replace('"', '\\"')
                            new_line = f'{indent}{key}: "{val_safe}"\n'
                            new_lines.append(new_line)
                            modified = True
                            continue
        new_lines.append(line)
        
    if modified:
        with open(file_path, "w", encoding="utf-8") as f:
            f.writelines(new_lines)

def main():
    files = list(CONTENT_DIR.glob("**/*.mdx"))
    print(f"Scanning {len(files)} files for quote fixes...")
    for f in files:
        fix_file(f)

if __name__ == "__main__":
    main()
