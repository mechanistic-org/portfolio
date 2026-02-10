import frontmatter
from pathlib import Path
import sys

# --- Taxonomy Definitions ---
TAGS = [
    "Thermal", "Mechanism", "Cost_Down", "Process", "Leadership", "Crisis", 
    "Yield", "Automation", "Architecture", "Acoustics", "Materials"
]

# --- Smart Mappings ---
# Map common legacy tags to the new Controlled Vocabulary
TAG_MAP = {
    # Thermal
    "Thermal Management": "Thermal",
    "Thermal Analysis": "Thermal",
    "Thermal Constraints": "Thermal",
    "Thermal Design": "Thermal",
    "Heat Transfer": "Thermal",

    # Mechanism
    "Mechanical Engineering": "Mechanism",
    "Mechanical Design": "Mechanism",
    "Mechanism Design": "Mechanism",
    "Structural Design": "Mechanism",
    "Sheet Metal": "Mechanism",
    "Plastics": "Mechanism",
    "Injection Molding": "Mechanism",
    "Pro/ENGINEER": "Mechanism",
    "CAD": "Mechanism",
    "SolidWorks": "Mechanism",
    
    # Cost_Down
    "Cost Engineering": "Cost_Down",
    "Cost Reduction": "Cost_Down",
    "Value Engineering": "Cost_Down",

    # Process
    "Design for Manufacturing (DFM)": "Process",
    "DFM": "Process",
    "Manufacturing Ops": "Process",
    "High Volume Manufacturing": "Process",
    "Prototyping": "Process",
    "Rapid Prototyping": "Process",
    "Iterative Prototyping": "Process",
    "Reliability Testing": "Process",
    "Product Testing": "Process",
    "Validation": "Process",
    "Tooling Strategy": "Process",
    
    # Crisis
    "Crisis Management": "Crisis",
    "Root Cause Analysis": "Crisis",
    "Failure Analysis": "Crisis",
    "Forensic Engineering": "Crisis",
    "Crisis Engineering": "Crisis",
    "Yield Crisis": "Crisis",

    # Yield
    "Yield Improvement": "Yield",
    
    # Leadership
    "Project Management": "Leadership",
    "Vendor Management": "Leadership",
    "Solo Execution": "Leadership",
    "Supply Chain Management": "Leadership",

    # Architecture
    "Product Design": "Architecture",
    "System Architecture": "Architecture",
    "Industrial Design": "Architecture",

    # Acoustics
    "Audio Engineering": "Acoustics",
    "Live Sound": "Acoustics",

    # Materials
    "Materials Knowledge": "Materials",
    "CMF Execution": "Materials",
    "Structural Foam": "Materials"
}

TARGET_DIR = Path("src/content/projects")

def fix_tags_compliance():
    print("🚑 Starting Tag Compliance Repair...")
    
    mdx_files = list(TARGET_DIR.glob("**/*.mdx"))
    stats = {"files": 0, "fixed": 0, "mapped": 0, "dropped": 0}
    
    for mdx_file in mdx_files:
        stats["files"] += 1
        try:
            post = frontmatter.load(mdx_file)
            needs_save = False
            
            if "tags" in post.metadata:
                original_tags = post.metadata["tags"]
                new_tags = set()
                
                for tag in original_tags:
                    if tag in TAGS:
                        new_tags.add(tag)
                    elif tag in TAG_MAP:
                        mapped = TAG_MAP[tag]
                        new_tags.add(mapped)
                        stats["mapped"] += 1
                        # print(f"  Mapping '{tag}' -> '{mapped}'")
                    else:
                        stats["dropped"] += 1
                        # print(f"  Dropping '{tag}'")

                # Convert back to list and sort
                final_tags = sorted(list(new_tags))
                
                if final_tags != sorted(original_tags):
                    post.metadata["tags"] = final_tags
                    needs_save = True
            
            if needs_save:
                with open(mdx_file, "wb") as f:
                    frontmatter.dump(post, f)
                stats["fixed"] += 1
                print(f"✅ Fixed {mdx_file.name}")

        except Exception as e:
            print(f"❌ Error processing {mdx_file}: {e}")

    print("-" * 30)
    print(f"🏁 Tag Fix Complete.")
    print(f"   Files Fixed: {stats['fixed']}")
    print(f"   Tags Mapped: {stats['mapped']}")
    print(f"   Tags Dropped: {stats['dropped']}")

if __name__ == "__main__":
    fix_tags_compliance()
