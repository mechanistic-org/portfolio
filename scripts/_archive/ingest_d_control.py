import os
import shutil

SOURCE_DIR = r"d:\portfolio\portfolio_working\2004_Digidesign_D-Control"
TARGET_BASE = r"d:\GitHub\portfolio-workspace\R2_MASTER\d-control\bubbles"

# Map Source to Target (Sticky IDs)
MAPPING = {
    # Intro / Hero
    "DControlES-xlarge.png": "01_intro",
    "full_big.jpg": "01_intro",
    
    # Adhesion Crisis (Peel Test)
    "04_Engineering_plastic-parts/944010957-00_PROBLEMS.pdf": "01_adhesion_crisis",
    "04_Engineering_plastic-parts/RING_LITE_PIPE FINISHING INSTRUCTIONS.pdf": "01_adhesion_crisis",
    
    # Process Control (Plasma/Factory)
    "03_Proto_early-ID/PCll_Front.jpg": "02_process_control",
    "03_Proto_early-ID/PCll_Rendering.jpg": "02_process_control",
    "D-Control_Service_Guide.pdf": "02_process_control", # Exploded views
    
    # Extra Context
    "d-control-hero-01.png": "01_intro",
}

def ingest():
    print(f"🚀 Starting D-Control Ingestion (Master Protocol)...")
    
    # Ensure directories exist
    dirs = set(MAPPING.values())
    for d in dirs:
        path = os.path.join(TARGET_BASE, d)
        if not os.path.exists(path):
            os.makedirs(path)
            print(f"Created dir: {d}")

    count = 0
    for src_rel, target_sub in MAPPING.items():
        src = os.path.join(SOURCE_DIR, src_rel)
        dst_dir = os.path.join(TARGET_BASE, target_sub)
        dst = os.path.join(dst_dir, os.path.basename(src_rel))
        
        if os.path.exists(src):
            shutil.copy2(src, dst)
            print(f"✅ Copied {os.path.basename(src)} -> {target_sub}")
            count += 1
        else:
            print(f"⚠️ Missing source: {src}")

    print(f"✨ Ingestion Complete. {count} files transferred to MASTER.")

if __name__ == "__main__":
    ingest()
