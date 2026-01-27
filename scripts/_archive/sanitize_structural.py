import os
import re

def rename_structural_assets():
    directory = r"D:\GitHub\quantum-assets\R2_STAGING\c24\structural"
    
    for filename in os.listdir(directory):
        # 1. Handle the #1-1.JPG pattern -> forensic-1-1.jpg
        # 2. Lowercase everything
        # 3. Replace spaces with hyphens
        
        new_name = filename.lower()
        
        # Replace "#" with "forensic-"
        if new_name.startswith("#"):
            new_name = new_name.replace("#", "forensic-")
            
        # Replace spaces and special chars
        new_name = new_name.replace(" ", "-").replace("&", "and")
        
        # Ensure only alphanumeric, hyphen, dot
        new_name = re.sub(r'[^a-z0-9.-]', '', new_name)
        
        old_path = os.path.join(directory, filename)
        new_path = os.path.join(directory, new_name)
        
        if old_path != new_path:
            try:
                os.rename(old_path, new_path)
                print(f"Renamed: {filename} -> {new_name}")
            except Exception as e:
                print(f"Error renaming {filename}: {e}")

if __name__ == "__main__":
    rename_structural_assets()
