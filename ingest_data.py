import os
import csv
import json
import urllib.parse
import urllib.request

# --- CONFIGURATION ---
SOURCE_DIR = "data_source"
OUTPUT_CONTENT_DIR = "src/content/projects"
OUTPUT_DATA_DIR = "src/data"
ASSETS_DIR = "src/assets/placeholders"

# Ensure directories exist
os.makedirs(OUTPUT_CONTENT_DIR, exist_ok=True)
os.makedirs(OUTPUT_DATA_DIR, exist_ok=True)
os.makedirs(ASSETS_DIR, exist_ok=True)

def read_csv_with_header_search(filepath, header_trigger="Name"):
    print(f"   🔎 Inspecting {filepath}...")
    if not os.path.exists(filepath): 
        print(f"      ❌ CRITICAL ERROR: File not found!")
        return []
        
    with open(filepath, 'r', encoding='utf-8-sig') as f:
        lines = f.readlines()
    
    print(f"      📄 File has {len(lines)} lines.")
    
    start_index = 0
    headers = []
    for i, line in enumerate(lines):
        if header_trigger in line:
            print(f"      ✅ Found trigger '{header_trigger}' on line {i+1}")
            headers = next(csv.reader([line]))
            start_index = i + 1
            break
    
    if not headers: 
        print(f"      ❌ CRITICAL ERROR: Could not find header row containing '{header_trigger}'")
        print(f"      👀 First 5 lines of file:")
        for l in lines[:5]: print(f"         {l.strip()}")
        return []
    
    print(f"      🏷️  Headers detected: {headers}")
    
    data = []
    reader = csv.reader(lines[start_index:])
    for row in reader:
        if not row or not row[0].strip(): continue
        item = {}
        for h_index, h_name in enumerate(headers):
            if h_index < len(row):
                item[h_name.strip()] = row[h_index].strip()
        data.append(item)
    
    print(f"      📊 Parsed {len(data)} valid rows.")
    return data

def process_projects():
    print("\n🏗️  STARTING PROJECT PROCESSING...")
    
    # Load Data
    projects = read_csv_with_header_search(os.path.join(SOURCE_DIR, "Main.csv"), "Slug Name")
    
    if not projects:
        print("   ❌ No projects found. Stopping.")
        return

    count = 0
    for i, row in enumerate(projects):
        name = row.get("Slug Name")
        
        # DEBUG: Print why we might be skipping
        if not name: 
            print(f"   ⚠️  Row {i} skipped: 'Slug Name' is empty.")
            continue

        # If we get here, we are writing a file
        slug = name.lower().replace(' ', '-').replace('/', '-')
        filename = f"{slug}.mdx"
        
        # Just write a minimal file to prove it works
        with open(os.path.join(OUTPUT_CONTENT_DIR, filename), "w", encoding="utf-8") as f:
            f.write(f"---\ntitle: \"{name}\"\n---")
            
        count += 1

    print(f"\n✅ INGESTION COMPLETE. Wrote {count} files to {OUTPUT_CONTENT_DIR}")

if __name__ == "__main__":
    process_projects()