import pandas as pd
from pathlib import Path
import re
from datetime import datetime
import numpy as np

# Configuration
SOURCE_DIR = Path(r"D:\GitHub\eriknorris-workspace\schedules\converted")
OUTPUT_CSV = Path(r"D:\GitHub\eriknorris-workspace\schedules\curtis_task_volatility.csv")

def parse_snapshot_date(filename):
    match = re.search(r"(\d{1,2})[-_](\d{1,2})[-_](\d{2})", filename)
    if match:
        m, d, y = match.groups()
        return datetime(2000 + int(y), int(m), int(d))
    return None

def main():
    if not SOURCE_DIR.exists():
        print("❌ Directory not found.")
        return

    # 1. Collect and Sort Files
    files = sorted(list(SOURCE_DIR.glob("digidesign_Curtis*.xlsx")))
    dated_files = []
    for f in files:
        d = parse_snapshot_date(f.stem)
        if d:
            dated_files.append((d, f))
    
    dated_files.sort(key=lambda x: x[0])
    print(f"🔍 Analyzing {len(dated_files)} snapshots associated with 'Curtis' project...")

    # 2. Key Structures
    # task_history: { "Task Name": [ { "date": snapshot_date, "finish": datetime } ] }
    task_history = {}

    # 3. Process Snapshots
    for s_date, f_path in dated_files:
        try:
            df = pd.read_excel(f_path)
            if "Task Name" not in df.columns or "Finish" not in df.columns:
                continue
                
            # Normalize dates
            df["Finish_DT"] = pd.to_datetime(df["Finish"], errors='coerce')
            
            # Iterate tasks
            for _, row in df.iterrows():
                t_name = str(row["Task Name"]).strip()
                t_finish = row["Finish_DT"]
                
                if not t_name or pd.isna(t_finish) or t_name == "nan":
                    continue
                
                if t_name not in task_history:
                    task_history[t_name] = []
                
                task_history[t_name].append({
                    "snapshot": s_date,
                    "finish": t_finish
                })
                
        except Exception as e:
            print(f"⚠️ Error reading {f_path.name}: {e}")

    # 4. Calculate Volatility
    # Metrics:
    # - Change Count: How many times did the finish date change?
    # - Max Drift: Max date - Min date (Range of uncertainty)
    # - Net Slip: Final date - Initial date
    
    results = []
    
    for t_name, history in task_history.items():
        if len(history) < 2:
            continue
            
        # Sort history by snapshot date (should be already, but safety first)
        history.sort(key=lambda x: x['snapshot'])
        
        changes = 0
        last_date = history[0]['finish']
        initial_date = history[0]['finish']
        final_date = history[-1]['finish']
        
        all_dates = [h['finish'] for h in history]
        
        # Calculate Changes frequency
        for entry in history[1:]:
            current_date = entry['finish']
            if current_date != last_date:
                changes += 1
            last_date = current_date
            
        # Calculate Magnitude
        try:
            net_slip = (final_date - initial_date).days
            date_range = (max(all_dates) - min(all_dates)).days
        except:
            net_slip = 0
            date_range = 0
            
        results.append({
            "Task Name": t_name,
            "Revisions": changes,
            "Snapshots Present": len(history),
            "Net Slip (Days)": net_slip,
            "Uncertainty Range (Days)": date_range,
            "Initial Date": initial_date.strftime('%Y-%m-%d'),
            "Final Date": final_date.strftime('%Y-%m-%d')
        })

    # 5. Output Results
    df_res = pd.DataFrame(results)
    
    # Filter out trivial tasks (0 revisions)
    df_volatile = df_res[df_res["Revisions"] > 0].copy()
    
    # Sort by Revisions (Frequency of confusion)
    df_volatile = df_volatile.sort_values("Revisions", ascending=False)
    
    print("\n🔥 TOP 15 MOST VOLATILE TASKS (Most Revisions)")
    print(f"{'Revisions':<10} | {'Slip (Days)':<12} | {'Task Name'}")
    print("-" * 60)
    for _, row in df_volatile.head(15).iterrows():
        print(f"{row['Revisions']:<10} | {row['Net Slip (Days)']:<12} | {row['Task Name'][:50]}")

    # Sort by Slip (Magnitude of delay)
    df_slip = df_res.sort_values("Net Slip (Days)", ascending=False)
    
    print("\n🐢 TOP 10 BIGGEST SLIPPERS (Most Delay)")
    print(f"{'Slip (Days)':<12} | {'Revisions':<10} | {'Task Name'}")
    print("-" * 60)
    for _, row in df_slip.head(10).iterrows():
        print(f"{row['Net Slip (Days)']:<12} | {row['Revisions']:<10} | {row['Task Name'][:50]}")
        
    # Valid explicit sort for CSV
    df_final = df_res.sort_values("Revisions", ascending=False)
    df_final.to_csv(OUTPUT_CSV, index=False)
    print(f"\n💾 Full Report Saved (Sorted by Revisions): {OUTPUT_CSV}")

if __name__ == "__main__":
    main()
