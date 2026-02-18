import jpype
import mpxj
import sys
import os
import glob

def debug_setup():
    # Manual JAVA_HOME
    if not os.environ.get("JAVA_HOME"):
        potential_home = r"C:\Program Files\Eclipse Adoptium\jdk-17.0.18.8-hotspot"
        if os.path.exists(potential_home):
            os.environ["JAVA_HOME"] = potential_home
            os.environ["PATH"] += os.pathsep + os.path.join(potential_home, "bin")
            print(f"🔧 JAVA_HOME set to: {potential_home}")
    
    # Locate mpxj
    mpxj_path = os.path.dirname(mpxj.__file__)
    lib_path = os.path.join(mpxj_path, "lib")
    print(f"📂 MPXJ Lib Path: {lib_path}")
    
    jars = glob.glob(os.path.join(lib_path, "*.jar"))
    print(f"📦 Found {len(jars)} JARs:")
    for jar in jars:
        print(f"   - {os.path.basename(jar)}")
        
    if not jars:
        print("❌ No JARs found! Check installation.")
        return

    # Check mpxj.jar specifically
    mpxj_jar = next((j for j in jars if "mpxj.jar" in j), None)
    if not mpxj_jar:
         print("❌ mpxj.jar missing!")
    
    # Start JVM
    print("🚀 Starting JVM...")
    try:
        if not jpype.isJVMStarted():
            cp_str = os.pathsep.join(jars)
            # Try passing classpath as argument directly just in case kwarg fails
            jpype.startJVM(classpath=[cp_str])
        print("✅ JVM Started.")
        
        # Verify Classpath from JVM side
        from jpype import java
        jvm_cp = java.lang.System.getProperty("java.class.path")
        print(f"☕ JVM System Classpath: {jvm_cp}")
        
    except Exception as e:
        print(f"❌ JVM Start/Verify Failed: {e}")
        return
    except Exception as e:
        print(f"❌ JVM Start Failed: {e}")
        return

    # Try Import
    print("🧪 Testing Import...")
    try:
        from net.sf.mpxj.mpp import MPPReader
        print("✅ Import Successful: net.sf.mpxj.mpp.MPPReader")
    except ImportError as e:
        print(f"❌ Import Failed: {e}")
    except Exception as e:
        print(f"❌ General Error: {e}")

if __name__ == "__main__":
    debug_setup()
