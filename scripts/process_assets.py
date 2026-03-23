import os
import sys
import argparse
import re
import shutil
from pathlib import Path
from PIL import Image, ImageOps
import pillow_heif  # Modern AVIF support
pillow_heif.register_heif_opener()

# Add 'lib' submodule to path for sidecar imports
SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.append(str(SCRIPT_DIR / "lib"))

try:
    import dxf_renderer
    DXF_SUPPORT = True
except ImportError:
    DXF_SUPPORT = False
    print("Warning: 'dxf_renderer' module not found or dependencies missing (ezdxf/matplotlib). DXF support disabled.")

# --- CONFIGURATION ---
# Logical Mapping:
# INPUT: User's Local Workspace (The "Darkroom")
# OUTPUT: The Repo Sibling (The "Loading Dock")

# Path to this script's directory (d:\GitHub\quantum\scripts)
SCRIPT_DIR = Path(__file__).resolve().parent
# Repo Root (d:\GitHub\quantum)
REPO_ROOT = SCRIPT_DIR.parent

# --- ENVIRONMENT FALLBACK PATTERN ---
try:
    from dotenv import load_dotenv
    # Allow injection of SWARM_ENV_PATH, defaulting to the global swarm config
    master_env_path = Path(os.getenv("SWARM_ENV_PATH", "D:/Assets/.env.swarm"))
    if master_env_path.exists():
        load_dotenv(dotenv_path=master_env_path)
    # Give precedence to local .env
    local_env_path = REPO_ROOT / ".env"
    if local_env_path.exists():
        load_dotenv(dotenv_path=local_env_path, override=True)
except ImportError:
    print("Notice: 'python-dotenv' not found. Relying on system environment variables.")

# Workspace Fallback Config
env_workspace = os.getenv("ERIKNORRIS_WORKSPACE_ROOT")
WORKSPACE_ROOT = Path(env_workspace) if env_workspace else (REPO_ROOT.parent / "portfolio-workspace")
MASTER_DIR = WORKSPACE_ROOT / "R2_MASTER"

# Assets Fallback Config
env_assets = os.getenv("ERIKNORRIS_ASSETS_ROOT")
assets_root = Path(env_assets) if env_assets else (REPO_ROOT.parent / "portfolio-assets")
STAGING_DIR = assets_root / "R2_STAGING"

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


# --- HELPER FUNCTIONS ---
def process_animation_sequence(input_dir, output_dir):
    """Generates an animated WebP from a folder of frames."""
    anim_name = input_dir.name
    print(f"  [ANIMATION] Found sequence folder: {anim_name}/")
    
    frames = sorted([f for f in input_dir.iterdir() if f.is_file() and f.suffix.lower() in ['.jpg', '.jpeg', '.tif', '.tiff', '.png']])
    if not frames:
        print(f"    [SKIP] No valid images in {anim_name}")
        return
    
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
                # Use ImageOps.pad to fit image within canvas without distortion
                padded_img = ImageOps.pad(img, canvas_size, method=Image.Resampling.LANCZOS, color=(0,0,0), centering=(0.5, 0.5))
                resized_frames.append(padded_img)
            
            # Determine Duration
            duration = 2000
            try:
                match = re.search(r'[_-](\d+)ms$', anim_name)
                if match:
                    duration = int(match.group(1))
                    print(f"    [CONFIG] Custom duration found: {duration}ms")
            except:
                pass

            # Save as Animated WebP
            out_filename = f"{anim_name}-{bp_name}.webp"
            out_file = output_dir / out_filename
            
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

            # NEW: Copy source frames to output so React components can reference them individually
            # Create subfolder for frames to keep things clean
            target_frame_dir = output_dir / anim_name
            target_frame_dir.mkdir(parents=True, exist_ok=True)
            
            for frame_file in frames:
               shutil.copy2(frame_file, target_frame_dir / frame_file.name)
            print(f"    -> Copied {len(frames)} source frames to {target_frame_dir.name}")
    
    except Exception as e:
        print(f"    [ERROR] Animation processing failed: {e}")

def setup_directories():
    """Ensure workspace directories exist."""
    if not MASTER_DIR.exists():
        print(f"Creating Master Directory: {MASTER_DIR}")
        MASTER_DIR.mkdir(parents=True, exist_ok=True)
    
    # We don't create STAGING_DIR here because it should already exist as a git repo
    if not STAGING_DIR.exists():
        print(f"WARNING: Staging Directory not found at {STAGING_DIR}")
        print("Please ensure 'quantum-assets' repo is checked out as a sibling to 'quantum'.")

