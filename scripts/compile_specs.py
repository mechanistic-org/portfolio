import os
import re
import json
import frontmatter
import argparse
from pathlib import Path

# Paths
ROOT_DIR = Path(__file__).parent.parent
DUMPS_DIR = ROOT_DIR / "notebook_dumps"
PROJECTS_DIR = ROOT_DIR / "src/content/projects"

def parse_spec_file(slug):
    """
    Smart Parser: Reads {slug}.txt and extracts:
    1. Narrative (Markdown Headers)
    2. Complexity (JSON Block)
    3. Entropy (JSON Block)
    4. Data Tables (Markdown Tables -> JSON)
    """
    txt_path = DUMPS_DIR / f"{slug}.txt"
    if not txt_path.exists():
        print(f"⚠️  Spec file missing: {txt_path}")
        return None

    content = txt_path.read_text(encoding="utf-8")
    
    parsed_data = {
        "forensic_summary": {},
        "scars": [],
        "complexity_vector": {},
        "events": [],
        "custom_tables": {}
    }

    # 1. EXTRACT JSON BLOCKS
    json_blocks = re.findall(r'```json\s*(\{.*?\})\s*```', content, re.DOTALL)
    for block in json_blocks:
        try:
            data = json.loads(block)
            # Complexity Vector
            if "complexity_vector" in data:
                print(f"   🔹 Found Complexity Vector (V2)")
                parsed_data["complexity_vector"] = data["complexity_vector"]
            # Entropy / Events
            if "events" in data:
                print(f"   🔹 Found Events (Entropy)")
                parsed_data["events"] = data["events"]
            # Narrative Fallback (if user pasted BOLUS JSON)
            if "forensic_summary" in data:
                print(f"   🔹 Found Bolus Narrative")
                parsed_data["forensic_summary"] = data["forensic_summary"]
            if "war_stories" in data:
                parsed_data["scars"] = data["war_stories"]
        except json.JSONDecodeError as e:
            print(f"   ❌ JSON Parse Error in block: {e}")

    # 2. EXTRACT NARRATIVE (MARKDOWN)
    # Looking for standard headers from REPORT_READY
    # Simple regex for now - can be expanded
    summary_match = re.search(r'## I\. PROJECT SUMMARY(.*?)(?=##|$)', content, re.DOTALL)
    if summary_match:
        print(f"   🔹 Found Narrative Summary (MD)")
        # TODO: Advanced parsing of bullets to dict if needed
        # For now, we rely on the JSON Bolus primarily, or manual Frontmatter
        pass

    # 3. EXTRACT DATA TABLES (MARKDOWN)
    # Look for ## Data: [Name]
    table_matches = re.finditer(r'## Data: (.*?)\n(\|.*\|.*\|)', content)
    for match in table_matches:
        table_name = match.group(1).strip()
        table_content = match.group(0) # Capture the whole block for now
        print(f"   🔹 Found Data Table: {table_name}")
        # Simplistic parser: user converts to JSON in their head? 
        # Future: Implement MD Table -> JSON conversion here.
        parsed_data["custom_tables"][table_name] = "Parsed from Spec"

    return parsed_data

def hydrate_project(slug, spec_data):
    """
    Updates src/content/projects/{slug}/index.mdx with spec_data
    """
    mdx_path = PROJECTS_DIR / slug / "index.mdx"
    if not mdx_path.exists():
        print(f"❌ Project MDX not found: {mdx_path}")
        return

    post = frontmatter.load(mdx_path)
    
    # Update Frontmatter
    if spec_data.get("complexity_vector"):
        post["complexity_vector"] = spec_data["complexity_vector"]
    
    if spec_data.get("forensic_summary"):
        post["forensic_summary"] = spec_data["forensic_summary"]

    if spec_data.get("scars"):
        post["scars"] = spec_data["scars"]

    # Write back
    with open(mdx_path, "wb") as f:
        frontmatter.dump(post, f)
    
    print(f"✅ Hydrated {slug} MDX")

    # Update Entropy Sidecar
    if spec_data.get("events"):
        entropy_path = DUMPS_DIR / f"{slug}_entropy.json" # Or inside Content?
        # Actually, we usually merge it into index.mdx "events" frontmatter or separate file?
        # Standard: events in frontmatter for Seismograph
        post["events"] = spec_data["events"]
        with open(mdx_path, "wb") as f:
            frontmatter.dump(post, f)
        print(f"✅ Updated Events for {slug}")

def main():
    parser = argparse.ArgumentParser(description="Spec V2 Compiler")
    parser.add_argument("--target", help="Specific project slug to compile")
    parser.add_argument("--audit", action="store_true", help="Audit all projects")
    args = parser.parse_args()

    if args.target:
        print(f"🔧 Compiling Spec for: {args.target}")
        spec = parse_spec_file(args.target)
        if spec:
            hydrate_project(args.target, spec)
        else:
            print("   (No .txt spec found. Skipping)")

def audit_all_projects():
    """
    Scans all projects in src/content/projects and reports their Spec Status.
    """
    print(f"{'PROJECT SLUG':<30} | {'SPEC V2':<12} | {'COMPLEXITY':<15} | {'STATUS'}")
    print("-" * 80)
    
    # Get all project directories
    projects = [p for p in PROJECTS_DIR.iterdir() if p.is_dir()]
    
    v2_count = 0
    legacy_count = 0
    
    for proj in sorted(projects):
        slug = proj.name
        mdx_path = proj / "index.mdx"
        spec_path = DUMPS_DIR / f"{slug}.txt"
        
        # Check Spec
        has_spec = "YES" if spec_path.exists() else "NO"
        
        # Check MDX Complexity
        has_complexity = "MISSING"
        if mdx_path.exists():
            try:
                post = frontmatter.load(mdx_path)
                if post.get("complexity_vector"):
                    has_complexity = "BOUND"
                    if isinstance(post["complexity_vector"], list):
                         has_complexity = "V1-LIST"
                else:
                    has_complexity = "NONE"
            except Exception:
                has_complexity = "ERROR"
        
        # Determine Status
        if spec_path.exists():
            status = "V2 READY"
            v2_count += 1
        else:
            status = "LEGACY"
            legacy_count += 1
            
        print(f"{slug:<30} | {has_spec:<12} | {has_complexity:<15} | {status}")

    print("-" * 80)
    print(f"SUMMARY: V2 Ready: {v2_count} | Legacy V1: {legacy_count} | Total: {len(projects)}")

def main():
    parser = argparse.ArgumentParser(description="Spec V2 Compiler")
    parser.add_argument("--target", help="Specific project slug to compile")
    parser.add_argument("--audit", action="store_true", help="Audit all projects")
    args = parser.parse_args()

    if args.target:
        print(f"Compiling Spec for: {args.target}")
        spec = parse_spec_file(args.target)
        if spec:
            hydrate_project(args.target, spec)
        else:
            print("   (No .txt spec found. Skipping)")

    if args.audit:
        print("Auditing all projects...")
        audit_all_projects()

if __name__ == "__main__":
    main()
