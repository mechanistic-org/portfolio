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

# Regex for Naming Convention (Strict Mode - Root Level)
# Example: xbox-detail-01.tif
NAMING_PATTERN = re.compile(r"^([\w-]+)-(hero|detail|context|iso|ortho|prototype|assembly|teardown|test|diagram|schematic|exploded|cutaway|render|ui|wireframe|arch|social)-(\d{2})\.(tif|tiff|jpg|jpeg|png)$", re.IGNORECASE)

# Reserved Folders for Pass-Through (Recursive Copy)
RESERVED_FOLDERS = ['3d', 'docs', 'manuals', 'press', 'downloads', 'resources']

def setup_directories():
    """Ensure workspace directories exist."""
    if not MASTER_DIR.exists():
        print(f"Creating Master Directory: {MASTER_DIR}")
        MASTER_DIR.mkdir(parents=True, exist_ok=True)
    
    # We don't create STAGING_DIR here because it should already exist as a git repo
    if not STAGING_DIR.exists():
        print(f"WARNING: Staging Directory not found at {STAGING_DIR}")
        print("Please ensure 'quantum-assets' repo is checked out as a sibling to 'quantum'.")

def process_image_file(item, output_path, strict_naming=True):
    """
    Process a single image file.
    strict_naming: If True, enforces NAMING_PATTERN. If False, allows any name (appends -bp).
    """
    
    # OUTPUT NAME CALCULATION
    if strict_naming:
        match = NAMING_PATTERN.match(item.name)
        if not match:
             # Check for GIF (Animation)
            if item.suffix.lower() == '.gif':
                print(f"    [GIF] Processing {item.name}...")
                try:
                    shutil.copy2(item, output_path / item.name)
                    with Image.open(item) as img:
                        out_name = f"{item.stem}.webp"
                        img.save(output_path / out_name, format='WEBP', save_all=True, optimize=True, quality=85)
                        print(f"      -> Generated: {out_name}")
                except Exception as e:
                    print(f"      [ERROR] GIF processing failed: {e}")
                return

            print(f"    [SKIP] Invalid Strict Name: {item.name}")
            return
        
        base_slug, view_type, sequence, ext = match.groups()
        base_name = f"{base_slug}-{view_type}-{sequence}"
    else:
        # LOOSE MODE (Gallery)
        # We just take the filename stem (no extension)
        if item.suffix.lower() not in ['.jpg', '.jpeg', '.png', '.tif', '.tiff', '.webp']:
             return # Skip non-images
        base_name = item.stem

    print(f"    [IMG] {item.name} -> {base_name}...")

    try:
        with Image.open(item) as img:
            img = ImageOps.exif_transpose(img)
            
            # Convert to RGB
            if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                    pass 
            elif img.mode != 'RGB':
                img = img.convert('RGB')

            # Generate Breakpoints
            for bp_name, width in BREAKPOINTS.items():
                # optimize: skip upscaling
                if width > (img.width * 1.1):
                    continue

                aspect_ratio = img.height / img.width
                height = int(width * aspect_ratio)

                resized_img = img.resize((width, height), Image.Resampling.LANCZOS)

                for fmt in FORMATS:
                    out_ext = fmt["ext"]
                    quality = fmt["quality"]
                    out_filename = f"{base_name}-{bp_name}.{out_ext}"
                    out_file = output_path / out_filename

                    resized_img.save(out_file, quality=quality, optimize=True)
                    # print(f"      -> {out_filename}")

    except Exception as e:
        print(f"    [ERROR] Failed to process {item.name}: {e}")

