import pypdf
import sys
import os

files = [
    r"d:/portfolio/portfolio_working/2004_Digidesign_D-Control/03_Engineering_BOMs-CoGs-etc/PCII_Stand_BOMs.pdf",
    r"d:/portfolio/portfolio_working/2004_Digidesign_D-Control/03_Engineering_BOMs-CoGs-etc/PC2_stand_shtmtl_prod_cost.pdf",
    r"d:/portfolio/portfolio_working/2004_Digidesign_D-Control/03_Engineering_BOMs-CoGs-etc/03_Engineering_BOMs-CoGs-etc.pdf"
]

for fpath in files:
    print(f"\n\n==================================================")
    print(f"FILE: {os.path.basename(fpath)}")
    print(f"==================================================")
    try:
        if not os.path.exists(fpath):
            print("File not found.")
            continue
            
        reader = pypdf.PdfReader(fpath)
        full_text = ""
        for page in reader.pages:
            full_text += page.extract_text() + "\n"
        
        # Heuristic: Look for lines with "$" or "Total"
        print("--- EXTRACTED TOTALS / DOLLARS ---")
        lines = full_text.split('\n')
        for line in lines:
            if "$" in line or "total" in line.lower() or "cost" in line.lower() or "grand" in line.lower():
                print(line.strip())
                
        print("\n--- FULL TEXT SAMPLE (First 500 chars) ---")
        print(full_text[:500])
        
    except Exception as e:
        print(f"Error: {e}")
