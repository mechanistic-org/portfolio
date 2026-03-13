import os
import shutil
import sys
from pathlib import Path

def sync_knowledge_items():
    print("🚀 Triggering Agency Memory Synchronization...")
    
    # Define source (IDE's hidden background knowledge folder)
    # The IDE explicitly passes the exact path to its brain folder in the system context.
    user_home = Path.home()
    source_dir = user_home / ".gemini" / "antigravity" / "knowledge"
    
    # Define target (Astro's local content folder)
    # We dump this into src/content/_agency_memory so Astro can optionally access it statically.
    target_dir = Path("src/content/_agency_memory")
    
    print(f"📡 Source Node: {source_dir}")
    print(f"📥 Target Node: {target_dir}")
    
    if not source_dir.exists():
        print("❌ CRITICAL: The Sovereign Source path does not exist. Halting sync.")
        sys.exit(1)
        
    # Clean the entire target directory to ensure we don't have orphaned ghosts
    if target_dir.exists():
        print("🧹 Purging legacy target node...")
        shutil.rmtree(target_dir)
        
    print("⏳ Mirroring Knowledge Items...")
    shutil.copytree(source_dir, target_dir)
    print("✅ Sync Complete. The Matrix has been refreshed.")

if __name__ == "__main__":
    sync_knowledge_items()
