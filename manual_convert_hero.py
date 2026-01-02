from PIL import Image
import os

source = r"D:\GitHub\quantum-workspace\R2_MASTER\c24\c24-hero-01.png"
dest = r"D:\GitHub\quantum\public\assets\r2\c24\c24-hero-01-xl.webp"

print(f"Opening {source}...")
img = Image.open(source)
print(f"Saving to {dest}...")
img.save(dest, "WEBP", quality=90)
print("Done.")
