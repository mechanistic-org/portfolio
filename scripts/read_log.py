
import sys

try:
    with open('build_log.txt', 'r', encoding='utf-16-le') as f:
        lines = f.readlines()
        for i, line in enumerate(lines):
            if "ERROR" in line or "Stack trace" in line or "Unexpected" in line:
                print(f"LINE {i}: {line.strip()}")
                # Print next 5 lines
                for j in range(1, 6):
                    if i+j < len(lines):
                        print(f"  {lines[i+j].strip()}")
except Exception as e:
    print(f"Error: {e}")
