
import os
import shutil
from pathlib import Path

# Config
PROJECTS_DIR = r"src/content/projects"
TRASH_DIR = r"src/content/projects/_Trash"

def scan_and_clean(dry_run=True):
    base_path = Path(os.getcwd()) / PROJECTS_DIR
    trash_path = Path(os.getcwd()) / TRASH_DIR
    
    if not base_path.exists():
        print(f"Error: {base_path} not found.")
        return

    # Create trash if not exists
    if not dry_run and not trash_path.exists():
        trash_path.mkdir(exist_ok=True)

    # Find all .mdx files in the root of projects dir
    flat_files = [f for f in base_path.glob("*.mdx") if f.is_file()]
    
    zombies = []

    print(f"Scanning {len(flat_files)} flat files in {PROJECTS_DIR}...\n")

    for file_path in flat_files:
        slug = file_path.stem # 'd-command' from 'd-command.mdx'
        folder_path = base_path / slug
        
        # Check if corresponding folder exists
        if folder_path.exists() and folder_path.is_dir():
            # Check if folder contains index.mdx
            index_path = folder_path / "index.mdx"
            if index_path.exists():
                zombies.append(file_path)
                print(f"[ZOMBIE] {file_path.name}  ->  Has Folder equivalent ({index_path.name})")
            else:
                print(f"[WARN]   {file_path.name}  ->  Folder exists but NO index.mdx!")
        else:
            # It's a legitimate flat file project (no folder)
            pass

    print(f"\nFound {len(zombies)} Zombie Files.")

    if not dry_run:
        print(f"\n--- MOVING TO {TRASH_DIR} ---")
        for z in zombies:
            dest = trash_path / z.name
            try:
                shutil.move(str(z), str(dest))
                print(f"Moved: {z.name}")
            except Exception as e:
                print(f"Error moving {z.name}: {e}")
    else:
        print("\n--- DRY RUN ---")
        print("Set dry_run=False to execute.")

if __name__ == "__main__":
    import sys
    # execute
    run_mode = True
    if len(sys.argv) > 1 and sys.argv[1] == "--dry-run":
        run_mode = True
    elif len(sys.argv) > 1 and sys.argv[1] == "--execute":
        run_mode = False
    
    scan_and_clean(dry_run=run_mode)
