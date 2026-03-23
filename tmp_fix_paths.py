import os
import re
from pathlib import Path

# Directories to search
TARGET_DIRS = [
    r"D:\GitHub\portfolio",
    r"D:\GitHub\global_agent"
]

# File extensions to modify
EXTENSIONS = {".ts", ".py", ".js", ".cjs", ".mjs", ".json", ".md", ".astro", ".tsx"}

# Regex replacements to carefully target paths and avoid replacing URLs or names
REPLACEMENTS = [
    # Paths starting with D:/GitHub/ or D:\GitHub\
    (re.compile(r"([dD]:[/\\]GitHub[/\\])eriknorris-workspace", re.IGNORECASE), r"\g<1>portfolio-workspace"),
    (re.compile(r"([dD]:[/\\]GitHub[/\\])eriknorris-assets", re.IGNORECASE), r"\g<1>portfolio-assets"),
    (re.compile(r"([dD]:[/\\]GitHub[/\\])eriknorris-archive", re.IGNORECASE), r"\g<1>portfolio-archive"),
    (re.compile(r"([dD]:[/\\]GitHub[/\\])eriknorris(?=[/\\'\"])", re.IGNORECASE), r"\g<1>portfolio"),
    # global_config path joins
    (re.compile(r"(GITHUB_ROOT\s*,\s*['\"])eriknorris(['\"])"), r"\g<1>portfolio\g<2>"),
    (re.compile(r"(GITHUB_ROOT\s*/\s*[\"'])eriknorris([\"'])"), r"\g<1>portfolio\g<2>"),
]

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return

    new_content = content
    for pattern, repl in REPLACEMENTS:
        new_content = pattern.sub(repl, new_content)

    if new_content != content:
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated: {filepath}")
        except Exception as e:
            print(f"Error writing {filepath}: {e}")

def main():
    for target_dir in TARGET_DIRS:
        for root, dirs, files in os.walk(target_dir):
            if any(part in root for part in ['.git', 'node_modules', '.astro', 'dist', 'build']):
                continue
                
            for file in files:
                filepath = os.path.join(root, file)
                # Skip self
                if file == "tmp_fix_paths.py":
                    continue
                ext = Path(file).suffix.lower()
                if ext in EXTENSIONS:
                    process_file(filepath)

if __name__ == "__main__":
    main()
