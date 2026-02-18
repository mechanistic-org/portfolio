
import os

def clean_c24():
    path = "src/content/projects/c24/index.mdx"
    if not os.path.exists(path):
        print(f"File not found: {path}")
        return

    with open(path, "r", encoding="utf-8") as f:
        lines = f.readlines()
    
    new_lines = []
    in_block = False
    
    for line in lines:
        # C24: Delete 'forensic_data:' recursively
        if line.startswith("forensic_data:"):
            in_block = True
            print("Found start of forensic_data block in c24")
            continue
        
        if in_block:
            # Check if line is next top-level key (start of line, no indent, alphanum)
            if line.strip() and not line.startswith(" ") and not line.startswith("#"):
                in_block = False
                print(f"Found end of forensic_data block at: {line.strip()[:20]}")
        
        if not in_block:
            new_lines.append(line)
            
    with open(path, "w", encoding="utf-8") as f:
        f.writelines(new_lines)
    print("Cleaned c24/index.mdx")

if __name__ == "__main__":
    clean_c24()
