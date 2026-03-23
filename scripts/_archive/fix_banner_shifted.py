
from PIL import Image

def fix_banner_shifted():
    input_path = r"d:\GitHub\portfolio\public\assets\branding\linkedin_banner_hybrid_v4_raw.png"
    output_path = r"d:\GitHub\portfolio\public\assets\branding\linkedin_banner_hybrid_v6_shifted.png"

    img = Image.open(input_path)
    width, height = img.size # 1024x1024
    
    # Same "Balanced" Height strategy
    target_content_height = 384
    target_canvas_width = target_content_height * 4 # 1536 px
    
    # 1. Extract strip
    top = (height - target_content_height) // 2
    bottom = top + target_content_height
    content_strip = img.crop((0, top, width, bottom))
    
    # 2. Create canvas
    bg_color = img.getpixel((0, 0)) 
    new_canvas = Image.new("RGB", (target_canvas_width, target_content_height), bg_color)
    
    # 3. Paste - SHIFTED RIGHT
    # Instead of centering, we maximize the Left Padding.
    # Total Padding = target_canvas_width - width = 1536 - 1024 = 512px.
    # We put roughly 80% of padding on the left to clear the avatar.
    # Left Pad = 400px. Right Pad = 112px.
    
    paste_x = 400 
    new_canvas.paste(content_strip, (paste_x, 0))
    
    # 4. Resize to Official Spec (1584x396)
    final_img = new_canvas.resize((1584, 396), Image.Resampling.LANCZOS)
    
    final_img.save(output_path, quality=100)
    print(f"Original: {width}x{height}")
    print(f"Shift Applied: +400px Left Padding")
    print(f"Saved: {final_img.size}")

if __name__ == "__main__":
    fix_banner_shifted()
