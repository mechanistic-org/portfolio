
import os
import json
import glob
import time
import datetime
import google.generativeai as genai
from pypdf import PdfReader
from dotenv import load_dotenv

# Load Environment Variables
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ Error: GEMINI_API_KEY not found in .env")
    exit(1)

genai.configure(api_key=api_key)

# Configuration
MODEL_NAME = "gemini-2.5-flash"
TARGET_DIR = r"D:\portfolio\portfolio_working\2007_Digidesign_C24" # Use Raw String for Windows path
OUTPUT_FILE = "src/content/projects/c24/_entropy.json" # Corrected Slug

# System Prompt
SYSTEM_PROMPT = """
You are a Senior Forensic Engineer analyzing historical project documentation (Weekly Status Reports, ECOs).
Your goal is to extract the "Entropic Risk" level for each week based on the text.

**Task:**
1. Identify the DATE of the report (ISO 8601 YYYY-MM-DD). If a date range is given (Week of...), use the Monday of that week.
2. Score the VOLATILITY (Entropy) on a scale of 1-10:
   - 1-3: Low (Routine, "On Track", "Green", minor component delays).
   - 4-6: Medium (Yellow, "Schedule Slip", "Tooling Modification", "Respin").
   - 7-9: High (Red, "Failure", "Crisis", "Yield Loss", "Line Down", "Mold Damage").
   - 10: Critical (Catastrophic Failure, Fire, Injury, Program Cancellation Risk).
3. Extract a SNIPPET (max 15 words) that justifies the score. This should be the "Smoking Gun" sentence.

**Output Format (JSON Only):**
{
  "date": "YYYY-MM-DD",
  "score": integer,
  "snippet": "string",
  "type": "Status Report" | "ECO"
}
"""

generation_config = {
  "temperature": 0.1,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 1024,
  "response_mime_type": "application/json",
}

model = genai.GenerativeModel(
  model_name=MODEL_NAME,
  generation_config=generation_config,
  system_instruction=SYSTEM_PROMPT,
)

def analyze_pdf(file_path):
    print(f"📄 Processing: {os.path.basename(file_path)}...")
    try:
        reader = PdfReader(file_path)
        full_text = ""
        for page in reader.pages:
            full_text += page.extract_text() + "\n"
        
        # Chunking: If text is too long, take the first 4000 chars (usually sufficiency for status summary)
        if len(full_text) > 10000:
            print("   ⚠️  Large file, truncating to 10k chars for analysis...")
            full_text = full_text[:10000]

        chat_session = model.start_chat()
        response = chat_session.send_message(f"Analyze this document content:\n\n{full_text}")
        
        try:
             data = json.loads(response.text)
             # Handle list response if multiple entries found (rare but possible)
             if isinstance(data, list):
                 return data
             return [data]
        except json.JSONDecodeError:
            print(f"   ❌ JSON Error for {file_path}")
            return []

    except Exception as e:
        print(f"   ❌ Error reading/processing {file_path}: {e}")
        return []

def main():
    print("----------------------------------------------------------------")
    print("   FORENSIC SEISMOGRAPH // ENTROPY EXTRACTION")
    print(f"   Model: {MODEL_NAME}")
    print("----------------------------------------------------------------")

    results = []
    
    # 1. Gather Files (Prioritize Governance Pulse)
    # Target the specific known location for status reports
    pulse_dir = os.path.join(TARGET_DIR, "04_Engineering_[Governance_Pulse]")
    if os.path.exists(pulse_dir):
        print(f"🎯  Targeting High-Value Directory: {pulse_dir}")
        # ESCAPE brackets for glob
        safe_pulse_dir = glob.escape(pulse_dir)
        pdf_files = glob.glob(os.path.join(safe_pulse_dir, "*.pdf"))
    else:
        # Fallback to recursive
        print(f"⚠️  Pulse dir not found, scanning root recursively...")
        pdf_files = glob.glob(os.path.join(TARGET_DIR, "**/*.pdf"), recursive=True)
        
    if not pdf_files:
        print(f"⚠️  No PDFs found.")
        return
    
    print(f"   Found {len(pdf_files)} PDFs. Extracting...")
    
    import re
    date_pattern = re.compile(r'(\d{2})-(\d{2})-(\d{2})') # Matches 01-11-08

    # 2. Analyze
    for i, pdf in enumerate(pdf_files):
        fname = os.path.basename(pdf).lower()
        
        # Match: Explicit keyword OR Date pattern (01-11-08.pdf)
        date_match = date_pattern.search(fname)
        is_relevant = any(x in fname for x in ["status", "eco", "curtis", "update"]) or date_match
        
        if is_relevant:
            # Derived Date from Filename (Trust this over LLM)
            derived_date = None
            if date_match:
                m, d, y = date_match.groups()
                # Assumption: 08 -> 2008. If > 80 -> 19XX (unlikely here but good practice)
                year_full = f"20{y}"
                derived_date = f"{year_full}-{m}-{d}"

            # RETRY LOGIC for Rate Limits
            max_retries = 3
            for attempt in range(max_retries):
                try:
                    analysis = analyze_pdf(pdf)
                    if analysis:
                        # OVERRIDE DATE IF DERIVED
                        if derived_date:
                            for item in analysis:
                                item["date"] = derived_date
                                # Fallback: If LLM failed score, random 1-3? No, keep LLM score.

                        results.extend(analysis)
                        # INCREMENTAL SAVE
                        save_json(results, OUTPUT_FILE)
                    
                    time.sleep(10) # 10s Sleep for Free Tier safety
                    break # Success, move to next file
                except Exception as e:
                    if "429" in str(e):
                        print(f"      ⏳ Rate Limited (429). Waiting 30s... (Attempt {attempt+1}/{max_retries})")
                        time.sleep(30)
                    else:
                        print(f"      ❌ Failed: {e}")
                        break
        else:
             pass # Silent skip to reduce noise

def save_json(data, filename):
    # Deduplicate & Sort Helper
    unique_data = {}
    for item in data:
        date = item.get("date")
        if not date: continue
        if date not in unique_data:
            unique_data[date] = item
        else:
            if item["score"] > unique_data[date]["score"]:
                unique_data[date] = item
    
    final_list = sorted(unique_data.values(), key=lambda x: x["date"])
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, "w") as f:
        json.dump(final_list, f, indent=2)
    print(f"      💾 Checkpoint saved ({len(final_list)} items).")

if __name__ == "__main__":
    main()
