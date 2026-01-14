
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
    # Instead of one SVG with CSS media queries (which can be flaky),
    # we generate two separate SVGs and use HTML <link media="..."> to switch them.
    
    # Light Mode Favicon -> Black Logo
    light_svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg width="192" height="192" viewBox="0 0 192 192" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <image width="192" height="192" href="{black_b64}" />
</svg>'''

    # Dark Mode Favicon -> White Logo
    dark_svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg width="192" height="192" viewBox="0 0 192 192" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <image width="192" height="192" href="{white_b64}" />
</svg>'''

    LIGHT_OUTPUT = Path("public/favicon-light.svg")
    DARK_OUTPUT = Path("public/favicon-dark.svg")

    print(f"Writing to {LIGHT_OUTPUT}...")
    LIGHT_OUTPUT.write_text(light_svg, encoding='utf-8')
    
    print(f"Writing to {DARK_OUTPUT}...")
    DARK_OUTPUT.write_text(dark_svg, encoding='utf-8')
    
    # Verify size
    size_kb = LIGHT_OUTPUT.stat().st_size / 1024
    print(f"Success! Generated separate light/dark favicons. Size: ~{size_kb:.2f} KB each")

if __name__ == "__main__":
    generate()
