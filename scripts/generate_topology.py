import csv
import json
import collections
from datetime import datetime

CONNECTIONS_CSV = 'd:/portfolio/portfolio_LinkedIn_working/Basic_LinkedInDataExport_01-13-2026.zip/Connections.csv'
OUTPUT_JSON = 'd:/GitHub/eriknorris/src/data/network_topology.json'

def clean_company(name):
    if not name: return "Unknown"
    name = name.strip()
    # Basic normalization
    replacements = {
        "Apple Inc.": "Apple",
        "Google Inc.": "Google",
        "Meta Platforms": "Meta",
        "Facebook": "Meta",
        "Amazon Web Services": "Amazon",
        "Amazon Lab126": "Amazon",
        "Universal Audio Inc.": "Universal Audio",
        "Digidesign / Avid": "Avid",
        "Avid Technology": "Avid",
        "Kaleidescape Inc.": "Kaleidescape",
    }
    return replacements.get(name, name)

def main():
    nodes = []
    company_counts = collections.Counter()
    
    # Read CSV
    with open(CONNECTIONS_CSV, 'r', encoding='utf-8') as f:
        # Skip weird header lines if any
        lines = f.readlines()
        
    # Find header row
    start_idx = 0
    for i, line in enumerate(lines):
        if line.startswith("First Name,Last Name"):
            start_idx = i
            break
            
    reader = csv.DictReader(lines[start_idx:])
    
    for row in reader:
        company = clean_company(row.get('Company', ''))
        position = row.get('Position', '')
        date_str = row.get('Connected On', '')
        
        if not company or not date_str:
            continue
            
        try:
            # Parse date "29 Jul 2025" -> "2025-07-29"
            date_obj = datetime.strptime(date_str, '%d %b %Y')
            iso_date = date_obj.strftime('%Y-%m-%d')
            
            # Anonymized Node
            node = {
                "company": company,
                "role": position,
                "connectedOn": iso_date
            }
            nodes.append(node)
            company_counts[company] += 1
            
        except ValueError:
            pass

    # Sort companies by count
    top_companies = company_counts.most_common(50)
    
    data = {
        "metadata": {
            "total_connections": len(nodes),
            "generated_at": datetime.now().isoformat()
        },
        "top_companies": [{"name": k, "count": v} for k, v in top_companies],
        "timeline": sorted(nodes, key=lambda x: x['connectedOn'])
    }
    
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
        
    print(f"Generated topology with {len(nodes)} connections.")
    print(f"Top Companies: {[x['name'] for x in data['top_companies'][:5]]}")

if __name__ == '__main__':
    main()
