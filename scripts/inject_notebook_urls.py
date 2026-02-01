import os
import re

# Mapping of Project Slug -> NotebookLM URL
NOTEBOOK_MAP = {
    "c24": "https://notebooklm.google.com/notebook/b8f893fe-234c-44ca-9d92-8fff6f82e53d?authuser=1",
    "webtv-cortez": "https://notebooklm.google.com/notebook/0e4b3124-6d3a-4835-8f2c-672d26b25989?authuser=1",
    "ksystem-120": "https://notebooklm.google.com/notebook/2afcdfc1-f747-4822-830b-cb29a17c65c3?authuser=1",
    "webtv-galaxy": "https://notebooklm.google.com/notebook/a743c4b4-0aaf-446f-b18c-13f23b38065e?authuser=1",
    "d-control": "https://notebooklm.google.com/notebook/c32aee36-9b19-43ec-9450-c8ed3bc6e86b?authuser=1",
    "sc48": "https://notebooklm.google.com/notebook/c783f4a0-8b0d-4770-8e1d-c31e1239306d?authuser=1",
    "webtv-elmer": "https://notebooklm.google.com/notebook/5fb69a8b-1ce6-4861-be36-46429138a43d?authuser=1"
}

BASE_DIR = "src/content/projects"

def update_frontmatter(file_path, url):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Regex to find frontmatter
    match = re.search(r"^---\n(.*?)\n---", content, re.DOTALL)
    if not match:
        print(f"FAILED: No frontmatter found in {file_path}")
        return

    frontmatter = match.group(1)
    
    # Check if notebook_url already exists
    if "notebook_url:" in frontmatter:
        # Update existing
        new_frontmatter = re.sub(
            r"notebook_url:.*", 
            f'notebook_url: "{url}"', 
            frontmatter
        )
    else:
        # Append to end of frontmatter
        new_frontmatter = frontmatter + f'\nnotebook_url: "{url}"'

    new_content = content.replace(frontmatter, new_frontmatter)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    
    print(f"SUCCESS: Updated {file_path}")

def main():
    print("--- Starting NotebookLM URL Injection ---")
    
    for slug, url in NOTEBOOK_MAP.items():
        # Construct path: src/content/projects/{slug}/index.mdx
        file_path = os.path.join(BASE_DIR, slug, "index.mdx")
        
        if os.path.exists(file_path):
            update_frontmatter(file_path, url)
        else:
            print(f"SKIPPED: {slug} (File not found at {file_path})")

    print("--- Injection Complete ---")

if __name__ == "__main__":
    main()
