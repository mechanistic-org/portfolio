import csv
import os
import random
import math
from datetime import datetime

# --- CONFIGURATION ---
SOURCE_DIR = "data_source"
MAIN_CSV = os.path.join(SOURCE_DIR, "Main.csv")
SKILLS_CSV = os.path.join(SOURCE_DIR, "Skills.csv")

# --- ARCHETYPES ---
# Define skill weights for different project types.
# Keys must match (fuzzy match) columns in Skills.csv
ARCHETYPES = {
    "Software": {
        "Python": 0.9, "React": 0.8, "TypeScript": 0.8, "Node.js": 0.7,
        "Data Analysis": 0.6, "Testing Automation": 0.7, "Git": 0.9,
        "Problem Solving": 0.8, "Agile Methodology": 0.8
    },
    "Hardware": {
        "CAD": 0.9, "Prototyping": 0.9, "Materials Knowledge": 0.8,
        "DFM": 0.9, "Tolerance Analysis": 0.8, "Simulation": 0.7,
        "Testing": 0.8, "Solidworks": 0.9, "Creo": 0.8
    },
    "Hybrid": {
        "Python": 0.7, "C++": 0.6, "Arduino": 0.8, "Raspberry Pi": 0.8,
        "Prototyping": 0.8, "Electronics": 0.7, "Problem Solving": 0.9,
        "System Architecture": 0.8
    },
    "Design": {
        "User-Centered Design": 0.9, "UX": 0.9, "Ideation": 0.9,
        "Prototyping": 0.8, "Design Research": 0.8, "Figma": 0.9,
        "Adobe": 0.8, "Visual Design": 0.8
    },
    "Management": {
        "Project Management": 0.9, "Risk Assessment": 0.8, "Communication": 0.9,
        "Stakeholder Management": 0.9, "Budgeting": 0.8, "Leadership": 0.9,
        "Strategy": 0.8
    }
}

# Default noise level (random variation)
NOISE = 0.15

def read_csv(filepath):
    with open(filepath, 'r', encoding='utf-8-sig') as f:
        # Read lines to handle potential empty lines or weird formatting
        lines = [l.strip() for l in f.readlines() if l.strip()]
        if not lines: return [], []
        
        # Parse headers with whitespace stripping
        headers = [h.strip() for h in lines[0].split(',')]
        
        reader = csv.DictReader(lines[1:], fieldnames=headers)
        data = [row for row in reader]
        return data, headers

def get_archetype(row):
    """Determine archetype based on Category, Tools, or Industry."""
    cat = (row.get("Category") or "").lower()
    ind = (row.get("Industry") or "").lower()
    tools = (row.get("Tools") or "").lower()
    
    if "software" in cat or "web" in cat or "app" in cat: return "Software"
    if "consumer electronics" in ind or "hardware" in cat: return "Hardware"
    if "design" in cat or "ux" in cat: return "Design"
    if "management" in cat or "strategy" in cat: return "Management"
    if "iot" in cat or "robotics" in cat: return "Hybrid"
    
    # Fallback based on tools
    if "python" in tools or "react" in tools: return "Software"
    if "solidworks" in tools or "creo" in tools: return "Hardware"
    if "figma" in tools: return "Design"
    
    return "Hardware" # Default to Hardware for this portfolio

def calculate_skill_value(skill_name, archetype, duration_days):
    """Calculate a value (0-100) for a skill based on archetype and duration."""
    base_weight = 0.1 # Default low weight
    
    # Check for fuzzy match in archetype weights
    for k, v in ARCHETYPES[archetype].items():
        if k.lower() in skill_name.lower():
            base_weight = v
            break
            
    # Scale by duration (logarithmic to prevent massive numbers for long projects)
    # A 30-day project with high weight might get ~20
    # A 3-year project with high weight might get ~90
    duration_factor = math.log(max(duration_days, 10), 10) # log10(days) -> 100d=2, 1000d=3
    
    # Base value calculation
    value = base_weight * duration_factor * 25 
    
    # Add noise
    value *= (1.0 + random.uniform(-NOISE, NOISE))
    
    # Clamp
    return max(1.0, min(100.0, value))

def main():
    print("🔧 Refining Skills Data...")
    
    # 1. Read Main.csv to get project list and metadata
    projects, _ = read_csv(MAIN_CSV)
    print(f"    Found {len(projects)} projects in Main.csv")
    
    # 2. Read existing Skills.csv to preserve headers (schema)
    _, skill_headers = read_csv(SKILLS_CSV)
    
    # 3. Generate new data
    new_rows = []
    
    for p in projects:
        name = p.get("Slug Name") or p.get("Name")
        if not name: continue
        
        # Calculate duration
        start_str = p.get("Project Start Date") or p.get("Project Start Date raw")
        end_str = p.get("Project End Date") or p.get("Project End Date raw")
        
        duration = 30 # Default
        try:
            start = datetime.strptime(start_str, "%m/%d/%Y")
            end = datetime.strptime(end_str, "%m/%d/%Y") if end_str else datetime.now()
            duration = (end - start).days
        except: pass
        
        archetype = get_archetype(p)
        
        row = {
            "Slug Name": name,
            "Project Start": start_str,
            "Project End": end_str,
            "days": duration
        }
        
        # Fill skill columns
        for header in skill_headers:
            if header in ["Slug Name", "Project Start", "Project End", "days", "midpoint", "✔️", "▲"]:
                continue
            
            val = calculate_skill_value(header, archetype, duration)
            row[header] = f"{val:.2f}"
            
        new_rows.append(row)
        
    # 4. Write back to Skills.csv
    with open(SKILLS_CSV, 'w', newline='', encoding='utf-8-sig') as f:
        writer = csv.DictWriter(f, fieldnames=skill_headers)
        writer.writeheader()
        writer.writerows(new_rows)
        
    print(f"✅ Regenerated Skills.csv with {len(new_rows)} rows.")

if __name__ == "__main__":
    main()
