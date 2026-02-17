import json
import yaml
import os

# Paths
mdx_path = r"d:\GitHub\eriknorris\src\content\projects\avegant-glyph\index.mdx"

# Raw Data
bom_data = {
  "project_name": "Avegant Glyph (Codename: Vulcan)",
  "physical_parts_manifest": {
    "fabricated_metal_parts": [
      {"part_number": "420-0001", "description": "Ear Can Gimbal", "material": "Aluminum A380 or ADC12", "process": "Cast"},
      {"part_number": "420-0002", "description": "Headband Spring", "material": "Piano Wire - JIS G 3522 DIA 2.03mm", "process": "Wire Form"},
      {"part_number": "420-0003", "description": "Detent Spring", "material": "301 Stainless Steel, Full Hard", "process": "Formed Sheet Metal"},
      {"part_number": "420-0005", "description": "Eyepiece Lens Carrier", "material": "6061-T6 Aluminum", "process": "CNC Machined"},
      {"part_number": "420-0006", "description": "Eyepiece Collapse Rail", "material": "1215 Steel", "process": "Turned"},
      {"part_number": "420-0009", "description": "Optics Module Chassis", "material": "Magnesium AZ-91D", "process": "Cast"},
      {"part_number": "420-0014", "description": "Gap Hider Shutter 1 - Right", "material": "304 Stainless Steel", "process": "Formed Sheet Metal / PVD"},
      {"part_number": "420-0015", "description": "Gap Hider Shutter 1 - Left", "material": "304 Stainless Steel", "process": "Formed Sheet Metal / PVD"},
      {"part_number": "420-0019", "description": "Button Plate - Right", "material": "AL 6061-T6", "process": "Precision Stamping"},
      {"part_number": "420-0020", "description": "Center Button", "material": "AL 6061-T6", "process": "Turned"},
      {"part_number": "420-0023", "description": "Button Plate - Left", "material": "AL 6061-T6", "process": "Precision Stamping"},
      {"part_number": "420-0033", "description": "Mirror Hinge Pin", "material": "304 Stainless Steel", "process": "Turned"},
      {"part_number": "420-0034", "description": "Optics IPD Rail", "material": "SUS (Stainless Steel)", "process": "Turned"},
      {"part_number": "420-0043", "description": "Headband Spring 160", "material": "Piano Wire 1.60mm", "process": "Wire Form"}
    ],
    "fabricated_plastic_parts": [
      {"part_number": "425-0001", "description": "Arm Inner - Right", "material": "Polypropylene RTP 100 RF", "process": "Injection Molding"},
      {"part_number": "425-0002", "description": "Ear Cover - Left", "material": "PC - Sabic EXL 1112", "process": "Injection Molding"},
      {"part_number": "425-0003", "description": "Outer Headband", "material": "PC - Sabic EXL 1414", "process": "Injection Molding"},
      {"part_number": "425-0005", "description": "Arm Inner - Left", "material": "Polypropylene RTP 100 RF", "process": "Injection Molding"},
      {"part_number": "425-0006", "description": "Ear Cover - Right", "material": "PC - Sabic EXL 1112", "process": "Injection Molding"},
      {"part_number": "425-0008", "description": "Bezel Ring - Right", "material": "PC - Sabic EXL 1112", "process": "Injection Molding"},
      {"part_number": "425-0009", "description": "Bezel Ring - Left", "material": "PC - Sabic EXL 1112", "process": "Injection Molding"},
      {"part_number": "425-0010", "description": "Ear Cover Bushing Inner - Right", "material": "PC - Sabic EXL 1112", "process": "Injection Molding"},
      {"part_number": "425-0012", "description": "IOB Back Housing - Right", "material": "PC 20% GF - Iupilon GS2020MN1", "process": "Injection Molding"},
      {"part_number": "425-0016", "description": "Audio Cavity - Right - Front", "material": "PC/ABS CYCOLOY C2800 FR", "process": "Injection Molding"},
      {"part_number": "425-0026", "description": "SIL Light Pipe", "material": "Polycarbonate (Optically Clear)", "process": "Injection Molding"},
      {"part_number": "425-0028", "description": "Eyepiece Release Button", "material": "PC - Sabic EXL 1112", "process": "Injection Molding"},
      {"part_number": "425-0034", "description": "Button Plate Backer - Left", "material": "PC/ABS CYCOLOY C2800 FR", "process": "Injection Molding"},
      {"part_number": "425-0037", "description": "Accessory Snap", "material": "PC/ABS CYCOLOY C2800 FR", "process": "Injection Molding"},
      {"part_number": "425-0039", "description": "Faceplate", "material": "PC - Sabic EXL 1112", "process": "Injection Molding"},
      {"part_number": "425-0040", "description": "Power Switch", "material": "PC/ABS CYCOLOY C2800 FR", "process": "Injection Molding"},
      {"part_number": "425-0049", "description": "Headband Inner Liner - Left", "material": "PA12 Grilimid TR90 (Body) / TPR Empilon HT45 (Skin)", "process": "Injection Molding / Overmold"},
      {"part_number": "425-0052", "description": "IPD Slider Gap Hider", "material": "PET Sheet", "process": "Die Cut"},
      {"part_number": "425-0056", "description": "Nose Piece Housing", "material": "RTP 200 D Nylon 6/12", "process": "Injection Molding"},
      {"part_number": "425-0069", "description": "Nose Pad", "material": "PC Sabic EXL 1414T / Silicone Overmold", "process": "Injection Molding"},
      {"part_number": "425-0072", "description": "IPD Slider Cap", "material": "PC - Sabic EXL 1112", "process": "Injection Molding"},
      {"part_number": "425-0077", "description": "HDMI Color Indicator", "material": "PC/ABS CYCOLOY C2800 FR", "process": "Injection Molding"},
      {"part_number": "425-0079", "description": "Nose Carriage", "material": "Delrin 507 Black Acetal", "process": "Injection Molding"},
      {"part_number": "425-0082", "description": "Eyepiece Can", "material": "SABIC ULTEM 1010", "process": "Injection Molding"}
    ],
    "soft_goods_and_other": [
      {"part_number": "427-0001", "description": "Boot - Left", "material": "Liquid Silicone Rubber (LSR) Shore A 70", "process": "Injection Molding"},
      {"part_number": "427-0002", "description": "Boot - Right", "material": "Liquid Silicone Rubber (LSR) Shore A 70", "process": "Injection Molding"},
      {"part_number": "427-0005", "description": "Eyepiece Dust Seal", "material": "Felt, Black", "process": "Die Cut"},
      {"part_number": "427-0009", "description": "Illumination Mirror PSA", "material": "3M 55261 Double Coated Tape", "process": "Die Cut"},
      {"part_number": "427-0014", "description": "Speaker Driver Pad", "material": "Silicone Foam HT-800", "process": "Die Cut"},
      {"part_number": "427-0016", "description": "Optics Chassis Pad", "material": "Closed Cell Urethane Foam", "process": "Die Cut"},
      {"part_number": "427-0017", "description": "Acoustic Mesh", "material": "Saati Acoustex B020HY", "process": "Die Cut"},
      {"part_number": "427-0018", "description": "Nosepiece Gel Insert", "material": "LSR Shore A 50", "process": "Injection Molding"},
      {"part_number": "820-0028", "description": "Ear Pad - Right Assembly", "material": "Leather / Memory Foam", "process": "Die Cut / Sew / Melt Bond"},
      {"part_number": "820-0029", "description": "Ear Pad - Left Assembly", "material": "Leather / Memory Foam", "process": "Die Cut / Sew / Melt Bond"}
    ],
    "printed_circuit_boards": [
      {"part_number": "GLF-200 / 20-0164", "description": "MCU Board (Main PCB)", "type": "Rigid"},
      {"part_number": "GLF-201 / 20-0164", "description": "ITE Board (HDMI/Video)", "type": "Rigid"},
      {"part_number": "GLF-202 / 20-0165", "description": "DPP Board (Left Eye)", "type": "Rigid"},
      {"part_number": "GLF-203 / 20-0166", "description": "DPP Board (Right Eye)", "type": "Rigid"},
      {"part_number": "GLF-204", "description": "Battery Board", "type": "Rigid"},
      {"part_number": "GLF-205", "description": "Coupon Board", "type": "Rigid"},
      {"part_number": "840-0008", "description": "Button Board Left", "type": "Rigid"},
      {"part_number": "840-0009", "description": "Button Board Right", "type": "Rigid"},
      {"part_number": "840-0001 / 175-0001", "description": "Bluetooth Board", "type": "Rigid"},
      {"part_number": "840-0006", "description": "LED Board Left", "type": "Rigid"},
      {"part_number": "840-0007", "description": "LED Board Right", "type": "Rigid"}
    ],
    "artwork_packaging_and_labels": [
      {"part_number": "435-0001", "description": "Serial Number Sticker", "material": "Matte Silver PET"},
      {"part_number": "457-0009", "description": "Retail Sleeve", "material": "450g C1S SBS"},
      {"part_number": "457-0025", "description": "Foam Insert", "material": "Foam"},
      {"part_number": "710-0004", "description": "Artwork File", "material": "Digital File"},
      {"description": "Compliance Label", "details": "FCC ID: 2AFYN-AG101, IC: 20644-AG101"}
    ],
    "hardware_and_fasteners": [
      {"part_number": "467-0020", "description": "Screw - TF M1.6 x 6mm", "material": "1018 Steel"},
      {"part_number": "467-0017", "description": "Screw M1.6-0.35 x 3mm", "material": "1018 Steel"},
      {"part_number": "467-0022", "description": "Screw - TF M2 x 8.3mm", "material": "1018 Steel"},
      {"description": "Battery", "details": "Li-Ion (Springpower mentioned as module vendor)"},
      {"description": "DMD Chip", "details": "Texas Instruments DLP"},
      {"description": "Lens Stack", "details": "Projection/Collimation Lenses"}
    ]
  }
}

