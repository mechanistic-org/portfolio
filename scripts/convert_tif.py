from pathlib import Path
from PIL import Image
import os

def convert_tifs(directory):
    path = Path(directory)
    for file in path.rglob("*.tif"):
        try:
            with Image.open(file) as img:
                new_path = file.with_suffix('.png')
                img.save(new_path, "PNG")
                print(f"Converted: {file} -> {new_path}")
        except Exception as e:
            print(f"Error converting {file}: {e}")

convert_tifs(r"D:\GitHub\quantum-assets\R2_STAGING\c24")
