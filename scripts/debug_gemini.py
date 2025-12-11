import os
import sys
from pathlib import Path
import google.generativeai as genai

print("--- MODEL LIST DEBUG ---")

# 1. Load .env (Simplified for brevity as we know it works)
env_path = Path(".env")
if env_path.exists():
    try:
        content = env_path.read_bytes()
        if content.startswith(b'\xef\xbb\xbf'):
            text = content.decode('utf-8-sig')
        else:
            text = content.decode('utf-8') 
        for line in text.splitlines():
            if line.strip().startswith("GEMINI_API_KEY"):
                key = line.split("=", 1)[1].strip().strip('"').strip("'")
                genai.configure(api_key=key)
                break
    except: pass

print("Available Models:")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f" - {m.name}")
except Exception as e:
    print(f"Error listing: {e}")
