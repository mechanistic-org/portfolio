import csv
import os

def get_expected_slugs():
    filepath = "data_source/Main.csv"
    with open(filepath, 'r', encoding='utf-8-sig') as f:
        lines = [l.strip() for l in f.readlines() if l.strip()]
    
    reader = csv.DictReader(lines)
    slugs = []
    for row in reader:
        name = row.get("Slug Name") or row.get("Name")
        if not name: continue
        slug = name.lower().strip().replace(' ', '-').replace('/', '-')
        slugs.append(f"{name} -> {slug}")
    
    return slugs

if __name__ == "__main__":
    slugs = get_expected_slugs()
    print("ORIGINAL NAME -> EXPECTED FOLDER NAME")
    print("-------------------------------------")
    for s in slugs:
        print(s)
