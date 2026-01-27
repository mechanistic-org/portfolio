
from PIL import Image, ImageOps

def fix_banner_pad():
    input_path = r"d:\GitHub\eriknorris\public\assets\branding\linkedin_banner_hybrid_v4_raw.png"
    output_path = r"d:\GitHub\eriknorris\public\assets\branding\linkedin_banner_hybrid_padded.png"

    img = Image.open(input_path)
    width, height = img.size # 1024x1024
    
    # Strategy: Capture more vertical height (Breathing Room)
    # Previous crop was 256px height. Let's double it to 512px.
    target_content_height = 512
    
    # For a 4:1 ratio at this height, we need Width = Height * 4
    target_canvas_width = target_content_height * 4 # 2048 px
    
    # 1. Extract the center 512px strip from the source (1024x512)
    top = (height - target_content_height) // 2
    bottom = top + target_content_height
    content_strip = img.crop((0, top, width, bottom))
    
    # 2. Create new canvas with background color
    # Sample corner pixel for background
    bg_color = img.getpixel((0, 0)) 
    new_canvas = Image.new("RGB", (target_canvas_width, target_content_height), bg_color)
    
    # 3. Paste content in center
    paste_x = (target_canvas_width - width) // 2
    new_canvas.paste(content_strip, (paste_x, 0))
    
    # 4. Resize to LinkedIn Spec (1584x396)
    final_img = new_canvas.resize((1584, 396), Image.Resampling.LANCZOS)
    
    final_img.save(output_path, quality=100)
    print(f"Original: {width}x{height}")
    print(f"Content Height Kept: {target_content_height}")
    print(f"New Canvas: {target_canvas_width}x{target_content_height}")
    print(f"Saved: {final_img.size}")

if __name__ == "__main__":
    fix_banner_pad()