def process_animation_sequence(folder, output_path):
    """Stitches a folder of images into a single WebP animation."""
    anim_name = folder.name.replace('anim_', '') # Clean name
    print(f"  [ANIMATION] Stitching sequence: {folder.name} -> {anim_name}.webp")
    
    frames = sorted([f for f in folder.iterdir() if f.is_file() and f.suffix.lower() in ['.jpg', '.jpeg', '.tif', '.tiff', '.png']])
    if not frames:
        print(f"    [SKIP] No valid frames found.")
        return

    try:
        pil_frames = []
        for f in frames:
            img = Image.open(f)
            img = ImageOps.exif_transpose(img)
            if img.mode != 'RGB': img = img.convert('RGB')
            pil_frames.append(img)
        
        # Determine Duration (default 500ms for UI flows, can be parsed from name)
        duration = 500
        # Check for _Xms in folder name
        match = re.search(r'[_-](\d+)ms$', folder.name)
        if match:
            duration = int(match.group(1))
            print(f"    [CONFIG] Duration: {duration}ms")

        # Generate Breakpoints
        for bp_name, width in BREAKPOINTS.items():
            resized_frames = []
            ref_img = pil_frames[0]
            aspect_ratio = ref_img.height / ref_img.width
            canvas_height = int(width * aspect_ratio)
            canvas_size = (width, canvas_height)

            for img in pil_frames:
                padded_img = ImageOps.pad(img, canvas_size, method=Image.Resampling.LANCZOS, color=(0,0,0), centering=(0.5, 0.5))
                resized_frames.append(padded_img)
            
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
            print(f"    -> Generated: {out_filename}")

    except Exception as e:
        print(f"    [ERROR] Animation stitching failed: {e}")

def process_project(slug):
    """Process all images for a specific project slug."""
    input_path = MASTER_DIR / slug
    output_path = STAGING_DIR / slug

    if not input_path.exists():
        print(f"Error: Project folder not found in MASTER: {input_path}")
        return

    output_path.mkdir(parents=True, exist_ok=True)

    print(f"Processing Project: {slug}")
    print(f"  Input:  {input_path}")
    print(f"  Output: {output_path}")

    # 1. PROCESS ROOT FILES (Strict Mode)
    # These are your Hero, Detail, and Social images.
    root_items = [f for f in input_path.iterdir() if f.is_file()]
    for item in root_items:
        # Pass-through Root Binaries (GLB, PDF)
        if item.suffix.lower() in ['.pdf', '.glb', '.gltf', '.mp4', '.mov', '.zip']:
            print(f"  [COPY] Root Asset: {item.name}")
            shutil.copy2(item, output_path / item.name)
            continue
        
        process_image_file(item, output_path, strict_naming=True)

    # 2. PROCESS SUBDIRECTORIES (The Routing Engine)
    subdirs = [d for d in input_path.iterdir() if d.is_dir()]
    
    for folder in subdirs:
        name = folder.name.lower()
        
        # ROUTE A: RESERVED PASS-THROUGH
        if name in RESERVED_FOLDERS:
            print(f"  [DOCS] Copying Reserved Folder: {name}/")
            target_dir = output_path / name
            if target_dir.exists(): shutil.rmtree(target_dir) # Clean overwrite
            shutil.copytree(folder, target_dir)
            continue
        
        # ROUTE B: ANIMATION SEQUENCE
        if name.startswith('anim_'):
            process_animation_sequence(folder, output_path)
            continue

        # ROUTE C: GALLERY (Loose Naming)
        if name.startswith('gallery_'):
            print(f"  [GALLERY] Processing Folder: {name}/")
            gallery_out = output_path / name
            gallery_out.mkdir(exist_ok=True)
            
            gallery_imgs = [f for f in folder.iterdir() if f.is_file()]
            for img in gallery_imgs:
                process_image_file(img, gallery_out, strict_naming=False)
            continue

        # ROUTE D: UNKNOWN / IGNORED
        print(f"  [WARN] Unknown folder '{name}' ignored. Use 'gallery_', 'anim_', or reserved names.")

def main():
    parser = argparse.ArgumentParser(description="Quantum Image Processor")
    parser.add_argument("slug", nargs="?", help="Project slug to process (e.g., 'xbox')")
    parser.add_argument("--all", action="store_true", help="Process ALL projects in MASTER directory")
    
    args = parser.parse_args()

    setup_directories()

    if args.all:
        projects = [d.name for d in MASTER_DIR.iterdir() if d.is_dir()]
        for p in projects:
            process_project(p)
    elif args.slug:
        process_project(args.slug)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
