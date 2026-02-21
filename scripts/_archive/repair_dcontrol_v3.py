import re

target_file = r"src/content/projects/d-control/index.mdx"

with open(target_file, "r", encoding="utf-8") as f:
    content = f.read()

lines = content.splitlines()
new_lines = []
in_scars = False

for line in lines:
    stripline = line.strip()
    
    if "scars:" in line:
        in_scars = True
    elif stripline.startswith("cogs:") or stripline.startswith("profitability:") or stripline.startswith("financial:") or stripline.startswith("___") or line.startswith("### "):
        in_scars = False
        
    if in_scars:
        # Force indentation for specific keys
        if stripline.startswith("- label:"):
            # Ensure 4 spaces
            line = "    " + stripline
        elif stripline.startswith("value:"):
            # Ensure 6 spaces
            line = "      " + stripline
        elif stripline.startswith("description:"):
            # Ensure 6 spaces
            line = "      " + stripline
            
    new_lines.append(line)

content = "\n".join(new_lines)

with open(target_file, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Refined {target_file} (v3)")
