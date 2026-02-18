import jpype
import mpxj
import os

# 1. Setup Java Home
if not os.environ.get("JAVA_HOME"):
    potential_home = r"C:\Program Files\Eclipse Adoptium\jdk-17.0.18.8-hotspot"
    if os.path.exists(potential_home):
        os.environ["JAVA_HOME"] = potential_home
        os.environ["PATH"] += os.pathsep + os.path.join(potential_home, "bin")

# 2. Start JVM via mpxj init
print("🚀 Starting JVM...")
if not jpype.isJVMStarted():
    try:
        jpype.startJVM()
    except Exception as e:
        print(f"❌ StartJVM Failed: {e}")

# 3. Test Imports
print("🧪 Testing Imports...")

try:
    from net.sf.mpxj.mpp import MPPReader
    print("✅ Success: net.sf.mpxj.mpp.MPPReader")
except ImportError:
    print("❌ Failed: net.sf.mpxj.mpp.MPPReader")

try:
    from net.sf.mpxj import ProjectFile
    print("✅ Success: net.sf.mpxj.ProjectFile")
except ImportError:
    print("❌ Failed: net.sf.mpxj.ProjectFile")

try:
    # Check what JAR contents suggested
    from org.mpxj.mpp import MPPReader
    print("✅ Success: org.mpxj.mpp.MPPReader")
except ImportError:
    print("❌ Failed: org.mpxj.mpp.MPPReader")

try:
    from mpxj.mpp import MPPReader as PyMPPReader
    print("✅ Success: mpxj.mpp.MPPReader (Python Wrapper?)")
except ImportError:
    print("❌ Failed: mpxj.mpp.MPPReader")
