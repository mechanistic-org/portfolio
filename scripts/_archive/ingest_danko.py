import os
import shutil

SOURCE_DIR = r"d:\portfolio\portfolio_working\2004_08_Digidesign_D-Command"
TARGET_BASE = r"d:\GitHub\eriknorris-workspace\R2_MASTER\d-command\bubbles"

# Map Source Patterns to Target Folders (Sticky IDs)
MAPPING = {
    "danko_main_withlabels.png": "02_architecture",
    "danko_fader_withlabels.png": "02_architecture",
    "D-Command_fader_top.jpg": "02_architecture",
    "D-CommandLarge.jpg": "01_intro",
    "Control room 3.JPG": "01_intro",
    "DSC03110.JPG": "03_regulatory", # Assumption: Lab shots
    "DSC03112.JPG": "03_regulatory",
    "DSC03113.JPG": "03_regulatory",
    "DSC03122.JPG": "04_quality",
    "DSC03123.JPG": "04_quality",
    "DSC03182.JPG": "04_quality",
    "DSC03259.jpg": "02_architecture",
    "PCll_Jr_Rev6_Fader_Print.jpg": "04_quality", # PCB Image!
    "PCll_Jr_Rev6_Main_Print.jpg": "04_quality", # PCB Image!
}

def ingest():
    print(f"🚀 Starting D-Command Ingestion (Master Protocol)...")
    
    # Ensure directories exist
    dirs = set(MAPPING.values())
    for d in dirs:
        path = os.path.join(TARGET_BASE, d)
        if not os.path.exists(path):
            os.makedirs(path)
            print(f"Created dir: {d}")

    count = 0
    for filename, target_sub in MAPPING.items():
        src = os.path.join(SOURCE_DIR, filename)
        dst_dir = os.path.join(TARGET_BASE, target_sub)
        dst = os.path.join(dst_dir, filename)
        
        if os.path.exists(src):
            shutil.copy2(src, dst)
            print(f"✅ Copied {filename} -> {target_sub}")
            count += 1
        else:
            print(f"⚠️ Missing source: {filename}")

    print(f"✨ Ingestion Complete. {count} files transferred to MASTER.")

if __name__ == "__main__":
    ingest()
