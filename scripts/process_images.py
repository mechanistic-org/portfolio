import os
import sys
import argparse
import re
import shutil
from pathlib import Path
from PIL import Image, ImageOps
import pillow_heif  # Modern AVIF support
pillow_heif.register_heif_opener()

# --- CONFIGURATION ---
# Logical Mapping:
# INPUT: User's Local Workspace (The "Darkroom")
# OUTPUT: The Repo Sibling (The "Loading Dock")

# Path to this script's directory (d:\GitHub\quantum\scripts)
SCRIPT_DIR = Path(__file__).resolve().parent
# Repo Root (d:\GitHub\quantum)
REPO_ROOT = SCRIPT_DIR.parent
# Sibling Workspace (d:\GitHub\quantum-workspace)
WORKSPACE_ROOT = REPO_ROOT.parent / "quantum-workspace"
MASTER_DIR = WORKSPACE_ROOT / "R2_MASTER"

# Repo Sibling Path (Relative to this script)
# Script is in d:\GitHub\quantum\scripts
# We want d:\GitHub\quantum-assets\R2_STAGING
STAGING_DIR = REPO_ROOT.parent / "quantum-assets" / "R2_STAGING"

# Breakpoints (Widths)
BREAKPOINTS = {
    "xl": 1920,
    "lg": 1280,
    "md": 800,
    "sm": 500
}

# Formats
FORMATS = [
    {"ext": "avif", "quality": 80},
    {"ext": "webp", "quality": 85}
]

# Regex for Naming Convention: {slug}-{view_type}-{sequence}.{ext}
# Example: xbox-detail-01.tif
NAMING_PATTERN = re.compile(r"^([\w-]+)-(hero|detail|context|iso|ortho|prototype|assembly|teardown|test|diagram|schematic|exploded|cutaway|render|ui|wireframe|arch)-(\d{2})\.(tif|tiff|jpg|jpeg|png)$", re.IGNORECASE)

def setup_directories():
    """Ensure workspace directories exist."""
    if not MASTER_DIR.exists():
        print(f"Creating Master Directory: {MASTER_DIR}")
        MASTER_DIR.mkdir(parents=True, exist_ok=True)
    
    # We don't create STAGING_DIR here because it should already exist as a git repo
    if not STAGING_DIR.exists():
        print(f"WARNING: Staging Directory not found at {STAGING_DIR}")
        print("Please ensure 'quantum-assets' repo is checked out as a sibling to 'quantum'.")

