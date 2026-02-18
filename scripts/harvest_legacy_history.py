import subprocess
import json
import os
import argparse
from pathlib import Path
import datetime

# --- Configuration ---
DEFAULT_LEGACY_REPO = Path("../quantum")
TARGET_JSON = Path("src/data/legacy_history.json")

def harvest_git_history(repo_path):
    """
    Extracts git log from the specified repo path.
    Format: hash|author|date|message
    """
    if not repo_path.exists():
        print(f"❌ Legacy repo path not found: {repo_path}")
        return []

    print(f"🔍 Harvesting history from: {repo_path.resolve()}")
    
    # Git command
    # %H: Commit Hash
    # %an: Author Name
    # %ad: Author Date (ISO 8601-like)
    # %s: Subject
    cmd = [
        "git",
        "-C", str(repo_path),
        "log",
        "--pretty=format:%H|%an|%ad|%s",
        "--date=iso"
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
        if result.returncode != 0:
            print(f"❌ Git Error: {result.stderr}")
            return []
            
        logs = []
        lines = result.stdout.strip().split('\n')
        
        print(f"   🔹 Processing {len(lines)} commits...")
        
        for line in lines:
            parts = line.split('|')
            if len(parts) >= 4:
                # reconstruct message if it contained pipes
                msg = "|".join(parts[3:])
                
                entry = {
                    "hash": parts[0],
                    "author": parts[1],
                    "date": parts[2],
                    "message": msg,
                    "source": "legacy_quantum" # Tag source to distinguish from live repo
                }
                logs.append(entry)
                
        return logs

    except Exception as e:
        print(f"❌ Execution Error: {e}")
        return []

def main():
    parser = argparse.ArgumentParser(description="Harvest Legacy Git History")
    parser.add_argument("--repo", type=Path, default=DEFAULT_LEGACY_REPO, help="Path to legacy repo")
    args = parser.parse_args()
    
    history = harvest_git_history(args.repo)
    
    if history:
        # Create output dir if needed
        TARGET_JSON.parent.mkdir(parents=True, exist_ok=True)
        
        with open(TARGET_JSON, "w", encoding="utf-8") as f:
            json.dump(history, f, indent=2)
            
        print(f"✅ Successfully saved {len(history)} legacy commits to {TARGET_JSON}")
        print("   Next Step: Import this JSON in your Colophon/Timeline component.")
    else:
        print("⚠️  No history harvested.")

if __name__ == "__main__":
    main()
