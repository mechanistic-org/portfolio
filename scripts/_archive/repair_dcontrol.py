import re
import os

target_file = r"src/content/projects/d-control/index.mdx"

with open(target_file, "r", encoding="utf-8") as f:
    content = f.read()

# Fix 1: Stickies formatting (convert inline layout to block)
# The current file has:
# stickies: - id: 01_intro
# title: 01 Intro
# We want:
# stickies:
#   - id: 01_intro
#     title: 01 Intro

# Specific fix for the messy stickies lines we saw
content = re.sub(r"stickies: - id:", "stickies:\n    - id:", content)
# Fix subsequent items that look like "featuredIndices: [] - id:"
content = re.sub(r"featuredIndices: \[\] - id:", "featuredIndices: []\n    - id:", content)

# Fix 2: Image lists collapsed on src line
# Pattern: src: ... - alt: ...
# We want to split this.
# Note: Indentation of images list needs to be correct.
# Usually:
#         images:
#           - alt:
# So 10 spaces?
# Let's be generous with matching.

def split_images(match):
    src_line = match.group(1)
    next_alt = match.group(2)
    return f"{src_line}\n          - alt: {next_alt}"

# Repeat this substitution until no matches, because one line might have multiple? 
# The broken file had: src: ... - alt: ...
# It seemed to be one per line in the broken version shown in view_file.
# e.g. src: .../file.webp - alt: next
# checking if there are multiple on one line.
# lines 51: src: ... - alt: ...
# lines 55: src: ... - alt: ...
# So just one split per line usually.

content = re.sub(r"(src: .*?) - alt: (.*?)", split_images, content)

# Fix 3: Indentation of the whole stickies block seems collapsed?
# The `view_file` showed:
# title: 01 Intro
# type: gallery
# at root level indentation?
# We need to indent them under the stickies item.
# This is hard to regex generically.
# But we know the schema. "title:", "type:", "data:" should be indented if they follow "- id:"

# Let's look at the structure again.
#     - id: 01_intro
# title: 01 Intro  <-- needs 6 spaces indent? 
#     - id: 01_intro
#       title: 01 Intro

# Heuristic: If we are inside `stickies`, indent non-indented keys.
# Actually, the file content we read in `view_file` showed no indent for `title`.
# title: 01 Intro
# We need to indent lines between `- id:` and the next `- id:` (or end of stickies).

lines = content.splitlines()
new_lines = []
in_stickies = False
current_indent = ""

for line in lines:
    stripline = line.strip()
    
    # Check if entering stickies
    if stripline.startswith("stickies:"):
        in_stickies = True
        new_lines.append(line)
        continue
        
    # Check if leaving stickies (e.g. "date:" or "heroImage:" or "metrics:")
    if in_stickies and (stripline.startswith("date:") or stripline.startswith("heroImage:")):
        in_stickies = False
        new_lines.append(line)
        continue
        
    if in_stickies:
        # If it's a new item "- id:"
        if "- id:" in line:
            # ensure proper indent. 
            # The regex above changed "stickies: - id:" to "stickies:\n    - id:"
            # So expected indent is 4 spaces.
            if not line.startswith("    "):
                line = "    " + line.strip()
        else:
            # It's a property of the sticky (title, type, data, layout, columns, scattered, images, aspectRatio, height, width, src, featuredIndices)
            # We need to indent these.
            # "images:" needs 6 spaces?
            # "- id:" is at 4 spaces.
            # Keys under it should be at 6 spaces.
            # "data:" -> 6 spaces
            #   "layout:" -> 8 spaces
            #   "images:" -> 8 spaces
            #     "- alt:" -> 10 spaces
            
            # This is complex to parse statefully.
            # Let's just indent everything by 4 spaces if it's not indented, and hope it aligns with "- id".
            # But "- id" is at 4 spaces. Sibling keys "title", "type" should be at 6? No, same level as "id" usually in YAML list?
            # - id: foo
            #   title: bar
            # So 6 spaces.
            
            # But "data" is a key. "data: {}".
            # Nested "data:" keys need 8 spaces.
            pass

