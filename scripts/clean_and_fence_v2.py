import re
import os

md_path = "d:\\GitHub\\eriknorris\\notebook_dumps\\cinema-one.md"
txt_path = "d:\\GitHub\\eriknorris\\notebook_dumps\\cinema-one.txt"

# 1. Read the MD file to get the source JSON content
with open(md_path, "r", encoding="utf-8") as f:
    md_content = f.read()

# 1. Read the MD file to get the source JSON content
with open(md_path, "r", encoding="utf-8") as f:
    md_content = f.read()

# Extract all fenced JSON blocks
raw_blocks = re.findall(r'```json\s*(.*?)\s*```', md_content, re.DOTALL | re.IGNORECASE)
print(f"DEBUG: Found {len(raw_blocks)} raw JSON blocks.")
for i, b in enumerate(raw_blocks):
    print(f"DEBUG: Block {i} length: {len(b)}")
    print(f"DEBUG: Block {i} snippet: {b[:100]}...")

bom_json = ""
timeline_json = ""

for block in raw_blocks:
    if '"metal_components"' in block:
        bom_json = block
    elif '"date":' in block and '[' in block:
        timeline_json = block

# 2. Clean the JSON strings (fix ,, and trailing commas)
def clean_json(s):
    if not s: return ""
    # Remove lines with just comma or comma spaces
    s = re.sub(r"^\s*,\s*$", "", s, flags=re.MULTILINE)
    s = re.sub(r"^\s*,\s*,\s*$", "", s, flags=re.MULTILINE)
    # Fix multiple commas
    s = re.sub(r",\s*,", ",", s)
    # Fix trailing commas
    s = re.sub(r",\s*]", "]", s)
    s = re.sub(r",\s*}", "}", s)
    return s

bom_json = clean_json(bom_json)
timeline_json = clean_json(timeline_json)

# 3. Read TXT file and Truncate
with open(txt_path, "r", encoding="utf-8") as f:
    txt_content = f.read()

# Find the cutoff point. 
# The original file ended with "Pogo pins,." text.
cutoff_marker = "Pogo pins,."
idx = txt_content.find(cutoff_marker)

if idx != -1:
    # Keep content up to the marker + length of marker
    clean_txt = txt_content[:idx + len(cutoff_marker)]
else:
    # Fallback: maybe we already cleaned it?
    # Use a safe length or look for the first occurance of "```json" and cut before it
    idx_fence = txt_content.find("```json")
    if idx_fence != -1:
         clean_txt = txt_content[:idx_fence]
    else:
         clean_txt = txt_content

# 4. Append clean blocks
new_content = clean_txt + "\n\n"
if bom_json:
    new_content += "```json\n" + bom_json + "\n```\n\n"

# Wrap timeline in an object to avoid TypeError in hydrate_content.py (data.update(list) fails)
if timeline_json:
    if timeline_json.strip().startswith("["):
        timeline_json = '{ "timeline_events": ' + timeline_json + ' }'
    new_content += "```json\n" + timeline_json + "\n```\n"

with open(txt_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("✅ Reset cinema-one.txt and appended clean fenced JSON.")
