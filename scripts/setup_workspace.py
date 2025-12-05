import os
import csv
import argparse
from pathlib import Path

# --- CONFIGURATION ---
SOURCE_CSV = "data_source/Main.csv"
# Path to this script's directory (d:\GitHub\quantum\scripts)
SCRIPT_DIR = Path(__file__).resolve().parent
# Repo Root (d:\GitHub\quantum)
REPO_ROOT = SCRIPT_DIR.parent
# Sibling Workspace (d:\GitHub\quantum-workspace)
WORKSPACE_ROOT = REPO_ROOT.parent / "quantum-workspace"

# Repo Sibling Path
STAGING_DIR = REPO_ROOT.parent / "quantum-assets" / "R2_STAGING"

def clean_slug(text):
    if not text: return ""
    return text.lower().strip().replace(' ', '-').replace('/', '-')

def setup_workspace():
    print(f"🚀 Initializing Quantum Workspace...")
    print(f"   Target: {WORKSPACE_ROOT}")

    # 1. Create Root Folders
    master_root = WORKSPACE_ROOT / "R2_MASTER"
    
    for folder in [master_root]:
        if not folder.exists():
            folder.mkdir(parents=True, exist_ok=True)
            print(f"📁 Created Root: {folder}")
        else:
            print(f"✅ Exists: {folder}")

    # 2. Read Projects from CSV
    if not os.path.exists(SOURCE_CSV):
        print(f"❌ Error: Could not find {SOURCE_CSV}")
        return

    print(f"\n📄 Reading Projects from {SOURCE_CSV}...")
    
    count = 0
    with open(SOURCE_CSV, 'r', encoding='utf-8-sig') as f:
        # Read first line to strip headers
        lines = f.readlines()
        if not lines: return
        
        headers = [h.strip() for h in lines[0].split(',')]
        reader = csv.DictReader(lines[1:], fieldnames=headers)
        
        for row in reader:
            raw_name = row.get("Slug Name") or row.get("Name")
            if not raw_name: continue
            
            slug = clean_slug(raw_name)
            
            # Create Project Folders in MASTER
            for root in [master_root]:
                p_folder = root / slug
                if not p_folder.exists():
                    p_folder.mkdir(exist_ok=True)
                    # print(f"   + {slug}") # Too noisy
                    count += 1
            
            # Create Project Folder in STAGING (Repo)
            if STAGING_DIR.exists():
                s_folder = STAGING_DIR / slug
                if not s_folder.exists():
                    s_folder.mkdir(exist_ok=True)

    print(f"\n✨ Done! Synced {count} project folders.")
    print(f"   1. Export Tiffs to:   {master_root}")

if __name__ == "__main__":
    setup_workspace()
