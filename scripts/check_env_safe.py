import os
from pathlib import Path

env_path = Path(".env")
print(f"--- ENV DIAGNOSTIC ---")
if not env_path.exists():
    print("❌ .env file NOT FOUND.")
else:
    print(f"✅ .env file FOUND at {env_path.absolute()}")
    try:
        with open(env_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        found = False
        for line in content.splitlines():
            line = line.strip()
            if line.startswith("GEMINI_API_KEY"):
                found = True
                if "=" not in line:
                    print("❌ Line found but missing '='.")
                    continue
                    
                key_part = line.split("=", 1)[1].strip().strip('"').strip("'")
                
                if not key_part:
                    print("❌ Key value is EMPTY.")
                elif key_part == "your_key_here" or "example" in key_part:
                    print("❌ Key is PLACEHOLDER (e.g. 'your_key_here').")
                elif " " in key_part:
                    print("❌ Key contains SPACES.")
                elif not key_part.startswith("AIza"):
                    print(f"⚠️ Key format SUSPICIOUS (Does not start with AIza). Starts with: '{key_part[:4]}...'")
                else:
                    print(f"✅ Key format looks VALID.")
                    print(f"   - Prefix: {key_part[:4]}...")
                    print(f"   - Length: {len(key_part)}")
                    
        if not found:
            print("❌ GEMINI_API_KEY variable NOT FOUND in .env.")
            
    except Exception as e:
        print(f"❌ Error reading .env: {e}")
