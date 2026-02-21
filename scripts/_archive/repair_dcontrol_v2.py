import re

target_file = r"src/content/projects/d-control/index.mdx"

with open(target_file, "r", encoding="utf-8") as f:
    content = f.read()

# Fix 1: Split " - id:" cases
content = re.sub(r"data: \{\} - id:", "data: {}\n    - id:", content)
content = re.sub(r"(src: .*?) - id:", r"\1\n    - id:", content)

# Fix 2: Split collapsed scars list
# Pattern: scars: - label:
content = re.sub(r"scars: - label:", "scars:\n    - label:", content)

# Pattern: description: "..." - label:
# This separates items.
# description ends with a quote usually.
content = re.sub(r'(description: ".*?") - label:', r'\1\n    - label:', content)

# Fix 3: Indent scars children to 6 spaces (they are currently 2 or 4 from previous script/state)
# The previous regex replacer indented "value:" to 4 spaces unconditionally.
# "    value:" -> we want "      value:" inside scars context.

lines = content.splitlines()
new_lines = []
in_scars = False

for line in lines:
    stripline = line.strip()
    
    # Check context. 
    # Note: scars is inside "metrics", so indentation might be deeper.
    # But usually "metrics:" is root, "  scars:" is 2 spaces.
    
    if "scars:" in line:
        in_scars = True
    elif stripline.startswith("cogs:") or stripline.startswith("profitability:") or stripline.startswith("financial:") or stripline.startswith("___") or line.startswith("### "):
        in_scars = False
        
    if in_scars:
        # If line starts with "value:" or "description:", indent to 6 spaces
        if line.startswith("    value:"):
            # It has 4 spaces. make it 6.
            line = "      " + line.strip()
        elif line.startswith("    description:"):
            line = "      " + line.strip()
            
    new_lines.append(line)

content = "\n".join(new_lines)

# One more fix: " - label:" inside line 455 needs to be split if regex didn't catch it.
# The regex above catch 'description: "..." - label:'.
# Let's hope description string is quoted properly.

with open(target_file, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Refined {target_file}")
