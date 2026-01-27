import re
import yaml
import sys

# We will manually parse the file to extract the data we want to keep, 
# then re-construct the object and dump it cleanly.

target_file = r"src/content/projects/d-control/index.mdx"

try:
    with open(target_file, "r", encoding="utf-8") as f:
        content = f.read()
except Exception as e:
    print(f"Failed to read file: {e}")
    sys.exit(1)

# Extract Markdown body (after second ---)
parts = content.split("---")
if len(parts) >= 3:
    body = parts[2]
else:
    # If split fails, maybe the first --- is missing or malformed?
    # Let's assume the body starts after the Metrics/Forensics block.
    # We'll just take everything after the last known frontmatter key.
    # This is risky. Let's try to regex out the frontmatter block.
    match = re.search(r"^---\s+(.*?)\s+---\s+(.*)$", content, re.DOTALL)
    if match:
        frontmatter_raw = match.group(1)
        body = match.group(2)
    else:
        print("Could not separate frontmatter. Aborting nuclear option to avoid data loss.")
        sys.exit(1)

# Extract Images for Galleries
# We'll scan the raw content for image patterns to rebuild the galleries.
# We know references exist like: src: /assets/.../full_big-md.webp
# We need to map them to stickies.

galleries = {
    "01_intro": [],
    "02_early_id": [],
    "03_gap_check": [],
    "04_stand_fit_check": [],
    "05_installations": []
}

# Regex to find images and which gallery they belong to.
# Since the file is messed up, we can infer gallery from the path segment.
# e.g. /bubbles/01_intro/...
image_pattern = re.compile(r"src: (/assets/r2/d-control/bubbles/([^/]+)/([^ \n]+))")

for match in image_pattern.finditer(content):
    full_path = match.group(1)
    gallery_id = match.group(2)
    filename = match.group(3)
    
    # Try to find dimensions/aspect ratio in the vicinity?
    # This is hard on a raw regex scan of a broken file.
    # BUT, the previous Repairs v1-v5 have fixed the indentation to be line-based.
    # So we can parse the LINES.
    pass

# Better approach: Read the file lines, statefully build the object.
# Since we repaired indentation in v5, it should be parsable line-by-line even if YAML parser fails.

current_sticky = None
current_image = {}

extracted_galleries = {} # key: sticky_id, value: list of image objs

lines = content.splitlines()
for i, line in enumerate(lines):
    line = line.strip()
    if line.startswith("- id:"):
        # New sticky
        current_sticky = line.replace("- id:", "").strip()
        extracted_galleries[current_sticky] = []
    
    if line.startswith("src:") and current_sticky:
        # Found image
        src = line.replace("src:", "").strip()
        # Look around for other props
        img = {"src": src}
        
        # Look back 3-4 lines for aspectRatio, height, width, alt
        # We assume standard order from previous verify
        # width
        # height
        # aspectRatio
        # - alt
        
        # Let's look at previous lines in the `lines` array
        # i-1: width
        # i-2: height
        # i-3: aspectRatio
        # i-4: alt
        
        try:
            if i > 0 and "width:" in lines[i-1]:
                img["width"] = int(float(lines[i-1].split("width:")[1].strip()))
            if i > 1 and "height:" in lines[i-2]:
                img["height"] = int(float(lines[i-2].split("height:")[1].strip()))
            if i > 2 and "aspectRatio:" in lines[i-3]:
                 img["aspectRatio"] = float(lines[i-3].split("aspectRatio:")[1].strip())
            if i > 3 and "- alt:" in lines[i-4]:
                 img["alt"] = lines[i-4].split("- alt:")[1].strip()
            elif i > 3 and "images:" in lines[i-4]:
                 # First image in list might be closer?
                 pass
            
            # Fallback scan if strict offsets fail
            if "alt" not in img:
                # Scan backwards max 5 lines
                for back_idx in range(1, 6):
                    if i - back_idx < 0: break
                    prev = lines[i-back_idx].strip()
                    if prev.startswith("- alt:") and "alt" not in img:
                        img["alt"] = prev.split("- alt:")[1].strip()
                    if prev.startswith("width:") and "width" not in img:
                         img["width"] = int(float(prev.split("width:")[1].strip()))
            
            if "src" in img and "alt" in img:
                extracted_galleries[current_sticky].append(img)
                
        except Exception as e:
            print(f"Error parsing image at line {i}: {e}")

