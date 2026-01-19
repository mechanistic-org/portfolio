import os
import re

# --- CONFIGURATION ---
GAP_REPORT_PATH = r"D:\GitHub\eriknorris-workspace\podcasts\gold_gap_report.md"
PROJECTS_DIR = r"d:\GitHub\eriknorris\src\content\projects"

def parse_gap_report(report_path):
    """
    Parses the gold_gap_report.md to extract missing items per project.
    Returns: { "project_slug": { "Vendors": [terms], "Technical": [terms]... } }
    """
    if not os.path.exists(report_path):
        print(f"❌ Report not found: {report_path}")
        return {}
        
    with open(report_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    updates = {}
    current_slug = None
    
    # Regex to find Slug
    slug_pattern = re.compile(r"\*\*Linked Project:\*\* `(.*?)`")
    
    for line in lines:
        line = line.strip()
        
        # New File/Project Block
        slug_match = slug_pattern.search(line)
        if slug_match:
            current_slug = slug_match.group(1)
            if current_slug not in updates:
                updates[current_slug] = {}
            continue
            
        # Parse Missing Items
        if line.startswith("- **Missing"):
            # Format: - **Missing Category:** Term, Term
            if not current_slug:
                continue
                
            parts = line.split(":**", 1)
            if len(parts) == 2:
                category_raw = parts[0].replace("- **Missing", "").strip()
                terms_raw = parts[1].strip()
                
                # Check for "None" or empty
                if not terms_raw:
                    continue
                    
                if category_raw not in updates[current_slug]:
                    updates[current_slug][category_raw] = []
                    
                updates[current_slug][category_raw].append(terms_raw)
                
    return updates

def generate_addendum(gold_data):
    """
    Creates the Markdown block to append.
    """
    lines = []
    lines.append("\n\n---")
    lines.append("## 🔍 Forensic Analysis (Audio Source)")
    lines.append("> *The following entities were identified in audio records but missing from written documentation.*")
    lines.append("")
    
    for category, terms_list in gold_data.items():
        # unique terms (deduplicate and sort)
        unique_terms = sorted(list(set(terms_list)))
        all_terms = ", ".join(unique_terms)
        lines.append(f"- **{category}:** {all_terms}")
        
    return "\n".join(lines)

def inject_projects(updates, dry_run=True):
    print(f"🔧 Starting Injection (Dry Run: {dry_run})...")
    
    count = 0
    for slug, data in updates.items():
        if not data:
            continue
            
        project_path = os.path.join(PROJECTS_DIR, slug, "index.mdx")
        
        # Handle "webtv-cortez" -> folder might be webtv-cortez, but check mapping
        if not os.path.exists(project_path):
            print(f"⚠️  Skipping {slug}: File not found at {project_path}")
            continue
            
        # Read Original
        with open(project_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        # Idempotency Check
        if "## 🔍 Forensic Analysis (Audio Source)" in content:
            print(f"⏭️  Skipping {slug}: Already injected.")
            continue
            
        addendum = generate_addendum(data)
        
        if dry_run:
            print(f"Would inject into [{slug}]:")
            print(addendum)
            print("-" * 20)
        else:
            with open(project_path, "a", encoding="utf-8") as f:
                f.write(addendum)
            print(f"✅ Injected into {slug}")
        
        count += 1
        
    print(f"🏁 Processed {count} projects.")

if __name__ == "__main__":
    updates = parse_gap_report(GAP_REPORT_PATH)
    # Default to False (Live) if user approves, but code defaults to True/Manual arg usually.
    # For this environment, we'll set dry_run=False to execute if confirmed. 
    # But let's stick to the plan: "Dry Run First"
    import sys
    is_dry = "--dry-run" in sys.argv
    inject_projects(updates, dry_run=is_dry)
