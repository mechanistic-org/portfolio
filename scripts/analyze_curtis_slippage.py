import pandas as pd
from pathlib import Path
import re
import matplotlib.pyplot as plt
from datetime import datetime

# Source: The converted Excel files
SOURCE_DIR = Path(r"D:\GitHub\eriknorris-workspace\schedules\converted")

def parse_snapshot_date(filename):
    # Matches patterns like "8-30-06", "10-12-06", "20140612"
    # Curtis looks like "Curtis Schedule 8-30-06" or "Curtis Working Schedule-1-10-07"
    
    # Try MM-DD-YY
    match = re.search(r"(\d{1,2})[-_](\d{1,2})[-_](\d{2})", filename)
    if match:
        m, d, y = match.groups()
        # Assume 2000s for these specific files
        return datetime(2000 + int(y), int(m), int(d))
    
    return None

def main():
    if not SOURCE_DIR.exists():
        print("❌ Directory not found.")
        return

    # Filter for "Curtis" files
    curtis_files = sorted(list(SOURCE_DIR.glob("digidesign_Curtis*.xlsx")))
    print(f"🔍 Found {len(curtis_files)} Curtis snapshots.")

    data_points = []

    for f in curtis_files:
        snapshot_date = parse_snapshot_date(f.stem)
        if not snapshot_date:
            continue
            
        try:
            df = pd.read_excel(f)
            
            # Find the "Project Finish" - usually the last task or the one with the latest finish
            # Or we can look for specific milestones like "FCS" or "Release" if named consistently.
            # For now, let's take the MAX finishing date in the entire plan.
            
            if "Finish" not in df.columns:
                continue

            # Convert Finish to datetime, coerce errors
            df["Finish_DT"] = pd.to_datetime(df["Finish"], errors='coerce')
            
            # Heuristic: Find the task named "Production Start" or similar, 
            # or just take the max finish of tasks containing "Production"
            
            # Filter for meaningful tasks
            prod_tasks = df[df["Task Name"].str.contains("Production", case=False, na=False)]
            
            if not prod_tasks.empty:
                 # Take the max finish of production tasks
                 target_dt = pd.to_datetime(prod_tasks["Finish"], errors='coerce').max()
            else:
                 # Fallback to project max
                 target_dt = pd.to_datetime(df["Finish"], errors='coerce').max()

            if pd.isna(target_dt) or target_dt > datetime(2010,1,1):
                continue
                
            project_finish = target_dt
            
            data_points.append({
                "Snapshot": snapshot_date,
                "Projected_Finish": project_finish,
                "File": f.name
            })
            
        except Exception as e:
            print(f"Error reading {f.name}: {e}")

    # Create DataFrame
    results = pd.DataFrame(data_points)
    results = results.sort_values("Snapshot")
    
    print("\n📊 SLIPPAGE ANALYSIS (Curtis Project)")
    print(f"{'Snapshot Date':<15} | {'Projected Finish':<15} | {'Delta (Days)':<10}")
    print("-" * 50)
    
    base_finish = None
    
    for _, row in results.iterrows():
        s_date = row["Snapshot"].strftime("%Y-%m-%d")
        p_finish = row["Projected_Finish"].strftime("%Y-%m-%d")
        
        # Calculate how far out the finish moved
        if base_finish is None:
            base_finish = row["Projected_Finish"]
            delta = 0
        else:
            delta = (row["Projected_Finish"] - base_finish).days
            
        print(f"{s_date:<15} | {p_finish:<15} | {delta:<10}")

    # Save to CSV
    csv_path = Path(r"D:\GitHub\eriknorris-workspace\schedules\curtis_slippage_report.csv")
    results.to_csv(csv_path, index=False)
    print(f"\n💾 Saved Report: {csv_path}")

    # ASCII Plot
    print("\n📈 ASCII Viz (Finish Date Drift):")
    min_date = results["Projected_Finish"].min()
    for _, row in results.iterrows():
        days_from_start = (row["Projected_Finish"] - min_date).days
        bar = "█" * (days_from_start // 5) # Scale down
        print(f"{row['Snapshot'].strftime('%m-%d-%y')}: {bar} ({row['Projected_Finish'].strftime('%Y-%m-%d')})")

if __name__ == "__main__":
    main()
