import jpype
import mpxj
import sys
import os
import glob

try:
    # Locate mpxj package
    mpxj_path = os.path.dirname(mpxj.__file__)
    lib_path = os.path.join(mpxj_path, "lib")
    
    # Get all jars
    jars = glob.glob(os.path.join(lib_path, "*.jar"))
    classpath = ";".join(jars)
    
    print(f"JPype Version: {jpype.__version__}")
    print(f"Loading {len(jars)} JARs from {lib_path}...")
    
    if not jpype.isJVMStarted():
        jpype.startJVM(classpath=[classpath])
        
    from net.sf.mpxj.mpp import MPPReader
    from net.sf.mpxj import ProjectFile
    
    print("JVM Started and MPXJ classes imported successfully.")
    
except Exception as e:
    print(f"FAIL: {e}")
    sys.exit(1)
