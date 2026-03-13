import os
import glob
import shutil
import json
from datetime import datetime, timezone

# The IDE's global knowledge brain
KNOWLEDGE_ROOT = r"C:\Users\erik\.gemini\antigravity\knowledge"
MEGA_FOLDER = os.path.join(KNOWLEDGE_ROOT, "en_os_technical_ecosystem")

# The Universal Taxonomy Mapping Rule
TAXONOMY_MAP = {
    # Mechanistic (The Philosophy & Strategy)
    "the_mechanistic_playbook.md": {"prefix": "MECHANISTIC", "title": "The Playbook"},
    "meta_audit_protocol.md": {"prefix": "MECHANISTIC", "title": "Meta-Audit Protocol"},
    "forensic_methodologies.md": {"prefix": "MECHANISTIC", "title": "Forensic Methodologies"},
    "sow_strategic_governance.md": {"prefix": "MECHANISTIC", "title": "SOW & Strategic Governance"},
    "agent_personas.md": {"prefix": "MECHANISTIC", "title": "Agent Personas (Cheerful Mentor)"},
    "standardized_agent_workflows.md": {"prefix": "MECHANISTIC", "title": "Standardized Agent Workflows"},
    "mechanistic_deployment_profile.md": {"prefix": "MECHANISTIC", "title": "Deployment Profile"},

    # ErikNorris (The Core Doctrine & Templates)
    "foundation.md": {"prefix": "ERIKNORRIS", "title": "Foundation (V31 Constraints)"},
    "system_stabilization_protocols.md": {"prefix": "ERIKNORRIS", "title": "System Stabilization Protocols"},
    "implementation_and_design_atlas.md": {"prefix": "ERIKNORRIS", "title": "Implementation & Design Atlas"},
    "intelligence_and_adversarial_twin_protocols.md": {"prefix": "ERIKNORRIS", "title": "Intelligence Twin Protocols"},
    "advanced_prompt_engineering_protocols.md": {"prefix": "ERIKNORRIS", "title": "Prompt Engineering Protocols"},
    "data_moat_strategies.md": {"prefix": "ERIKNORRIS", "title": "Data Moat Strategies"},

    # Mobile Outfitters (Case Study)
    "holy_grail_mo.md": {"prefix": "MECHANISTIC", "title": "Case Study: Mobile Outfitters (Holy Grail)"},
}

def shatter():
    print("Beginning Physical Surgery: Shattering the Swarm's Mega-Folder...")
    
    if not os.path.exists(MEGA_FOLDER):
        print(f"Mega-folder not found at {MEGA_FOLDER}. Skipping.")
        return

    # Find all Markdown files deeply nested in the mega-folder
    search_pattern = os.path.join(MEGA_FOLDER, "**", "*.md")
    files = glob.glob(search_pattern, recursive=True)

    for file_path in files:
        file_name = os.path.basename(file_path)
        
        # Look up the taxonomy routing
        mapping = TAXONOMY_MAP.get(file_name, {"prefix": "UNASSIGNED", "title": file_name.replace(".md", "").replace("_", " ").title()})
        prefix = mapping["prefix"]
        title = mapping["title"]
        
        # Create a completely new, atomic slug and folder
        new_slug = f"{prefix.lower()}_{file_name.replace('.md', '')}"
        new_folder = os.path.join(KNOWLEDGE_ROOT, new_slug)
        new_artifacts_folder = os.path.join(new_folder, "artifacts")
        
        os.makedirs(new_artifacts_folder, exist_ok=True)
        
        # Move the markdown file into the new atomic folder
        new_file_path = os.path.join(new_artifacts_folder, file_name)
        shutil.copy2(file_path, new_file_path)
        
        # Generate the precise JSON Metadata to guarantee semantic alignment
        now = datetime.now(timezone.utc).isoformat()
        metadata = {
            "title": f"[{prefix}] {title}",
            "summary": f"Core directive for the {prefix} domain permanently extracted from the legacy mega-folder to guarantee atomic context injection.",
            "version": 1,
            "created_at": now,
            "updated_at": now,
            "references": [],
            "source": "shatter_kis.py surgery script"
        }
        
        metadata_path = os.path.join(new_folder, "metadata.json")
        with open(metadata_path, "w", encoding="utf-8") as f:
            json.dump(metadata, f, indent=2)
            
        print(f"Extracted: {file_name} -> {new_slug}")

    # Remove the old corrupted mega-folder
    print("Destroying the legacy en_os_technical_ecosystem mega-folder...")
    shutil.rmtree(MEGA_FOLDER)
    print("Surgery Complete: The Swarm's brain is now atomic and Sovereign.")

if __name__ == "__main__":
    shatter()
