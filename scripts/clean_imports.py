import os

CONTENT_DIR = "src/content/projects"
IMPORTS_TO_REMOVE = [
    "import { YouTube } from '@astro-community/astro-embed-youtube';",
    "import ModelViewer from '@components/mdx/ModelViewer.astro';"
]

def clean_imports():
    count = 0
    for filename in os.listdir(CONTENT_DIR):
        if not filename.endswith(".mdx"): continue
        
        path = os.path.join(CONTENT_DIR, filename)
        with open(path, "r", encoding="utf-8") as f:
            lines = f.readlines()
            
        new_lines = []
        changed = False
        for line in lines:
            stripped = line.strip()
            if stripped in IMPORTS_TO_REMOVE:
                changed = True
                continue # Skip this line
            new_lines.append(line)
            
        if changed:
            with open(path, "w", encoding="utf-8") as f:
                f.writelines(new_lines)
            print(f"cleaned: {filename}")
            count += 1
            
    print(f"Total files cleaned: {count}")

if __name__ == "__main__":
    clean_imports()
