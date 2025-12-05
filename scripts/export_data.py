import csv
import json
import os

SOURCE_FILE = os.path.join("data_source", "Skills.csv")
OUTPUT_FILE = os.path.join("src", "data", "skills.json")

def main():
    print(f"Reading from {SOURCE_FILE}...")
    
    if not os.path.exists(SOURCE_FILE):
        print(f"Error: {SOURCE_FILE} not found.")
        return

    projects = []
    
    with open(SOURCE_FILE, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Extract basic metadata
            project = {
                "name": row.get("Slug Name", "Unknown"),
                "start": row.get("Project Start", ""),
                "end": row.get("Project End", ""),
                "days": int(row.get("days", 0) or 0),
                "skills": {}
            }
            
            # Extract skills (all other columns)
            for key, value in row.items():
                if key not in ["Slug Name", "Project Start", "Project End", "days", "midpoint", "✔️", "▲"]:
                    try:
                        val = float(value)
                        if val > 0:
                            project["skills"][key] = val
                    except ValueError:
                        pass
            
            projects.append(project)
            
    # Sort by start date (newest first)
    # Assuming MM/DD/YYYY format
    def parse_date(d):
        try:
            parts = d.split('/')
            return int(parts[2]) * 10000 + int(parts[0]) * 100 + int(parts[1])
        except:
            return 0
            
    projects.sort(key=lambda x: parse_date(x["start"]), reverse=True)

    print(f"Writing {len(projects)} projects to {OUTPUT_FILE}...")
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(projects, f, indent=2)
        
    print("Done.")

if __name__ == "__main__":
    main()
