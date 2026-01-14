import sys
import re

LOG_FILE = "build_try2.log"

def scan_log():
    try:
        # Try UTF-16LE first (common for PowerShell redirection)
        content = open(LOG_FILE, "r", encoding="utf-16-le").read()
    except:
        try:
            # Fallback to UTF-8
            content = open(LOG_FILE, "r", encoding="utf-8").read()
        except Exception as e:
            print(f"Failed to read file: {e}")
            return

    lines = content.split('\n')
    for i, line in enumerate(lines):
        # Look for typical Astro/Vite error indicators
        if "error" in line.lower() or "failed" in line.lower() or "exception" in line.lower():
            # Skip noise
            if "TS7016" in line: continue # Skip implicit any if not strict
            
            print(f"--- DETECTED @ LINE {i} ---")
            start = max(0, i - 10)
            end = min(len(lines), i + 10)
            for j in range(start, end):
                prefix = ">" if j == i else " "
                print(f"{prefix} {lines[j]}")
            print("-" * 30)

if __name__ == "__main__":
    scan_log()
