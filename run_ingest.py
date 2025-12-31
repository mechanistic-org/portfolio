
import subprocess
import sys

with open("ingest_error.log", "w") as f:
    try:
        result = subprocess.run([sys.executable, "ingest_data.py"], capture_output=True, text=True)
        f.write("--- STDOUT ---\n")
        f.write(result.stdout)
        f.write("\n--- STDERR ---\n")
        f.write(result.stderr)
        print("Run complete. Check ingest_error.log")
    except Exception as e:
        f.write(f"Wrapper failed: {e}")