def process_project(slug, force_mode=False):
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
                    
                    # NEW: Nested Animation Support (Check explicitly)
                    if bubble_file.is_dir():
                        process_animation_sequence(bubble_file, target_bubble_path)
                        continue

                    # Pass-throughs (SVG too)
                    if bubble_file.suffix.lower() in ['.pdf', '.glb', '.gltf', '.mp4', '.mov', '.zip', '.svg', '.m4a']:
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





        # --- DOCUMENTS PROCESSING (Pass-through) ---
        if item.is_dir() and item.name == "documents":
            print(f"  [DOCS] Detected documents directory. Syncing...")
            docs_out_path = output_path / "documents"
            docs_out_path.mkdir(parents=True, exist_ok=True)

            for doc_file in item.iterdir():
                if not doc_file.is_file(): continue
                # Allow standard doc formats
                if doc_file.suffix.lower() in ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt', '.zip']:
                    shutil.copy2(doc_file, docs_out_path / doc_file.name)
                    print(f"    -> Copied: {doc_file.name}")
            continue

        # --- 3D ASSETS PROCESSING (Pass-through) ---
        if item.is_dir() and item.name == "3d":
            print(f"  [3D] Detected 3d directory. Syncing...")
            models_out_path = output_path / "3d"
            models_out_path.mkdir(parents=True, exist_ok=True)

            for model_file in item.iterdir():
                if not model_file.is_file(): continue
                # Allow standard 3D formats
                if model_file.suffix.lower() in ['.glb', '.gltf', '.usdz', '.obj', '.fbx']:
                    shutil.copy2(model_file, models_out_path / model_file.name)
                    print(f"    -> Copied: {model_file.name}")
            continue

        # --- ANIMATION SEQUENCE PROCESSING (Fallback) ---
        if item.is_dir():
             process_animation_sequence(item, output_path)
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
                    
                    # NEW: Nested Animation Support
                    if bubble_file.is_dir():
                        process_animation_sequence(bubble_file, target_bubble_path)
                        continue

                    # Pass-throughs
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

        # --- DXF PROCESSING (Sidecar) ---
        if item.suffix.lower() == '.dxf':
            if DXF_SUPPORT:
                # We output to the same portfolio folder (PNGs will be picked up by gallery, SVGs available for diagrams)
                dxf_renderer.convert_dxf_to_assets(item, output_path)
            else:
                print(f"  [SKIP] DXF found but dependencies missing: {item.name}")
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
                # Save in target formats
                    for fmt in FORMATS:
                        out_ext = fmt["ext"]
                        quality = fmt["quality"]
                        # Fix: Ensure logic handles output naming correctly
                        out_filename = f"{base_name}-{bp_name}.{out_ext}"
                        out_file = output_path / out_filename

                        # Smart Skip: Check if output exists and is newer than source
                        if out_file.exists() and not force_mode:
                             source_mtime = item.stat().st_mtime
                             target_mtime = out_file.stat().st_mtime
                             
                             if target_mtime >= source_mtime:
                                 # print(f"    [SKIP] Up to date: {out_filename}") 
                                 # Silent skip to reduce noise? User wants optimization.
                                 # Or maybe print only if verbose?
                                 # Let's print for now so user sees it working.
                                 print(f"    [SKIP] Up to date: {out_filename}")
                                 continue

                        resized_img.save(out_file, quality=quality, optimize=True)
                        print(f"    -> Generated: {out_file.resolve()} (Exists: {out_file.exists()})")

        except Exception as e:
            print(f"  [ERROR] Failed to process {item.name}: {e}")

    # --- AUDIO PROCESSING (Singularity Audit: The Podcast Engine) ---
    audio_files = sorted([f for f in input_path.iterdir() if f.suffix.lower() in ['.wav', '.m4a']])
    for audio_file in audio_files:
        print(f"  [AUDIO] Processing {audio_file.name}...")
        try:
            # Output: .mp3 (192kbps)
            mp3_out_name = f"{audio_file.stem}.mp3"
            mp3_out_path = output_path / mp3_out_name

            # Check if ffmpeg exists
            import subprocess
            try:
                # Use subprocess to run ffmpeg
                # cmd: ffmpeg -i input.wav -b:a 192k -y output.mp3
                # -y force overwrite
                cmd = ["ffmpeg", "-i", str(audio_file), "-b:a", "192k", "-y", str(mp3_out_path)]
                
                # Suppress output unless error
                result = subprocess.run(cmd, capture_output=True, text=True)
                
                if result.returncode == 0:
                     print(f"    -> Generated: {mp3_out_name} (192kbps MP3)")
                else:
                    print(f"    [ERROR] FFmpeg failed: {result.stderr}")

            except FileNotFoundError:
                print("    [WARNING] FFmpeg not found. Falling back to simple COPY (preserving format).")
                shutil.copy2(audio_file, output_path / audio_file.name)
                print(f"    -> Copied: {audio_file.name}")
        
        except Exception as e:
            print(f"    [ERROR] Audio processing failed: {e}")

def main():
    parser = argparse.ArgumentParser(description="Quantum Image Processor")
    parser.add_argument("slug", nargs="?", help="Project slug to process (e.g., 'xbox')")
    parser.add_argument("--all", action="store_true", help="Process ALL projects in MASTER directory")
    parser.add_argument("--force", action="store_true", help="Force re-processing of all assets (ignore mtime)")
    
    args = parser.parse_args()

    setup_directories()

    if args.all:
        # Scan MASTER_DIR for folders
        projects = [d.name for d in MASTER_DIR.iterdir() if d.is_dir()]
        for p in projects:
            process_project(p, force_mode=args.force)
    elif args.slug:
        process_project(args.slug, force_mode=args.force)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