team_data = {
  "avegant_glyph_team": [
    {"name": "Edward Tang", "role": "CEO / Co-Founder"},
    {"name": "Allan Evans", "role": "CTO / Co-Founder / Program Owner"},
    {"name": "Yobie Benjamin", "role": "COO / CSO"},
    {"name": "Neil Welch", "role": "VP of Engineering"},
    {"name": "Joerg Tewes", "role": "Executive / CEO"},
    {"name": "Jonathan Zagel", "role": "Director of Finance"},
    {"name": "Richard Kerris", "role": "Marketing / Executive"},
    {"name": "Grant Martin", "role": "Head of Marketing and Product Strategy"},
    {"name": "Aaron Eash", "role": "Hardware Engineering Lead"},
    {"name": "Christopher Westra", "role": "Lead Mechanical Engineer"},
    {"name": "Erik Norris", "role": "Senior Mechanical Engineer"},
    {"name": "Geoffrey Hill", "role": "Mechanical Engineer"},
    {"name": "Misha (Michael) Young", "role": "Mechanical Engineer / Project Manager"},
    {"name": "Alexander Goldis", "role": "Mechanical Engineer"},
    {"name": "Samuel Backes", "role": "Mechanical Engineer / Design"},
    {"name": "Corey Higham", "role": "Mechanical Engineer / Drafter"},
    {"name": "Leonard Pang", "role": "Mechanical / Manufacturing Engineer"},
    {"name": "R. Nehchiri", "role": "Mechanical Engineer / Drafter"},
    {"name": "Andrew Gross", "role": "Engineer (Ph.D.)"},
    {"name": "Bernhard Wildner", "role": "Engineer"},
    {"name": "Eamon O'Connor", "role": "Engineer"},
    {"name": "Forrest Foust", "role": "Engineer"},
    {"name": "Henry Wang", "role": "Engineer"},
    {"name": "Jansen Ika", "role": "Engineer"},
    {"name": "Yu-Ju Chen", "role": "Engineer"},
    {"name": "Paul Tu", "role": "Engineer"},
    {"name": "Baker Ngan", "role": "Engineer"},
    {"name": "Barron Jeter", "role": "Engineer"},
    {"name": "Phil Satterfield", "role": "Engineer"},
    {"name": "Stephen Medina", "role": "Product"},
    {"name": "Emma Kessler", "role": "Manager of Brand Marketing"},
    {"name": "Stephanie Johnson", "role": "Marketing / Team Member"},
    {"name": "Andrew (Andy) Turk", "role": "Team Member"},
    {"name": "Kevin King", "role": "Technical Project Manager"},
    {"name": "Lawrence (Larry) Supan", "role": "Operations"},
    {"name": "Maha Parameswaran", "role": "Quality Assurance (QA)"},
    {"name": "Dante Nuno", "role": "Director of Human Resources"},
    {"name": "Nicole Crittendon", "role": "Office Manager"},
    {"name": "Tori Geiken", "role": "Customer Feedback"},
    {"name": "Azmat Ali", "role": "Team Member"},
    {"name": "Jill Nguyen", "role": "Team Member"},
    {"name": "Eric Frasch", "role": "Team Member"},
    {"name": "Gary Hooper", "role": "Team Member"},
    {"name": "Jason Jia", "role": "Team Member"},
    {"name": "JianHua Li", "role": "Team Member"},
    {"name": "Joe Caci", "role": "Team Member"},
    {"name": "Lisa Garvey", "role": "Team Member"},
    {"name": "Martha Bossley", "role": "Team Member"},
    {"name": "Vincent Van De Poll", "role": "Team Member"},
    {"name": "Max Zagel", "role": "Team Member"},
    {"name": "Julie Ling", "role": "Team Member"},
    {"name": "Dierdre De Medeiros", "role": "Team Member"},
    {"name": "Tony Barnes", "role": "Team Member"}
  ]
}

