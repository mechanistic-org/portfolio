
import re
import sys

def strip_ansi(text):
    ansi_escape = re.compile(r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')
    return ansi_escape.sub('', text)

def show_errors(log_file):
    print(f"Reading {log_file}...")
    try:
        with open(log_file, 'r', encoding='utf-16-le') as f:
            lines = f.readlines()
    except:
        try:
            with open(log_file, 'r', encoding='utf-8') as f:
                lines = f.readlines()
        except Exception as e:
            print(f"Failed to read file: {e}")
            return

    for i, line in enumerate(lines):
        clean = strip_ansi(line)
        if "error" in clean.lower() and "ts(" in clean.lower(): 
             # Matches actual TS errors, e.g. "error ts(1234)"
             print(f"Line {i+1}: {clean.strip()}")
             # Print context (next line usually has code snippet)
             if i + 1 < len(lines):
                 print(f"  > {strip_ansi(lines[i+1]).strip()}")

if __name__ == "__main__":
    show_errors("check_errors.txt")
