import os
import re
from pathlib import Path

CONTENT_DIR = Path("src/content/projects")

# Map of Display string to Taxonomy Value
CLIENT_FIX_MAP = {
    "WebTV": "webtv",
    "Microsoft": "microsoft",
    "UltimateTV": "ultimatetv",
    "Frog Design": "frogdesign",
    "frogdesign": "frogdesign",
}

def fix_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    new_content = content
    modified = False

    # Regex to find client list
    # e.g. client: [WebTV] or client: ["WebTV"] or multiline
    
    # Simple replace for the specific ones we just added
    # Be careful not to replace text in body, only in FM (roughly)
    
    # We can use simple string replace for "client: [WebTV]" -> "client: [webtv]"
    # "client: [Microsoft]" -> "client: [microsoft]"
    # "client: [UltimateTV]" -> "client: [ultimatetv]"
    
    # Also handle list format
    # - WebTV -> - webtv (if under client:)
    
    # Let's do a robust line-by-line FM parser or just targeted search/replace for the known recent edits.
    
    lines = content.splitlines()
    in_fm = False
    fm_count = 0
    in_client_block = False
    
    new_lines = []
    
    for line in lines:
        if line.strip() == "---":
            fm_count += 1
            in_fm = (fm_count == 1)
        
        if in_fm:
            # Check if entering client block
            if re.match(r'^(\s*)client:', line):
                in_client_block = True
                # Check for inline list
                if "[" in line:
                    for k, v in CLIENT_FIX_MAP.items():
                        if k in line and v != k: # exact string match in line? dangerous?
                             # only replace if surrounded by quotes or brackets
                             # replace "WebTV" with "webtv"
                             line = line.replace(f'"{k}"', f'"{v}"')
                             line = line.replace(f"'{k}'", f"'{v}'")
                             line = line.replace(f"[{k}]", f"[{v}]")
                             line = line.replace(f", {k}]", f", {v}]")
                             line = line.replace(f"[{k},", f"[{v},")
                             line = line.replace(f", {k},", f", {v},")
                             # what if unquoted?
                             line = line.replace(f" {k}]", f" {v}]")
                             
                    in_client_block = False # Inline, so block ends
            elif in_client_block:
                # Inside multiline client block
                # Check for new key (end of block)
                if re.match(r'^(\s*)[a-z]+:', line):
                    in_client_block = False
                elif line.strip().startswith("- "):
                    val = line.strip()[2:]
                    # Check if val is one of our targets
                    if val in CLIENT_FIX_MAP:
                        line = line.replace(val, CLIENT_FIX_MAP[val])
        
        new_lines.append(line)
        
    final_content = "\n".join(new_lines)
    if final_content != content:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(final_content)
        print(f"Fixed {file_path.name}")

def main():
    for root, dirs, files in os.walk(CONTENT_DIR):
        for file in files:
            if file.endswith(".mdx") or file.endswith(".md"):
                fix_file(Path(root) / file)

if __name__ == "__main__":
    main()
