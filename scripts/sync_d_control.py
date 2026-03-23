import os
import shutil
import time

SOURCE_DIR = r"D:\GitHub\portfolio-assets\R2_STAGING\d-control\bubbles"
TARGET_DIR = r"D:\GitHub\portfolio\public\assets\r2\d-control\bubbles"

def sync():
    print(f"🚀 Starting Robust Sync (D-Control)...")
    print(f"  Source: {SOURCE_DIR}")
    print(f"  Target: {TARGET_DIR}")
    
    if not os.path.exists(SOURCE_DIR):
        print(f"❌ Source not found!")
        return

    # Walk source
    for root, dirs, files in os.walk(SOURCE_DIR):
        # Create corresponding target dir
        rel_path = os.path.relpath(root, SOURCE_DIR)
        target_path = os.path.join(TARGET_DIR, rel_path)
        
        if not os.path.exists(target_path):
            os.makedirs(target_path)
            print(f"  Created: {rel_path}")
            
        for file in files:
            src_file = os.path.join(root, file)
            dst_file = os.path.join(target_path, file)
            
            # Simple Copy with Retry
            retries = 3
            while retries > 0:
                try:
                    shutil.copy2(src_file, dst_file)
                    print(f"  ✅ Copied: {file}")
                    break
                except Exception as e:
                    print(f"  ⚠️ Locked: {file}. Retrying in 1s...")
                    time.sleep(1)
                    retries -= 1
                    if retries == 0:
                        print(f"  ❌ Failed to copy: {file} ({e})")

    print(f"✨ Sync Complete.")

if __name__ == "__main__":
    sync()
