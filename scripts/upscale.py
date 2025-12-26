import os
import subprocess
import argparse
from pathlib import Path

# Configuration
UPSCALER_BIN = r"C:\Program Files\Upscayl\resources\bin\upscayl-bin.exe"
MODELS_PATH = r"C:\Program Files\Upscayl\resources\models"
DEFAULT_MODEL = "upscayl-standard-4x" # Standard Upscayl model
SCALE_FACTOR = 4

def upscale_image(input_path, output_path, model=DEFAULT_MODEL):
    """
    Wraps the upscayl-bin CLI to upscale a single image.
    """
    input_path = Path(input_path).resolve()
    output_path = Path(output_path).resolve()

    if not input_path.exists():
        print(f"[ERROR] Input file not found: {input_path}")
        return False

    print(f"[UPSCALING] {input_path.name} -> {output_path.name} ({model})")
    
    # Construct command
    # upscayl-bin -i input -o output -s 4 -m models_path -n model_name
    cmd = [
        UPSCALER_BIN,
        "-i", str(input_path),
        "-o", str(output_path),
        "-s", str(SCALE_FACTOR),
        "-m", MODELS_PATH,
        "-n", model,
        "-f", "png" # Force PNG for lossless intermediate
    ]

    try:
        # Run process
        result = subprocess.run(cmd, capture_output=True, text=True, check=True, encoding='utf-8', errors='replace')
        print(f"   -> Success!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"   -> Failed! Exit Code: {e.returncode}")
        print(f"   -> Stderr: {e.stderr}")
        return False
    except FileNotFoundError:
        print(f"   -> Error: '{UPSCALER_BIN}' not found. Is it in your PATH?")
        return False

def main():
    parser = argparse.ArgumentParser(description="Batch upscale images using Upscayl.")
    parser.add_argument("input", help="Input file or directory")
    parser.add_argument("--model", default=DEFAULT_MODEL, help=f"Model name (default: {DEFAULT_MODEL})")
    
    args = parser.parse_args()
    
    input_path = Path(args.input)
    
    if input_path.is_file():
        # Single file mode
        # Output to same folder with -upscaled suffix
        output_name = f"{input_path.stem}-upscaled.png"
        output_path = input_path.parent / output_name
        upscale_image(input_path, output_path, args.model)
        
    elif input_path.is_dir():
        # Directory mode
        # Create 'upscaled' subfolder
        output_dir = input_path / "upscaled"
        output_dir.mkdir(exist_ok=True)
        
        valid_exts = {".png", ".jpg", ".jpeg", ".webp", ".tif", ".tiff"}
        
        for file in input_path.iterdir():
            if file.suffix.lower() in valid_exts:
                output_path = output_dir / f"{file.stem}.png"
                upscale_image(file, output_path, args.model)

if __name__ == "__main__":
    main()
