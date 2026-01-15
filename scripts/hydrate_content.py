import os
import argparse
import json
import sys
import subprocess
import frontmatter
from pathlib import Path

# --- Configuration ---
SOURCE_DIR = Path("notebook_dumps")
TARGET_DIR = Path("src/content/projects")

def check_git_status(force=False):
    """
    Ensures the repo is clean before running.
    """
    if force:
        print("⚠️  FORCE MODE: Skipping Git safety check.")
        return True

    try:
        # Check for uncommitted changes
        result = subprocess.run(
            ["git", "status", "--porcelain"], 
            capture_output=True, 
            text=True, 
            check=True
        )
        if result.stdout.strip():
            print("❌  ABORT: Git repository has uncommitted changes.")
            print("    Please commit or stash your changes before running hydration.")
            print("    Or use --force to bypass this check.")
            sys.exit(1)
        print("✅  Git status clean. Proceeding...")
    except FileNotFoundError:
        print("⚠️  Git not found. Skipping safety check.")
    except subprocess.CalledProcessError:
        print("⚠️  Not a git repository or git error. Skipping safety check.")

def find_target_mdx(slug, content_dir):
    """
    Locates the MDX file for a given slug.
    Checks:
    1. src/content/projects/{slug}/index.mdx (Folder Structure)
    2. src/content/projects/{slug}.mdx (File Structure)
    """
    # 1. Folder Structure
    folder_path = content_dir / slug / "index.mdx"
    if folder_path.exists():
        return folder_path
    
    # 2. File Structure
    file_path = content_dir / f"{slug}.mdx"
    if file_path.exists():
        return file_path

    return None

def hydrate_content(dry_run=False, force=False):
    """
    Main hydration logic.
    """
    check_git_status(force)

    if not SOURCE_DIR.exists():
        print(f"❌  Source directory '{SOURCE_DIR}' not found.")
        sys.exit(1)

    json_files = list(SOURCE_DIR.glob("*.json"))
    if not json_files:
        print(f"⚠️  No JSON files found in '{SOURCE_DIR}'.")
        return

    print(f"🔍  Found {len(json_files)} JSON files. Scanning targets...")
    
    stats = {"matched": 0, "skipped": 0, "updated": 0}

    for json_file in json_files:
        slug = json_file.stem # Filename without extension
        target_mdx = find_target_mdx(slug, TARGET_DIR)

        if not target_mdx:
            print(f"⏭️  Skipped: No matching MDX for '{slug}'")
            stats["skipped"] += 1
            continue

        stats["matched"] += 1

        # Load Data
        with open(json_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Load MDX
        try:
            post = frontmatter.load(target_mdx)
        except Exception as e:
            print(f"❌  Error reading '{target_mdx}': {e}")
            continue

        # Prepare Updates
        changes = []
        
        # 1. Metrics (Mapped to forensic_metrics to avoid schema conflict)
        if "metrics" in data:
            if post.metadata.get("forensic_metrics") != data["metrics"]:
                changes.append(f"  - Update 'metrics' -> 'forensic_metrics'")
                post.metadata["forensic_metrics"] = data["metrics"]
        
        # 2. Presentation Mode
        if "presentation_mode" in data:
            if post.metadata.get("presentation_mode") != data["presentation_mode"]:
                changes.append(f"  - Update 'presentation_mode' to '{data['presentation_mode']}'")
                post.metadata["presentation_mode"] = data["presentation_mode"]

        # 3. Forensic Summary
        if "forensic_summary" in data:
             if post.metadata.get("forensic_summary") != data["forensic_summary"]:
                changes.append(f"  - Update 'forensic_summary'")
                post.metadata["forensic_summary"] = data["forensic_summary"]

        # 4. Toolchain
        if "toolchain" in data:
            # Inject generic 'toolchain' array. 
            # Note: We do NOT overwrite existing 'tools' if present, per requirements.
            if post.metadata.get("toolchain") != data["toolchain"]:
                changes.append(f"  - Update 'toolchain'")
                post.metadata["toolchain"] = data["toolchain"]

        # Apply Changes
        if changes:
            print(f"📝  {slug}:")
            for change in changes:
                print(change)
            
            if not dry_run:
                try:
                    # Write back to file
                    # python-frontmatter's dump defaults to --- separators
                    with open(target_mdx, "w", encoding="utf-8") as f:
                        f.write(frontmatter.dumps(post))
                    stats["updated"] += 1
                except Exception as e:
                    print(f"❌  Failed to write '{slug}': {e}")
        else:
            if dry_run:
                print(f"⚪  {slug}: No changes needed.")

    # Summary
    print("-" * 30)
    print(f"🏁  Hydration{' (Dry Run)' if dry_run else ''} Complete.")
    print(f"    Matched: {stats['matched']}")
    print(f"    Skipped: {stats['skipped']}")
    if not dry_run:
        print(f"    Updated: {stats['updated']}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Hydrate Astro MDX content from NotebookLM JSON dumps.")
    parser.add_argument("--dry-run", action="store_true", help="Preview changes without writing to disk.")
    parser.add_argument("--force", action="store_true", help="Bypass Git safety check.")
    
    args = parser.parse_args()
    
    hydrate_content(dry_run=args.dry_run, force=args.force)
