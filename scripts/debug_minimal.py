import jpype
import os

# 1. Setup Java Home
if not os.environ.get("JAVA_HOME"):
    potential_home = r"C:\Program Files\Eclipse Adoptium\jdk-17.0.18.8-hotspot"
    if os.path.exists(potential_home):
        os.environ["JAVA_HOME"] = potential_home
        os.environ["PATH"] += os.pathsep + os.path.join(potential_home, "bin")

# 2. Import mpxj (triggers addClassPath)
import mpxj

# 3. Start JVM (should pick up added paths)
print("🚀 Starting JVM...")
if not jpype.isJVMStarted():
    try:
        jpype.startJVM()
    except Exception as e:
        print(f"❌ StartJVM Failed: {e}")

# 4. Test Import
try:
    from net.sf.mpxj.mpp import MPPReader
    print("✅ Success: Imported MPPReader")
except Exception as e:
    print(f"❌ Import Failed: {e}")
