import jpype
import mpxj
import sys
import os
import pandas as pd
from pathlib import Path

# Configuration
MPP_FILE = Path(r"D:\GitHub\eriknorris-workspace\schedules\Ares_mechanical.mpp")
TARGET_DIR = Path(r"D:\GitHub\eriknorris-workspace\schedules\converted")

def setup_jvm():
    try:
        if not os.environ.get("JAVA_HOME"):
            potential_home = r"C:\Program Files\Eclipse Adoptium\jdk-17.0.18.8-hotspot"
            if os.path.exists(potential_home):
                os.environ["JAVA_HOME"] = potential_home
                os.environ["PATH"] += os.pathsep + os.path.join(potential_home, "bin")

        if not jpype.isJVMStarted():
            print("🚀 Starting JVM...")
            jpype.startJVM()
        return True
    except Exception as e:
        print(f"❌ JVM Fail: {e}")
        return False

def convert_single():
    print(f"📄 Processing: {MPP_FILE}")
    if not MPP_FILE.exists():
        print(f"❌ File missing: {MPP_FILE}")
        return

    try:
        from org.mpxj.mpp import MPPReader
        reader = MPPReader()
        project = reader.read(str(MPP_FILE))
        print(f"✅ Read Project: {project.getProjectHeader().getName()}")
        
        tasks = []
        all_tasks = project.getTasks()
        print(f"   Found {all_tasks.size()} tasks.")
        
        # Simplified extraction for test
        for task in all_tasks:
            tasks.append({"ID": task.getID(), "Name": task.getName()})
            
        if tasks:
            df = pd.DataFrame(tasks)
            out_file = TARGET_DIR / "debug_Ares.xlsx"
            TARGET_DIR.mkdir(exist_ok=True, parents=True)
            df.to_excel(out_file, index=False)
            print(f"💾 Saved: {out_file}")
        else:
             print("⚠️ No tasks extracted.")

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    setup_jvm()
    convert_single()
