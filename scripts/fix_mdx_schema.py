import frontmatter
import os
from pathlib import Path
import re

TARGET_DIR = Path("src/content/projects")

def fix_mdx_schema():
    print("🚑 Starting MDX Schema Fix (String -> Object)...")
    
    mdx_files = list(TARGET_DIR.glob("**/*.mdx"))
    stats = {"fixed": 0, "skipped": 0, "errors": 0}

    for mdx_file in mdx_files:
        try:
            post = frontmatter.load(mdx_file)
            needs_save = False
            
            # Check forensic_summary
            if "forensic_summary" in post.metadata:
                summary = post.metadata["forensic_summary"]
                
                if isinstance(summary, str):
                    print(f"  ⚡ Fixing '{mdx_file.name}' legacy summary...")
                    
                    new_summary = {
                        "trigger": "Legacy Data (Migration)",
                        "intervention": "Legacy Data (Migration)",
                        "result": summary
                    }
                    
                    # Regex Tries (Same as migration script)
                    pattern = r"(?:Trigger|Crisis):\s*(.*?)\s*(?:Intervention|Action|Fix):\s*(.*?)\s*(?:Result|Outcome):\s*(.*)"
                    match = re.search(pattern, summary, re.IGNORECASE | re.DOTALL)
                    
                    if match:
                        new_summary["trigger"] = match.group(1).strip()
                        new_summary["intervention"] = match.group(2).strip()
                        new_summary["result"] = match.group(3).strip()
                    
                    post.metadata["forensic_summary"] = new_summary
                    needs_save = True
                    stats["fixed"] += 1
            
            if needs_save:
                with open(mdx_file, "wb") as f:
                    frontmatter.dump(post, f)
            else:
                stats["skipped"] += 1

        except Exception as e:
            print(f"❌ Error processing '{mdx_file}': {e}")
            stats["errors"] += 1

    print("-" * 30)
    print(f"🏁 MDX Fix Complete.")
    print(f"   Fixed:   {stats['fixed']}")
    print(f"   Skipped: {stats['skipped']}")
    print(f"   Errors:  {stats['errors']}")

if __name__ == "__main__":
    fix_mdx_schema()
