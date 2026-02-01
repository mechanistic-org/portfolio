import os
import re
import datetime

# Configuration
PROJECTS_DIR = "src/content/projects"
OUTPUT_FILE = "public/assets/prompts/PROJECT_INDEX.md"

def strip_quotes(text):
    if not text:
        return ""
    return text.strip().strip('"').strip("'")

def parse_frontmatter(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    match = re.search(r"^---\n(.*?)\n---", content, re.DOTALL)
    if not match:
        return None

    frontmatter = match.group(1)
    data = {}

    # Simple Regex Parser for standard keys
    # Note: This is not a full YAML parser but sufficient for our flat key: value structure
    for line in frontmatter.split("\n"):
        if ":" in line:
            parts = line.split(":", 1)
            key = parts[0].strip()
            val = parts[1].strip()
            data[key] = strip_quotes(val)
            
    # Handle multi-line forensic_summary if it relies on indentation (which simple split fails on)
    # So we use specific regex for the heavy fields
    
    summary_match = re.search(r"forensic_summary:\s*([\"'|].*?)(\n[a-z]|\n---)", frontmatter, re.DOTALL)
    if summary_match:
        # cleanup multi-line
        raw_summary = summary_match.group(1)
        # remove newlines and extra spaces for the registry line
        clean_summary = " ".join(raw_summary.split())
        data["forensic_summary"] = strip_quotes(clean_summary)

    return data

def main():
    print("--- Compiling Forensic Registry ---")
    
    registry_entries = []

    # Walk the projects directory
    for root, dirs, files in os.walk(PROJECTS_DIR):
        for file in files:
            if file == "index.mdx":
                path = os.path.join(root, file)
                slug = os.path.basename(root)
                
                print(f"Scanning {slug}...")
                metadata = parse_frontmatter(path)
                
                if metadata and metadata.get("notebook_url"):
                    entry = {
                        "slug": slug,
                        "title": metadata.get("title", slug),
                        "url": metadata.get("notebook_url"),
                        "summary": metadata.get("forensic_summary") or metadata.get("description") or "No summary available.",
                        "role": metadata.get("role", "Unknown"),
                        "employer": metadata.get("employer", "Unknown")
                    }
                    registry_entries.append(entry)

    # Sort by Employer then Title
    registry_entries.sort(key=lambda x: (x["employer"], x["title"]))

    # Generate Markdown
    lines = []
    lines.append(f"# Forensic Project Registry")
    lines.append(f"Generated: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}")
    lines.append("")
    lines.append("> **System Instruction:** Use this registry to locate the specific 'Detail Pod' (NotebookLM) for a given query. Do not hallucinate details. Refer the user to the specific URL.")
    lines.append("")

    for item in registry_entries:
        lines.append(f"## {item['title']} (`{item['slug']}`)")
        lines.append(f"- **Role:** {item['role']} | **Entity:** {item['employer']}")
        lines.append(f"- **Notebook:** {item['url']}")
        lines.append(f"- **Summary:** {item['summary']}")
        lines.append("")
        lines.append("---")
        lines.append("")

    # Write Output
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print(f"COMPLETE: Registry generated at {OUTPUT_FILE}")
    print(f"Total Entries: {len(registry_entries)}")

if __name__ == "__main__":
    main()
