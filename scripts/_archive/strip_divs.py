import os
import re

def strip_divs(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove <div ...> opening tags (case insensitive, multiline safe-ish)
    # matching <div followed by any characters until >
    new_content = re.sub(r'<div[^>]*>', '', content, flags=re.IGNORECASE)
    
    # Remove </div> closing tags
    new_content = re.sub(r'</div>', '', new_content, flags=re.IGNORECASE)
    
    if content != new_content:
        print(f"Stripped divs from {os.path.basename(filepath)}")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

def main():
    root_dirs = ['src/content/projects']
    print("Scrubbing divs from MDX files...")
    for root in root_dirs:
        for subdir, dirs, files in os.walk(root):
            for file in files:
                if file.endswith('.mdx') or file.endswith('.md'):
                    strip_divs(os.path.join(subdir, file))

if __name__ == '__main__':
    main()
