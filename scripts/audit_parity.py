import json
import re
import sys
from pathlib import Path
from difflib import SequenceMatcher

# Protocol: The 12 "Heavy Cylinder" Projects
TARGETS = [
    "c24",
    "d-control",
    "d-command",
    "sc48",
    "m700",
    "ksystem-120",
    "320-slot-optical-carousel",
    "bazooka",
    "extension-switches",
    "room-director",
    "wall-plates",
    "webtv-cortez"
]

REPO_ROOT = Path(__file__).parent.parent
DUMPS_DIR = REPO_ROOT / "notebook_dumps"
CONTENT_DIR = REPO_ROOT / "src/content/projects"

def extract_sovereign_narrative(txt_path):
    """
    Extracts the narrative from a .txt dump using Strict Separation logic.
    Identical to hydrate_content.py logic.
    """
    try:
        content = txt_path.read_text(encoding="utf-8")
    except Exception as e:
        return f"ERROR: {e}"

    decoder = json.JSONDecoder()
    pos = 0
    cleaned_segments = []
    
    while pos < len(content):
        next_brace = content.find('{', pos)
        if next_brace == -1:
            cleaned_segments.append(content[pos:])
            break
        if next_brace > pos:
            cleaned_segments.append(content[pos:next_brace])
        try:
            _, end_offset = decoder.raw_decode(content, next_brace)
            # SKIP JSON
            pos = next_brace + end_offset
        except json.JSONDecodeError:
            cleaned_segments.append(content[next_brace])
            pos = next_brace + 1
            
    full_narrative = "".join(cleaned_segments)
    
    # Minimal cleanup for comparison
    lines = [l.strip() for l in full_narrative.split('\n') if l.strip()]
    # Filter 'run' lines as per hydrate script
    lines = [l for l in lines if not (len(l) < 50 and l.lower().startswith("run"))]
    
    return "\n".join(lines)

def extract_mdx_body(mdx_path):
    """
    Extracts the body text from an MDX file (after Frontmatter).
    """
    try:
        content = mdx_path.read_text(encoding="utf-8")
    except Exception as e:
        return f"ERROR: {e}"
        
    # Regex split to handle '---' at start of line only
    parts = re.split(r'^---\s*$', content, flags=re.MULTILINE)
    
    # DEBUG:
    print(f"DEBUG {mdx_path.name}: Parts count = {len(parts)}")
    
    if len(parts) < 3:
        if len(parts) >= 2:
             # Check if this is valid body
             body = parts[-1].strip()
             return body
        return f"ERROR: Invalid MDX format (parts={len(parts)})"
        
    # The body is everything after the second '---' separator
    # parts[0] = '' (usually), parts[1] = frontmatter, parts[2:] = body segments
    # usage of --- as HR in body causes multiple parts. We must rejoin them.
    body = "\n---\n".join(parts[2:]).strip()
    
    # print(f"DEBUG BODY START: {body[:50]}")
    return body

def check_for_json_leak(text):
    """
    Heuristic to check if raw JSON leaked into the body.
    """
    if '{"forensic_metrics":' in text or '{"scars":' in text:
        return True
    return False

def audit_project(slug):
    txt_path = DUMPS_DIR / f"{slug}.txt"
    # Logic note: some are mapped differently? No, dumps should match slugs for these 12.
    # Wait, webtv-cortez dump might be webtv-cortez.txt? Yes.
    
    mdx_path = DUMPS_DIR / f"{slug}.md" # Wait, the user asked to compare DUMPS vs CURRENT BODY.
    # The current body is in `notebook_dumps/{slug}.md` (The Sovereign Narrative File)
    # OR is it in `src/content/projects/{slug}/index.mdx`?
    # The user said: "against current body text dump the user sees when they llok at the page"
    # That implies `index.mdx`.
    # BUT, `hydrate_content.py` writes to `notebook_dumps/{slug}.md` AND `src/content/projects...`?
    # Actually, `hydrate_content.py` generates `{slug}.md` in `notebook_dumps` THEN injects it.
    # Let's check `notebook_dumps/{slug}.md` as the Primary Artifact first, as that is the "Sovereign Source".
    
    # Re-reading user request: "against current body text dump the user sees when they llok at the page"
    # This specifically means the MDX file in `src/content`.
    
    mdx_file = CONTENT_DIR / slug / "index.mdx"
    
    if not txt_path.exists():
        return {"status": "MISSING_SOURCE", "slug": slug}
    if not mdx_file.exists():
        return {"status": "MISSING_TARGET", "slug": slug}
        
    source_narrative = extract_sovereign_narrative(txt_path)
    if source_narrative.startswith("ERROR"):
        return {"status": "READ_ERROR", "slug": slug, "msg": source_narrative}
        
    target_body = extract_mdx_body(mdx_file)
    if target_body.startswith("ERROR"):
        return {"status": "READ_ERROR", "slug": slug, "msg": target_body}
        
    # Similarity Check
    # We clean both heavily to compare "Bone Structure"
    # Similarity Check
    # We clean both heavily to compare "Bone Structure"
    def normalize(t):
        # Remove stickies specific to MDX
        t = re.sub(r'<div.*?>.*?</div>', '', t, flags=re.DOTALL) # Generic div removal if needed
        # Remove specific sticky tags if they exist as components
        # (Assuming MDX might have <Sticky ... /> or similar? No, usually just text)
        
        # Remove whitespace
        t = re.sub(r'\s+', ' ', t).strip()
        return t
        
    norm_source = normalize(source_narrative)
    norm_target = normalize(target_body)
    
    # Debug: Dump first 100 chars if low parity
    debug_msg = ""
    matcher = SequenceMatcher(None, norm_source, norm_target)
    ratio = matcher.ratio()
    
    if ratio < 0.10:
        debug_msg = f"\nSRC: {norm_source[:100]}...\nTGT: {norm_target[:100]}..."
    
    # Leak Check
    has_leak = check_for_json_leak(target_body)
    
    return {
        "status": "OK",
        "slug": slug,
        "ratio": ratio,
        "leak": has_leak,
        "source_len": len(source_narrative),
        "target_len": len(target_body),
        "diff": abs(len(source_narrative) - len(target_body)),
        "debug_msg": debug_msg
    }

def main():
    # Force UTF-8 output for Windows terminals/pipes
    if sys.platform == "win32":
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')

    print(f"AUDIT: Checking {len(TARGETS)} Projects for Content Parity (Source .txt vs Target .mdx)")
    print(f"{'PROJECT':<30} | {'PARITY':<8} | {'JSON LEAK':<10} | {'DIFF (Chars)':<12} | {'STATUS'}")
    print("-" * 80)
    
    results = []
    
    for slug in TARGETS:
        res = audit_project(slug)
        results.append(res)
        
        status_icon = "[OK]"
        if res["status"] != "OK":
            status_icon = "[ERROR]"
        elif res["leak"]:
            status_icon = "[LEAK]"
        elif res["ratio"] < 0.90: # Allow some deviation for formatting
            status_icon = "[LOW]"
            
        print(f"{slug:<30} | {res.get('ratio', 0):.2%}   | {str(res.get('leak', 'N/A')):<10} | {res.get('diff', 0):<12} | {status_icon}")
        if res.get('debug_msg'):
            try:
                print(res['debug_msg'])
            except:
                print("Degug message skipped due to encoding.")
            print("-" * 80)

if __name__ == "__main__":
    main()
