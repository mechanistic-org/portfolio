import os
import csv

# --- CONFIGURATION ---
SOURCE_CSV = "data_source/Main.csv"
OUTPUT_DIR = "R2_STAGING" # <--- This folder will appear on your desktop/project root

def clean_slug(text):
    if not text: return ""
    return text.lower().strip().replace(' ', '-').replace('/', '-')

def create_folders():
    print(f"🚀 Starting Folder Factory...")
    
    if not os.path.exists(SOURCE_CSV):
        print(f"❌ Error: Could not find {SOURCE_CSV}")
        return

    # Create the main container folder
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        print(f"📁 Created root directory: {OUTPUT_DIR}/")

    count = 0
    with open(SOURCE_CSV, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            # 1. Get the Name
            raw_name = row.get("Slug Name")
            if not raw_name: continue
            
            # 2. Convert to Slug (EXACT same logic as ingestion script)
            slug = clean_slug(raw_name)
            
            # 3. Create the Folder
            folder_path = os.path.join(OUTPUT_DIR, slug)
            
            if not os.path.exists(folder_path):
                os.makedirs(folder_path)
                print(f"   + Created: {slug}/")
                count += 1
            else:
                print(f"   . Exists:  {slug}/")

    print(f"\n✅ Done! Created {count} project folders in '{OUTPUT_DIR}'")
    print("👉 Now drag your real images into these folders, then drag the whole 'R2_STAGING' folder to Cloudflare.")

if __name__ == "__main__":
    create_folders()