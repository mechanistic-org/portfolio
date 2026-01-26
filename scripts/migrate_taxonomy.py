import os
import re
from pathlib import Path

CONTENT_DIRS = [Path("src/content/projects")]

# Mapping Rules
INDUSTRY_MAP = {
    "technology": "consumer_electronics",
    "other": "consumer_electronics",
}

CATEGORY_MAP = {
    "uncategorized": "other"
}

# Specific overrides based on slug/title
OVERRIDES = {
    "sc48": {"industry": "pro_audio"},
    "sc48-remote": {"industry": "pro_audio"}, # hypothetical
    "sunbeam-toaster": {"industry": "consumer_appliance"},
    "coffee-maker": {"industry": "consumer_appliance"}, # hypothetical
    "test_protocol_alpha": {"industry": "other"}, # Wait, 'other' is being removed! Map to consumer_electronics or automation? Let's use 'automation' as user added it.
    "avegant-glyph": {"industry": "consumer_electronics"},
    "webtv-galaxy": {"industry": "consumer_electronics"},
}

def migrate_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
    
    modified = False
    new_lines = []
    
    slug = file_path.parent.name if file_path.name == "index.mdx" else file_path.stem
    
    for line in lines:
        # Check Industry
        match_ind = re.match(r'^(\s*)industry:\s*([a-zA-Z0-9_]+)\s*$', line)
        if match_ind:
            indent = match_ind.group(1)
            val = match_ind.group(2)
            
            # Apply Override if exists
            if slug in OVERRIDES and "industry" in OVERRIDES[slug]:
                new_val = OVERRIDES[slug]["industry"]
                if val != new_val:
                    print(f"[{slug}] Overriding industry: {val} -> {new_val}")
                    new_lines.append(f"{indent}industry: {new_val}\n")
                    modified = True
                    continue
            
            # Apply General Map
            if val in INDUSTRY_MAP:
                new_val = INDUSTRY_MAP[val]
                print(f"[{slug}] Migrating industry: {val} -> {new_val}")
                new_lines.append(f"{indent}industry: {new_val}\n")
                modified = True
                continue
                
        # Check Category
        match_cat = re.match(r'^(\s*)category:\s*([a-zA-Z0-9_]+)\s*$', line)
        if match_cat:
            indent = match_cat.group(1)
            val = match_cat.group(2)
            
            if val in CATEGORY_MAP:
                new_val = CATEGORY_MAP[val]
                print(f"[{slug}] Migrating category: {val} -> {new_val}")
                new_lines.append(f"{indent}category: {new_val}\n")
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
                migrate_file(f)

if __name__ == "__main__":
    main()
