import re

target_file = r"src/content/projects/d-control/index.mdx"

with open(target_file, "r", encoding="utf-8") as f:
    content = f.read()

# Fix 1: Split "data: {} - id:" -> Just new list item
# We can discard data: {} if we are starting a new id, as the previous item is implicit.
content = re.sub(r"data: \{\} - id:", "\n    - id:", content)

# Fix 2: Split "src: ... - id:"
# We want to keep the src line, new line, indent - id
content = re.sub(r"(src: .*?\.webp) - id:", r"\1\n    - id:", content)
content = re.sub(r"(src: .*?\.jpg) - id:", r"\1\n    - id:", content)
# catch-all for src ending in non-space
content = re.sub(r"(src: .*?) - id:", r"\1\n    - id:", content)

# Fix 3: Split "src: ... - alt:" if any remain
content = re.sub(r"(src: .*?) - alt:", r"\1\n          - alt:", content)

# Fix 4: Check for "data: {}" at start of line again (artifacts from split)
# We will do a line-by-line pass to clean up indentation of the newly split lines if needed,
# though the regex replacement puts "\n    - id:" which assumes 4 spaces.

with open(target_file, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Repaired {target_file} (v5)")
