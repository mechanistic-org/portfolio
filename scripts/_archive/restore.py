import os
from pathlib import Path

TARGET_DIR = Path(r"D:\GitHub\quantum-workspace\R2_MASTER\c24")

def main():
    print(f"Restoring backups in {TARGET_DIR}...")
    
    # Find all backup files
    backups = list(TARGET_DIR.glob("*-BACKUP.png"))
    
    for backup in backups:
        # Deduce original name: c24-render-01-BACKUP.png -> c24-render-01.png
        original_name = backup.name.replace("-BACKUP", "")
        original_path = TARGET_DIR / original_name
        
        print(f"Restoring: {original_name}")
        
        # 1. Delete the "bad" upscaled version if it exists
        if original_path.exists():
            print(f"  -> Removing bad upscaled file")
            original_path.unlink()
            
        # 2. Rename Backup -> Original
        print(f"  -> Restoring backup")
        backup.rename(original_path)

if __name__ == "__main__":
    main()
