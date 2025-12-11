import os
import shutil
from pathlib import Path

# Config
SOURCE_DIR = Path(r"d:\GitHub\quantum\data_source\mined_assets")
# We copy to public so they are accessible by URL
WEB_TARGET_DIR = Path(r"d:\GitHub\quantum\public\images\visual-log")
DOC_TARGET_FILE = Path(r"d:\GitHub\quantum\src\content\docs\reference\VISUAL_LOG.md")

# Topic Mapping (ID -> Title)
TOPICS = {
    "ed0788e5": "Matte Carbon Debugging",
    "933c1250": "Anisotropy Implementation",
    "d0e908d8": "Export Fixes",
    "e5a894f4": "Matte Forged Carbon v1",
    "290efb7d": "Documentation Consolidation"
}

def generate_gallery():
    if not SOURCE_DIR.exists():
        print("Source dir not found.")
        return

    # Clean/Reset Target
    if WEB_TARGET_DIR.exists():
        shutil.rmtree(WEB_TARGET_DIR)
    WEB_TARGET_DIR.mkdir(parents=True, exist_ok=True)
    
    # Analyze Assets
    images_by_topic = {}
    
    print("Processing assets...")
    for filename in os.listdir(SOURCE_DIR):
        if not filename.endswith(".png"): continue
        
        # Filename format: YYYY-MM-DD_ID_OriginalName
        parts = filename.split("_")
        if len(parts) >= 2:
            source_id = parts[1]
        else:
            source_id = "unknown"
            
        topic = TOPICS.get(source_id, f"Session {source_id}")
        
        if topic not in images_by_topic:
            images_by_topic[topic] = []
            
        # Copy to Public
        # Simplify name for web? Keep unique timestamp.
        web_filename = filename.lower()
        shutil.copy2(SOURCE_DIR / filename, WEB_TARGET_DIR / web_filename)
        
        images_by_topic[topic].append(web_filename)

    # Generate Markdown
    lines = [
        "---",
        "title: \"Engineering Visual Log\"",
        "slug: \"visual_log\"",
        "sidebar:",
        "  group: \"Reference\"",
        "---",
        "# Engineering Visual Log",
        "",
        "**Objective:** A chronological gallery of automated visual artefacts mined from the development brain.",
        ""
    ]
    
    # Determine sorted order of topics (maybe by session date? ID is roughly chronological?)
    # Dictionary iteration order is insertion order in py3.7+, but let's just output loop.
    
    for topic, images in images_by_topic.items():
        lines.append(f"## {topic}")
        lines.append("")
        lines.append("<div class=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 not-content\">")
        
        # Limit? No, user wants everything handled.
        for img in images:
            # "Appropriately cropping" -> object-cover
            lines.append("  <div class=\"relative group overflow-hidden rounded-xl border border-white/10 shadow-lg\">")
            lines.append(f"    <img src=\"/images/visual-log/{img}\" alt=\"{topic}\" class=\"w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-105\" />")
            lines.append("  </div>")
            
        lines.append("</div>")
        lines.append("")
        lines.append("---")
        lines.append("")

    # Write MD
    DOC_TARGET_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(DOC_TARGET_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
        
    print(f"Gallery generated at {DOC_TARGET_FILE}")
    print(f"Images copied to {WEB_TARGET_DIR}")

if __name__ == "__main__":
    generate_gallery()
