import subprocess
import os
import sys

# File to check
TEST_KEY = "dreamjob/dreamjob-hero-01-v2.jpg"
BUCKET = "projects"
LOCAL_TEST_OUT = "test_download.jpg"

def main():
    print(f"🕵️ Diagnosing R2 presence for: {TEST_KEY}")
    
    cmd_base = "npx.cmd" if os.name == 'nt' else "npx"
    
    # 1. Check if we can GET it
    cmd = [cmd_base, "wrangler", "r2", "object", "get", f"{BUCKET}/{TEST_KEY}", "--file", LOCAL_TEST_OUT]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ SUCCESS: File exists in R2 and was downloaded.")
            
            # Check size
            if os.path.exists(LOCAL_TEST_OUT):
                size = os.path.getsize(LOCAL_TEST_OUT)
                print(f"   Size: {size} bytes")
                os.remove(LOCAL_TEST_OUT)
            else:
                print("   ⚠️  Warning: Wrangler said success but file not found?")
        else:
            print("❌ FAILURE: Could not retrieve file.")
            print("   STDOUT:", result.stdout)
            print("   STDERR:", result.stderr)

    except Exception as e:
        print(f"❌ CRITICAL EXCEPTION: {e}")

if __name__ == "__main__":
    main()
