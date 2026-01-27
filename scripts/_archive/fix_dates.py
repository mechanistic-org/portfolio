import os
import re
import dateutil.parser

def fix_date(date_str):
    if not date_str:
        return None
    try:
        # Remove quotes if present
        cleaned = date_str.strip('"').strip("'")
        dt = dateutil.parser.parse(cleaned)
        return dt.strftime("%Y-%m-%d")
    except:
        return None

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to find date: and endDate:
    # Handles: date: 2008-01-01, date: "2/1/1996", etc.
    
    lines = content.split('\n')
    new_lines = []
    in_frontmatter = False
    changed = False

    for line in lines:
        stripped = line.strip()
        if stripped == '---':
            in_frontmatter = not in_frontmatter
            new_lines.append(line)
            continue
        
        if in_frontmatter:
            # Check for date fields
            match = re.search(r'^(date|endDate|pubDate|updatedDate):\s*(.*)$', line)
            if match:
                key = match.group(1)
                val = match.group(2).strip()
                
                # If value is just empty or [], skip
                if not val or val == '""' or val == "''":
                     new_lines.append(line)
                     continue

                fixed = fix_date(val)
                if fixed and fixed != val.strip('"').strip("'"):
                    print(f"Fixing {key}: {val} -> {fixed} in {os.path.basename(filepath)}")
                    new_lines.append(f'{key}: {fixed}')
                    changed = True
                else:
                    new_lines.append(line)
            else:
                new_lines.append(line)
        else:
            new_lines.append(line)
    
    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write('\n'.join(new_lines))

def main():
    dirs_to_scan = ['src/content/projects', 'src/data']
    for root_dir in dirs_to_scan:
        print(f"Scanning {root_dir}...")
        for subdir, dirs, files in os.walk(root_dir):
            for file in files:
                if file.endswith('.md') or file.endswith('.mdx'):
                    process_file(os.path.join(subdir, file))

if __name__ == '__main__':
    main()