def process_project(slug):
    """Process all images for a specific project slug."""
    input_path = MASTER_DIR / slug
    output_path = STAGING_DIR / slug

    if not input_path.exists():
        print(f"Error: Project folder not found in MASTER: {input_path}")
        return

    # Create output folder if it doesn't exist
    output_path.mkdir(parents=True, exist_ok=True)

    print(f"Processing Project: {slug}")
    print(f"  Input:  {input_path}")
    print(f"  Output: {output_path}")

    # Find valid master files (and directories for animations)
    items = sorted(input_path.iterdir())
    
    for item in items:
        # --- BUBBLE PROCESSING (Recursive) ---
        if item.is_dir() and item.name == "bubbles":
            print(f"  [BUBBLE] Detected bubbles directory. Recursing...")
            bubbles_out_path = output_path / "bubbles"
            bubbles_out_path.mkdir(parents=True, exist_ok=True)
            
            for bubble_dir in sorted(item.iterdir()):
                if not bubble_dir.is_dir(): continue
                print(f"    Processing Bubble: {bubble_dir.name}")
                
                # Setup target dir
                target_bubble_path = bubbles_out_path / bubble_dir.name
                target_bubble_path.mkdir(parents=True, exist_ok=True)
                
                # Copy deck.md and config.json
                for config_file in ["deck.md", "config.json"]:
                   if (bubble_dir / config_file).exists():
                       shutil.copy2(bubble_dir / config_file, target_bubble_path / config_file)

                # Process Images inside Bubble
                for bubble_file in bubble_dir.iterdir():
                    if bubble_file.name in ["deck.md", "config.json"]: continue
                    
                    # Pass-throughs (SVG too)
                    if bubble_file.suffix.lower() in ['.pdf', '.glb', '.gltf', '.mp4', '.mov', '.zip', '.svg']:
                        shutil.copy2(bubble_file, target_bubble_path / bubble_file.name)
                        continue
                        
                    # Standard Image Processing
                    try:
                         with Image.open(bubble_file) as img:
                            img = ImageOps.exif_transpose(img)
                            if img.mode != 'RGB': img = img.convert('RGB')
                            
                            # Generate Breakpoints
                            for bp_name, width in BREAKPOINTS.items():
                                if width > (img.width * 1.1): continue
                                aspect_ratio = img.height / img.width
                                height = int(width * aspect_ratio)
                                resized_img = img.resize((width, height), Image.Resampling.LANCZOS)
                                
                                for fmt in FORMATS:
                                    out_filename = f"{bubble_file.stem}-{bp_name}.{fmt['ext']}"
                                    resized_img.save(target_bubble_path / out_filename, quality=fmt['quality'], optimize=True)
                            
                            # Safety Copy (Original for legacy links)
                            shutil.copy2(bubble_file, target_bubble_path / bubble_file.name)

                    except Exception as e:
                        print(f"    [SKIP] Not an image or failed: {bubble_file.name} ({e})")
            continue

        # --- ANIMATION SEQUENCE PROCESSING (Folder -> WebP) ---
        if item.is_dir():
            anim_name = item.name
            print(f"  [ANIMATION] Found sequence folder: {anim_name}/")
            
            frames = sorted([f for f in item.iterdir() if f.is_file() and f.suffix.lower() in ['.jpg', '.jpeg', '.tif', '.tiff', '.png']])
            if not frames:
                print(f"    [SKIP] No valid images in {anim_name}")
                continue
            
            try:
                # Load all frames
                pil_frames = []
                for f in frames:
                    img = Image.open(f)
                    # Fix EXIF Orientation
                    img = ImageOps.exif_transpose(img)
                    if img.mode != 'RGB': img = img.convert('RGB')
                    pil_frames.append(img)
                
                # Generate Breakpoints for Animation
                for bp_name, width in BREAKPOINTS.items():
                    # Resize all frames
                    resized_frames = []
                    
                    # Use first frame as reference for canvas size
                    ref_img = pil_frames[0]
                    aspect_ratio = ref_img.height / ref_img.width
                    canvas_height = int(width * aspect_ratio)
                    canvas_size = (width, canvas_height)

                    for img in pil_frames:
                        # Use ImageOps.pad to fit image within canvas without distortion (Letterboxing)
                        # This prevents "squishing" if frames have different aspect ratios
                        # Fill color: Black (0,0,0) matches the dark theme better than white
                        
                        # Fix: Ensure we are padding to the calculated canvas_size
                        padded_img = ImageOps.pad(img, canvas_size, method=Image.Resampling.LANCZOS, color=(0,0,0), centering=(0.5, 0.5))
                        resized_frames.append(padded_img)
                    
                    # Determine Duration
                    # Look for duration in folder name (e.g. "base-click_testing_500ms")
                    # Default: 2000ms (0.5fps)
                    duration = 2000
                    try:
                        # Check for _Xms or -Xms suffix
                        match = re.search(r'[_-](\d+)ms$', anim_name)
                        if match:
                            duration = int(match.group(1))
                            print(f"    [CONFIG] Custom duration found: {duration}ms")
                    except:
                        pass

                    # Save as Animated WebP
                    out_filename = f"{anim_name}-{bp_name}.webp"
                    out_file = output_path / out_filename
                    
                    resized_frames[0].save(
                        out_file, 
                        save_all=True, 
                        append_images=resized_frames[1:], 
                        optimize=True, 
                        quality=80, 
                        duration=duration, 
                        loop=0,
                        format='WEBP'
                    )
                    print(f"    -> Generated: {out_filename} (Animated Sequence)")
            
            except Exception as e:
                print(f"    [ERROR] Animation processing failed: {e}")
            continue

        # --- BUBBLE PROCESSING (Recursive) ---
        if item.is_dir() and item.name == "bubbles":
            print(f"  [BUBBLE] Detected bubbles directory. Recursing...")
            bubbles_out_path = output_path / "bubbles"
            bubbles_out_path.mkdir(parents=True, exist_ok=True)
            
            for bubble_dir in sorted(item.iterdir()):
                if not bubble_dir.is_dir(): continue
                print(f"    Processing Bubble: {bubble_dir.name}")
                
                # Setup target dir
                target_bubble_path = bubbles_out_path / bubble_dir.name
                target_bubble_path.mkdir(parents=True, exist_ok=True)
                
                # Copy deck.md and config.json
                for config_file in ["deck.md", "config.json"]:
                   if (bubble_dir / config_file).exists():
                       shutil.copy2(bubble_dir / config_file, target_bubble_path / config_file)

                # Process Images inside Bubble
                for bubble_file in bubble_dir.iterdir():
                    if bubble_file.name in ["deck.md", "config.json"]: continue
                    
                    # Pass-throughs
                    if bubble_file.suffix.lower() in ['.pdf', '.glb', '.gltf', '.mp4', '.mov', '.zip', '.svg']:
                        shutil.copy2(bubble_file, target_bubble_path / bubble_file.name)
                        continue
                        
                    # Standard Image Processing (Simplified for Bubbles - maintain original name or add sizing?)
                    # For now, let's treat them as standard images but output to the bubble folder.
                    # We reuse the logic but applied to this file.
                    try:
                         with Image.open(bubble_file) as img:
                            img = ImageOps.exif_transpose(img)
                            if img.mode != 'RGB': img = img.convert('RGB')
                            
                            # Generate Breakpoints
                            for bp_name, width in BREAKPOINTS.items():
                                if width > (img.width * 1.1): continue
                                aspect_ratio = img.height / img.width
                                height = int(width * aspect_ratio)
                                resized_img = img.resize((width, height), Image.Resampling.LANCZOS)
                                
                                for fmt in FORMATS:
                                    out_filename = f"{bubble_file.stem}-{bp_name}.{fmt['ext']}"
                                    resized_img.save(target_bubble_path / out_filename, quality=fmt['quality'], optimize=True)
                            
                            # Also save original size as MD/WebP for reference if needed, or fallback?
                            # Let's ensure the EXACT name requested by deck.md exists if possible, or we need to update deck.md.
                            # Current deck.md refs: "DSC02771.JPG" or "c24-context-05-md.webp".
                            # If deck.md asks for JPG, we should probably copy the JPG or update deck.md.
                            # STICKY POINT: The deck.md files I wrote point to the RAW filenames (e.g. .JPG).
                            # If I optimized them to .webp, the links break unless I update deck.md.
                            # FOR SAFETY: I will copy the original file AND generate WebP.
                            shutil.copy2(bubble_file, target_bubble_path / bubble_file.name)

                    except Exception as e:
                        print(f"    [SKIP] Not an image or failed: {bubble_file.name} ({e})")
            continue

        # --- PASS-THROUGH ASSETS ---
        # Copy non-image assets directly (PDF, GLB, MP4, etc.)
        if item.suffix.lower() in ['.pdf', '.glb', '.gltf', '.mp4', '.mov', '.zip']:
            print(f"  [COPY] {item.name}")
            shutil.copy2(item, output_path / item.name)
            continue

        # --- IMAGE PROCESSING ---
        match = NAMING_PATTERN.match(item.name)
        
        # Handle GIFs specifically (Animated WebP)
        if item.suffix.lower() == '.gif':
            print(f"  [GIF] Processing {item.name}...")
            try:
                # Copy original GIF as fallback
                shutil.copy2(item, output_path / item.name)
                
                # Convert to Animated WebP
                with Image.open(item) as img:
                    out_name = f"{item.stem}.webp"
                    img.save(output_path / out_name, format='WEBP', save_all=True, optimize=True, quality=85)
                    print(f"    -> Generated: {out_name} (Animated WebP)")
            except Exception as e:
                print(f"    [ERROR] GIF processing failed: {e}")
            continue

        if not match:
            print(f"  [SKIP] Invalid Name: {item.name}")
            continue

        base_slug, view_type, sequence, ext = match.groups()
        base_name = f"{base_slug}-{view_type}-{sequence}"
        
        print(f"  [PROCESSING] {item.name}...")

        try:
            with Image.open(item) as img:
                # Fix EXIF Orientation
                img = ImageOps.exif_transpose(img)
                
                # Convert to RGB (strip alpha if present, handle CMYK)
                if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                     # Keep alpha for WebP/AVIF if needed, but usually for photos we want RGB
                     # For now, let's assume photos are RGB. If UI screenshot has transparency, we keep it.
                     pass 
                elif img.mode != 'RGB':
                    img = img.convert('RGB')

                # Generate Breakpoints
                for bp_name, width in BREAKPOINTS.items():
                    # Don't upscale (allow 10% tolerance for near-misses)
                    if width > (img.width * 1.1):
                        continue

                    # Calculate height to maintain aspect ratio
                    aspect_ratio = img.height / img.width
                    height = int(width * aspect_ratio)

                    # Resize (Lanczos for quality)
                    resized_img = img.resize((width, height), Image.Resampling.LANCZOS)

                    # Save in target formats
                    for fmt in FORMATS:
                        out_ext = fmt["ext"]
                        quality = fmt["quality"]
                        out_filename = f"{base_name}-{bp_name}.{out_ext}"
                        out_file = output_path / out_filename

                        resized_img.save(out_file, quality=quality, optimize=True)
                        print(f"    -> Generated: {out_file.resolve()} (Exists: {out_file.exists()})")

        except Exception as e:
            print(f"  [ERROR] Failed to process {item.name}: {e}")

def main():
    parser = argparse.ArgumentParser(description="Quantum Image Processor")
    parser.add_argument("slug", nargs="?", help="Project slug to process (e.g., 'xbox')")
    parser.add_argument("--all", action="store_true", help="Process ALL projects in MASTER directory")
    
    args = parser.parse_args()

    setup_directories()

    if args.all:
        # Scan MASTER_DIR for folders
        projects = [d.name for d in MASTER_DIR.iterdir() if d.is_dir()]
        for p in projects:
            process_project(p)
    elif args.slug:
        process_project(args.slug)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
