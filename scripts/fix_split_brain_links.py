import os
import re
from pathlib import Path

# Target directory
PROJECTS_DIR = Path(r"d:\GitHub\eriknorris\src\content\projects")

def fix_split_brain():
    print("🧠 Starting Split Brain Global Link Replacement...")
    
    if not PROJECTS_DIR.exists():
        print(f"❌ Error: {PROJECTS_DIR} does not exist.")
        return

    # Look for any .md or .mdx file
    search_files = list(PROJECTS_DIR.rglob("*.mdx")) + list(PROJECTS_DIR.rglob("*.md"))
    
    modified_count = 0
    total_replacements = 0

    for file_path in search_files:
        content = file_path.read_text(encoding="utf-8")
        
        # Replace /assets/r2/ with /assets/
        new_content, count = re.subn(r"/assets/r2/", r"/assets/", content)
        
        if count > 0:
            file_path.write_text(new_content, encoding="utf-8")
            modified_count += 1
            total_replacements += count
            print(f"  📝 Fixed {count} instances in {file_path.name}")

    print(f"\n✅ Scan Complete.")
    print(f"✅ Modified {modified_count} files.")
    print(f"✅ Replaced {total_replacements} total '/assets/r2/' links.")

if __name__ == "__main__":
    fix_split_brain()
