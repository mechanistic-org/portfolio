
import os
import re

def analyze_file(filepath):
    print(f"--- Analyzing {os.path.basename(filepath)} ---")
    
    if not os.path.exists(filepath):
        print("❌ File not found.")
        return

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            
        full_text = "".join(lines)
        total_chars = len(full_text)
        
        print(f"  Total Lines: {len(lines)}")
        print(f"  Total Chars: {total_chars}")
        
        # Check for super long lines (Base64 dumps)
        max_len = 0
        long_line_count = 0
        for line in lines:
            line_len = len(line)
            if line_len > max_len:
                max_len = line_len
            if line_len > 5000:
                long_line_count += 1
                
        print(f"  Max Line Len: {max_len}")
        print(f"  Lines > 5k chars: {long_line_count}")
        
        # Check for suspicious blocks (Base64-ish density)
        # Simple heuristic: high density of alphanumeric with no spaces
        
        # Check for Null Bytes
        if '\0' in full_text:
            print("  ⚠️ NULL BYTES DETECTED! (This kills NotebookLM)")
            print(f"  Null Bytes detected: {full_text.count(chr(0))}")
        else:
            print("  Null Bytes detected: 0")

        # Check for HTML Tag Density
        tag_chars = full_text.count('<') + full_text.count('>')
        print(f"  HTML Tag Chars (< >): {tag_chars}")
        if tag_chars > 20000:
             print("  ⚠️ HIGH HTML DENSITY (NotebookLM parser might choke)")

    except Exception as e:
        print(f"Error analyzing file: {e}")

if __name__ == "__main__":
    # Target files to analyze
    target_files = [
        r"D:\portfolio\portfolio_email_working\WebTV_ALL_eml\STITCHED\WebTV_Volume_002.md",
        r"D:\portfolio\portfolio_email_working\WebTV_ALL_eml\STITCHED\WebTV_Volume_007.md"
    ]
    
    for f in target_files:
        analyze_file(f)
