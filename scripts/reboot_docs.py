import os
import shutil
import datetime

# Configuration
DOCS_ROOT = "src/content/docs"
ARCHIVE_DIR = "src/content/docs/archive_2025"
NEW_DIRS = ["core", "systems", "guides"]

# Files to move to Archive (Manual Selection based on ListDir)
# We move everything EXCEPT specific "System" folders that might be needed temporarily,
# but the plan is "Start Fresh", so we move nearly everything.
ITEMS_TO_ARCHIVE = [
    "00_QUICKSTART.md", "01_THE_REFINERY.md", "02_THE_STUDIO.md", "03_THE_ENGINE_ROOM.md",
    "INTERACTION.md", "INTERNAL_SCRIPTS.md", "MAINTENANCE.md", "MANIFESTO.md",
    "REFERENCES.md", "ROADMAP.md", "STICKIE_PROTOCOL.md", "STYLE_GUIDE.md",
    "SUBSTANCE_MAXIMIZATION_PLAN.md", "UX_MOVES.md", "VERNACULAR.md",
    "WORKFLOW_VIDEO.md", "Z_INDEX_MAP.md",
    "audits", "backlog", "design", "meta", "project", "prompts", "protocols", "reference", "workflows"
]

def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)
        print(f"Created: {path}")

def move_item(item):
    src = os.path.join(DOCS_ROOT, item)
    dst = os.path.join(ARCHIVE_DIR, item)
    
    if os.path.exists(src):
        # Move
        try:
            shutil.move(src, dst)
            print(f"Archived: {item}")
        except Exception as e:
            print(f"Failed to archive {item}: {e}")
    else:
        print(f"Skipped (Not Found): {item}")

def main():
    print("--- Starting Documentation Reboot ---")
    
    # 1. Create Archive & New Structure
    ensure_dir(ARCHIVE_DIR)
    for d in NEW_DIRS:
        ensure_dir(os.path.join(DOCS_ROOT, d))
        
    # 2. Archive Items
    for item in ITEMS_TO_ARCHIVE:
        move_item(item)
        
    # 3. Create Placeholder READMEs for new folders so they aren't empty
    for d in NEW_DIRS:
        with open(os.path.join(DOCS_ROOT, d, "README.md"), "w") as f:
            f.write(f"# {d.capitalize()}\n\nNew Institution Era Documentation.")

    print("--- Reboot Complete ---")

if __name__ == "__main__":
    main()
