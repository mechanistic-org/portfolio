import jpype
import mpxj
import sys
import os
import glob
import pandas as pd
from pathlib import Path

# Configuration
BASE_DIR = Path(r"D:\GitHub\portfolio-workspace\schedules")
SOURCE_DIRS = [
    BASE_DIR / "kaleidescape",
    BASE_DIR / "digidesign",
    BASE_DIR / "avegant"
]
TARGET_DIR = BASE_DIR / "converted"

def setup_jvm():
    try:
        # Manual JAVA_HOME fallback for current session
        if not os.environ.get("JAVA_HOME"):
            potential_home = r"C:\Program Files\Eclipse Adoptium\jdk-17.0.18.8-hotspot"
            if os.path.exists(potential_home):
                os.environ["JAVA_HOME"] = potential_home
                os.environ["PATH"] += os.pathsep + os.path.join(potential_home, "bin")
                print(f"🔧 Manually set JAVA_HOME to: {potential_home}")

        # Start JVM (mpxj package handles classpath via __init__)
        if not jpype.isJVMStarted():
            print("🚀 Starting JVM...")
            jpype.startJVM()
            
        print("✅ JVM Started.")
        return True
    except Exception as e:
        print(f"❌ JVM Fail: {e}")
        return False

def convert_mpp_to_excel(mpp_file):
    # Use verified package name
    try:
        from org.mpxj.mpp import MPPReader
    except ImportError:
        try:
             from net.sf.mpxj.mpp import MPPReader
        except ImportError:
             print("❌ Could not import MPPReader from org.mpxj or net.sf.mpxj")
             return []
             
    try:
        reader = MPPReader()
        project = reader.read(str(mpp_file))
        
        tasks = []
        all_tasks = project.getTasks()
        
        print(f"   📄 Parsing {mpp_file.name} ({all_tasks.size()} tasks)...")

        for task in all_tasks:
            # Basic Extraction
            t_id = task.getID()
            t_name = task.getName()
            t_start = task.getStart()
            t_finish = task.getFinish()
            t_dur = task.getDuration()
            t_pct = task.getPercentageComplete()
            
            # Resource Handling
            res_names = []
            assignments = task.getResourceAssignments()
            if assignments:
                for assignment in assignments:
                    res = assignment.getResource()
                    if res:
                        # detailed debug: print(f"DEBUG Type: {type(res.getName())}")
                        res_names.append(str(res.getName()))
            t_res = ", ".join(res_names)
            
            tasks.append({
                "ID": t_id,
                "Task Name": t_name,
                "Start": str(t_start) if t_start else "",
                "Finish": str(t_finish) if t_finish else "",
                "Duration": str(t_dur) if t_dur else "",
                "% Complete": t_pct,
                "Resources": t_res
            })
            
        return tasks
    except Exception as e:
        print(f"   ❌ Error parsing {mpp_file.name}: {e}")
        return []

def main():
    if not setup_jvm():
        sys.exit(1)
        
    TARGET_DIR.mkdir(exist_ok=True, parents=True)
    
    total_files = 0
    total_converted = 0

    for source_dir in SOURCE_DIRS:
        if not source_dir.exists():
            print(f"⚠️ Skipping missing directory: {source_dir}")
            continue

        print(f"📂 Scanning: {source_dir.name} ({source_dir})...")
        mpp_files = list(source_dir.glob("*.mpp"))
        # Debug: Print found files
        # for f in mpp_files:
        #    print(f"   found: {f.name}")
        
        print(f"   🔍 Found {len(mpp_files)} .mpp files.")
        
        for mpp in mpp_files:
            total_files += 1
            print(f"🚀 Converting: {mpp.name}")
            data = convert_mpp_to_excel(mpp)
            
            if data:
                df = pd.DataFrame(data)
                
                # Prefix filename with directory name to verify distinct sources (unless it's the root 'schedules')
                prefix = "" if source_dir == BASE_DIR else f"{source_dir.name}_"
                out_name = f"{prefix}{mpp.stem}.xlsx"
                
                out_file = TARGET_DIR / out_name
                df.to_excel(out_file, index=False)
                print(f"   💾 Saved: {out_file.name}")
                total_converted += 1
            else:
                print(f"   ⚠️ No data extracted.")

    print(f"\n✅ Batch Conversion Complete. {total_converted}/{total_files} files processed.")

if __name__ == "__main__":
    main()
