
from PIL import Image

def fix_banner():
    # Paths
    input_path = r"d:\GitHub\eriknorris\public\assets\branding\linkedin_banner_hybrid.png"
    output_path = r"d:\GitHub\eriknorris\public\assets\branding\linkedin_banner_hybrid_final.png"

    # Load
    img = Image.open(input_path)
    width, height = img.size
    print(f"Original: {width}x{height}")

    # Calculate 4:1 Center Crop
    target_height = width // 4
    top = (height - target_height) // 2
    bottom = top + target_height
    
    # Crop
    crop_box = (0, top, width, bottom)
    cropped_img = img.crop(crop_box)
    print(f"Cropped to: {cropped_img.size}")

    # Resize to LinkedIn Spec (1584x396)
    final_img = cropped_img.resize((1584, 396), Image.Resampling.LANCZOS)
    
    # Save
    final_img.save(output_path, quality=100)
    print(f"Saved Final: {final_img.size} to {output_path}")

if __name__ == "__main__":
    fix_banner()
