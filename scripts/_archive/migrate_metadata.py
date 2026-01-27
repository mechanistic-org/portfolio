import os
import re
import yaml
from pathlib import Path

CONTENT_DIR = Path("src/content/projects")

# Mappings
PRODUCTION_MAP = {
    "Discovery": "discovery",
    "Research": "discovery",
    "Definition": "definition",
    "Concept": "concept",
    "Prototype": "prototype",
    "Validation": "validation",
    "Production": "production",
    "Shipped": "production",
    "Market": "production",
    "Standard": "production"
}

SCALE_RULES = {
    "microsoft": "global",
    "webtv": "mass",
    "ultimatetv": "mass",
    "apple": "global",
    "xbox": "global",
    "mechanistic": "one_off",
    "frogdesign": "series",
    "digidesign": "limited",
    "avegant": "series",
    "noon": "series",
    "default": "one_off" # Safe fallback
}

def migrate_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    match = re.search(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not match:
        return

    fm_text = match.group(1)
    try:
        data = yaml.safe_load(fm_text)
    except:
        return

    modified = False

    # 1. Rename statusLabel -> productionScale
    # We do this via regex on the raw content to preserve comments/order if possible,
    # or just manipulate the dict if that's safer. Let's manipulate dict for reliability.
    
    if "statusLabel" in data:
        print(f"[{file_path.stem}] Migrating statusLabel...")
        # Start with unknown, we will refine it below
        if "productionScale" not in data:
             data["productionScale"] = "one_off" 
        del data["statusLabel"]
        modified = True

    # 2. Infer Production Scale (if missing or just set)
    # If we just migrated it, or if it's missing entirely
    if "productionScale" not in data or data["productionScale"] == "one_off":
        employer = data.get("employer", "").lower()
        client = ""
        if "client" in data and isinstance(data["client"], list) and len(data["client"]) > 0:
             client = data["client"][0].lower()
             
        # Rule of thumb
        target_scale = "one_off"
        
        if employer in SCALE_RULES:
            target_scale = SCALE_RULES[employer]
        elif client in SCALE_RULES:
            target_scale = SCALE_RULES[client]
            
        if target_scale != data.get("productionScale"):
             data["productionScale"] = target_scale
             print(f"[{file_path.stem}] Set scale to '{target_scale}' (Employer: {employer})")
             modified = True

    # 3. Normalize Production Status
    if "production" in data:
        curr = data["production"]
        # If it's already lower case enum, leave it.
        # If it's "Production", map to "production"
        # If it's arbitrary string, map to "production" or "prototype" based on keywords?
        
        # Simple mapping first
        for k, v in PRODUCTION_MAP.items():
            if k.lower() in curr.lower():
                if curr != v:
                    print(f"[{file_path.stem}] Mapping production '{curr}' -> '{v}'")
                    data["production"] = v
                    modified = True
                break
        else:
            # If no map found, and it looks like a real sentence, maybe default to "production" if ambiguous?
            # Or just set to 'production' (Launch) if it looks complete.
            if curr not in PRODUCTION_MAP.values():
                 print(f"[{file_path.stem}] Unknown production status '{curr}' -> defaulting to 'production'")
                 data["production"] = "production"
                 modified = True

    if modified:
        new_fm = yaml.dump(data, sort_keys=False, allow_unicode=True)
        # re-insert
        new_content = f"---\n{new_fm}---\n" + content[match.end():].lstrip("\n")
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)

def main():
    print("Migrating metadata...")
    for root, dirs, files in os.walk(CONTENT_DIR):
        for file in files:
            if file.endswith(".mdx") or file.endswith(".md"):
                migrate_file(Path(root) / file)
    print("Done.")

if __name__ == "__main__":
    main()
