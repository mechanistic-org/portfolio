
from PIL import Image

def fix_banner_v4():
    input_path = r"d:\GitHub\portfolio\public\assets\branding\linkedin_banner_hybrid_v4_raw.png"
    output_path = r"d:\GitHub\portfolio\public\assets\branding\linkedin_banner_hybrid_v4_final.png"

    img = Image.open(input_path)
    width, height = img.size
    print(f"Input: {width}x{height}")

    # The content is centered and complex. We need a 4:1 crop.
    target_height = width // 4
    top = (height - target_height) // 2
    bottom = top + target_height
    
    # Crop
    crop_box = (0, top, width, bottom)
    cropped_img = img.crop(crop_box)
    
    # Resize to LinkedIn Spec
    final_img = cropped_img.resize((1584, 396), Image.Resampling.LANCZOS)
    
    final_img.save(output_path, quality=100)
    print(f"Saved: {final_img.size}")

if __name__ == "__main__":
    fix_banner_v4()