timeline_data = {
  "project_schedule_and_development_events": [
    {"date": "2013-09-27", "event": "Lens Details Received from AES", "type": "Development", "source_id": 61},
    {"date": "2013-10-07", "event": "Test Optical Bench (OBench) Design Started", "type": "Development", "source_id": 61},
    {"date": "2013-10-18", "event": "CES Optical Bench Design Started", "type": "Development", "source_id": 61},
    {"date": "2013-11-04", "event": "CAD Model sent to AMS for review", "type": "Development", "source_id": 62},
    {"date": "2013-11-26", "event": "Testing of Projector and Aux Boards Started", "type": "Testing", "source_id": 62},
    {"date": "2013-12-19", "event": "Assembly and testing of CES Prototypes Started", "type": "Prototype", "source_id": 62},
    {"date": "2014-01-06", "event": "Avegant Glyph Debut at CES 2014", "type": "Milestone", "source_id": 115},
    {"date": "2014-01-22", "event": "Kickstarter Campaign Ends ($1.5 Million raised)", "type": "Milestone", "source_id": 115},
    {"date": "2014-06-16", "event": "Glyph 1.0 Project Official Start Date", "type": "Schedule", "source_id": 81},
    {"date": "2014-07-08", "event": "Works-Like (WL) Prototype Phase Start", "type": "Prototype", "source_id": 81},
    {"date": "2014-07-15", "event": "Looks-Like (LL) Prototype Phase Start", "type": "Prototype", "source_id": 81},
    {"date": "2014-08-28", "event": "Looks-Like Prototypes Complete", "type": "Milestone", "source_id": 81},
    {"date": "2014-09-05", "event": "Works-Like Prototypes Complete", "type": "Milestone", "source_id": 81},
    {"date": "2014-09-17", "event": "Production Intent (PI) Prototype Design Tasks Start", "type": "Development", "source_id": 81},
    {"date": "2014-11-21", "event": "System Level Tasks Start", "type": "Development", "source_id": 81},
    {"date": "2014-12-02", "event": "Vendor Visit: Guangzhou (Ear pad/Audio)", "type": "Meeting", "source_id": 20},
    {"date": "2014-12-04", "event": "Vendor Visit: Yoku (Battery), YongYuLong (ME), OTI (LSR)", "type": "Meeting", "source_id": 20},
    {"date": "2014-12-05", "event": "Intretech Factory Tour & TDE Testing Introduction", "type": "Meeting", "source_id": 20},
    {"date": "2015-01-05", "event": "Final Design Unveiled at CES 2015", "type": "Milestone", "source_id": 15},
    {"date": "2015-03-10", "event": "Update and release project schedule to Intretech", "type": "Schedule", "source_id": 17},
    {"date": "2015-03-24", "event": "EVT EE PCBA build plan sent to Intretech", "type": "Planning", "source_id": 17},
    {"date": "2015-05-08", "event": "Tooling Kick Off (List sent to Intretech)", "type": "Milestone", "source_id": 17},
    {"date": "2015-05-20", "event": "Software Design Tasks Complete (Target)", "type": "Development", "source_id": 81},
    {"date": "2015-06-24", "event": "Erik Norris Interview/Meeting with Joerg Tewes & Allan Evans", "type": "Meeting", "source_id": 25},
    {"date": "2015-07-07", "event": "EVT Unit Payment Verification (150pcs)", "type": "Procurement", "source_id": 17},
    {"date": "2015-08-04", "event": "Feedback on DVT Plan provided to Intretech", "type": "Planning", "source_id": 17},
    {"date": "2015-09-01", "event": "EE BOM 20150901 Issued", "type": "Documentation", "source_id": 82},
    {"date": "2015-11-06", "event": "Glyph 2.0 Roadmap Issued", "type": "Planning", "source_id": 56},
    {"date": "2016-01-12", "event": "Audio Frequency Response Testing (Glyph 1 Digital)", "type": "Testing", "source_id": 1},
    {"date": "2016-01-19", "event": "Glyph 1.0 Project Finish Date", "type": "Schedule", "source_id": 81},
    {"date": "2016-02-04", "event": "Inner Liner Tool Drawing Created (467-0029)", "type": "Development", "source_id": 69},
    {"date": "2016-02-29", "event": "TI / Intretech Factory Visit (720p Program Analysis)", "type": "Meeting", "source_id": 79},
    {"date": "2016-03-29", "event": "Clamping Force Sensitivity Testing", "type": "Testing", "source_id": 5},
    {"date": "2016-03-30", "event": "Artwork Drawing Release (427-0031)", "type": "Development", "source_id": 50},
    {"date": "2016-05-19", "event": "Faceplate Engineering Review", "type": "Development", "source_id": 43},
    {"date": "2016-08-30", "event": "Sleeve Development", "type": "Development", "source_id": 67},
    {"date": "2016-09-02", "event": "Retail Sleeve Drawing Created (457-0029)", "type": "Development", "source_id": 59},
    {"date": "2016-09-23", "event": "Updated Graphics and Layout (Drawing 457-0009 Rev 10)", "type": "Development", "source_id": 7},
    {"date": "2016-12-11", "event": "Oprah's Favorite Things Promotion", "type": "Marketing", "source_id": 29},
    {"date": "2017-02-28", "event": "Avegant Alumni Group Created", "type": "Administrative", "source_id": 35}
  ]
}

