
from PIL import Image

def fix_banner_v7():
    input_path = r"d:\GitHub\eriknorris\public\assets\branding\linkedin_banner_v7_raw.png"
    output_path = r"d:\GitHub\eriknorris\public\assets\branding\linkedin_banner_v7_final.png"

    img = Image.open(input_path)
    width, height = img.size # 1024x1024
    
    # Strategy: "Balanced" 384px height worked perfectly for V6.
    # It captures the subject without being too "loose" (padded) or "tight" (clipped).
    # Since V7 was prompted to be "Low Vertical Profile", this should result in an even cleaner fit.
    
    target_content_height = 384
    target_canvas_width = target_content_height * 4 # 1536 px
    
    # 1. Extract vertical strip
    top = (height - target_content_height) // 2
    bottom = top + target_content_height
    content_strip = img.crop((0, top, width, bottom))
    
    # 2. Create canvas
    bg_color = img.getpixel((0, 0)) 
    new_canvas = Image.new("RGB", (target_canvas_width, target_content_height), bg_color)
    
    # 3. Paste Centered (or Shifted? Let's check the image first... Default to centered for Masterpiece)
    # The prompt asked for "Left to Right" flow, so centering it is safe. 
    # The user can ask for a shift if needed, but "Masterpiece" implies balance.
    
    paste_x = (target_canvas_width - width) // 2
    new_canvas.paste(content_strip, (paste_x, 0))
    
    # 4. Resize to LinkedIn Spec
    final_img = new_canvas.resize((1584, 396), Image.Resampling.LANCZOS)
    
    final_img.save(output_path, quality=100)
    print(f"Saved V7: {final_img.size}")

if __name__ == "__main__":
    fix_banner_v7()
