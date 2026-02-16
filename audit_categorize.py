import os
import re
import hashlib

PROJECTS_DIR = r"src\content\projects"
SCAFFOLD_SIGNATURE = "Auto-generated scaffold from Multiverse Registry"

def parse_mdx(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        match = re.search(r'^---\s+(.*?)\s+---\s+(.*)$', content, re.DOTALL)
        if match:
            fm_text = match.group(1)
            body = match.group(2).strip()
            
            # Extract tier
            tier_match = re.search(r'^tier:\s*(\d+)', fm_text, re.MULTILINE)
            tier = int(tier_match.group(1)) if tier_match else 0
            
            slug = os.path.basename(os.path.dirname(filepath))
            
            # Classification
            if SCAFFOLD_SIGNATURE in body:
                category = "EMPTY_SCAFFOLD"
            elif tier == 3:
                category = "PARTIAL_CONTENT"
            else:
                category = "HYDRATED"

            return {
                "slug": slug,
                "category": category,
                "tier": tier
            }
        else:
            return {"slug": os.path.basename(os.path.dirname(filepath)), "error": "No frontmatter"}
            
    except Exception as e:
        return {"slug": os.path.basename(os.path.dirname(filepath)), "error": str(e)}

def generate_summary():
    projects = []
    entries = os.listdir(PROJECTS_DIR)
    for entry_name in entries:
        entry_path = os.path.join(PROJECTS_DIR, entry_name)
        if os.path.isdir(entry_path):
            mdx_path = os.path.join(entry_path, "index.mdx")
            if os.path.exists(mdx_path):
                projects.append(parse_mdx(mdx_path))

    empty = sorted([p['slug'] for p in projects if p.get('category') == "EMPTY_SCAFFOLD"])
    partial = sorted([p['slug'] for p in projects if p.get('category') == "PARTIAL_CONTENT"])
    hydrated = sorted([p['slug'] for p in projects if p.get('category') == "HYDRATED"])

    with open("scaffold_audit_summary.md", "w") as f:
        f.write("# Scaffold Audit Report\n\n")
        
        f.write(f"## 1. Empty Scaffolds ({len(empty)})\n")
        f.write("> Projects containing *only* the 'Auto-generated' placeholder.\n\n")
        for slug in empty:
            f.write(f"- `{slug}`\n")
            
        f.write(f"\n## 2. Partial Content Scaffolds ({len(partial)})\n")
        f.write("> Projects marked `tier: 3` but containing unique 'Challenge' or 'Context' sections.\n\n")
        for slug in partial:
            f.write(f"- `{slug}`\n")

        f.write(f"\n## 3. Hydrated Projects ({len(hydrated)})\n")
        f.write("> Tier 1/2 projects with full forensic analysis.\n\n")
        for slug in hydrated:
            f.write(f"- `{slug}`\n")

if __name__ == "__main__":
    generate_summary()
