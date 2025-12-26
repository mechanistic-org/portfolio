import os
from pathlib import Path
import shutil

TARGET_DIR = Path(r"D:\GitHub\quantum-workspace\R2_MASTER\c24")

def main():
    print(f"Scanning {TARGET_DIR}...")
    
    # 1. Find all *upscaled.png files
    upscaled_files = list(TARGET_DIR.glob("*-upscaled.png"))
    
    for upscaled in upscaled_files:
        # Deduce original name: c24-render-01-upscaled.png -> c24-render-01.png
        original_name = upscaled.name.replace("-upscaled", "")
        original_path = TARGET_DIR / original_name
        
        backup_name = original_name.replace(".png", "-BACKUP.png")
        backup_path = TARGET_DIR / backup_name
        
        print(f"Processing: {original_name}")
        
        # 2. Check if original exists (it should)
        if original_path.exists():
            # 3. Rename Original -> Backup
            if not backup_path.exists():
                print(f"  -> Backing up original to {backup_name}")
                original_path.rename(backup_path)
            else:
                print(f"  -> Backup already exists, deleting original: {original_name}")
                original_path.unlink() # Delete original if backup exists
        
        # 4. Rename Upscaled -> Original
        print(f"  -> Swapping Upscaled to {original_name}")
        upscaled.rename(original_path)

if __name__ == "__main__":
    main()
