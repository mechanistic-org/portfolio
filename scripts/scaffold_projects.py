import os
import csv
import glob
import sys

# --- CONFIGURATION ---
# We assume this script is returned from scripts/ to root or similar, 
# but let's just use the relative path hardcoded for the repo structure.
# If running from root: python scripts/scaffold_projects.py
SOURCE_DIR = "data_source"

def find_file(suffix):
    """Find a file in SOURCE_DIR ending with suffix."""
    pattern = os.path.join(SOURCE_DIR, f"*{suffix}")
    matches = glob.glob(pattern)
    return matches[0] if matches else None

def read_csv_smart(filepath, header_trigger="Name"):
    if not filepath or not os.path.exists(filepath): 
        print(f"⚠️  File not found: {filepath}")
        return []
    
    with open(filepath, 'r', encoding='utf-8-sig') as f:
        lines = [l.strip() for l in f.readlines() if l.strip()]
    
    if not lines: return []
    
    start_idx = -1
    for i, line in enumerate(lines):
        if header_trigger in line:
            start_idx = i
            break
    if start_idx == -1: start_idx = 0

    if lines[start_idx].startswith(','): lines[start_idx] = lines[start_idx][1:]
    
    reader = csv.DictReader(lines[start_idx:])
    data = []
    for row in reader:
        clean_row = {k.strip(): (v.strip() if v else "") for k, v in row.items() if k}
        if clean_row: data.append(clean_row)
    return data

def scaffold_content():
    """
    Scaffold missing manual content files for all projects in Main.csv.
    """
    print("🏗️  Scaffolding Content...")
    main_file = find_file("Main.csv")
    if not main_file:
        print("❌ Main.csv not found in data_source/")
        return

    main = read_csv_smart(main_file, "Name")
    
    count = 0
    for row in main:
        name = row.get("Slug Name") or row.get("Name")
        if not name: continue
        
        slug = name.lower().strip().replace(' ', '-').replace('/', '-').strip('.')
        # title = row.get("Descriptive Name") or name
        
        # Check if file exists
        filepath = os.path.join(SOURCE_DIR, "manual_content", f"{slug}.md")
        # Ensure directory exists
        os.makedirs(os.path.dirname(filepath), exist_ok=True)

        if not os.path.exists(filepath):
            print(f"    + Creating {slug}.md")
            
            template = f"""import {{ YouTube }} from '@astro-community/astro-embed-youtube';
import ModelViewer from '@components/mdx/ModelViewer.astro';

## The Challenge
Describe the core problem or opportunity. What were the technical constraints? What was the business goal?

## Engineering Approach
How did you solve it?
*   **Key Decision 1:** ...
*   **Key Decision 2:** ...

## Impact
What was the result? (Metrics, patents, launch success, etc.)

### Project Artifacts
<div class="my-8">
  <YouTube id="dQw4w9WgXcQ" />
</div>
{{{{MODEL_URL}}}}
"""
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(template)
            count += 1
            
    print(f"✅ Scaffolding Complete. Created {count} new files.")

if __name__ == "__main__":
    scaffold_content()
