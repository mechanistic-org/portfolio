import frontmatter
import yaml
import json
import argparse
from pathlib import Path

# Config
ROOT_DIR = Path(__file__).parent.parent
PROJECTS_DIR = ROOT_DIR / "src/content/projects"
DUMPS_DIR = ROOT_DIR / "notebook_dumps"

TARGETS = [
    "bazooka",
    "extension-switches",
    "room-director",
    "wall-plates",
    "minimerc",
    "makeline"
]

def migrate_project(slug):
    mdx_path = PROJECTS_DIR / slug / "index.mdx"
    if not mdx_path.exists():
        print(f"❌ Project not found: {slug}")
        return

    try:
        post = frontmatter.load(mdx_path)
    except Exception as e:
        print(f"❌ Error loading {slug}: {e}")
        return

    output = []
    
    # Header
    output.append(f"# Spec: V2 (Auto-Migrated)")
    output.append(f"# Project: {post.get('title', slug)}")
    output.append("")

    # Narrative Block
    if post.get("forensic_summary"):
        output.append("## Narrative")
        output.append("```json")
        output.append(json.dumps({"forensic_summary": post["forensic_summary"]}, indent=2))
        output.append("```")
        output.append("")

    # Complexity Block
    if post.get("complexity_vector"):
        output.append("## Complexity")
        output.append("```json")
        output.append(json.dumps({"complexity_vector": post["complexity_vector"]}, indent=2))
        output.append("```")
        output.append("")

    # Entropy Block (Events)
    if post.get("events"):
        output.append("## Entropy")
        output.append("```json")
        output.append(json.dumps({"events": post["events"]}, indent=2))
        output.append("```")
        output.append("")
    
    # Scars (War Stories)
    if post.get("scars"):
        output.append("## Scars")
        output.append("```json")
        output.append(json.dumps({"war_stories": post["scars"]}, indent=2))
        output.append("```")
        output.append("")

    # Write to notebook_dumps
    dump_path = DUMPS_DIR / f"{slug}.txt"
    with open(dump_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(output))
        
    print(f"✅ Migrated {slug} -> {dump_path}")

def main():
    print("🚀 Starting V1 -> V2 Spec Migration...")
    
    # Ensure dumps dir exists
    DUMPS_DIR.mkdir(parents=True, exist_ok=True)
    
    for slug in TARGETS:
        migrate_project(slug)
        
    print("🏁 Migration Complete.")

if __name__ == "__main__":
    main()
