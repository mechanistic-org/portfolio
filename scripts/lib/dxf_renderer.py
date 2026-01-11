
import sys
import os
import ezdxf
from ezdxf.addons.drawing import RenderContext, Frontend
from ezdxf.addons.drawing.matplotlib import MatplotlibBackend
import matplotlib.pyplot as plt
from pathlib import Path

def convert_dxf_to_assets(dxf_path, output_dir):
    """
    Converts a single DXF file to SVG and PNG assets.
    Returns a list of generated file paths.
    """
    dxf_path = Path(dxf_path)
    output_dir = Path(output_dir)
    generated_files = []
    
    if not dxf_path.exists():
        print(f"Error: File not found: {dxf_path}")
        return generated_files

    # Ensure output directory exists
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"  [DXF] Processing {dxf_path.name}...")
    try:
        doc = ezdxf.readfile(dxf_path)
    except IOError:
        print(f"    [ERROR] Not a DXF file or I/O error.")
        return generated_files
    except ezdxf.DXFStructureError:
        print(f"    [ERROR] Invalid or corrupted DXF file.")
        return generated_files

    msp = doc.modelspace()
    
    # Set up the plotting backend
    # Note: We create a fresh figure for each render to avoid memory leaks or overlap
    fig = plt.figure()
    ax = fig.add_axes([0, 0, 1, 1])
    ctx = RenderContext(doc)
    
    # Draw the layout
    try:
        out_backend = MatplotlibBackend(ax)
        Frontend(ctx, out_backend).draw_layout(msp, finalize=True)
        
        # 1. Save SVG (Vector)
        svg_path = output_dir / f"{dxf_path.stem}.svg"
        fig.savefig(svg_path, transparent=True)
        generated_files.append(str(svg_path))
        print(f"    -> Generated: {svg_path.name}")
        
        # 2. Save PNG (Raster - High Res)
        # 300 DPI gives a good balance for 'zooming in' on schemas
        png_path = output_dir / f"{dxf_path.stem}.png"
        fig.savefig(png_path, dpi=300, transparent=True)
        generated_files.append(str(png_path))
        print(f"    -> Generated: {png_path.name}")

        # 3. Save PDF (Archival/AI Vector)
        # Useful for NotebookLM and high-fidelity archival
        pdf_path = output_dir / f"{dxf_path.stem}.pdf"
        fig.savefig(pdf_path, transparent=True)
        generated_files.append(str(pdf_path))
        print(f"    -> Generated: {pdf_path.name}")

    except Exception as e:
        print(f"    [ERROR] Rendering failed: {e}")
    finally:
        plt.close(fig)

    return generated_files

if __name__ == "__main__":
    # Standalone usage validation
    import argparse
    parser = argparse.ArgumentParser(description="Standalone DXF Renderer")
    parser.add_argument("input", help="Input DXF file or directory")
    parser.add_argument("output", nargs="?", help="Output directory (Optional: defaults to input location)")
    args = parser.parse_args()
    
    input_path = Path(args.input)
    
    # Determine output path if not specified
    if args.output:
        output_path = Path(args.output)
    else:
        # Default to the same folder as input
        output_path = input_path if input_path.is_dir() else input_path.parent
    
    if input_path.is_file():
        convert_dxf_to_assets(input_path, output_path)
    elif input_path.is_dir():
        for item in input_path.iterdir():
            if item.suffix.lower() == '.dxf':
                convert_dxf_to_assets(item, output_path)