# Transformations

# BOM
bom_list = []
manifest = bom_data.get("physical_parts_manifest", {})
for category, items in manifest.items():
    if isinstance(items, list):
        for item in items:
            label = item.get("description", "Unknown")
            pn = item.get("part_number")
            if pn:
                label = f"{label} ({pn})"
            
            value = item.get("material") or item.get("details") or item.get("type") or "Unknown"
            bom_list.append({"label": label, "value": value})

# Cast
cast_list = []
for person in team_data.get("avegant_glyph_team", []):
    cast_list.append({
        "name": person["name"],
        "role": person["role"],
        "org": "Avegant"
    })

# Timeline
timeline_list = []
for event in timeline_data.get("project_schedule_and_development_events", []):
    timeline_list.append({
        "date": event["date"],
        "title": event["event"],
        "description": event["type"]
    })

# Generate Output
output_data = {
    "bom": bom_list,
    "cast": cast_list,
    "timeline": timeline_list
}

yaml_content = yaml.dump(output_data, allow_unicode=True, sort_keys=False)

# Read MDX
with open(mdx_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find insertion point (second '---')
frontmatter_end_idx = content.find('---', 3) # Start searching after the first '---' (index 0)

if frontmatter_end_idx == -1:
    print("Error: Could not find end of frontmatter.")
    exit(1)

# Split content
pre_content = content[:frontmatter_end_idx]
post_content = content[frontmatter_end_idx:]

# Insert YAML
new_content = pre_content + yaml_content + post_content

# Write MDX
with open(mdx_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully injected Frontmatter data.")
