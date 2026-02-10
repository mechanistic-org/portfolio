import frontmatter
import os
from pathlib import Path
import sys

# --- Taxonomy Definitions (Mirrored from src/config/taxonomy.ts) ---
INDUSTRIES = ["consumer_electronics", "pro_audio", "consumer_appliance", "automation"]
CATEGORIES = [
    "consumer_electronics", "mobile_device", "wearable_ar", "home_entertainment", "smart_home", "appliance",
    "enterprise_hardware", "medical_device", "computing", "control_surface",
    "input_device", "module_subsystem"
]
EMPLOYERS = [
    "digidesign", "mechanistic", "kaleidescape", "noon", "hyphen", 
    "silicon_graphics", "frogdesign", "ep_technologies", "avegant", "erik_norris", "Self-Employed"
]
CLIENTS = ["microsoft", "webtv", "ultimatetv", "frogdesign"]
PRODUCTION_STATUS = ["discovery", "definition", "concept", "prototype", "validation", "production"]
PRODUCTION_SCALE = ["one_off", "limited", "series", "mass", "global"]
ROLES = ["mechanical_engineer", "industrial_designer", "software_engineer", "project_lead", "consultant", "other"]
TOOLS = [
    "pro_engineer", "windchill", "solidworks", "cad", "other", "onshape", 
    "ptc_creo", "adobe_creative_suite", "blender", "keyshot", "thermal_simulation", "autocad"
]
TAGS = [
    "Thermal", "Mechanism", "Cost_Down", "Process", "Leadership", "Crisis", 
    "Yield", "Automation", "Architecture", "Acoustics", "Materials"
]

TARGET_DIR = Path("src/content/projects")

# --- Label to Value Mappings for Auto-Fix ---
INDUSTRY_MAP = {
    "Consumer Electronics": "consumer_electronics",
    "Pro Audio": "pro_audio",
    "Consumer Appliance": "consumer_appliance",
    "Automation": "automation"
}

CATEGORY_MAP = {
    "Enterprise Hardware": "enterprise_hardware",
    "Medical Device": "medical_device",
    "Computing": "computing",
    "Control Surface": "control_surface",
    "Input Device": "input_device",
    "Module / Sub-system": "module_subsystem",
    "Consumer Electronics": "consumer_electronics",
    "Mobile Device": "mobile_device",
    "Wearable / AR": "wearable_ar",
    "Home Entertainment": "home_entertainment",
    "Smart Home": "smart_home",
    "Appliance": "appliance"
}

def audit_keystatic_compliance():
    print("🔍 Starting Keystatic Compliance Audit (Round 2)...")
    
    mdx_files = list(TARGET_DIR.glob("**/*.mdx"))
    stats = {"files": 0, "errors": 0, "warnings": 0, "fixed": 0}
    
    for mdx_file in mdx_files:
        stats["files"] += 1
        try:
            post = frontmatter.load(mdx_file)
            slug = post.metadata.get("slug") or mdx_file.stem
            needs_save = False
            file_errors = []
            
            # --- Check 1: Enums ---
            
            # Industry
            if "industry" in post.metadata:
                val = post.metadata["industry"]
                if val not in INDUSTRIES:
                    if val in INDUSTRY_MAP:
                        post.metadata["industry"] = INDUSTRY_MAP[val]
                        needs_save = True
                        print(f"  ✨ Fixed Industry Label: '{val}' -> '{INDUSTRY_MAP[val]}'")
                    else:
                        file_errors.append(f"❌ Invalid Industry: '{val}'")
            
            # Category
            if "category" in post.metadata:
                val = post.metadata["category"]
                if val not in CATEGORIES:
                    if val in CATEGORY_MAP:
                        post.metadata["category"] = CATEGORY_MAP[val]
                        needs_save = True
                        print(f"  ✨ Fixed Category Label: '{val}' -> '{CATEGORY_MAP[val]}'")
                    else:
                         file_errors.append(f"❌ Invalid Category: '{val}'")

            # Employer
            if "employer" in post.metadata:
                val = post.metadata["employer"]
                if val not in EMPLOYERS:
                     val_lower = val.lower().replace(" ", "_")
                     if val_lower in EMPLOYERS:
                         post.metadata["employer"] = val_lower
                         needs_save = True
                         print(f"  ✨ Fixed Employer case for {slug}")
                     elif val == "Self Employed": 
                         post.metadata["employer"] = "Self-Employed"
                         needs_save = True
                     else:
                        file_errors.append(f"❌ Invalid Employer: '{val}'")

            # --- Check 2: Tags ---
            if "tags" in post.metadata:
                tags = post.metadata["tags"]
                # Tags should be clean now, but let's check
                valid_tags = [t for t in tags if t in TAGS]
                if len(valid_tags) != len(tags):
                    post.metadata["tags"] = valid_tags
                    needs_save = True
                    print(f"  ✨ Removed {len(tags) - len(valid_tags)} residual invalid tags")
            
            # --- Check 3: Forensic Summary ---
            if "forensic_summary" in post.metadata:
                fs = post.metadata["forensic_summary"]
                if isinstance(fs, str):
                    new_summary = {
                        "trigger": "Legacy Data (Audit Fix)",
                        "intervention": "Legacy Data (Audit Fix)",
                        "result": fs
                    }
                    post.metadata["forensic_summary"] = new_summary
                    needs_save = True
                    print(f"  ✨ Fixed Forensic Summary for {slug}")

            # --- Save Changes ---
            if needs_save:
                with open(mdx_file, "wb") as f:
                    frontmatter.dump(post, f)
                stats["fixed"] += 1
            
            if file_errors:
                print(f"📄 {slug}:")
                for err in file_errors:
                    print(f"  {err}")
                stats["errors"] += len(file_errors)

        except Exception as e:
            print(f"❌ Error reading {mdx_file}: {e}")

    print("-" * 30)
    print(f"🏁 Audit Complete.")
    print(f"   Files Scanned: {stats['files']}")
    print(f"   Errors Found:  {stats['errors']}")
    print(f"   Files Fixed:   {stats['fixed']}")

if __name__ == "__main__":
    audit_keystatic_compliance()
