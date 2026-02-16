import json
import re
import difflib

# 1. Read Source
with open('notebook_dumps/webtv-elmer.txt', 'r', encoding='utf-8') as f:
    source_content = f.read()

# Strip JSON from source using the logic we BELIEVE is correct (or just regex for now to be agnostic)
# Regex to remove { ... } blocks
source_stripped = re.sub(r'\{.*?\}', '', source_content, flags=re.DOTALL)
# Also strip "run" lines
source_lines = [l.strip() for l in source_stripped.split('\n') if l.strip()]
source_lines = [l for l in source_lines if not (len(l) < 50 and l.lower().startswith("run"))]

# 2. Read Output
with open('src/content/projects/webtv-elmer/index.mdx', 'r', encoding='utf-8') as f:
    output_content = f.read()

# Separate Frontmatter
parts = output_content.split('---')
if len(parts) >= 3:
    body_content = parts[2]
else:
    body_content = output_content

output_lines = [l.strip() for l in body_content.split('\n') if l.strip()]

# 3. Diff
diff = difflib.unified_diff(source_lines, output_lines, fromfile='source_stripped', tofile='output_body')
print("\n".join(list(diff)))
