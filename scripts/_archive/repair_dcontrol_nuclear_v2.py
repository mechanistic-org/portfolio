import re
import yaml
import sys

target_file = r"src/content/projects/d-control/index.mdx"

try:
    with open(target_file, "r", encoding="utf-8") as f:
        raw_content = f.read()
except Exception as e:
    print(f"Failed to read file: {e}")
    sys.exit(1)

# Scrape images
# Pattern: src: /assets/.../bubbles/(FOLDER)/FILENAME
# We capture: FOLDER, FILENAME, ASPECT, WIDTH, HEIGHT, ALT
# We scan line by line to keep context.

images_by_folder = {}

lines = raw_content.splitlines()
current_img = {}

for i, line in enumerate(lines):
    line = line.strip()
    
    # Try to capture props
    if line.startswith("src:"):
        src = line.replace("src:", "").strip().split(" ")[0] # split to ignore trailing junk if any
        current_img["src"] = src
        
        # Infer folder
        match = re.search(r"/bubbles/([^/]+)/", src)
        if match:
            folder = match.group(1)
            # Add to list
            if folder not in images_by_folder:
                images_by_folder[folder] = []
            
            if "alt" in current_img: # simplistic check
                images_by_folder[folder].append(current_img)
            
            current_img = {} # reset
            
    elif line.startswith("- alt:"):
        current_img["alt"] = line.replace("- alt:", "").strip()
    elif line.startswith("aspectRatio:"):
        # remove "aspectRatio:" and maybe trailing junk
        val = line.replace("aspectRatio:", "").strip()
        try:
             current_img["aspectRatio"] = float(val)
        except:
             current_img["aspectRatio"] = 1.5
    elif line.startswith("height:"):
        try:
            current_img["height"] = int(float(line.replace("height:", "").strip()))
        except: pass
    elif line.startswith("width:"):
        try:
            current_img["width"] = int(float(line.replace("width:", "").strip()))
        except: pass

# Extract Body
if "### D-Control [Project Buckley] Forensic Report" in raw_content:
    body = "### D-Control [Project Buckley] Forensic Report" + raw_content.split("### D-Control [Project Buckley] Forensic Report")[1]
else:
    # Fallback
    body = "\n\n(Content could not be separated automatically. Please verify.)\n"

# Define Master Frontmatter
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
        "scars": [
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

# Sticky mapping
titles = {
    "01_intro": "01 Intro",
    "02_early_id": "02 Early Id",
    "03_gap_check": "03 Gap Check",
    "04_stand_fit_check": "04 Stand Fit Check",
    "05_installations": "05 Installations"
}

sticky_ids = ["01_intro", "02_early_id", "03_gap_check", "04_stand_fit_check", "05_installations"]

for sid in sticky_ids:
    imgs = images_by_folder.get(sid, [])
    # Dedup?
    # Ensure they have mandatory fields
    valid_imgs = []
    for img in imgs:
        if "src" in img:
            valid_imgs.append(img)
            
    frontmatter["cyberspace"]["stickies"].append({
        "id": sid,
        "title": titles.get(sid, sid),
        "type": "gallery",
        "data": {
            "layout": "masonry",
            "columns": 3,
            "scattered": True,
            "images": valid_imgs
        },
        "featuredIndices": []
    })

yaml_str = yaml.dump(frontmatter, sort_keys=False, width=1000, default_flow_style=False)
final = f"---\n{yaml_str}---\n\n{body}"

with open(target_file, "w", encoding="utf-8") as f:
    f.write(final)

print("Nuclear repair v2 complete.")
