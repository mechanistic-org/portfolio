import yaml
import re
import sys

try:
    with open("src/content/projects/c24/index.mdx", "r", encoding="utf-8") as f:
        text = f.read()

    # The frontmatter starts at the beginning of the string with '---\n'
    # and ends with the first '\n---\n'
    match = re.match(r"^---\n(.*?)\n---(?=\n|$)", text, re.DOTALL)
    if match:
        fm_str = match.group(1)
        # Parse YAML
        fm = yaml.safe_load(fm_str)
        
        # Replace the raw BOM list with the targeted summary for C24
        fm["bom"] = [
            {"label": "PCB Assemblies", "value": "19"},
            {"label": "Sheet Metal Parts", "value": "15"},
            {"label": "Plastic Injection Parts", "value": "10"},
            {"label": "Data Control Drawings (DCDs)", "value": "12 Revisions"},
            {"label": "Major Engineering Change Orders (ECOs)", "value": "4"},
            {"label": "Console Units Shipped (Q4 '07)", "value": "500"}
        ]
        
        new_fm_str = yaml.dump(fm, sort_keys=False, default_flow_style=False, allow_unicode=True)
        # Reconstruct the file
        new_text = "---\n" + new_fm_str + "---\n" + text[match.end():].lstrip("\n")
        
        with open("src/content/projects/c24/index.mdx", "w", encoding="utf-8") as fw:
            fw.write(new_text)        
        print("Successfully updated C24 BOM format.")
    else:
        print("Error: Could not find frontmatter block.")
except Exception as e:
    print(f"Error executing fix_bom: {e}")
