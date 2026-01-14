import os
import sys

PROJECTS_DIR = r"src/content/projects"
DRY_RUN = "--dry-run" in sys.argv

# The Schema Blocks to inject if missing
BLOCK_METRICS = """
# METRICS (The Real Data - C24 Schema)
metrics:
  financial:
    toolingBudget: 0
    toolingActual: 0
    margins: []
    costOfGoodsSold: []
  process:
    dcdCount: 0
    engineeringChangeOrders: []
  war_stories: []
"""

BLOCK_CYBERSPACE = """
# CYBERSPACE (The Layout)
cyberspace:
  layout: linear
  narrative: []
  stickies: []
"""

BLOCK_WAR_STORIES = "war_stories: []"

def modernize_project(slug, path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"[ERROR] Could not read {slug}: {e}")
        return

    # Split Frontmatter
    parts = content.split('---', 2)
    if len(parts) < 3:
        print(f"[SKIP] {slug}: Invalid frontmatter format.")
        return

    frontmatter = parts[1]
    body = parts[2]
    
    new_frontmatter = frontmatter
    updates = []

    # Check and Inject Metrics
    if "metrics:" not in frontmatter:
        new_frontmatter += BLOCK_METRICS
        updates.append("metrics")

    # Check and Inject Cyberspace
    if "cyberspace:" not in frontmatter:
        # Note: Some legacy have 'cyberspace: null'
        if "cyberspace: null" in frontmatter:
             new_frontmatter = new_frontmatter.replace("cyberspace: null", BLOCK_CYBERSPACE.strip())
             updates.append("cyberspace (replaced null)")
        else:
            new_frontmatter += BLOCK_CYBERSPACE
            updates.append("cyberspace")

    # Check and Inject War Stories (Root)
    if "war_stories:" not in frontmatter:
        new_frontmatter += "\n" + BLOCK_WAR_STORIES
        updates.append("war_stories")

    # Reconstruct
    if updates:
        final_content = f"---{new_frontmatter}\n---{body}"
        if DRY_RUN:
            print(f"[DRY RUN] {slug}: Would inject {', '.join(updates)}")
        else:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(final_content)
            print(f"[UPDATED] {slug}: Injected {', '.join(updates)}")
    else:
        if DRY_RUN:
            pass # Silent on standard checks
        # print(f"[OK] {slug}: Already modern.")

def main():
    print(f"Scanning {PROJECTS_DIR}..." + (" (DRY RUN)" if DRY_RUN else ""))
    count = 0
    if not os.path.exists(PROJECTS_DIR):
         print(f"Directory not found: {PROJECTS_DIR}")
         return

    for slug in os.listdir(PROJECTS_DIR):
        folder_path = os.path.join(PROJECTS_DIR, slug)
        file_path = os.path.join(folder_path, "index.mdx")
        
        if os.path.isdir(folder_path) and os.path.exists(file_path):
            modernize_project(slug, file_path)
            count += 1
            
    print(f"\nScanned {count} projects.")

if __name__ == "__main__":
    main()
