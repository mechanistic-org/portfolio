import io
import os
import re
import sys
from pathlib import Path

# Windows cp1252 terminals raise UnicodeEncodeError on emoji output.
# Force UTF-8 at the stream level so this script runs without PYTHONIOENCODING=utf-8.
if hasattr(sys.stdout, 'buffer'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
if hasattr(sys.stderr, 'buffer'):
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# --- CONFIGURATION ---
PROJECTS_DIR = Path(r"d:\GitHub\portfolio\src\content\projects")
LINKEDIN_MASTER_PATH = Path(r"d:\GitHub\portfolio\src\config\linkedin_master.ts")
# [STANDARDIZED] Output to native prompts directory in content
OUTPUT_PATH = Path(r"d:\GitHub\portfolio\src\content\prompts\LINKEDIN_READY.txt")

# --- MAPPING ---
# Maps filesystem slugs to linkedin_master.ts Company Names
# This enables the "Recursive Workflow" to route MDX content to the correct "Bucket"
SLUG_MAP = {
    # HYPHEN
    "hyphen-makeline": "HYPHEN",
    "makeline": "HYPHEN",
    "backsplash": "HYPHEN",
    "misc": "HYPHEN", 
    "portion-cup": "HYPHEN",
    "dispensers": "HYPHEN",

    # NOON HOME
    "noon-home": "NOON HOME",
    "room-director": "NOON HOME",
    "wall-plates": "NOON HOME",
    "base-click-testing-1": "NOON HOME",
    "click-testing": "NOON HOME",
    "extension-switches": "NOON HOME",
    "bazooka": "NOON HOME",

    # AVEGANT
    "avegant-glyph": "AVEGANT",
    "glyph": "AVEGANT",
    "avegant": "AVEGANT",

    # KALEIDESCAPE
    "kaleidescape": "KALEIDESCAPE",
    "320-slot-optical-carousel": "KALEIDESCAPE",
    "cinema-one": "KALEIDESCAPE",
    "m500": "KALEIDESCAPE",
    "m700": "KALEIDESCAPE", 
    "sundance": "KALEIDESCAPE",
    "dv700": "KALEIDESCAPE",
    "m700-vault-recovery": "KALEIDESCAPE",
    "kserver-1500": "KALEIDESCAPE",
    "kserver-5000": "KALEIDESCAPE",
    "kplayer-6000": "KALEIDESCAPE",
    "kplayer-300": "KALEIDESCAPE",
    "kplayer-2500": "KALEIDESCAPE",
    "kserver-2500": "KALEIDESCAPE",
    "kvault-10": "KALEIDESCAPE",
    "disc-cartridges": "KALEIDESCAPE",
    "strato": "KALEIDESCAPE",
    "alto": "KALEIDESCAPE",
    "terra": "KALEIDESCAPE",
    "strato-terra": "KALEIDESCAPE",
    "ksystem-120": "KALEIDESCAPE (ORPHEUS) - KSYSTEM-120",

    # DIGIDESIGN (AVID)
    "c24": "DIGIDESIGN (AVID)",
    "sc48": "DIGIDESIGN (AVID)",
    "venue-live-sound": "DIGIDESIGN (AVID)",
    "profile": "DIGIDESIGN (AVID)",
    "d-control": "DIGIDESIGN (AVID)",
    "d-command": "DIGIDESIGN (AVID)",
    
    # WEBTV
    "webtv": "WEBTV (MICROSOFT)",
    "webtv-galaxy": "WEBTV (MICROSOFT) - GALAXY",
    "minimerc": "WEBTV (MICROSOFT) - GALAXY",
    "mercury-lc": "WEBTV (MICROSOFT) - GALAXY",
    "webtv-mercury": "WEBTV (MICROSOFT) - GALAXY",
    "xbox": "WEBTV (MICROSOFT) - GALAXY",
    "webtv-cortez": "WEBTV (MICROSOFT) - CORTEZ",
    "cortex": "WEBTV (MICROSOFT) - CORTEZ",
    "webtv-elmer": "WEBTV (MICROSOFT) - ELMER",
    "webtv-pluto": "WEBTV (MICROSOFT) - ELMER",
    "webtv-titan": "WEBTV (MICROSOFT) - ELMER",
    "zeus": "WEBTV (MICROSOFT) - ELMER",

    # GENERIC / EARLY
    "motorola-mp3": "EARLY CAREER",
    "early-career": "EARLY CAREER",
    "ept-1000": "EARLY CAREER",
    "sgi-320-540": "EARLY CAREER",
    "indigo": "EARLY CAREER",
    "indy": "EARLY CAREER",
    "personal-iris": "EARLY CAREER",
}

# --- UTILS ---

def to_bold(text):
    """Converts text to Unicode Sans Bold (LinkedIn formatting)."""
    normal = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    bold   = "𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵"
    trans = str.maketrans(normal, bold)
    return text.translate(trans)

def parse_ts_variable(content, var_name):
    """
    Extracts a variable string from a TS file using regex.
    """
    pattern = re.compile(rf"{var_name}:\s*[`\"](.*?)[\"`],", re.DOTALL)
    match = pattern.search(content)
    if match:
        return match.group(1).strip()
    return ""

def parse_experience(content):
    """
    Parses the experience array from linkedin_master.ts using basic regex.
    Returns: list of dicts {company, role, blurb, projects: []}
    """
    # Find the content inside `experience: [` and `]`
    exp_match = re.search(r"experience:\s*\[(.*?)\]\s*,", content, re.DOTALL)
    if not exp_match:
        return []
        
    block_content = exp_match.group(1)
    
    # Simple parser assuming standard formatting { ... }, { ... }
    # We split by "}," and then parse keys
    entries = []
    
    # Regex to find each object block
    # We use backreferences (\1, \2, \3) to match opening/closing quotes correctly
    # We relax the separators to .*? to handle potential comments or whitespace variants
    object_pattern = re.compile(r"company:\s*([\"'])(.*?)\1.*?role:\s*([\"'])(.*?)\3.*?blurb:\s*([`\"'])(.*?)\5", re.DOTALL)
    
    matches = object_pattern.findall(block_content)
    
    for m in matches:
        # Groups are: 1=quote, 2=company, 3=quote, 4=role, 5=quote, 6=blurb
        entries.append({
            "company": m[1].strip(),
            "role": m[3].strip(),
            "blurb": m[5].strip(),
            "projects": [] # To be hydrated
        })
        
    return entries

def extract_forensic_summary(content):
    """
    Extracts Trigger/Intervention/Result from MDX content.
    Priority 1: YAML Frontmatter (forensic_summary object)
    Priority 2: Body Text (Legacy/Narrative)
    """
    data = {}

    # 1. YAML Extraction (Text-based, no external deps)
    # Find the first YAML block (between first ~200 lines to be safe, but regex handles it)
    # We look for "forensic_summary:" and then indented keys
    
    # Locate the forensic_summary block
    fs_match = re.search(r"^forensic_summary:\s*\n(.*?)(?:^\w|\Z)", content, re.MULTILINE | re.DOTALL)
    if fs_match:
        block = fs_match.group(1)
        
        # Parse individual keys from the block
        # We assume standard YAML format: key: "value" or key: value
        t_match = re.search(r"(?:trigger|Trigger):\s*[\"']?(.*?)[\"']?\s*\n", block)
        i_match = re.search(r"(?:intervention|Intervention):\s*[\"']?(.*?)[\"']?\s*\n", block)
        r_match = re.search(r"(?:result|Result):\s*[\"']?(.*?)[\"']?\s*\n", block)
        
        if t_match and i_match and r_match:
            return {
                "Trigger": t_match.group(1).strip(),
                "Intervention": i_match.group(1).strip(),
                "Result": r_match.group(1).strip()
            }

    # 2. Body Regex (Legacy Fallback)
    # Searches for bullet points in the text body
    patterns = {
        "Trigger": re.compile(r"[•-]\s*The\s*Trigger(?:\s*\(Crisis\))?:\s*(.*)", re.IGNORECASE),
        "Intervention": re.compile(r"[•-]\s*The\s*Intervention(?:\s*\(Fix\))?:\s*(.*)", re.IGNORECASE),
        "Result": re.compile(r"[•-]\s*The\s*Result(?:\s*\(Impact\))?:\s*(.*)", re.IGNORECASE)
    }
    
    for key, pattern in patterns.items():
        match = pattern.search(content)
        if match:
            # Remove any trailing Markdown formatting if necessary
            clean_text = match.group(1).strip().strip('*_`')
            data[key] = clean_text
            
    if len(data) == 3:
        return data
        
    return None

# --- MAIN ---

def harvest():
    print("🚜 Starting LinkedIn Harvest...")
    
    # 1. Read Static Profile (linkedin_master.ts)
    if not LINKEDIN_MASTER_PATH.exists():
        print(f"❌ Master file not found: {LINKEDIN_MASTER_PATH}")
        return

    ts_content = LINKEDIN_MASTER_PATH.read_text(encoding="utf-8")
    tagline = parse_ts_variable(ts_content, "tagline")
    about = parse_ts_variable(ts_content, "about")
    experience_list = parse_experience(ts_content)
    
    print(f"   👤 Found Profile: {tagline[:30]}...")
    print(f"   📋 Found {len(experience_list)} Career Entries in Master.")
    
    # 2. Scan Projects and Hydrate
    orphans = []
    
    if PROJECTS_DIR.exists():
        for folder in PROJECTS_DIR.iterdir():
            if folder.is_dir():
                mdx_path = folder / "index.mdx"
                if mdx_path.exists():
                    content = mdx_path.read_text(encoding="utf-8")
                    
                    # Extract Data
                    summary = extract_forensic_summary(content)
                    
                    # Get Frontmatter Title (basic)
                    # Anchored to start of line to avoid nested 'title:' in stickies
                    title_match = re.search(r"^title:\s*(.*)", content, re.MULTILINE)
                    raw_title = title_match.group(1).strip().strip('"').strip("'") if title_match else ""
                    
                    # Fallback to Folder Name if title is empty
                    title = raw_title if raw_title else folder.name.replace("-", " ").title()
                    
                    slug = folder.name

                    
                    if summary:
                        project_data = {
                            "title": title,
                            "slug": slug,
                            "summary": summary
                        }
                        print(f"   💎 Harvested: {slug}")
                        
                        # MATCHING LOGIC
                        # 1. Map Slug -> Company
                        target_company = SLUG_MAP.get(slug)
                        
                        matched = False
                        
                        if target_company:
                            # Try to find in experience_list
                            for entry in experience_list:
                                if entry["company"] == target_company:
                                    entry["projects"].append(project_data)
                                    matched = True
                                    break
                                    
                        # 2. Fallback: Fuzzy Match Company Name in Slug? (Nah, manual map is safer for now)
                        
                        if not matched:
                            orphans.append(project_data)
                    else:
                        pass # No summary, skip

    print(f"   ✅ Associated projects with employers.")
    if orphans:
        print(f"   ⚠️ Found {len(orphans)} orphaned projects (No Employer Match)")

    # 3. Generate Output: The Decoupled Architecture
    output_lines = []
    
    # ---------------------------------------------------------
    # PART 1: OVERARCHING PROFILE INFO
    # ---------------------------------------------------------
    output_lines.append(f"{to_bold('--- TAGLINE ---')}")
    output_lines.append(tagline)
    output_lines.append("")
    output_lines.append(f"{to_bold('--- ABOUT ---')}")
    output_lines.append(about)
    output_lines.append("\n" + "="*40 + "\n")
    
    # ---------------------------------------------------------
    # PART 2: THE EXPERIENCE BUCKETS (Strictly for the "Experience" section)
    # ---------------------------------------------------------
    output_lines.append(f"{to_bold('SECTION 1: THE EXPERIENCE BUCKETS')}")
    output_lines.append("(Copy these blurbs directly into the LinkedIn 'Experience' section. Max 2,000 characters per role.)\n")
    
    for entry in experience_list:
        output_lines.append(f"{to_bold(entry['company'].upper())} | {entry['role']}")
        output_lines.append("-" * len(f"{entry['company']} | {entry['role']}"))
        if entry["blurb"]:
            output_lines.append(entry["blurb"].strip())
        output_lines.append("") # Spacer
    
    output_lines.append("\n" + "="*40 + "\n")

    # ---------------------------------------------------------
    # PART 3: THE DISCRETE PROJECTS (Strictly for the "Projects" section)
    # ---------------------------------------------------------
    output_lines.append(f"{to_bold('SECTION 2: THE DISCRETE PROJECTS')}")
    output_lines.append("(Copy these blocks directly into the LinkedIn 'Projects' section, and link them to the associated Experience above.)\n")
    
    for entry in experience_list:
        if entry["projects"]:
            output_lines.append(f"■ {to_bold('Projects Associated With:')} {entry['company']}\n")
            
            for p in entry["projects"]:
                summary = p["summary"]
                title = p['title']
                
                # Format the block
                block = f"{to_bold('Project Title:')} {title}\n"
                block += f"🔸 {to_bold('Trigger:')} {summary['Trigger']}\n"
                block += f"🔸 {to_bold('Intervention:')} {summary['Intervention']}\n"
                block += f"🔸 {to_bold('Result:')} {summary['Result']}\n"
                
                output_lines.append(block)
            
            output_lines.append("") # Spacer between employers
            output_lines.append("-" * 20)
            output_lines.append("") # Spacer

    # Orphans
    if orphans:
        output_lines.append(f"■ {to_bold('ORPHANED PROJECTS (No Employer Match)')}\n")
        for p in orphans:
            summary = p["summary"]
            block = f"{to_bold('Project Title:')} {p['title']}\n"
            block += f"🔸 {to_bold('Trigger:')} {summary['Trigger']}\n"
            block += f"🔸 {to_bold('Intervention:')} {summary['Intervention']}\n"
            block += f"🔸 {to_bold('Result:')} {summary['Result']}\n"
            output_lines.append(block)

    # Write
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text("\n".join(output_lines), encoding="utf-8")
    
    print(f"🏁 Generated Asset: {OUTPUT_PATH}")

if __name__ == "__main__":
    harvest()
