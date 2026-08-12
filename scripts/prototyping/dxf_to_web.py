
import sys
import os
import ezdxf
from ezdxf.addons.drawing import RenderContext, Frontend
from ezdxf.addons.drawing.matplotlib import MatplotlibBackend
import matplotlib.pyplot as plt
from pathlib import Path

def convert_dxf(dxf_path, output_dir):
    dxf_path = Path(dxf_path)
    output_dir = Path(output_dir)
    
    if not dxf_path.exists():
        print(f"Error: File not found: {dxf_path}")
        return

    output_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"Loading {dxf_path}...")
    try:
        doc = ezdxf.readfile(dxf_path)
    except IOError:
        print(f"Not a DXF file or a generic I/O error.")
        return
    except ezdxf.DXFStructureError:
        print(f"Invalid or corrupted DXF file.")
        return

    msp = doc.modelspace()
    
    # 1. Export to SVG (using ezdxf's svg backend if preferred, but matplotlib is robust for both)
    # Actually, ezdxf has a native SVG exporter which is often better for pure vectors than matplotlib
    # Let's try the Matplotlib backend first as it handles complex entities well and supports formats via plt.

    print("Rendering...")
    
    # Safe rendering with Matplotlib
    fig = plt.figure()
    ax = fig.add_axes([0, 0, 1, 1])
    ctx = RenderContext(doc)
    
    # Better colors for dark mode web? Or just standard black/white?
    # Let's try to detect if it's dark or light.
    # For now, let's assume valid CAD colors but force background transparent or white.
    
    out_backend = MatplotlibBackend(ax)
    Frontend(ctx, out_backend).draw_layout(msp, finalize=True)
    
    # Save SVG
    svg_path = output_dir / f"{dxf_path.stem}.svg"
    fig.savefig(svg_path, transparent=True)
    print(f"Saved SVG: {svg_path}")
    
    # Save PNG (High Res)
    png_path = output_dir / f"{dxf_path.stem}.png"
    fig.savefig(png_path, dpi=300, transparent=True)
    print(f"Saved PNG: {png_path}")
    
    plt.close(fig)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise SystemExit("Usage: python dxf_to_web.py <local-evidence.dxf> [output-dir]")

    source = sys.argv[1]
    output = sys.argv[2] if len(sys.argv) > 2 else Path(__file__).parent / "output"
    convert_dxf(source, output)
