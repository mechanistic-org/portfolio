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


# --- Reverse Hydration (MDX -> Resume/LinkedIn) ---

def reverse_hydrate(dry_run=False):
    """
    Extracts 'forensic_metrics' and 'war_stories' from Project MDX files
    and updates RESUME_READY.txt and LINKEDIN_READY.txt.
    """
    resume_path = Path("public/assets/prompts/RESUME_READY.txt")
    linkedin_path = Path("public/assets/branding/LINKEDIN_READY.txt")
    
    # 1. Collect Data from MDX
    project_data = {}
    mdx_files = list(TARGET_DIR.glob("**/*.mdx"))
    
    for mdx_file in mdx_files:
        try:
            post = frontmatter.load(mdx_file)
            project_slug = post.metadata.get("slug") or mdx_file.stem
            
            # Extract War Stories
            war_stories = []
            if "metrics" in post.metadata and "war_stories" in post.metadata["metrics"]:
                stories = post.metadata["metrics"]["war_stories"]
                for story in stories:
                    if isinstance(story, dict): # Handle object format
                        label = story.get('label')
                        # EXCLUSION LIST: Items to keep in Project MDX but HIDE from Resume/LinkedIn
                        if "Berry Creek" in label:
                            continue
                        war_stories.append(f"- **{label}**: {story.get('description')}")
            
            # Extract Forensic Metrics
            forensics = []
            if "forensic_metrics" in post.metadata:
                fm = post.metadata["forensic_metrics"]
                if fm.get("financial"): forensics.append(f"- **Financial**: {fm['financial']}")
                if fm.get("process"): forensics.append(f"- **Process**: {fm['process']}")
                if fm.get("technical"): forensics.append(f"- **Technical**: {fm['technical']}")

            if war_stories or forensics:
                project_data[project_slug] = {
                    "title": post.metadata.get("title", project_slug),
                    "war_stories": war_stories,
                    "forensics": forensics
                }
                
        except Exception as e:
            print(f"⚠️  Error reading MDX {mdx_file}: {e}")

    # 2. Generate Resume Section
    new_resume_section = "\n## PROJECT ARTIFACTS (Auto-Generated)\n\n"
    for slug, data in project_data.items():
        new_resume_section += f"### {data['title']}\n"
        for item in data['forensics']:
            new_resume_section += item + "\n"
        for item in data['war_stories']:
            new_resume_section += item + "\n"
        new_resume_section += "\n"

    # 3. Update Resume File
    if resume_path.exists():
        with open(resume_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        # Basic append if marker not found (First Run)
        if "## PROJECT ARTIFACTS (Auto-Generated)" not in content:
            updated_content = content + "\n" + new_resume_section
        else:
            # Replace existing block (Regex or simple split would be better, but simple split for now)
            pre_split = content.split("## PROJECT ARTIFACTS (Auto-Generated)")[0]
            updated_content = pre_split + new_resume_section
            
        if not dry_run:
            with open(resume_path, "w", encoding="utf-8") as f:
                f.write(updated_content)
            print("✅  Updated RESUME_READY.txt")
        else:
            print("⚪  [Dry Run] Would update RESUME_READY.txt")

    # 4. Generate LinkedIn Section (Copy-Paste Ready)
    # Format: 
    # [Project Name]
    # [Forensic Summary]
    # - Bullet 1
    # - Bullet 2
    
    new_linkedin_section = "\n## LINKEDIN EXPERIENCE BLURBS (Auto-Generated)\n\n"
    for slug, data in project_data.items():
        new_linkedin_section += f"**{data['title']}**\n"
        for item in data['forensics']:
            new_linkedin_section += item + "\n"
        for item in data['war_stories']:
            # Berry Creek filtering happens during data collection (step 1), so it's already filtered here.
            # However, for safety and clarity if logic changes:
            new_linkedin_section += item + "\n"
        new_linkedin_section += "\n"

    # 5. Update LinkedIn File
    if linkedin_path.exists():
        with open(linkedin_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        if "## LINKEDIN EXPERIENCE BLURBS (Auto-Generated)" not in content:
            updated_content = content + "\n" + new_linkedin_section
        else:
             pre_split = content.split("## LINKEDIN EXPERIENCE BLURBS (Auto-Generated)")[0]
             updated_content = pre_split + new_linkedin_section
        
        if not dry_run:
            with open(linkedin_path, "w", encoding="utf-8") as f:
                f.write(updated_content)
            print("✅  Updated LINKEDIN_READY.txt")
        else:
            print("⚪  [Dry Run] Would update LINKEDIN_READY.txt")
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Hydrate content from JSON dumps or Reverse Hydrate MDX to Text.")
    parser.add_argument("--force", action="store_true", help="Bypass Git safety check.")
    parser.add_argument("--reverse", action="store_true", help="Run Reverse Hydration (MDX -> Resume).")
    parser.add_argument("--dry-run", action="store_true", help="Simulate without writing.")
    
    args = parser.parse_args()
    
    if args.reverse:
        print("🔄  Starting Reverse Hydration...")
        reverse_hydrate(dry_run=args.dry_run)
    else:
        hydrate_content(dry_run=args.dry_run, force=args.force)

