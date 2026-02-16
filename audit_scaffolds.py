import os
import re
import hashlib

PROJECTS_DIR = r"src\content\projects"
SCAFFOLD_SIGNATURE = "Auto-generated scaffold from Multiverse Registry"
REPORT_FILE = "scaffold_report.txt"

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
            is_scaffold = SCAFFOLD_SIGNATURE in body or tier == 3

            # Normalize body: Remove Title Headers (Lines starting with #)
            # This tests if the "Scaffold Part" is identical
            normalized_body = re.sub(r'^#+\s+.*$', '', body, flags=re.MULTILINE).strip()
            
            return {
                "slug": slug,
                "is_scaffold": is_scaffold,
                "tier": tier,
                "body_content": body,
                "normalized_hash": hashlib.md5(normalized_body.encode('utf-8')).hexdigest(),
                "normalized_len": len(normalized_body)
            }
        else:
            return {"slug": os.path.basename(os.path.dirname(filepath)), "error": "No frontmatter"}
            
    except Exception as e:
        return {"slug": os.path.basename(os.path.dirname(filepath)), "error": str(e)}

def audit():
    projects = []
    if not os.path.exists(PROJECTS_DIR):
        print(f"Directory not found: {PROJECTS_DIR}")
        return

    entries = os.listdir(PROJECTS_DIR)
    for entry_name in entries:
        entry_path = os.path.join(PROJECTS_DIR, entry_name)
        if os.path.isdir(entry_path):
            mdx_path = os.path.join(entry_path, "index.mdx")
            if os.path.exists(mdx_path):
                projects.append(parse_mdx(mdx_path))

    scaffolds = [p for p in projects if p.get("is_scaffold")]
    hydrated = [p for p in projects if not p.get("is_scaffold") and not p.get("error")]
    
    with open(REPORT_FILE, 'w', encoding='utf-8') as f:
        f.write(f"Total Projects: {len(projects)}\n")
        f.write(f"Hydrated: {len(hydrated)}\n")
        f.write(f"Scaffolds: {len(scaffolds)}\n\n")
        
        # Analyze Scaffolds by Normalized Content
        groups = {}
        for s in scaffolds:
            h = s['normalized_hash']
            if h not in groups:
                groups[h] = []
            groups[h].append(s)
            
        f.write("--- SCAFFOLD VARIATIONS (Normalized) ---\n")
        if len(groups) == 1:
            f.write("ALL SCAFFOLDS SHARE IDENTICAL TEMPLATE STRUCTURE.\n")
            f.write("(Differences were only in the generated Title Header)\n")
        else:
            f.write(f"Found {len(groups)} different templates.\n")
            for h, items in groups.items():
                f.write(f"\nTemplate Hash: {h[:8]} (Count: {len(items)})\n")
                f.write(f"Sample Content (Normalized):\n{items[0]['body_content']}\n")
                f.write("-" * 20 + "\n")

    print(f"Report verified. {len(hydrated)} hydrated, {len(scaffolds)} scaffolds.")

if __name__ == "__main__":
    audit()
