import json
import shutil
from pathlib import Path
import sys

# Configuration
SOURCE_DIR = Path("notebook_dumps")
BACKUP_DIR = Path("notebook_dumps_backup")

def migrate_dumps():
    print("🚀 Starting Schema Migration...")
    
    # 1. Backup
    if SOURCE_DIR.exists():
        if BACKUP_DIR.exists():
            shutil.rmtree(BACKUP_DIR)
        shutil.copytree(SOURCE_DIR, BACKUP_DIR)
        print(f"✅ Backup created at {BACKUP_DIR}")
    else:
        print("❌ Source directory not found!")
        return

    # 2. Iterate and Migrate
    json_files = list(SOURCE_DIR.glob("*.json"))
    updated_count = 0

    for json_file in json_files:
        try:
            with open(json_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            
            changes = []
            
            # --- MIGRATION LOGIC ---
            
            # 1. metrics -> forensic_metrics (Financial/Process/Governance)
            if "metrics" in data:
                metrics = data["metrics"]
                new_forensic = data.get("forensic_metrics", {})
                
                keys_to_move = ["financial", "process", "governance", "technical"]
                
                for key in keys_to_move:
                    if key in metrics:
                        val = metrics[key]
                        if val:
                            new_forensic[key] = val
                            changes.append(f"Moved metrics.{key} -> forensic_metrics.{key}")
                            del metrics[key] # Cleanup old key
                
                if new_forensic:
                    data["forensic_metrics"] = new_forensic

            # 2. metrics.scars -> scars (Root)
            if "metrics" in data and "scars" in metrics:
                ws = metrics["scars"]
                if ws:
                    data["scars"] = ws
                    changes.append(f"Moved metrics.scars -> scars (Root)")
                    del metrics["scars"]

            # 3. Cleanup empty metrics object
            if "metrics" in data and not data["metrics"]:
                del data["metrics"]
                changes.append("Removed empty metrics object")

            # --- END MIGRATION LOGIC ---

            if changes:
                print(f"📝 Migrating {json_file.name}:")
                for change in changes:
                    print(f"  - {change}")
                
                with open(json_file, "w", encoding="utf-8") as f:
                    json.dump(data, f, indent=4)
                updated_count += 1
            
        except Exception as e:
            print(f"❌ Error processing {json_file.name}: {e}")

    print("-" * 30)
    print(f"🏁 Migration Complete. Updated {updated_count} files.")

if __name__ == "__main__":
    migrate_dumps()
