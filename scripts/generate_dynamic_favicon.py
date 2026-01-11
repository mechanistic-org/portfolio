
import re
import os
import base64
from io import BytesIO
from pathlib import Path
from PIL import Image

# Paths relative to the project root
BLACK_LOGO_PATH = Path("public/assets/branding/EN_logo_black_1200.svg")
WHITE_LOGO_PATH = Path("public/assets/branding/EN_logo_white_1200.svg")
OUTPUT_PATH = Path("public/favicon.svg")
TARGET_SIZE = (192, 192) # Max size needed for high-dpi favicons

def extract_base64(path):
    if not path.exists():
        raise FileNotFoundError(f"File not found: {path}")

    content = path.read_text(encoding='utf-8')
    
    # Regex to find the data URI
    match = re.search(r'(?:xlink:)?href="(data:image/[^;]+;base64,[^"]+)"', content)
    if not match:
        match = re.search(r"(?:xlink:)?href='(data:image/[^;]+;base64,[^']+)'", content)
    
    if match:
        return match.group(1)
    raise ValueError(f"Could not find base64 image data in {path}")

def optimize_image_data(b64_string):
    """Decodes, resizes, and re-encodes base64 image data."""
    # Strip prefix
    header, encoded = b64_string.split(',', 1)
    
    # Decode
    data = base64.b64decode(encoded)
    
    # Process with PIL
    img = Image.open(BytesIO(data))
    
    # Resize (Lanczos for quality)
    img.thumbnail(TARGET_SIZE, Image.Resampling.LANCZOS)
    
    # Save to buffer
    buffer = BytesIO()
    img.save(buffer, format="PNG", optimize=True)
    
    # Re-encode
    new_data = base64.b64encode(buffer.getvalue()).decode('utf-8')
    return f"{header},{new_data}"

def generate():
    print(f"Processing Black Logo: {BLACK_LOGO_PATH}")
    try:
        black_raw = extract_base64(BLACK_LOGO_PATH)
        black_b64 = optimize_image_data(black_raw)
        print("  - Optimized black logo")
    except Exception as e:
        print(f"Error processing black logo: {e}")
        return

    print(f"Processing White Logo: {WHITE_LOGO_PATH}")
    try:
        white_raw = extract_base64(WHITE_LOGO_PATH)
        white_b64 = optimize_image_data(white_raw)
        print("  - Optimized white logo")
    except Exception as e:
        print(f"Error processing white logo: {e}")
        return

    # Logic:
    # Light Mode System -> needs high contrast key -> Black Logo
    # Dark Mode System  -> needs high contrast key -> White Logo
    
    svg_template = f'''<svg width="192" height="192" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
  <style>
    /* Default: Light Mode preference matches Black Logo */
    .logo-dark {{ display: none; }}
    .logo-light {{ display: block; }}

    /* Dark Mode preference matches White Logo */
    @media (prefers-color-scheme: dark) {{
      .logo-dark {{ display: block; }}
      .logo-light {{ display: none; }}
    }}
  </style>
  
  <!-- "logo-light" means "Logo for Light Mode" (Black Color) -->
  <image class="logo-light" width="192" height="192" href="{black_b64}" />
  
  <!-- "logo-dark" means "Logo for Dark Mode" (White Color) -->
  <image class="logo-dark" width="192" height="192" href="{white_b64}" />
</svg>'''

    print(f"Writing to {OUTPUT_PATH}...")
    OUTPUT_PATH.write_text(svg_template, encoding='utf-8')
    
    # Verify size
    size_kb = OUTPUT_PATH.stat().st_size / 1024
    print(f"Success! Generated optimized dynamic favicon. Size: {size_kb:.2f} KB")

if __name__ == "__main__":
    generate()
