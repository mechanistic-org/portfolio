import os
import json
import yaml

mdx_path = r"D:\GitHub\portfolio\src\content\projects\c24\index.mdx"
json_path = r"D:\GitHub\portfolio\src\content\projects\c24\data.json"

with open(mdx_path, "r", encoding="utf-8") as f:
    content = f.read()

# Split the MDX into frontmatter and body
if content.startswith("---\n"):
    parts = content.split("---\n", 2)
    if len(parts) == 3:
        frontmatter_str = parts[1]
        body = parts[2]
        
        # Parse YAML
        try:
            data = yaml.safe_load(frontmatter_str)
        except Exception as e:
            print(f"Failed to parse YAML: {e}")
            exit(1)
            
        keys_to_extract = ["bom", "cast", "timeline", "scars", "metrics", "forensic_summary", "toolchain"]
        extracted_data = {}
        
        for k in keys_to_extract:
            if k in data:
                extracted_data[k] = data.pop(k)
                
        # Write JSON sidecar
        with open(json_path, "w", encoding="utf-8") as jf:
            json.dump(extracted_data, jf, indent=2)
            
        print(f"Successfully wrote sidecar to {json_path}")
        
        # Write back MDX
        new_frontmatter = yaml.dump(data, default_flow_style=False, sort_keys=False)
        new_content = f"---\n{new_frontmatter}---\n{body}"
        
        with open(mdx_path, "w", encoding="utf-8") as nf:
            nf.write(new_content)
            
        print("Successfully updated index.mdx")
    else:
        print("Could not find ending frontmatter delimiter.")
else:
    print("File does not start with ---")
