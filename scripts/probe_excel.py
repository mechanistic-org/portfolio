import pandas as pd

FILE_PATH = "thermal_dump.xls"
OUTPUT_TXT = "dump_excel.txt"

try:
    print(f"📂 Reading Local: {FILE_PATH}")
    xls = pd.ExcelFile(FILE_PATH)
    df = pd.read_excel(xls, sheet_name='data1', header=None, nrows=50)
    
    with open(OUTPUT_TXT, "w", encoding="utf-8") as f:
        f.write(df.to_string())
        
    print(f"✅ Dumped to {OUTPUT_TXT}")
    
except Exception as e:
    print(f"❌ Error: {e}")
