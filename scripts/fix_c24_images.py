import os
import re
import urllib.parse

# correct absolute paths
MDX_FILE = r"d:\GitHub\eriknorris\src\content\projects\c24\index.mdx"
ASSETS_DIR = r"d:\GitHub\eriknorris\public\assets\r2\c24\bubbles"

def find_best_image(bubble_dir, base_name):
    # Priorities: xl > lg > md > sm > original (no suffix)
    priorities = ["xl", "lg", "md", "sm"]
    extensions = [".webp", ".avif", ".png", ".jpg", ".jpeg"]
    
    # Check for suffixed versions
    for prio in priorities:
        for ext in extensions:
            candidate = f"{base_name}-{prio}{ext}"
            if os.path.exists(os.path.join(bubble_dir, candidate)):
                return candidate
    
    # Check for exact match or other extensions
    for ext in extensions:
        candidate = f"{base_name}{ext}"
        if os.path.exists(os.path.join(bubble_dir, candidate)):
            return candidate
            
    return None

def main():
    with open(MDX_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # Regex to find bubbles and their images
    # We look for - id: ... then strictly parse lines until next id
    
    lines = content.splitlines()
    new_lines = []
    
    current_bubble_id = None
    
    # Hardcoded mapping if implicit logic fails, but we try implicit first
    # referencing the directory names from list_dir:
    # 01_origin_story, 02_side_cap_crisis, etc.
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Detect Bubble ID
        id_match = re.search(r"^\s+-\s+id:\s+(\S+)", line)
        if id_match:
            current_bubble_id = id_match.group(1)
            new_lines.append(line)
            i += 1
            continue
            
        # Detect Image Item (alt:)
        alt_match = re.search(r"^\s+alt:\s+(.+)$", line)
        
        if alt_match and current_bubble_id:
            alt_text = alt_match.group(1).strip()
            base_name = alt_text
            
            # Look in the directory
            bubble_path = os.path.join(ASSETS_DIR, current_bubble_id)
            
            if os.path.exists(bubble_path):
                best_file = find_best_image(bubble_path, base_name)
                
                new_lines.append(line)
                if best_file:
                    indent = len(line) - len(line.lstrip())
                    encoded_filename = urllib.parse.quote(best_file)
                    web_path = f"/assets/r2/c24/bubbles/{current_bubble_id}/{encoded_filename}"
                    
                    new_lines.append(f"{' ' * indent}src: {web_path}")
                    
                    # Check if next line is already a src line, if so, skip it
                    if i + 1 < len(lines):
                        next_line = lines[i+1]
                        if re.match(r"^\s+src:\s", next_line):
                            i += 1 # Skip existing src
                else:
                    print(f"Warning: No file found for {base_name} in {current_bubble_id}")
            else:
                new_lines.append(line)
        else:
            new_lines.append(line)
        
        i += 1

    # Write back
    with open(MDX_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(new_lines))

    print("Finished updating MDX.")

if __name__ == "__main__":
    main()
