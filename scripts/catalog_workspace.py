
import os
import json
import argparse
from pathlib import Path

def catalog_workspace(root_dir, output_file):
    """
    Scans the workspace and generates a JSON manifest of the file structure.
    Skips binary files and common ignore folders.
    """
    manifest = {
        "root": str(root_dir),
        "structure": {},
        "summary": {
            "total_files": 0,
            "total_size_mb": 0,
            "extensions": {}
        }
    }

    ignore_dirs = {'.git', 'node_modules', '__pycache__', '.ds_store', 'dist', '.astro'}
    
    # Walk the directory
    for root, dirs, files in os.walk(root_dir):
        # Filter directories in-place
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        
        rel_path = os.path.relpath(root, root_dir)
        if rel_path == ".":
            rel_path = ""
            
        current_node = manifest["structure"]
        if rel_path:
            parts = rel_path.split(os.sep)
            for part in parts:
                if part not in current_node:
                    current_node[part] = {}
                current_node = current_node[part]
        
        for file in files:
            file_path = os.path.join(root, file)
            size_bytes = os.path.getsize(file_path)
            ext = os.path.splitext(file)[1].lower()
            
            # Update summary stats
            manifest["summary"]["total_files"] += 1
            manifest["summary"]["total_size_mb"] += size_bytes / (1024 * 1024)
            manifest["summary"]["extensions"][ext] = manifest["summary"]["extensions"].get(ext, 0) + 1
            
            # Add to structure (leaf node)
            # We don't store full content, just metadata
            current_node[file] = {
                "size_kb": round(size_bytes / 1024, 2),
                "type": "file"
            }

    # Write to file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2)
    
    print(f"Catalog complete. Manifest written to {output_file}")
    print(f"Scanned {manifest['summary']['total_files']} files ({round(manifest['summary']['total_size_mb'], 2)} MB).")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Catalog workspace files.")
    parser.add_argument("root_dir", help="Root directory to scan")
    parser.add_argument("--output", default="workspace_manifest.json", help="Output JSON file")
    
    args = parser.parse_args()
    
    catalog_workspace(args.root_dir, args.output)
