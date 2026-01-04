import pandas as pd
import json

# Use the LOCAL copy we made
FILE_PATH = "thermal_dump.xls" 
OUTPUT_PATH = r"D:\GitHub\eriknorris\src\config\sc48_thermal_real.json"

try:
    print(f"📂 Reading: {FILE_PATH}")
    xls = pd.ExcelFile(FILE_PATH)
    
    # Header confirmed at row 28 (0-indexed) based on dump
    HEADER_ROW = 28 
    df = pd.read_excel(xls, sheet_name='data1', header=HEADER_ROW)
    
    # Strip whitespace from columns
    df.columns = [str(c).strip() for c in df.columns]
    print(f"📋 Columns: {list(df.columns)}")
    
    clean_data = []
    
    # Target Columns
    col_map = {
        "CPU": "cpu",
        "R PSU": "psu",
        "DSP": "dmp",
        "Ambient": "amb"
    }
    
    # Verify columns exist
    for c in col_map.keys():
        if c not in df.columns:
            print(f"⚠️ Warning: Column '{c}' not found. Available: {df.columns}")
            
    time_col = "Time, s"
    if time_col not in df.columns:
        # Fallback if "Time, s" is slightly different
        time_cols = [c for c in df.columns if "Time" in c]
        if time_cols: time_col = time_cols[0]
    
    print(f"⏳ Time Column: {time_col}")

    for i, row in df.iterrows():
        try:
            t_val = row[time_col]
            if pd.isnull(t_val): continue
            
            # Convert seconds to minutes for X-axis if needed, or keep seconds
            # The mock used minutes (0-60). 
            # Real data seems to range 0-200+ (based on dump). 
            # Let's keep raw value but ensure float.
            time_val = float(t_val) / 60.0 # Convert to Minutes
            
            sensors = {}
            valid_row = True
            
            for source_col, target_key in col_map.items():
                if source_col in df.columns:
                    val = row[source_col]
                    if pd.notnull(val):
                        sensors[target_key] = float(val)
                    else:
                        sensors[target_key] = 0
                else:
                    sensors[target_key] = 0
            
            clean_data.append({
                "timestamp": round(time_val, 2),
                "sensors": sensors
            })

        except Exception as e:
            continue
            
    # Sample down if too large (>500 points) to keep JSON light
    if len(clean_data) > 500:
        step = len(clean_data) // 500
        clean_data = clean_data[::step]
        
    print(f"📊 Extracted {len(clean_data)} points.")
    
    with open(OUTPUT_PATH, 'w') as f:
        json.dump(clean_data, f)
    print(f"💾 Saved to {OUTPUT_PATH}")

except Exception as e:
    print(f"❌ Error: {e}")
