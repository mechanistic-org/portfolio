
import pandas as pd
import os

files = [
    r"d:\GitHub\quantum-workspace\periodic-table-\TRAITS_FAULTS_1.xlsx",
    r"d:\GitHub\quantum-workspace\periodic-table-\TRAITS_FAULTS_2.xlsx"
]

for f in files:
    print(f"\n--- Inspecting {os.path.basename(f)} ---")
    try:
        df = pd.read_excel(f)
        print("Columns:", df.columns.tolist())
        print(df.head(5).to_string())
    except Exception as e:
        print(f"Error reading {f}: {e}")
