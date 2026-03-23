import os
import ast
import json

SCRIPTS_DIR = r"d:\GitHub\portfolio\scripts"

def get_py_docstring(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            tree = ast.parse(f.read())
            return ast.get_docstring(tree) or "No docstring found."
    except Exception as e:
        return f"Error parsing: {str(e)}"

def get_js_comment(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read().strip()
            if content.startswith("/**"):
                end = content.find("*/")
                if end != -1:
                    return content[3:end].strip().replace('*', '').strip()
            elif content.startswith("//"):
                lines = []
                for line in content.splitlines():
                    if line.startswith("//"):
                        lines.append(line[2:].strip())
                    else:
                        break
                return " ".join(lines)
    except:
        pass
    return "No header comment."

inventory = []

for root, dirs, files in os.walk(SCRIPTS_DIR):
    if "node_modules" in root or "__pycache__" in root or "lib" in root:
        continue
        
    for file in files:
        path = os.path.join(root, file)
        rel_path = os.path.relpath(path, SCRIPTS_DIR)
        
        desc = ""
        if file.endswith(".py"):
            desc = get_py_docstring(path)
        elif file.endswith((".js", ".ts", ".mjs", ".cjs")):
            desc = get_js_comment(path)
            
        inventory.append({
            "file": rel_path,
            "description": desc.split('\n')[0][:100] if desc else "No description"
        })

print(json.dumps(inventory, indent=2))
