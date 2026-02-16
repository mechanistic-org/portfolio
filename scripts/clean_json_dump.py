import re

file_path = "d:\\GitHub\\eriknorris\\notebook_dumps\\cinema-one.txt"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# The JSON block corresponds to the appended part. 
# We can just use regex to fix the specific errors we saw:
# 1. Lines containing only commas or spaces and commas
# 2. Trailing commas in arrays (regex: ,(\s*]) -> \1)

# Fix isolated comma lines
content = re.sub(r"^\s*,\s*$", "", content, flags=re.MULTILINE)
content = re.sub(r"^\s*,\s*,\s*$", "", content, flags=re.MULTILINE)

# Fix multiple commas
content = re.sub(r",\s*,", ",", content)

# remove empty lines left by above
content = re.sub(r"\n\s*\n", "\n", content)

# Fix trailing commas before closing brackets/braces
content = re.sub(r",\s*]", "]", content)
content = re.sub(r",\s*}", "}", content)

# Wrap in fenced code block if not already
if "```json" not in content:
    # Find the start of the JSON block (Heuristic: first { after the narrative text)
    # The narrative ends around line 1671 with "Pogo pins,."
    # We can search for the start of the metal_components block or the first {
    
    # Let's find the last { in the file, or the start of the object containing metal_components
    match = re.search(r"\{\s*\"metal_components\"", content)
    if match:
        start_index = match.start()
        # Insert ```json before
        content = content[:start_index] + "\n```json\n" + content[start_index:]
        # Append ``` at the end
        content = content.strip() + "\n```"

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Cleaned and Fenced JSON in cinema-one.txt")
