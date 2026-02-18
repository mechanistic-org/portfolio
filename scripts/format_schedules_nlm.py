import pandas as pd
from pathlib import Path
import sys

# Configuration
SOURCE_DIR = Path(r"D:\GitHub\eriknorris-workspace\schedules\converted")
OUTPUT_BASE = Path(r"D:\GitHub\eriknorris-workspace\schedules")

def format_date(d):
    try:
        if pd.isna(d) or str(d).strip() == "":
            return ""
        return pd.to_datetime(d).strftime("%Y-%m-%d")
    except:
        return str(d)

def main():
    if not SOURCE_DIR.exists():
        print(f"❌ Source directory not found: {SOURCE_DIR}")
        sys.exit(1)

    all_files = list(SOURCE_DIR.glob("*.xlsx"))
    print(f"🔍 Found {len(all_files)} Excel schedules.")

    # Map prefixes to output files
    outputs = {
        "avegant": OUTPUT_BASE / "nlm_avegant.txt",
        "digidesign": OUTPUT_BASE / "nlm_digidesign.txt",
        "kaleidescape": OUTPUT_BASE / "nlm_kaleidescape.txt"
    }

    # Initialize files
    for p in outputs.values():
        with open(p, "w", encoding="utf-8") as f:
            f.write(f"# Forensic Schedule Dump: {p.stem}\n")
            f.write("Format: [Date] **Task** (End: Date) {Team}\n\n")

    for excel_file in all_files:
        # Determine Category
        fname = excel_file.name.lower()
        target_path = outputs["kaleidescape"] # Default
        
        if fname.startswith("avegant"):
            target_path = outputs["avegant"]
        elif fname.startswith("digidesign"):
            target_path = outputs["digidesign"]
            
        print(f"📄 Processing {excel_file.name} -> {target_path.name}...")
        
        with open(target_path, "a", encoding="utf-8") as f:
            f.write(f"## PROJECT: {excel_file.stem}\n")
            f.write("-" * 40 + "\n")
            
            try:
                df = pd.read_excel(excel_file)
                # Sort by Start Date if possible
                if "Start" in df.columns:
                    df["Start_DT"] = pd.to_datetime(df["Start"], errors='coerce')
                    df = df.sort_values("Start_DT")
                
                for _, row in df.iterrows():
                    # Clean data
                    task = str(row.get("Task Name", "")).strip()
                    start = format_date(row.get("Start", ""))
                    finish = format_date(row.get("Finish", ""))
                    res = str(row.get("Resources", "")).strip()
                    
                    if not task or task.lower() == "nan": continue
                    
                    # Markdown List Item
                    line = f"- "
                    if start:
                        line += f"[{start}] "
                    
                    line += f"**{task}**"
                    
                    meta = []
                    if finish and finish != start:
                        meta.append(f"End: {finish}")
                    if res and res.lower() != "nan" and res != "":
                        meta.append(f"Team: {res}")
                        
                    if meta:
                        line += f" ({', '.join(meta)})"
                    
                    f.write(line + "\n")
                
                f.write("\n\n")
                
            except Exception as e:
                print(f"   ❌ Error reading {excel_file.name}: {e}")
                f.write(f"\n[Error processing {excel_file.name}: {e}]\n\n")

    print(f"\n🚀 Logs Generated:")
    for p in outputs.values():
        print(f"   - {p.name}")

if __name__ == "__main__":
    main()
