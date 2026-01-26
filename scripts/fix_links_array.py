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
        
        # Check for "links:" followed by "  url: ..." without a dash
        if line.strip() == "links:":
            # Look ahead
            if i + 1 < len(lines):
                next_line = lines[i+1]
                # Regex for "  url: ..."
                match = re.match(r'^(\s*)url:\s*(.*)$', next_line)
                if match:
                    indent = match.group(1)
                    val = match.group(2)
                    print(f"Fixing links object in {file_path}")
                    new_lines.append(line) # Keep links:
                    # Add dash to url line
                    # standard indent for list item is 2 spaces usually, or same indent as url but with dash prefix?
                    # If url: is indented 2 spaces, - url: should be indented 2 spaces? No, 
                    # links:
                    #   url: ...  ->
                    # links:
                    #   - url: ...
                    
                    # We will just replace the next line
                    new_lines.append(f"{indent}- url: {val}\n")
                    modified = True
                    # Skip the original next line in the loop? 
                    # We are in a loop iterating i. If we append here, we need to skip the next iteration?
                    # Actually better to restructure loop or just modify the lines list in place?
                    # Let's just use strict logic:
                    # Iterate, and if we match this pair, we consume both.
                    # But the loop is strict linear.
                    # I will mark the next line to be skipped.
                    continue
        
        # We need a skip mechanism
        # But wait, my loop logic above has a flaw: I can't skip the *next* iteration easily with a for-range unless I use a while loop.
        # Let's use while loop.
        new_lines.append(line)

    # Let me rewrite with while loop for safer skip
    
def fix_file_v2(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    modified = False
    new_lines = []
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Check for links:
        if line.strip() == "links:":
            if i + 1 < len(lines):
                next_line = lines[i+1]
                match = re.match(r'^(\s*)url:\s*(.*)$', next_line)
                if match:
                    indent = match.group(1)
                    val = match.group(2)
                    print(f"Fixing links object in {file_path}")
                    new_lines.append(line)
                    new_lines.append(f"{indent}- url: {val}\n")
                    modified = True
                    i += 2
                    continue
                    
        new_lines.append(line)
        i += 1
        
    if modified:
        with open(file_path, "w", encoding="utf-8") as f:
            f.writelines(new_lines)

def main():
    for d in CONTENT_DIRS:
        if d.exists():
            files = list(d.glob("**/*.mdx")) + list(d.glob("**/*.md"))
            print(f"Scanning {len(files)} files in {d}...")
            for f in files:
                fix_file_v2(f)

if __name__ == "__main__":
    main()
