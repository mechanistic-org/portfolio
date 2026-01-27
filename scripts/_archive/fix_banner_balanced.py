
from PIL import Image

def fix_banner_balanced():
    input_path = r"d:\GitHub\eriknorris\public\assets\branding\linkedin_banner_hybrid_v4_raw.png"
    output_path = r"d:\GitHub\eriknorris\public\assets\branding\linkedin_banner_hybrid_v5_balanced.png"

    img = Image.open(input_path)
    width, height = img.size # 1024x1024
    
    # "Goldilocks" Strategy
    # Crop height = 256px (Too Tight, clips gears)
    # Padded height = 512px (Too Loose, tiny subject)
    # Balanced height = 384px
    
    target_content_height = 384
    
    # Required Width for 4:1 Ratio
    target_canvas_width = target_content_height * 4 # 1536 px
    
    # 1. Extract the vertical strip of 384px
    top = (height - target_content_height) // 2
    bottom = top + target_content_height
    content_strip = img.crop((0, top, width, bottom))
    
    # 2. Create canvas
    bg_color = img.getpixel((0, 0)) 
    new_canvas = Image.new("RGB", (target_canvas_width, target_content_height), bg_color)
    
    # 3. Paste in center
    paste_x = (target_canvas_width - width) // 2
    new_canvas.paste(content_strip, (paste_x, 0))
    
    # 4. Resize to Official Spec (1584x396) - Just a slight upscale from 1536x384
    final_img = new_canvas.resize((1584, 396), Image.Resampling.LANCZOS)
    
    final_img.save(output_path, quality=100)
    print(f"Original: {width}x{height}")
    print(f"Balanced Height: {target_content_height}")
    print(f"New Canvas: {target_canvas_width}x{target_content_height}")
    print(f"Saved: {final_img.size}")

if __name__ == "__main__":
    fix_banner_balanced()
