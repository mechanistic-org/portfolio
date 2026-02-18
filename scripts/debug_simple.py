import jpype
import os
import glob
import sys

# 1. Setup Java Home
if not os.environ.get("JAVA_HOME"):
    potential_home = r"C:\Program Files\Eclipse Adoptium\jdk-17.0.18.8-hotspot"
    if os.path.exists(potential_home):
        os.environ["JAVA_HOME"] = potential_home
        os.environ["PATH"] += os.pathsep + os.path.join(potential_home, "bin")

# 2. Build Classpath
import mpxj
lib_path = os.path.join(os.path.dirname(mpxj.__file__), "lib")
jars = glob.glob(os.path.join(lib_path, "*.jar"))
cp_str = os.pathsep.join(jars)

print(f"📦 Classpath length: {len(cp_str)} chars")
# print(f"📦 Classpath: {cp_str}")

# 3. Start JVM Explicitly
if not jpype.isJVMStarted():
    # Force Djava.class.path
    print("🚀 Starting JVM with explicit -Djava.class.path...")
    try:
        # jpype.startJVM(classpath=[cp_str])
        jpype.startJVM(jpype.getDefaultJVMPath(), "-Djava.class.path=" + cp_str)
    except Exception as e:
        print(f"❌ StartJVM Failed: {e}")
        sys.exit(1)

print("✅ JVM Started.")

# 4. Probe Classpath
from jpype import java
jvm_cp = java.lang.System.getProperty("java.class.path")
print(f"☕ Actual JVM Classpath: {jvm_cp}")

# 5. Test Import
try:
    from net.sf.mpxj.mpp import MPPReader
    print("✅ Success: Imported MPPReader")
except Exception as e:
    print(f"❌ Import Failed: {e}")