# RETHINK: Text-based repair is fragile.
# Since I verified the structure IS repetitive, maybe I can just do a very specific find-replace for each key type.

# "title: " -> "      title: " (inside stickies)
# "type: gallery" -> "      type: gallery"
# "data:" -> "      data:"
# "layout: masonry" -> "        layout: masonry"
# "columns: 3" -> "        columns: 3"
# "scattered: true" -> "        scattered: true"
# "images:" -> "        images:"
# "- alt:" -> "          - alt:"
# "aspectRatio:" -> "            aspectRatio:"
# "height:" -> "            height:"
# "width:" -> "            width:"
# "src:" -> "            src:"
# "featuredIndices:" -> "      featuredIndices:"

# This seems safer.

replacements = [
    (r"^title: (0\d .*)$", r"      title: \1"), # Match specific sticky titles
    (r"^type: gallery$", r"      type: gallery"),
    (r"^data:$", r"      data:"),
    (r"^layout: masonry$", r"        layout: masonry"),
    (r"^columns: 3$", r"        columns: 3"),
    (r"^scattered: true$", r"        scattered: true"),
    (r"^images: - alt:", r"        images:\n          - alt:"), # specific collapsed case?
    (r"^images:$", r"        images:"),
    (r"^- alt: (.*)$", r"          - alt: \1"),
    (r"^aspectRatio: (.*)$", r"            aspectRatio: \1"),
    (r"^height: (\d+)$", r"            height: \1"),
    (r"^width: (\d+)$", r"            width: \1"),
    (r"^src: (.*)$", r"            src: \1"),
    (r"^featuredIndices: (.*)$", r"      featuredIndices: \1"),
    (r"^data: \{\}$", r"      data: {}"),
    # Fix metrics section too
    (r"^cogs:$", r"  cogs:"),
    (r"^value: (.*)$", r"    value: \1"),
    (r"^label: (.*)$", r"    label: \1"),
    (r"^financial:$", r"  financial:"),
    (r"^process:$", r"  process:"),
    (r"^technical:$", r"  technical:"),
    (r"^governance:$", r"  governance:"),
    (r"^ecos:$", r"    ecos:"),
    (r"^dcos: (.*)$", r"    dcos: \1"),
    (r"^interventions:$", r"  interventions:"),
    (r"^count: (.*)$", r"    count: \1"),
    (r"^profitability:$", r"  profitability:"),
    (r"^toolingActual: (.*)$", r"    toolingActual: \1"),
    (r"^toolingBudget: (.*)$", r"    toolingBudget: \1"),
    (r"^margins: (.*)$", r"    margins: \1"),
    (r"^costOfGoodsSold: (.*)$", r"    costOfGoodsSold: \1"),
    (r"^dcdCount: (.*)$", r"    dcdCount: \1"),
    (r"^engineeringChangeOrders: (.*)$", r"    engineeringChangeOrders: \1"),
    (r"^war_stories: (.*)$", r"  war_stories: \1"),
]

# Write the processed lines
final_lines = []
for line in content.splitlines():
    processed = line
    # Apply splitting of images first
    if "src:" in processed and " - alt:" in processed:
        # Split!
        parts = processed.split(" - alt: ")
        # parts[0] is "src: ..."
        # parts[1] is "alt: ..."
        # Indent src correctly (12 spaces)
        src_part = parts[0].strip()
        alt_part = parts[1].strip()
        
        # We need to make sure src_part is handled by the regex loop later or fix it here.
        # Let's fix it here.
        processed = f"            {src_part}\n          - alt: {alt_part}"
    
    # Apply regex replacements
    for pattern, repl in replacements:
        if "\n" not in processed: # Don't re-process split lines
            if re.search(pattern, processed):
                processed = re.sub(pattern, repl, processed)
    
    final_lines.append(processed)

# Rejoin
fixed_content = "\n".join(final_lines)

# Fix double-spaces or weird artifacts if any
fixed_content = re.sub(r"aspectRatio: aspectRatio:", "aspectRatio:", fixed_content)

with open(target_file, "w", encoding="utf-8") as f:
    f.write(fixed_content)

print(f"Repaired {target_file}")
