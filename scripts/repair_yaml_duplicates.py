import os
import re

MDX_FILE = r"d:\GitHub\eriknorris\src\content\projects\c24\index.mdx"

def nuclear_repair():
    print(f"Scanning {MDX_FILE} for duplicate source keys...")
    
    with open(MDX_FILE, "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    cleaned_lines = []
    
    # We track the 'previous' line type relative to the 'current' line
    # If current is 'src:' and previous was 'src:', we DROP the PREVIOUS one?
    # No, the script appended the NEW (and correct/encoded) one AFTER the old one.
    # So if we have:
    # src: old
    # src: new
    # We want to keep 'new'.
    
    # Strategy: Reverse iterate?
    # Or linear: 
    # If line is 'src:', check if next line is 'src:'. If so, likely duplicate.
    
    # Actually, simpler:
    # If a list item has multiple 'src' keys, YAML fails.
    # We can detect this pattern:
    #   src: ...
    #   src: ...
    # We just want the last one.
    
    skip_indices = set()
    
    for i in range(len(lines) - 1):
        current_line = lines[i]
        next_line = lines[i+1]
        
        # Check for src key pattern
        # spaces + src: ...
        curr_src = re.match(r"^(\s+)src:\s", current_line)
        next_src = re.match(r"^(\s+)src:\s", next_line)
        
        if curr_src and next_src:
            # Check indentation match to ensure they are siblings
            if curr_src.group(1) == next_src.group(1):
                print(f"Duplicate found at line {i+1}. Marking for deletion.")
                skip_indices.add(i)
                
    # Rebuild
    final_output = []
    for i, line in enumerate(lines):
        if i not in skip_indices:
            final_output.append(line)
            
    with open(MDX_FILE, "w", encoding="utf-8") as f:
        f.writelines(final_output)
        
    print(f"Repaired {len(skip_indices)} corruptions. File saved.")

if __name__ == "__main__":
    nuclear_repair()
