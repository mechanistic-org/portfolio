
import os
import re

def fix_broken_imports(root_dir):
    print(f"Scanning {root_dir} for broken imports...")
    
    # Regex for "import  from" (two spaces or more, or space-from)
    # broken pattern: import from "..."
    # or import  from "..."
    
    # We want to match: import [whitespace] from ["']
    pattern = re.compile(r'^\s*import\s+(type\s+)?from\s+[\'"]', re.MULTILINE)
    
    # Also "import  from" (double space)
    pattern2 = re.compile(r'^\s*import\s+(type\s+)?\s+from\s+[\'"]', re.MULTILINE)

    count = 0
    extensions = {'.astro', '.ts', '.tsx', '.jsx', '.js'}

    for dirpath, dirnames, filenames in os.walk(root_dir):
        if 'node_modules' in dirpath or '.git' in dirpath:
            continue
            
        for filename in filenames:
            ext = os.path.splitext(filename)[1]
            if ext not in extensions:
                continue
                
            filepath = os.path.join(dirpath, filename)
            
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
            except:
                continue
                
            modified = False
            new_lines = []
            
            for line in lines:
                # Check for broken import
                # "import from" (invalid) -> delete line?
                # "import  from" (invalid) -> delete line?
                
                # Check strict text match to avoid false positives?
                stripped = line.strip()
                
                # Check for "import from"
                if stripped.startswith('import from ') or stripped.startswith('import  from ') or stripped.startswith('import type from '):
                    # This is likely a broken default import removal
                    # We should probably delete it, or convert to side-effect import `import "..."`
                    # Converting to side-effect import is safer: `import "..."`
                    
                    # Extract module specifier
                    # import from "mod" -> import "mod"
                    match = re.search(r'from\s+([\'"].*?[\'"]);?', stripped)
                    if match:
                        module = match.group(1)
                        # Replace line with `import "mod";\n`
                        # But typically side effects aren't needed for components.
                        # Safe to delete?
                        # If it was unused, then side-effect was probably not intended (unless CSS).
                        # If it's a CSS file, we should keep it.
                        if module.endswith('.css"') or module.endswith('.scss"') or module.endswith('.css\''):
                             new_lines.append(f'import {module};\n')
                        else:
                             # Delete
                             pass
                        modified = True
                        count += 1
                        continue
                
                # Also check for "import , {" or "import { ,"
                if re.search(r'import\s+,\s*\{', stripped):
                    # import , { A } -> import { A }
                    line = re.sub(r'import\s+,\s*\{', 'import {', line)
                    modified = True
                    count += 1
                
                new_lines.append(line)
                
            if modified:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.writelines(new_lines)
                print(f"Fixed {filepath}")

    print(f"Fixed {count} broken imports.")

if __name__ == "__main__":
    fix_broken_imports("src")
