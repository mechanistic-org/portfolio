
import re
import os

def strip_ansi(text):
    ansi_escape = re.compile(r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')
    return ansi_escape.sub('', text)

def clean_unused_vars(log_file):
    print(f"Reading {log_file}...")
    
    lines = []
    try:
        with open(log_file, 'r', encoding='utf-16-le') as f:
            lines = f.readlines()
    except:
        with open(log_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()

    # Regex for parsed error line (without ANSI)
    # src/components/Audio/SonicHeartbeat.tsx:11:9 - warning ts(6133): 't' is declared but its value is never read.
    # We make the regex more permissive to catch spaces, quotes, and the structure
    regex_str = r"^(.*?):(\d+):(\d+)\s+-\s+warning\s+ts\(6133\):\s+'(.*?)'\s+is\s+declared\s+but\s+its\s+value\s+is\s+never\s+read\.?"
    pattern = re.compile(regex_str, re.IGNORECASE)
    
    updates = {} 

    for line in lines:
        clean_line = strip_ansi(line).strip()
        match = re.search(regex_str, clean_line, re.IGNORECASE)
        if match:
            file_path, line_num, col_num, var_name = match.groups()
            
            file_path = file_path.replace('\\', '/')
            if not os.path.exists(file_path):
                # try relative to cwd?
                pass
            
            if file_path not in updates:
                updates[file_path] = []
            updates[file_path].append((int(line_num), var_name))
            
    print(f"Found {len(updates)} files with unused variables.")
    
    for file_path, items in updates.items():
        # Sort items by line number descending
        items.sort(key=lambda x: x[0], reverse=True)
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.readlines()
        except:
            print(f"Error reading {file_path}")
            continue
            
        modified = False
        
        # Group by line
        line_map = {}
        for ln, var in items:
            if ln not in line_map: line_map[ln] = []
            line_map[ln].append(var)
        
        for ln, vars in line_map.items():
            idx = ln - 1
            if idx < 0 or idx >= len(content): continue
            
            line = content[idx]
            original = line
            
            # Simple removal logic for imports only
            if 'import' in line:
                for var in vars:
                    # Remove var from { var, ... } or { ..., var }
                    # Regex: \bvar\b
                    
                    # 1. Remove "var,"
                    new_line = re.sub(rf'\b{re.escape(var)}\b\s*,', '', line)
                    if new_line == line:
                        # 2. Remove ", var"
                        new_line = re.sub(rf',\s*\b{re.escape(var)}\b', '', line)
                    if new_line == line:
                        # 3. Remove "var" (last item or single item)
                        new_line = re.sub(rf'\b{re.escape(var)}\b', '', line)
                    
                    line = new_line
                
                # Cleanup empty braces: import { } from ...
                line = re.sub(r'{\s*}', '{}', line)
                if '{}' in line and ('import' in line):
                     # check if it becomes empty import
                     if re.search(r'import\s*(type)?\s*\{\}\s*from', line):
                         line = "" # Delete line
                
                # Cleanup double commas caused by imperfect regex
                line = re.sub(r',\s*,', ',', line)
                line = re.sub(r'{\s*,', '{ ', line)
                
            if line != original:
                content[idx] = line
                modified = True
                
        if modified:
             with open(file_path, 'w', encoding='utf-8') as f:
                 f.writelines(content)
             print(f"Cleaned {file_path}")

if __name__ == "__main__":
    clean_unused_vars("check_output.txt")
