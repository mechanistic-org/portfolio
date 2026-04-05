#!/usr/bin/env python3
"""
check_schema_parity.py

Checks for schema drift between Zod (content.config.ts) and Keystatic (keystatic.config.tsx).
Extracts field names and reports any fields present in Zod that are missing in Keystatic.
Issue: portfolio#61
"""

import re
import sys
from pathlib import Path

# Fields that are explicitly allowed to exist in Zod but not Keystatic
# We can expand this if we find intentional mismatches
IGNORED_FIELDS = {
    # e.g., 'forensic_data' (deprecated/never used in UI anymore)
    'forensic_data'
}

def get_zod_fields(content_str: str) -> set:
    fields = set()
    matches = re.finditer(r'^\s*([a-zA-Z0-9_]+)\s*:\s*(?:z\.|z\n)', content_str, re.MULTILINE)
    for m in matches:
        fields.add(m.group(1))
    
    # Alternatively find fields where z is on the next line
    matches_next_line = re.finditer(r'^\s*([a-zA-Z0-9_]+)\s*:\s*\n\s*z\.', content_str, re.MULTILINE)
    for m in matches_next_line:
        fields.add(m.group(1))
        
    return fields

def get_keystatic_fields(content_str: str) -> set:
    fields = set()
    matches = re.finditer(r'^\s*([a-zA-Z0-9_]+)\s*:\s*fields\.', content_str, re.MULTILINE)
    for m in matches:
        fields.add(m.group(1))
    return fields

def main():
    root = Path(__file__).resolve().parent.parent
    zod_path = root / "src" / "content.config.ts"
    ks_path = root / "keystatic.config.tsx"

    if not zod_path.exists() or not ks_path.exists():
        print("❌ Error: Could not find schema files to compare.")
        sys.exit(1)

    zod_content = zod_path.read_text(encoding="utf-8")
    ks_content = ks_path.read_text(encoding="utf-8")

    zod_fields = get_zod_fields(zod_content)
    ks_fields = get_keystatic_fields(ks_content)

    zod_fields -= IGNORED_FIELDS

    missing_in_keystatic = zod_fields - ks_fields

    if missing_in_keystatic:
        print("⚠️ SCHEMA DRIFT DETECTED: Zod fields missing in Keystatic")
        print("    (Running in ADVISORY MODE: CI will not fail, but please sync eventually.)\n")
        
        for field in sorted(missing_in_keystatic):
            print(f"  - {field}")
        
        print("\nFix: Add these fields to keystatic.config.tsx to unblock Keystatic.")
        sys.exit(0) # Advisory only, do not block CI while schema stabilizes
        
    print("✅ Schema Parity OK (Zod → Keystatic)")
    sys.exit(0)

if __name__ == "__main__":
    main()
