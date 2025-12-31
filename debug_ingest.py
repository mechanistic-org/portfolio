import os
import csv
import json

SOURCE_DIR = "data_source"
OUTPUT_DATA_DIR = "src/config"

def find_file(name):
    for root, dirs, files in os.walk(SOURCE_DIR):
        if name in files:
            return os.path.join(root, name)
    return None

def read_csv_smart(filepath, key_field):
    with open(filepath, mode='r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        return list(reader)

def debug():
    main_path = find_file("Main.csv")
    print(f"Main CSV: {main_path}")
    rows = read_csv_smart(main_path, "Slug Name")
    
    for row in rows:
        name = row.get("Slug Name") or row.get("Name")
        if not name: continue
        
        # Exact logic from ingest_data.py
        slug = name.lower().strip().replace(' ', '-').replace('/', '-').replace('|', '-')
        print(f"Row: '{name}' -> slug: '{slug}'")
        
        if "c" in slug and "24" in slug:
            print(f"FOUND TARGET: raw_name='{name}' -> slug='{slug}'")
            
            intelligence_path = os.path.join(OUTPUT_DATA_DIR, f"{slug}_intelligence.json")
            print(f"Checking path: {intelligence_path}")
            print(f"Exists? {os.path.exists(intelligence_path)}")
            
            # List directory to see what IS there
            print(f"Contents of {OUTPUT_DATA_DIR}:")
            print(os.listdir(OUTPUT_DATA_DIR))

if __name__ == "__main__":
    debug()
