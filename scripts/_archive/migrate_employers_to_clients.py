import os
import re
import yaml
from pathlib import Path

CONTENT_DIR = Path("src/content/projects")

def migrate_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Parse Frontmatter
    match = re.search(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not match:
        return

    fm_text = match.group(1)
    try:
        data = yaml.safe_load(fm_text)
    except Exception as e:
        print(f"Error parsing YAML in {file_path}: {e}")
        return

    modified = False
    
    # Logic:
    # If employer is 'webtv' -> employer: 'mechanistic', client.append('WebTV')
    # If employer is 'microsoft' -> employer: 'mechanistic', client.append('Microsoft')
    
    current_employer = data.get("employer")
    
    if current_employer in ["webtv", "microsoft"]:
        new_client = "WebTV" if current_employer == "webtv" else "Microsoft"
        
        # Update Employer
        # We need to replace the line in the text to preserve comments/formatting if possible, 
        # but pure yaml dump is risky for comments. 
        # Let's do regex replacement for the employer line.
        
        # Update Client list
        clients = data.get("client", [])
        if isinstance(clients, str):
            clients = [clients]
        if not clients:
            clients = []
            
        if new_client not in clients:
            clients.append(new_client)
            modified = True
            
        # Write back
        # We will use regex to swap employer and robustly update client
        
        lines = content.splitlines()
        new_lines = []
        employer_updated = False
        client_updated = False
        
        for line in lines:
            # Employer
            if not employer_updated:
                m_emp = re.match(r'^(\s*)employer:\s*' + re.escape(current_employer) + r'\s*$', line)
                if m_emp:
                    new_lines.append(f"{m_emp.group(1)}employer: mechanistic")
                    employer_updated = True
                    modified = True
                    continue
            
            # Client
            # Finding where 'client' is defined is tricky if it's multiline or empty.
            # Easiest is to rewrite the client line if we find it.
            if re.match(r'^(\s*)client:', line):
                # Skip existing client lines
                # We will re-insert the client block
                continue
            if line.strip().startswith("- ") and not client_updated:
                 # Check if we are inside a client block? 
                 # Too risky parsing by line.
                 pass

            new_lines.append(line)
        
        # This approach is messy for 'client'. 
        # Let's use the 'replace_key' approach for simple keys and re-serialize structure for complex?
        # No, let's just use the `replace_file_content` logic style: read file, find key, replace value.
        
        # Let's rebuild the file content properly.
        # Since we are doing specific known replacements (webtv/microsoft), we can be targeted.
        
        new_content = content
        
        # 1. Replace employer
        new_content = re.sub(r'employer:\s*' + current_employer, 'employer: mechanistic', new_content)
        
        # 2. Update client
        # Regex to find "client: []" or "client:\n  - foo"
        
        # Case A: client: []
        if "client: []" in new_content:
            new_content = new_content.replace("client: []", f"client:\n  - {new_client}")
        # Case B: client: [foo] (inline list)
        elif re.search(r'client:\s*\[(.*?)\]', new_content):
            def repl(m):
                existing = m.group(1)
                if existing.strip():
                     return f"client: [{existing}, {new_client}]"
                else:
                     return f"client: [{new_client}]"
            new_content = re.sub(r'client:\s*\[(.*?)\]', repl, new_content)
        # Case C: client:\n  - foo
        elif re.search(r'client:\s*\n', new_content):
             # Append to list?
             # Find the block and add item.
             # This is hard with regex.
             # Let's just assume most are [] or inline for this specific codebase based on previous views.
             # If we see multiline, we might append entry.
             pass
        else:
             # Case D: client starting line not found?
             pass

        if new_content != content:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Migrated {file_path.name}: {current_employer} -> mechanistic, added client {new_client}")

def main():
    for root, dirs, files in os.walk(CONTENT_DIR):
        for file in files:
            if file.endswith(".mdx") or file.endswith(".md"):
                migrate_file(Path(root) / file)

if __name__ == "__main__":
    main()
