import os
import re
from pathlib import Path

CONTENT_DIRS = [Path("src/content/projects")]

EMPLOYER_MAP = {
    "mechanistic_webtv": "webtv",
    "mechanistic_consulting": "mechanistic",
    "internal_audit": "mechanistic",
    "unknown": "mechanistic", # Default fallback
    "electromechanical_mechanism": "mechanistic",
    "mobile_phone": "mechanistic",
    "wearable_ar": "avegant",
    "mechanistic": "mechanistic", # Explicit keep
}

# Specific overrides based on slug
OVERRIDES = {
    "xbox": "microsoft",
    "xbox-redesign": "microsoft",
    "weemote": "mechanistic", # Client?
    "acer-phone": "mechanistic", # Client Acer?
    "acer-aspire": "frogdesign",
    "vadem-clio": "frogdesign",
    # WebTV projects
    "webtv-galaxy": "webtv",
    "webtv-mercury": "webtv",
    "webtv-pluto": "webtv",
    "webtv-elmer": "webtv",
    "webtv-cortez": "webtv",
    "webtv-titan": "webtv",
    "zeus": "webtv",
    "titan-k": "webtv",
    # Others
    "test_protocol_alpha": "mechanistic",
}

def migrate_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
    
    modified = False
    new_lines = []
    
    slug = file_path.parent.name if file_path.name == "index.mdx" else file_path.stem
    
    for line in lines:
        match_emp = re.match(r'^(\s*)employer:\s*([a-zA-Z0-9_]+)\s*$', line)
        if match_emp:
            indent = match_emp.group(1)
            val = match_emp.group(2)
            
            new_val = val
            
            # Check Override
            if slug in OVERRIDES:
                new_val = OVERRIDES[slug]
            elif val in EMPLOYER_MAP:
                new_val = EMPLOYER_MAP[val]
            
            if new_val != val:
                print(f"[{slug}] Migrating employer: {val} -> {new_val}")
                new_lines.append(f"{indent}employer: {new_val}\n")
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
