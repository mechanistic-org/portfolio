
import os
import json
from pypdf import PdfReader

CASE_STUDY_DIR = r"d:\GitHub\quantum-workspace\__sample_case_studies__"
OUTPUT_FILE = r"C:\Users\erik\.gemini\antigravity\brain\8fb28874-ac35-4965-a3f3-b3d491983ac9\case_study_inventory.md"

def extract_pdf_info(filepath):
    try:
        reader = PdfReader(filepath)
        text = ""
        # Get text from first 2 pages
        for page in reader.pages[:2]:
            text += page.extract_text() + "\n"
        
        info = reader.metadata
        return {
            "filename": os.path.basename(filepath),
            "title": info.title or os.path.basename(filepath),
            "author": info.author,
            "page_count": len(reader.pages),
            "excerpt": text[:1000].replace('\n', ' ')
        }
    except Exception as e:
        return {"filename": os.path.basename(filepath), "error": str(e)}

def main():
    results = []
    print(f"Scanning {CASE_STUDY_DIR}...")
    
    for filename in os.listdir(CASE_STUDY_DIR):
        if filename.lower().endswith('.pdf'):
            path = os.path.join(CASE_STUDY_DIR, filename)
            data = extract_pdf_info(path)
            results.append(data)
    
    # Generate Markdown Report
    md_output = "# Case Study Inventory\n\n"
    for item in results:
        md_output += f"## {item['filename']}\n"
        if 'error' in item:
            md_output += f"> **Error:** {item['error']}\n\n"
        else:
            md_output += f"- **Pages:** {item['page_count']}\n"
            md_output += f"- **Excerpt:** {item['excerpt']}...\n\n"
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(md_output)
    
    print(f"Inventory written to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
