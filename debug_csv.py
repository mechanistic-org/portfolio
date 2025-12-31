
import csv
import os

def read_csv_smart(filepath):
    print(f"Reading: {filepath}")
    with open(filepath, 'r', encoding='utf-8-sig') as f:
        lines = [l.strip() for l in f.readlines() if l.strip()]
    
    start_idx = 0
    headers = [h.strip() for h in lines[start_idx].split(',')]
    print(f"RAW HEADERS: {headers}")
    
    output = []
    # Manual parsing to match ingest_data logic
    reader = csv.DictReader(lines[start_idx:])
    for row in reader:
        # Strip keys and values
        clean_row = {k.strip(): (v.strip() if v else "") for k, v in row.items() if k}
        output.append(clean_row)
    return output

def get_val(row, *keys):
    clean_keys = [k.lower().strip() for k in keys]
    for rk, rv in row.items():
        if rk.lower().strip() in clean_keys:
            return rv
    return "MISSING"

data = read_csv_smart("data_source/Main.csv")
for row in data:
    if row.get("Slug Name") == "C24":
        print("\n--- C24 ROW ---")
        print(row)
        print(f"Title: {get_val(row, 'Title', 'Job Title')}")
        print(f"Team: {get_val(row, 'Team', 'Team Size')}")
        break