# Construct New Frontmatter Object
frontmatter = {
    "slug": "d-control",
    "title": "D-Control",
    "theme": "hyperspace",
    "presentation_mode": "deep_dive",
    "description": "Forensic resolution of the PCII Adhesion Crisis.",
    "cyberspace": {
        "enable": True,
        "stickies": []
    },
    # Static metadata
    "date": "2003-01-01",
    "endDate": "2004-05-01",
    "draft": False,
    "listed": True,
    "heroImage": "/assets/r2/d-control/d-control-hero-01-xl.webp",
    "audio_url": "/assets/r2/d-control/d-control-briefing.m4a",
    "toolchain": ["Pro/ENGINEER", "SAP"],
    "tags": ["Tolerance Analysis", "Iterative Prototyping", "Project Buckley", "Mechanical Engineering", "Product Design"],
    "forensic_metrics": {
        "financial": "Bundle Price £52,869 (16-fader) to £70,494 (32-fader); Shipped 17 systems in one day (4/29/05).",
        "process": "Compressed 2-month DFM cycle to 2.5 weeks; Managed 109 active drawings.",
        "technical": "Resolved 'Swedish TV' 6mm Gap (Tip Contact); Retrofitted ALPS faders (180-deg rotation) to save tooling."
    },
    "forensic_summary": "Tasked with the mechanical architecture of the flagship 'Buckley' (D-Control) console, I navigated a catastrophic yield crisis (10% Top Cover yield / >50% Fader Pan rejection). I personally executed manual 'tweaking' of warped sheet metal to salvage the launch. Triggered by field reports of 'warped endcaps' and unit alignment gaps ('Swedish TV' incident: 5-6mm vertical offset), I intervened by re-engineering mounting methodology. Additionally, I solved a catastrophic 'Peeling Overlay' crisis via forensic surface energy analysis (Plasma Treatment) and engineered a 180-degree fader retrofit to migrate from P&G to ALPS components without scrapping inventory.",
    "teamSize": "Core 8 / INT 45 / EXT 20",
    "metrics": {
        "cogs": {"value": "$1,293", "label": "Stand BOM"},
        "profitability": {"value": "8,000+", "label": "CPUs Salvaged"},
        "governance": {
            "ecos": ["ECO-ADH-001 (Plasma)", "ECO-13080 (Gap)", "ECO-ALPS-001"],
            "dcos": 109
        },
        "interventions": {"count": 5, "label": "Crisis Recoveries"},
        "financial": {
            "toolingActual": 234865,
            "toolingBudget": 250000,
            "margins": [],
            "costOfGoodsSold": ["$1,293 (Stand Only)", "$50-$100 Saved (Monitor Offshoring)"],
            "quotes": [
                "The official solution for warped fader plates? Tell the line to manually bend sheet metal against a table... That is blacksmithing.",
                "Vegas Mode hits 61°C on the heat sink. That's hot enough to degrade components... but it shipped."
            ]
        },
        "process": {
            "dcdCount": 109,
            "engineeringChangeOrders": ["Plasma_Treatment", "ALPS_Retrofit", "Gap_Protocol", "Monitor_Offshoring"]
        },
        "war_stories": [
             {
                "label": "The 'Blacksmithing' Protocol",
                "value": "Manual Metal Bending",
                "description": "Authorized manual bending of warped fader plates (Part 11517) on the line to keep the line moving. 'If you stop to retool, you never ship.'"
             },
             {
                "label": "Vegas Mode Thermal Spike",
                "value": "61°C Heatsink",
                "description": "Accepted 61°C thermal risk on LED supply during 'All Lights Flashing' demo mode to enable the 180-degree fader flip."
             },
             {
                "label": "The Rigid Block Match",
                "value": "Assembly Inversion",
                "description": "Inverted assembly order: bolted units together first to create a rigid block, then attached wobbly stand legs, saving hours of alignment time."
             },
             {
                "label": "Deviation 7896",
                "value": "74% Yield Accepted",
                "description": "Prioritized revenue over cosmetics: tracked specific serial numbers of warped End Caps (26% failure rate) to ship 'Pragmatic Units'."
             },
             {
                "label": "The 'No-Stuff' Pivot",
                "value": "Inventory Hack",
                "description": "Created the 'Danko' mid-tier product using the premium 'Buckley' PCB by simply not populating ('No-Stuff') 7 specific resistors."
             },
             {
                "label": "The SNUT.part Conflict",
                "value": "Intralink War",
                "description": "Battled IT to reboot license servers at 9 PM to check in 'Version 35' of a standard nut (SNUT.part) that was locking the entire assembly."
             },
             {
                "label": "The Parasitic Touch",
                "value": "LED Interference",
                "description": "Diagnosed 20% frequency shift in touch faders as parasitic capacitance from nearby LEDs. Fixed with a generic 0805 C0G capacitor."
             }
        ]
    }
}

# Populate Stickies with Extracted Galleries
sticky_order = ["01_intro", "02_early_id", "03_gap_check", "04_stand_fit_check", "05_installations"]
titles = {
    "01_intro": "01 Intro",
    "02_early_id": "02 Early Id",
    "03_gap_check": "03 Gap Check",
    "04_stand_fit_check": "04 Stand Fit Check",
    "05_installations": "05 Installations"
}

for sid in sticky_order:
    frontmatter["cyberspace"]["stickies"].append({
        "id": sid,
        "title": titles.get(sid, sid),
        "type": "gallery",
        "data": {
            "layout": "masonry",
            "columns": 3,
            "scattered": True,
            "images": extracted_galleries.get(sid, [])
        },
        "featuredIndices": []
    })

# Dump to YAML
yaml_output = yaml.dump(frontmatter, sort_keys=False, width=1000, default_flow_style=False)

# Reassemble File
new_file_content = f"---\n{yaml_output}---\n\n{body}"

# Write
with open(target_file, "w", encoding="utf-8") as f:
    f.write(new_file_content)

print(f"NUCLEAR REPAIR COMPLETE: {target_file}")
print(f"Extracted {sum(len(g) for g in extracted_galleries.values())} images.")
