import os
import frontmatter
import re

PROJECTS_DIR = 'd:/GitHub/portfolio/src/content/projects'

# Normalization Maps
TOOL_MAP = {
    'proengineer': 'Pro/ENGINEER',
    'pro engineer': 'Pro/ENGINEER',
    'pro-engineer': 'Pro/ENGINEER',
    'creo': 'PTC Creo', # Match LinkedIn
    'ptc creo': 'PTC Creo',
    'solidworks': 'SOLIDWORKS',
    'onshape': 'Onshape',
    'autocad': 'AutoCAD', 
    'thermal simulation': 'Thermal Simulation' # Capitalize
}

# New Tags to Inject based on Tool Usage
# If a project has these tools, ensure it has these tags/skills
IMPLIED_TAGS = {
    'Pro/ENGINEER': ['Mechanical Engineering', 'Product Design'],
    'PTC Creo': ['Mechanical Engineering', 'Product Design'],
    'SOLIDWORKS': ['Mechanical Engineering', 'CAD'],
    'Onshape': ['Mechanical Engineering', 'CAD'],
    'Moldflow': ['Injection Molding'],
    'Thermal Simulation': ['Thermal Analysis']
}

def standardize_file(filepath):
    changed = False
    try:
        post = frontmatter.load(filepath)
        
        # 1. Standardize Tools
        if 'tools' in post.metadata and isinstance(post.metadata['tools'], list):
            new_tools = []
            for tool in post.metadata['tools']:
                lower_tool = tool.lower()
                if lower_tool in TOOL_MAP:
                    normalized = TOOL_MAP[lower_tool]
                    if normalized != tool:
                        new_tools.append(normalized)
                        changed = True
                    else:
                        new_tools.append(tool)
                else:
                    new_tools.append(tool)
            post.metadata['tools'] = new_tools

        # 2. Inject Implied Tags (as 'tags' or 'additionalSkills')
        # We'll put high-level disciplines in 'tags'
        if 'tools' in post.metadata:
            current_tags = set(post.metadata.get('tags', []))
            
            for tool in post.metadata['tools']:
                # Recalculate implication based on NEW tool name
                if tool in IMPLIED_TAGS:
                    for implied in IMPLIED_TAGS[tool]:
                        if implied not in current_tags:
                            current_tags.add(implied)
                            changed = True
            
            if changed:
                post.metadata['tags'] = list(current_tags)

        # 3. Save if changed
        if changed:
            print(f"Updating {os.path.basename(filepath)}")
            # Custom dumper to keep it clean-ish or just write back
            with open(filepath, 'wb') as f:
                frontmatter.dump(post, f)
                
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

def main():
    print("Standardizing MDX Data...")
    for root, dirs, files in os.walk(PROJECTS_DIR):
        for file in files:
            if file.endswith('.mdx'):
                standardize_file(os.path.join(root, file))

if __name__ == '__main__':
    main()
