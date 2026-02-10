import json
import re
from pathlib import Path
import sys

# Configuration
SOURCE_DIR = Path("notebook_dumps")

def migrate_v1_to_v2():
    print("🚀 Starting V1 -> V2 Schema Migration...")
    
    if not SOURCE_DIR.exists():
        print(f"❌ Source directory '{SOURCE_DIR}' not found.")
        sys.exit(1)

    json_files = list(SOURCE_DIR.glob("*.json"))
    print(f"🔍 Found {len(json_files)} JSON files.")
    
    stats = {"migrated": 0, "skipped": 0, "errors": 0}

    for json_file in json_files:
        try:
            with open(json_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            
            needs_save = False
            slug = json_file.stem

            # Check for forensic_summary
            if "forensic_summary" in data:
                summary = data["forensic_summary"]
                
                # If String -> Migrate
                if isinstance(summary, str):
                    print(f"  ⚡ Migrating '{slug}'...")
                    
                    # Naive Parsing Strategy
                    # Try to split by "Trigger:" "Intervention:" "Result:"
                    # Or just default to Legacy
                    
                    new_summary = {
                        "trigger": "Legacy Data (Migration)",
                        "intervention": "Legacy Data (Migration)",
                        "result": summary
                    }
                    
                    # Regex Tries
                    # Matches "Trigger: ... Intervention: ... Result: ..."
                    pattern = r"(?:Trigger|Crisis):\s*(.*?)\s*(?:Intervention|Action|Fix):\s*(.*?)\s*(?:Result|Outcome):\s*(.*)"
                    match = re.search(pattern, summary, re.IGNORECASE | re.DOTALL)
                    
                    if match:
                        new_summary["trigger"] = match.group(1).strip()
                        new_summary["intervention"] = match.group(2).strip()
                        new_summary["result"] = match.group(3).strip()
                        print(f"    ✅ Parsed structure successfully.")
                    else:
                        print(f"    ⚠️  Could not parse structure. Wrappping entire string in 'result'.")

                    data["forensic_summary"] = new_summary
                    needs_save = True
                    stats["migrated"] += 1
                
                elif isinstance(summary, dict):
                     # Already V2
                     pass
            
            # Save if needed
            if needs_save:
                # Add version tag
                data["_schema_version"] = "v2.0"
                
                with open(json_file, "w", encoding="utf-8") as f:
                    json.dump(data, f, indent=4)
            else:
                stats["skipped"] += 1

        except Exception as e:
            print(f"❌ Error processing '{json_file}': {e}")
            stats["errors"] += 1

    print("-" * 30)
    print(f"🏁 Migration Complete.")
    print(f"   Migrated: {stats['migrated']}")
    print(f"   Skipped:  {stats['skipped']}")
    print(f"   Errors:   {stats['errors']}")

if __name__ == "__main__":
    migrate_v1_to_v2()
