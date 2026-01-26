import os
import re
import yaml
from pathlib import Path

CONTENT_DIR = Path("src/content/projects")

def get_clients():
    clients = set()
    for root, dirs, files in os.walk(CONTENT_DIR):
        for file in files:
            if file.endswith(".mdx") or file.endswith(".md"):
                path = os.path.join(root, file)
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()
                    # extract frontmatter
                    match = re.search(r'^---\n(.*?)\n---', content, re.DOTALL)
                    if match:
                        try:
                            fm = yaml.safe_load(match.group(1))
                            if "client" in fm and fm["client"]:
                                if isinstance(fm["client"], list):
                                    for c in fm["client"]:
                                        clients.add(c)
                                elif isinstance(fm["client"], str):
                                    clients.add(fm["client"])
                        except Exception as e:
                            print(f"Error parsing {file}: {e}")
    return sorted(list(clients))

if __name__ == "__main__":
    clients = get_clients()
    print("EXISTING CLIENTS:")
    for c in clients:
        print(f"- {c}")
