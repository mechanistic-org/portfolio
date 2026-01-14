import os
import frontmatter
import csv
from collections import Counter

# Content paths
PROJECTS_DIR = 'd:/GitHub/eriknorris/src/content/projects'
LINKEDIN_SKILLS_CSV = 'd:/portfolio/portfolio_LinkedIn_working/Basic_LinkedInDataExport_01-13-2026.zip/Skills.csv'

# Sets to hold data
site_tools = Counter()
site_tags = Counter()
site_icons = Counter()
linkedin_skills = set()

# 1. Parse Site Content
print("Scanning MDX files...")
for root, dirs, files in os.walk(PROJECTS_DIR):
    for file in files:
        if file.endswith('.mdx'):
            path = os.path.join(root, file)
            try:
                post = frontmatter.load(path)
                
                # Extract Tools
                if 'tools' in post.metadata:
                    for tool in post.metadata['tools']:
                        site_tools[tool] += 1
                        
                # Extract Tags
                if 'tags' in post.metadata:
                    for tag in post.metadata['tags']:
                        site_tags[tag] += 1

                # Extract Icons
                if 'toolIcons' in post.metadata:
                    for icon in post.metadata['toolIcons']:
                        site_icons[icon] += 1
                        
            except Exception as e:
                print(f"Error parsing {file}: {e}")

# 2. Parse LinkedIn Data
print("\nReading LinkedIn Skills...")
try:
    with open(LINKEDIN_SKILLS_CSV, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        next(reader) # Skip header
        for row in reader:
            if row:
                linkedin_skills.add(row[0].strip())
except Exception as e:
    print(f"Error reading CSV: {e}")

# 3. Analyze
print("\n--- ANALYSIS ---")
print(f"Total Site Tools: {len(site_tools)}")
print(f"Total Site Tags: {len(site_tags)}")
print(f"Total LinkedIn Skills: {len(linkedin_skills)}")

# Normalization for comparison
def normalize(s):
    return s.lower().replace(" ", "").replace("-", "")

site_tools_norm = {normalize(k): k for k in site_tools}
site_tags_norm = {normalize(k): k for k in site_tags}
link_skills_norm = {normalize(k): k for k in linkedin_skills}

# Matches
tool_matches = []
tag_matches = []
misses = []

for skill_norm, original_skill in link_skills_norm.items():
    if skill_norm in site_tools_norm:
        tool_matches.append(f"{original_skill} (Site: {site_tools_norm[skill_norm]})")
    elif skill_norm in site_tags_norm:
        tag_matches.append(f"{original_skill} (Site Tag: {site_tags_norm[skill_norm]})")
    else:
        misses.append(original_skill)

print("\n[MATCHES - TOOLS]")
for m in sorted(tool_matches):
    print(m)

print("\n[MATCHES - TAGS]")
for m in sorted(tag_matches):
    print(m)

print("\n[MISSING FROM SITE]")
for m in sorted(misses):
    print(m)

print("\n[SITE TOOLS NOT IN LINKEDIN]")
for tool in site_tools:
    if normalize(tool) not in link_skills_norm:
        print(f"{tool} ({site_tools[tool]} uses)")

